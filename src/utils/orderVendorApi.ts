import axios from "axios";

const BASE_URL = "https://mbayy-be.onrender.com/api/v1";

// Create axios instance with default config
const orderApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
orderApi.interceptors.request.use(
  (config) => {
    // Token will be added per request in the functions below
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
orderApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message =
        error.response.data?.message ||
        `HTTP error! status: ${error.response.status}`;
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Network error: No response from server");
    } else {
      // Something else happened
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
);

export interface Order {
  _id: string;
  orderId: string;
  orderDate: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    fullAddress: string;
  };
  totalAmount: number;
  status: "On Delivery" | "Delivered" | "Cancelled" | "Pending";
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  paymentStatus: "Paid" | "Pending" | "Failed";
  createdAt: string;
  updatedAt: string;
}

export interface GetVendorOrdersResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
    totalOrders: number;
    pagination: {
      currentPage: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface GetVendorOrdersParams {
  token: string;
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: "newest" | "oldest";
}

export const getVendorOrders = async (
  params: GetVendorOrdersParams
): Promise<GetVendorOrdersResponse> => {
  const { token, page = 1, limit = 10, status, sortBy = "newest" } = params;

  // Build query parameters
  const queryParams: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
  };

  if (status && status !== "All") {
    queryParams.status = status;
  }

  try {
    const response = await orderApi.get("/order/vendor_orders", {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    throw error;
  }
};

// Get single order details
export const getOrderDetails = async (
  orderId: string,
  token: string
): Promise<Order> => {
  try {
    const response = await orderApi.get(`/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};

// Get single order by ID (using the new endpoint)
export const getOneOrder = async (
  orderId: string,
  token: string
): Promise<Order> => {
  try {
    const response = await orderApi.get(`/order/get_one_order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching single order:", error);
    throw error;
  }
};

// Update order status
export interface UpdateOrderStatusParams {
  orderId: string;
  status: Order["status"];
  token: string;
}

export const updateOrderStatus = async (
  params: UpdateOrderStatusParams
): Promise<Order> => {
  const { orderId, status, token } = params;

  try {
    const response = await orderApi.patch(
      `/order/${orderId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Get order statistics
export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  onDeliveryOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export const getOrderStats = async (token: string): Promise<OrderStats> => {
  try {
    const response = await orderApi.get("/order/vendor_stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching order stats:", error);
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (
  orderId: string,
  token: string,
  reason?: string
): Promise<Order> => {
  try {
    const response = await orderApi.patch(
      `/order/${orderId}/cancel`,
      { reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};

// Export orders
export const exportOrders = async (
  token: string,
  format: "csv" | "pdf" = "csv",
  filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }
): Promise<Blob> => {
  try {
    const response = await orderApi.get("/order/export", {
      params: {
        format,
        ...filters,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    console.error("Error exporting orders:", error);
    throw error;
  }
};
