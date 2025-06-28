// src/services/orderApi.ts
import axios from "axios";
import { initializeSession } from "@/redux/slices/sessionSlice";
import store from "@/redux/store";

const api = axios.create({
  baseURL: "https://mbayy-be.onrender.com/api/v1/user",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

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
  orderStatus:
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | "Completed";
  paymentOption: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  orders: any[];
}

export const fetchOrders = async (sessionId: string): Promise<Order[]> => {
    if (!sessionId) {
    throw new Error("Session ID is missing. Please try again.");
  }

  try {
    const response = await api.get<ApiResponse>("/get_orders_user", {
      params: { sessionId },
    });

    if (!response.data.success || !Array.isArray(response.data.orders)) {
      throw new Error(response.data.message || "Failed to fetch orders");
    }

    return response.data.orders.map(
      (order): Order => ({
        id: order._id,
        orderId: order._id,
        buyer: {
          fullName: `${order.buyerInfo.first_name} ${order.buyerInfo.last_name}`,
          email: order.buyerInfo.email,
          phone: order.buyerInfo.phone,
        },
        shippingAddress: {
          street: order.buyerInfo.address,
          city: order.buyerInfo.city,
          region: order.buyerInfo.region,
          country: order.buyerInfo.country,
          postalCode: order.buyerInfo.postalCode,
        },
        product: {
          name: order.product.name,
          category: order.product.category,
          subCategory: order.product.sub_category,
          image: order.product.images?.[0] || "/placeholder.svg",
          price: order.product.price,
        },
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        paymentStatus:
          order.payStatus === "Successful"
            ? "Paid"
            : order.payStatus === "Failed"
            ? "Failed"
            : "Pending",
        orderStatus:
          order.status === "Processing"
            ? "Processing"
            : order.status === "Shipped"
            ? "Shipped"
            : order.status === "Delivered"
            ? "Delivered"
            : order.status === "Cancelled"
            ? "Cancelled"
            : "Completed",
        paymentOption: order.paymentOption,
        createdAt: order.createdAt,
      })
    );
  } catch (error: any) {
    console.error("Fetch orders error:", error);
    throw error.message || "Failed to fetch orders";
  }
};

// Only available status update is confirming order received
export const confirmOrderReceived = async (orderId: string): Promise<void> => {

  try {
    await api.patch(`/confirmOrderReceived/${orderId}`);
  } catch (error: any) {
    console.error("Confirm order error:", error);
    throw error.message || "Failed to confirm order";
  }
};

export const getOrdersWithSession = async (): Promise<Order[]> => {
  let sessionId = store.getState().session.sessionId;
  if (!sessionId) {
    // Initialize session if missing
    store.dispatch(initializeSession());
    sessionId = store.getState().session.sessionId;

    if (!sessionId) {
      throw new Error("Failed to initialize session ID");
    }
  }
  return fetchOrders(sessionId);
};
