import {
  getAllCustomers,
  getAllPayments,
  GetVendorCustomersParams,
} from "@/utils/vendorCustomer_Payment";
import { useQuery } from "@tanstack/react-query";

export const useVendorCustomer = (params: GetVendorCustomersParams) => {
  return useQuery({
    queryKey: ["vendorCustomer", params],
    queryFn: () => getAllCustomers(params),
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

export const useVendorPayments = (params: GetVendorCustomersParams) => {
  return useQuery({
    queryKey: ["vendorPayments", params],
    queryFn: () => getAllPayments(params),
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
