import axios from "axios";
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

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const state = store.getState();
    const token = state.user?.token || state.vendor?.token;
    const userId = state.user?.user?.id || state.vendor?.vendor?.id; // Access userId from user.user.id or vendor.vendor.id
    console.log("Fetch Orders Redux State:", {
      userId: userId || "undefined",
      userToken: token ? token.slice(0, 10) + "..." : "undefined",
      vendorToken: state.vendor?.token
        ? state.vendor.token.slice(0, 10) + "..."
        : "undefined",
    });
    if (!token) {
      throw new Error("Authentication token is missing. Please log in again.");
    }
    if (!userId) {
      throw new Error("User ID is missing. Please log in again.");
    }
    console.log("Fetch Orders Request:", {
      url: "/get_orders_user",
      params: { userId },
      token: token.slice(0, 10) + "...",
    });
    const response = await api.get<ApiResponse>("/get_orders_user", {
      params: { userId },
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Fetch Orders Response:", response.data);
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
    console.error("Fetch Orders Error:", error.message, error.response?.data);
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch orders"
    );
  }
};

export const getOrdersWithSession = async (): Promise<Order[]> => {
  return fetchOrders();
};
