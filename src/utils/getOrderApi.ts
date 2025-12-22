// src/utils/getOrderApi.ts
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
  orders?: any[];
  data?: any[];
}

const api = axios.create({
  baseURL: "https://ilosiwaju-mbaay-2025.com/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

// First, let's try to debug what endpoint we should be calling
// Based on your payment callback, orders might be under `/order` endpoint

export const getOrdersWithSession = async (token: string, role?: "user" | "vendor"): Promise<Order[]> => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing. Please log in again.");
    }

    console.log("🔐 Fetching orders with token for role:", role);

    // Try different endpoints to see which one works
    let response;
    
    try {
      // First try: Get user-specific orders
      response = await api.get<ApiResponse>("/user/get_orders_user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📊 User orders API response:", response.data);
    } catch (userError: any) {
      console.log("⚠️ User orders endpoint failed, trying order endpoint:", userError.message);
      
      // Second try: Get orders from order endpoint
      response = await api.get<ApiResponse>("/order/get_orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📊 Order endpoint response:", response.data);
    }

    // Check response structure
    const responseData = response.data;
    console.log("📦 Full API response:", {
      success: responseData.success,
      message: responseData.message,
      hasOrders: !!responseData.orders,
      ordersCount: responseData.orders?.length || 0,
      hasData: !!responseData.data,
      dataCount: responseData.data?.length || 0
    });

    // Handle different response structures
    let rawOrders: any[] = [];
    
    if (responseData.orders && Array.isArray(responseData.orders)) {
      rawOrders = responseData.orders;
    } else if (responseData.data && Array.isArray(responseData.data)) {
      rawOrders = responseData.data;
    } else if (Array.isArray(responseData)) {
      rawOrders = responseData;
    } else {
      console.warn("Unexpected response structure:", responseData);
      throw new Error("Invalid response format from server");
    }

    console.log(`📊 Found ${rawOrders.length} raw orders to process`);

    if (rawOrders.length === 0) {
      console.log("📭 No orders found");
      return [];
    }

    // Process each order
    const processedOrders: Order[] = [];

    for (let i = 0; i < rawOrders.length; i++) {
      const rawOrder = rawOrders[i];
      console.log(`🔄 Processing order ${i}:`, {
        id: rawOrder._id,
        orderId: rawOrder.orderId,
        hasBuyerInfo: !!rawOrder.buyerInfo,
        hasItems: !!rawOrder.items && Array.isArray(rawOrder.items),
        itemsCount: rawOrder.items?.length || 0,
        status: rawOrder.status,
        payStatus: rawOrder.payStatus
      });

      // Extract items
      const items: OrderItem[] = [];
      
      if (rawOrder.items && Array.isArray(rawOrder.items)) {
        rawOrder.items.forEach((item: any, itemIndex: number) => {
          const product = item.product || {};
          console.log(`📦 Item ${itemIndex}:`, {
            productName: product.name,
            productId: product._id,
            hasImages: !!product.images,
            price: item.price || product.price,
            quantity: item.quantity
          });

          // Create category and subcategory based on product data
          let category = "Art & Craft";
          let subCategory = "Artwork";
          
          if (product.category) {
            category = product.category;
          } else if (product.name?.includes("ART")) {
            category = "Art & Sculptures";
          }
          
          if (product.sub_category) {
            subCategory = product.sub_category;
          } else if (product.subCategory) {
            subCategory = product.subCategory;
          }

          items.push({
            id: product._id || `item-${rawOrder._id}-${itemIndex}`,
            productId: product._id || "",
            name: product.name || item.name || "Unknown Product",
            category: category,
            subCategory: subCategory,
            image: product.images?.[0] || product.poster || item.image || "https://via.placeholder.com/80",
            price: Number(item.price) || Number(product.price) || 0,
            quantity: Number(item.quantity) || 1,
          });
        });
      } else {
        console.log("⚠️ Order has no items array, creating placeholder");
        items.push({
          id: `placeholder-${rawOrder._id}`,
          productId: "",
          name: "Unknown Product",
          category: "Unknown",
          subCategory: "Unknown",
          image: "https://via.placeholder.com/80",
          price: Number(rawOrder.totalPrice) || 0,
          quantity: 1,
        });
      }

      // Extract buyer info
      const buyerInfo = rawOrder.buyerInfo || {};
      const fullName = `${buyerInfo.first_name || ""} ${buyerInfo.last_name || ""}`.trim() || 
                      rawOrder.userId || "Unknown Customer";

      // Create shipping address
      const shippingAddress = {
        street: buyerInfo.address || "Address not provided",
        city: buyerInfo.city || "City not provided",
        region: buyerInfo.region || "Region not provided",
        country: buyerInfo.country || "Country not provided",
        postalCode: buyerInfo.postalCode || buyerInfo.postal_code || "",
      };

      // Determine payment status
      let paymentStatus: "Paid" | "Pending" | "Failed" = "Pending";
      if (rawOrder.payStatus === "Successful" || rawOrder.paymentStatus === "Successful") {
        paymentStatus = "Paid";
      } else if (rawOrder.payStatus === "Failed" || rawOrder.paymentStatus === "Failed") {
        paymentStatus = "Failed";
      }

      // Determine order status
      const validStatuses: OrderStatus[] = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Completed",
      ];
      let orderStatus: OrderStatus = "Pending";
      if (rawOrder.status && validStatuses.includes(rawOrder.status)) {
        orderStatus = rawOrder.status;
      }

      // Create the processed order
      const processedOrder: Order = {
        id: rawOrder._id || `order-${i}`, // Use the actual _id from backend
        orderId: rawOrder._id || `order-${i}`, // Use the same ID
        buyer: {
          fullName: fullName,
          email: buyerInfo.email || "No email provided",
          phone: buyerInfo.phone || "No phone provided",
        },
        shippingAddress: shippingAddress,
        items: items,
        totalPrice: Number(rawOrder.totalPrice) || 0,
        paymentStatus: paymentStatus,
        orderStatus: orderStatus,
        paymentOption: rawOrder.paymentOption || "Unknown",
        createdAt: rawOrder.createdAt || new Date().toISOString(),
      };

      console.log(`✅ Processed order ${i}:`, {
        id: processedOrder.id,
        itemsCount: processedOrder.items.length,
        totalPrice: processedOrder.totalPrice,
        paymentStatus: processedOrder.paymentStatus,
        orderStatus: processedOrder.orderStatus
      });

      processedOrders.push(processedOrder);
    }

    console.log(`🏁 Successfully processed ${processedOrders.length} orders`);
    return processedOrders;

  } catch (error: any) {
    console.error("❌ Error fetching orders:", error);
    
    // More specific error messages
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      
      if (error.response.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      } else if (error.response.status === 404) {
        throw new Error("Orders endpoint not found. Please contact support.");
      } else if (error.response.status === 500) {
        throw new Error("Server error. Please try again later.");
      }
    }
    
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch orders");
  }
};

// Alternative: Try fetching orders from different endpoints
export const fetchOrders = async (token: string, role?: "user" | "vendor"): Promise<Order[]> => {
  return getOrdersWithSession(token, role);
};