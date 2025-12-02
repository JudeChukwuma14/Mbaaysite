// // src/utils/getOrderApi.ts
// import axios from "axios";
// import { OrderStatus } from "./orderApi";

// export interface Order {
//   id: string;
//   orderId: string;
//   buyer: {
//     fullName: string;
//     email: string;
//     phone: string;
//   };
//   shippingAddress: {
//     street: string;
//     city: string;
//     region: string;
//     country: string;
//     postalCode: string;
//   };
//   product: {
//     id: string;
//     name: string;
//     category: string;
//     subCategory: string;
//     image: string;
//     price: number;
//   };
//   quantity: number;
//   totalPrice: number;
//   paymentStatus: "Paid" | "Pending" | "Failed";
//   orderStatus: OrderStatus;
//   paymentOption: string;
//   createdAt: string;
// }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   orders: any[];
// }

// const api = axios.create({
//   baseURL: "https://ilosiwaju-mbaay-2025.com/api/v1/user",
//   headers: { "Content-Type": "application/json" },
//   timeout: 20000,
// });

// export const fetchOrders = async (token: string, role?: "user" | "vendor"): Promise<Order[]> => {
//   try {
//     if (!token) {
//       throw new Error("Authentication token is missing. Please log in again.");
//     }
//     console.log("Fetching orders with token:", { token, role });
//     const response = await api.get<ApiResponse>("/get_orders_user", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log(response)
//     if (!response.data.success || !Array.isArray(response.data.orders)) {
//       throw new Error(response.data.message || "Failed to fetch orders");
//     }

//     const validStatuses: OrderStatus[] = [
//       "Pending",
//       "Processing",
//       "Shipped",
//       "Delivered",
//       "Cancelled",
//       "Completed",
//     ];

//     return response.data.orders.map((order): Order => ({
//       id: order._id,
//       orderId: order._id,
//       buyer: {
//         fullName: `${order.buyerInfo.first_name || ""} ${order.buyerInfo.last_name || ""}`.trim(),
//         email: order.buyerInfo.email || "",
//         phone: order.buyerInfo.phone || "",
//       },
//       shippingAddress: {
//         street: order.buyerInfo.address || "",
//         city: order.buyerInfo.city || "",
//         region: order.buyerInfo.region || "",
//         country: order.buyerInfo.country || "",
//         postalCode: order.buyerInfo.postalCode || "",
//       },
//       product: {
//         id: order.product?._id || "",
//         name: order.product?.name || "Unknown Product",
//         category: order.product?.category || "Unknown",
//         subCategory: order.product?.sub_category || "Unknown",
//         image: order.product?.images?.[0] || "https://via.placeholder.com/80",
//         price: Number(order.product?.price) || 0,
//       },
//       quantity: Number(order.quantity) || 1,
//       totalPrice: Number(order.totalPrice) || 0,
//       paymentStatus:
//         order.payStatus === "Successful"
//           ? "Paid"
//           : order.payStatus === "Failed"
//             ? "Failed"
//             : "Pending",
//       orderStatus: validStatuses.includes(order.status) ? order.status : "Pending",
//       paymentOption: order.paymentOption || "Unknown",
//       createdAt: order.createdAt || new Date().toISOString(),
//     }));
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || error.message || "Failed to fetch orders");
//   }
// };

// export const getOrdersWithSession = async (token: string, role?: "user" | "vendor"): Promise<Order[]> => {
//   return fetchOrders(token, role);
// };

// src/utils/getOrderApi.ts - UPDATED TO HANDLE INCONSISTENT DATA
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
  console.log("🔍 [EXTRACT] Examining order structure:", {
    hasProductField: !!order.product,
    productKeys: order.product ? Object.keys(order.product) : 'No product',
    hasOrderField: !!order.order,
    orderKeys: order.order ? Object.keys(order.order) : 'No order'
  });

  // Case 1: Direct product field (current structure)
  if (order.product && typeof order.product === 'object') {
    console.log("✅ [EXTRACT] Found product data directly");
    return {
      product: order.product,
      orderData: order,
      quantity: order.quantity || 1
    };
  }

  // Case 2: Nested structure (order.product format from payment callback)
  if (order.order && order.product) {
    console.log("✅ [EXTRACT] Found nested order.product structure");
    return {
      product: order.product,
      orderData: order.order,
      quantity: order.order.quantity || 1
    };
  }

  // Case 3: Maybe the entire object IS the order with product nested?
  if (order._id && order.buyerInfo) {
    console.log("✅ [EXTRACT] Found direct order with buyerInfo");
    return {
      product: order.product || {},
      orderData: order,
      quantity: order.quantity || 1
    };
  }

  console.log("⚠️ [EXTRACT] Could not identify order structure");
  return {
    product: {},
    orderData: order,
    quantity: 1
  };
};

