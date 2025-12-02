import axios from "axios";
import { OrderStatus } from "./orderApi";

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  subCategory: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderId: string;
  buyer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    region: string;
    country: string;
    postalCode: string;
  };
  items: OrderItem[];
  totalPrice: number;
  paymentStatus: "Paid" | "Pending" | "Failed";
  orderStatus: OrderStatus;
  paymentOption: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  orders: any[];
}

const api = axios.create({
  baseURL: "https://ilosiwaju-mbaay-2025.com/api/v1/user",
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

// Helper function to extract product data from different response structures
const extractProductData = (order: any) => {
  console.log("🔍 [EXTRACT] Examining order:", order._id, {
    hasItems: !!order.items && Array.isArray(order.items),
    itemsCount: order.items?.length || 0,
    hasProductField: !!order.product,
    itemsWithProduct: order.items?.filter((item: any) => item.product)?.[0]?.product?.name
  });

  // Check if order has items array with actual products
  if (order.items && Array.isArray(order.items)) {
    const validItems = order.items.filter((item: any) => item.product && item.product._id);
    
    if (validItems.length > 0) {
      console.log("✅ [EXTRACT] Found items array with", validItems.length, "valid items");
      return {
        hasValidItems: true,
        items: validItems,
        orderData: order
      };
    }
  }

  // Check if order has direct product field
  if (order.product && order.product._id) {
    console.log("✅ [EXTRACT] Found product data directly");
    return {
      hasValidItems: true,
      items: [{
        product: order.product,
        quantity: order.quantity || 1,
        price: order.product.price,
        total: order.totalPrice
      }],
      orderData: order
    };
  }

  console.log("⚠️ [EXTRACT] Order has no valid product data");
  return {
    hasValidItems: false,
    items: [],
    orderData: order
  };
};

// Helper function to group orders by session/transaction
const groupOrdersByTransaction = (apiOrders: any[]): any[] => {
  console.log("🔍 [GROUP] Starting to group orders. Total orders:", apiOrders.length);

  const groupedOrders: { [key: string]: any[] } = {};

  apiOrders.forEach((rawOrder, index) => {
    const extractedData = extractProductData(rawOrder);
    const orderData = extractedData.orderData;

    console.log(`📦 [GROUP] Processed order ${index}:`, {
      orderId: orderData._id,
      sessionId: orderData.buyerSession || orderData.buyerInfo?.sessionId,
      hasValidItems: extractedData.hasValidItems,
      itemsCount: extractedData.items?.length || 0
    });

    // Only group orders that have valid items
    if (extractedData.hasValidItems && extractedData.items.length > 0) {
      const sessionId = orderData.buyerSession || orderData.buyerInfo?.sessionId;
      const key = sessionId || orderData._id;

      if (!groupedOrders[key]) {
        groupedOrders[key] = [];
      }
      groupedOrders[key].push(extractedData);
    } else {
      console.log(`🚫 [GROUP] Order ${orderData._id} has no valid items, skipping from groups`);
    }
  });

  console.log("📊 [GROUP] Created", Object.keys(groupedOrders).length, "order groups with products");

  // Process grouped orders that have products
  const groupedOrdersWithProducts = Object.values(groupedOrders).map((orderGroup, groupIndex) => {
    console.log(`👥 [GROUP] Group ${groupIndex} has ${orderGroup.length} orders`);

    const firstOrder = orderGroup[0];
    
    // Calculate total price
    const totalPrice = orderGroup.reduce((sum, item) => {
      return sum + item.items.reduce((itemSum: number, orderItem: any) => 
        itemSum + (orderItem.total || orderItem.price * (orderItem.quantity || 1) || 0), 0);
    }, 0);

    // Create items array from all items in the group
    const items = orderGroup.flatMap((item, itemIndex) => {
      return item.items.map((orderItem: any, subIndex: number) => {
        const productData = orderItem.product || {};
        console.log("📦 Processing product data:", {
          name: productData.name,
          price: productData.price,
          hasImages: !!productData.images?.length
        });
        
        return {
          id: productData._id || `item-${Date.now()}-${itemIndex}-${subIndex}`,
          productId: productData._id || "",
          name: productData.name || "Unknown Product",
          // The API doesn't provide category/subCategory in product data
          category: productData.category || "Art & Craft", // Default based on "ART WORK"
          subCategory: productData.subCategory || "Artwork",
          image: productData.images?.[0] || productData.poster || "https://via.placeholder.com/80",
          price: Number(orderItem.price) || Number(productData.price) || 0,
          quantity: Number(orderItem.quantity) || 1,
        };
      });
    });

    const groupedOrder = {
      ...firstOrder.orderData,
      items: items,
      totalPrice: totalPrice,
      // Combine statuses
      status: orderGroup.some(item => item.orderData.status === "Cancelled") ? "Cancelled" :
        orderGroup.some(item => item.orderData.status === "Pending") ? "Pending" :
          orderGroup.some(item => item.orderData.status === "Processing") ? "Processing" :
            orderGroup.some(item => item.orderData.status === "Shipped") ? "Shipped" :
              orderGroup.every(item => item.orderData.status === "Delivered") ? "Delivered" : "Processing",
      // Combine payment statuses
      payStatus: orderGroup.some(item => item.orderData.payStatus === "Failed") ? "Failed" :
        orderGroup.every(item => item.orderData.payStatus === "Successful") ? "Successful" : "Pending",
    };

    console.log(`✅ [GROUP] Group ${groupIndex} created with:`, {
      itemsCount: groupedOrder.items.length,
      items: groupedOrder.items.map((item: any) => ({
        name: item.name,
        category: item.category,
        subCategory: item.subCategory
      })),
      totalPrice: groupedOrder.totalPrice
    });

    return groupedOrder;
  });

  // Also include orders without products (for display, but with placeholder items)
  const ordersWithoutProducts = apiOrders.filter(rawOrder => {
    const extractedData = extractProductData(rawOrder);
    return !extractedData.hasValidItems || extractedData.items.length === 0;
  }).map((rawOrder) => {
    console.log(`📝 Creating placeholder for order without products: ${rawOrder._id}`);
    
    return {
      ...rawOrder,
      items: [{
        id: `placeholder-${rawOrder._id}`,
        productId: "",
        name: "Unknown Product",
        category: "Unknown",
        subCategory: "Unknown",
        image: "https://via.placeholder.com/80",
        price: Number(rawOrder.totalPrice) || 0,
        quantity: 1,
      }],
      totalPrice: Number(rawOrder.totalPrice) || 0,
      status: rawOrder.status || "Processing",
      payStatus: rawOrder.payStatus || "Pending",
    };
  });

  return [...groupedOrdersWithProducts, ...ordersWithoutProducts];
};

export const fetchOrders = async (token: string, role?: "user" | "vendor"): Promise<Order[]> => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing. Please log in again.");
    }

    console.log("🔐 [FETCH] Fetching orders with token, role:", { role });
    const response = await api.get<ApiResponse>("/get_orders_user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("📨 [FETCH] API Response metadata:", {
      success: response.data.success,
      message: response.data.message,
      ordersCount: response.data.orders?.length || 0
    });

    if (!response.data.success || !Array.isArray(response.data.orders)) {
      throw new Error(response.data.message || "Failed to fetch orders");
    }

    const validStatuses: OrderStatus[] = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Completed",
    ];

    // Group orders by transaction first
    const groupedOrders = groupOrdersByTransaction(response.data.orders);

    console.log("🎯 [FETCH] Total processed orders:", groupedOrders.length);

    const processedOrders = groupedOrders.map((order, index): Order => {
      console.log(`🔄 [FETCH] Processing order ${index}:`, {
        orderId: order._id,
        itemsCount: order.items?.length || 0,
        items: order.items?.map((item: any) => ({
          name: item.name,
          category: item.category,
          subCategory: item.subCategory,
          price: item.price,
          quantity: item.quantity
        })),
        totalPrice: order.totalPrice
      });

      return {
        id: `order-${index}-${order._id}`,
        orderId: order._id,
        buyer: {
          fullName: `${order.buyerInfo?.first_name || ""} ${order.buyerInfo?.last_name || ""}`.trim() || "Unknown Customer",
          email: order.buyerInfo?.email || "No email provided",
          phone: order.buyerInfo?.phone || "No phone provided",
        },
        shippingAddress: {
          street: order.buyerInfo?.address || "Address not provided",
          city: order.buyerInfo?.city || "City not provided",
          region: order.buyerInfo?.region || "Region not provided",
          country: order.buyerInfo?.country || "Country not provided",
          postalCode: order.buyerInfo?.postalCode || "",
        },
        items: Array.isArray(order.items) ? order.items : [{
          id: `item-${index}`,
          productId: "",
          name: "Unknown Product",
          category: "Unknown",
          subCategory: "Unknown",
          image: "https://via.placeholder.com/80",
          price: Number(order.totalPrice) || 0,
          quantity: 1,
        }],
        totalPrice: Number(order.totalPrice) || 0,
        paymentStatus:
          order.payStatus === "Successful"
            ? "Paid"
            : order.payStatus === "Failed"
              ? "Failed"
              : "Pending",
        orderStatus: validStatuses.includes(order.status) ? order.status : "Pending",
        paymentOption: order.paymentOption || "Unknown",
        createdAt: order.createdAt || new Date().toISOString(),
      };
    });

    console.log("🏁 [FETCH] Final processed orders count:", processedOrders.length);
    processedOrders.forEach((order, idx) => {
      console.log(`Order ${idx} (${order.orderId}):`, {
        items: order.items.map(item => item.name),
        hasRealProduct: order.items.some(item => item.name !== "Unknown Product")
      });
    });

    return processedOrders;
  } catch (error: any) {
    console.error("❌ [FETCH] Error fetching orders:", error);
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch orders");
  }
};

export const getOrdersWithSession = async (token: string, role?: "user" | "vendor"): Promise<Order[]> => {
  return fetchOrders(token, role);
};