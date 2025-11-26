import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  changeVendorPassword,
  updateVendorLocation,
  initiateVendorEmailChange,
  verifyVendorEmail,
  updateStoreDetails,
} from "@/utils/vendorApi";

// Change password
export const useChangeVendorPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      newPassword,
      confirmPassword,
    }: {
      token: string | null;
      newPassword: string;
      confirmPassword: string;
    }) => changeVendorPassword(token, newPassword, confirmPassword),
    onSuccess: (data: any) => {
      const msg = data?.message || "Password changed successfully!";
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
    onError: (error: any) => {
      console.error("useChangeVendorPassword error:", error);
      const msg =
        error?.message || error?.toString() || "Failed to change password";
      toast.error(msg);
    },
  });
};

// Update location
export const useUpdateVendorLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      location,
    }: {
      token: string | null;
      location: any;
    }) => updateVendorLocation(token, location),
    onSuccess: (data: any) => {
      toast.success(data?.message || "Location updated");
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
    onError: (error: any) => {
      console.error("useUpdateVendorLocation error:", error);
      toast.error(error?.message || "Failed to update location");
    },
  });
};

// Initiate email change (send OTP)
export const useInitiateVendorEmailChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, email }: { token: string | null; email: string }) =>
      initiateVendorEmailChange(token, email),
    onSuccess: (data: any) => {
      toast.success(data?.message || "Email OTP sent");
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
    onError: (error: any) => {
      console.error("useInitiateVendorEmailChange error:", error);
      toast.error(error?.message || "Failed to initiate email change");
    },
  });
};

// Verify email with OTP
export const useVerifyVendorEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      email,
      otp,
    }: {
      token: string | null;
      email: string;
      otp: string;
    }) => verifyVendorEmail(token, email, otp),
    onSuccess: (data: any) => {
      toast.success(data?.message || "Email updated");
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
    onError: (error: any) => {
      console.error("useVerifyVendorEmail error:", error);
      toast.error(error?.message || "Failed to verify email");
    },
  });
};

// Update store details (name / phone)
export const useUpdateStoreDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      details,
    }: {
      token: string | null;
      details: { storeName?: string; storePhone?: string };
    }) => updateStoreDetails(token, details),
    onSuccess: (data: any) => {
      toast.success(data?.message || "Store details updated");
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
    onError: (error: any) => {
      console.error("useUpdateStoreDetails error:", error);
      toast.error(error?.message || "Failed to update store details");
    },
  });
};
