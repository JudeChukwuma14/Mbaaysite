// src/utils/orderApi.ts
import store from "@/redux/store";
import axios from "axios";
import { toast } from "react-toastify";

interface OrderCartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderPricing {
  subtotal: string;
  shipping: string; // Changed to string
  tax: string;
  discount: string;
  commission: string;
  total: string;
}

export interface OrderData {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  apartment: string;
  city: string;
  region: string;
  postalCode: string;
  couponCode: string;
  paymentOption: "Pay Before Delivery" | "Pay After Delivery";
  cartItems: OrderCartItem[];
  pricing: OrderPricing;
}

interface CheckoutResponse {
  orderId: string;
  authorization_url?: string;
  reference?: string;
  status: string;
  message?: string;
}

export interface PaymentStatusResponse {
  message: string;
  orderId: string;
  orderData?: OrderData;
}

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Completed";

const api = axios.create({
  baseURL: "https://mbayy-be.vercel.app/api/v1/order",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
    } else if (error.response?.status === 404) {
      toast.error("Resource not found.");
    } else {
      toast.error(message);
    }
    console.error("API Error:", error.message, error.response?.data);
    return Promise.reject(error);
  }
);

export const submitOrder = async (
  sessionId: string,
  orderData: OrderData,
  token: string
): Promise<CheckoutResponse> => {
  try {
    const response = await api.post(
      `/order_checkout/${sessionId}`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data || response.data;
  } catch (error: any) {
    console.error("Order Submission Error:", error.message, error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to place order");
  }
};

export const getPaymentStatus = async (
  reference: string
): Promise<PaymentStatusResponse> => {
  try {
    const response = await api.get(`/payment_callback`, {
      params: { reference },
    });
    return response.data.data || response.data; // Handle nested data
  } catch (error: any) {
    console.error("Payment Status Error:", error.message, error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to verify payment"
    );
  }
};


export const confirmOrderReceived = async (
  orderId: string,
  token: string
): Promise<{ success: boolean; message: string; status?: OrderStatus }> => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing. Please log in again.");
    }
    const response = await api.patch(`/confirmOrderReceived/${orderId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to confirm order receipt");
    }
    const validStatuses: OrderStatus[] = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Completed",
    ];
    const status = response.data.order?.status;
    return {
      success: true,
      message: response.data.message || "Order receipt confirmed",
      status: validStatuses.includes(status) ? status : "Delivered", // Default to "Delivered"
    };
  } catch (error: any) {
    console.error("Confirm Order Error:", error.message, error.response?.data);
    throw new Error(error.response?.data?.message || error.message || "Failed to confirm order receipt");
  }
};