// Helper function to group orders by session/transaction
const groupOrdersByTransaction = (apiOrders: any[]): any[] => {
  console.log("🔍 [GROUP] Starting to group orders. Total orders:", apiOrders.length);

  const groupedOrders: { [key: string]: any[] } = {};

  apiOrders.forEach((rawOrder, index) => {
    const { product, orderData, quantity } = extractProductData(rawOrder);

    console.log(`📦 [GROUP] Processed order ${index}:`, {
      orderId: orderData._id,
      sessionId: orderData.buyerSession || orderData.buyerInfo?.sessionId,
      hasProductData: !!product && Object.keys(product).length > 0,
      productName: product?.name || 'No product name',
      quantity: quantity
    });

    const sessionId = orderData.buyerSession || orderData.buyerInfo?.sessionId;

    if (sessionId) {
      if (!groupedOrders[sessionId]) {
        groupedOrders[sessionId] = [];
      }
      groupedOrders[sessionId].push({
        order: orderData,
        product: product,
        quantity: quantity
      });
    } else {
      console.log(`⚠️ [GROUP] Order ${orderData._id} has no sessionId, using _id as key`);
      if (!groupedOrders[orderData._id]) {
        groupedOrders[orderData._id] = [];
      }
      groupedOrders[orderData._id].push({
        order: orderData,
        product: product,
        quantity: quantity
      });
    }
  });

  console.log("📊 [GROUP] Created", Object.keys(groupedOrders).length, "order groups");

  const result = Object.values(groupedOrders).map((orderGroup, groupIndex) => {
    console.log(`👥 [GROUP] Group ${groupIndex} has ${orderGroup.length} orders`);

    const firstOrder = orderGroup[0];
    const totalPrice = orderGroup.reduce((sum, item) => sum + (item.order.totalPrice || 0), 0);

    // Create items array
    const items = orderGroup.map((item, itemIndex) => {
      const product = item.product;
      const order = item.order;

      console.log(`🛒 [GROUP] Group ${groupIndex}, Item ${itemIndex}:`, {
        productName: product?.name || 'Unknown',
        productPrice: product?.price || order.totalPrice,
        hasImages: !!product?.images?.[0],
        quantity: item.quantity
      });

      return {
        id: product?._id || order._id || `item-${Date.now()}-${itemIndex}`,
        productId: product?._id || "",
        name: product?.name || product?.title || "Unknown Product",
        category: product?.category || "Unknown",
        subCategory: product?.sub_category || product?.subCategory || "Unknown",
        image: product?.images?.[0] || product?.poster || "https://via.placeholder.com/80",
        price: Number(product?.price) || Number(order.totalPrice) || 0,
        quantity: Number(item.quantity) || 1,
      };
    });

    const groupedOrder = {
      ...firstOrder.order,
      items: items,
      totalPrice: totalPrice,
      // Combine statuses
      status: orderGroup.some(item => item.order.status === "Cancelled") ? "Cancelled" :
        orderGroup.some(item => item.order.status === "Pending") ? "Pending" :
          orderGroup.some(item => item.order.status === "Processing") ? "Processing" :
            orderGroup.some(item => item.order.status === "Shipped") ? "Shipped" :
              orderGroup.every(item => item.order.status === "Delivered") ? "Delivered" : "Processing",
      // Combine payment statuses
      payStatus: orderGroup.some(item => item.order.payStatus === "Failed") ? "Failed" :
        orderGroup.every(item => item.order.payStatus === "Successful") ? "Successful" : "Pending",
    };

    console.log(`✅ [GROUP] Group ${groupIndex} created with:`, {
      itemsCount: groupedOrder.items.length,
      itemNames: groupedOrder.items.map((item: any) => item.name),
      totalPrice: groupedOrder.totalPrice
    });

    return groupedOrder;
  });

  return result;
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

    console.log("🎯 [FETCH] Total grouped orders:", groupedOrders.length);

    const processedOrders = groupedOrders.map((order, index): Order => {
      console.log(`🔄 [FETCH] Processing order ${index}:`, {
        orderId: order._id,
        itemsCount: order.items?.length || 0,
        itemNames: order.items?.map((item: any) => item.name) || [],
        totalPrice: order.totalPrice
      });

      return {
        id: `order-group-${index}-${order._id}`,
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

    console.log("🏁 [FETCH] Final processed orders:", processedOrders.map(order => ({
      orderId: order.orderId,
      itemsCount: order.items.length,
      itemNames: order.items.map(item => item.name),
      totalPrice: order.totalPrice
    })));

    return processedOrders;
  } catch (error: any) {
    console.error("❌ [FETCH] Error fetching orders:", error);
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch orders");
  }
};

export const getOrdersWithSession = async (token: string, role?: "user" | "vendor"): Promise<Order[]> => {
  return fetchOrders(token, role);
};