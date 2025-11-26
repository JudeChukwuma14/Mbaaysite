import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVendorOrders,
  getOrderDetails,
  getOneOrder, // Add this import
  cancelOrder,
  exportOrders,
  cancelOrPostponeOrder,
  type GetVendorOrdersParams,
} from "@/utils/orderVendorApi";
import { toast } from "react-toastify";

export const useVendorOrders = (params: GetVendorOrdersParams) => {
  return useQuery({
    queryKey: ["vendorOrders", params],
    queryFn: () => getVendorOrders(params),
    enabled: !!params.token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401/403 errors
      if (error.message.includes("401") || error.message.includes("403")) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: ["orderDetails", orderId],
    queryFn: () => getOrderDetails(orderId),
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      if (error.message.includes("401") || error.message.includes("403")) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useOneOrder = (orderId: any) => {
  return useQuery({
    queryKey: ["oneOrder", orderId],
    queryFn: () => getOneOrder(orderId),
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      if (error.message.includes("401") || error.message.includes("403")) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// // Hook for order statistics
// export const useOrderStats = (token: string) => {
//   return useQuery({
//     queryKey: ["orderStats"],
//     queryFn: () => getOrderStats(token),
//     enabled: !!token,
//     staleTime: 10 * 60 * 1000, // 10 minutes
//     retry: (failureCount, error) => {
//       if (error.message.includes("401") || error.message.includes("403")) {
//         return false;
//       }
//       return failureCount < 3;
//     },
//   });
// };

// Hook for cancelling orders
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      token,
      reason,
    }: {
      orderId: string;
      token: string;
      reason?: string;
    }) => cancelOrder(orderId, token, reason),
    onSuccess: (variables) => {
      queryClient.invalidateQueries({ queryKey: ["vendorOrders"] });
      queryClient.invalidateQueries({
        queryKey: ["orderDetails", variables._id],
      });
      queryClient.invalidateQueries({ queryKey: ["orderStats"] });

      toast.success("Order cancelled successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      console.error("Error cancelling order:", error);
      toast.error(error.message || "Failed to cancel order", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });
};

// Hook for exporting orders
export const useExportOrders = () => {
  return useMutation({
    mutationFn: ({
      token,
      format,
      filters,
    }: {
      token: string;
      format?: "csv" | "pdf";
      filters?: { status?: string; startDate?: string; endDate?: string };
    }) => exportOrders(token, format, filters),
    onSuccess: (blob, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders.${variables.format || "csv"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Orders exported successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      console.error("Error exporting orders:", error);
      toast.error(error.message || "Failed to export orders", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });
};

// Hook for cancelling or postponing an order (vendor initiated)
export const useCancelOrPostponeOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: {
      payload: {
        orderId: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        postalCode?: string | number;
        address: string;
        country: string;
        state: string;
        city: string;
        isCancellation?: boolean;
        isPostponement?: boolean;
        cancellationReason?: string;
        postponementFromDate?: string;
        postponementToDate?: string;
      };
      token?: string;
    }) => cancelOrPostponeOrder(args.payload, args.token),
    onSuccess: (_data, variables) => {
      // Invalidate related queries so UI refreshes
      queryClient.invalidateQueries({ queryKey: ["vendorOrders"] });
      if (variables?.payload?.orderId) {
        queryClient.invalidateQueries({
          queryKey: ["orderDetails", variables.payload.orderId],
        });
        queryClient.invalidateQueries({
          queryKey: ["oneOrder", variables.payload.orderId],
        });
      }

      const action = variables.payload.isCancellation
        ? "cancelled"
        : variables.payload.isPostponement
        ? "postponed"
        : "updated";
      toast.success(`Order ${action} successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: any) => {
      console.error("Error cancelling/postponing order:", error);
      toast.error(error.message || "Failed to update order", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });
};
