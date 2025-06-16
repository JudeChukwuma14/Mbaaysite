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
  shipping: number;
  tax: string;
  discount: string;
  total: string;
}

export interface OrderData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
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
  authorization_url?: string; // Updated to match Paystack response
  reference?: string; // Added to store the reference
  status: string;
  message?: string; // Added to handle backend message
}

interface PaymentStatusResponse {
  status: "success" | "failed";
  orderId: string;
  orderDetails?: OrderData;
}

const api = axios.create({
  baseURL: "https://mbayy-be.onrender.com/api/v1/order",
  headers: { "Content-Type": "application/json" },
});

// Global error handling
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
    console.error("API Error:", error.message);
    return Promise.reject(error);
  }
);

export const submitOrder = async (
  sessionId: string,
  orderData: OrderData
): Promise<CheckoutResponse> => {
  try {
    const response = await api.post(`/order_checkout/${sessionId}`, orderData);
    return response.data;
  } catch (error: any) {
    console.error("Order Submission Error:......", error.message);
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
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to verify payment"
    );
  }
};
