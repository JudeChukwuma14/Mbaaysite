// src/utils/getOrderApi.ts
import axios from "axios";


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
  product: {
    name: string;
    category: string;
    subCategory: string;
    image: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
  paymentStatus: "Paid" | "Pending" | "Failed";
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Completed";
  paymentOption: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  orders: any[];
}

const api = axios.create({
  baseURL: "https://mbayy-be.onrender.com/api/v1/user",
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

export const fetchOrders = async (token: string, userId: string): Promise<Order[]> => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing. Please log in again.");
    }
    if (!userId) {
      throw new Error("User ID is missing. Please log in again.");
    }
    const response = await api.get<ApiResponse>("/get_orders_user", {
      params: { userId },
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.data.success || !Array.isArray(response.data.orders)) {
      throw new Error(response.data.message || "Failed to fetch orders");
    }

    return response.data.orders.map((order): Order => ({
      id: order._id,
      orderId: order._id,
      buyer: {
        fullName: `${order.buyerInfo.first_name || ""} ${order.buyerInfo.last_name || ""}`.trim(),
        email: order.buyerInfo.email || "",
        phone: order.buyerInfo.phone || "",
      },
      shippingAddress: {
        street: order.buyerInfo.address || "",
        city: order.buyerInfo.city || "",
        region: order.buyerInfo.region || "",
        country: order.buyerInfo.country || "",
        postalCode: order.buyerInfo.postalCode || "",
      },
      product: {
        name: order.product?.name || "Unknown Product",
        category: order.product?.category || "Unknown",
        subCategory: order.product?.sub_category || "Unknown",
        image: order.product?.images?.[0] || "https://via.placeholder.com/80",
        price: Number(order.product?.price) || 0,
      },
      quantity: Number(order.quantity) || 1,
      totalPrice: Number(order.totalPrice) || 0,
      paymentStatus:
        order.payStatus === "Successful"
          ? "Paid"
          : order.payStatus === "Failed"
          ? "Failed"
          : "Pending",
      orderStatus: order.status || "Pending",
      paymentOption: order.paymentOption || "Unknown",
      createdAt: order.createdAt || new Date().toISOString(),
    }));
  } catch (error: any) {
    console.error("Fetch Orders Error:", error.message, error.response?.data);
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch orders");
  }
};

export const getOrdersWithSession = async (token: string, userId: string): Promise<Order[]> => {
  return fetchOrders(token, userId);
};