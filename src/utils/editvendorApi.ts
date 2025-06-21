import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "https://mbayy-be.vercel.app/api/v1/vendor";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Function to upload avatar (logo image)
export const uploadAvatar = async (data: FormData, token: string) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/upload_avatar`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

// Function to upload business logo (banner image)
export const uploadBusinessLogo = async (data: FormData, token: string) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/upload_businesslogo`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading business logo:", error);
    throw error;
  }
};

// Custom hook for avatar upload mutation
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, token }: { data: FormData; token: any }) =>
      uploadAvatar(data, token),
    onSuccess: () => {
      toast.success("Logo uploaded successfully!");
      // Invalidate vendor data to refresh it
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
    onError: (error) => {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo. Please try again.");
    },
  });
};

// Custom hook for business logo upload mutation
export const useUploadBusinessLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, token }: { data: FormData; token: any }) =>
      uploadBusinessLogo(data, token),
    onSuccess: () => {
      toast.success("Banner uploaded successfully!");
      // Invalidate vendor data to refresh it
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
    onError: (error) => {
      console.error("Error uploading banner:", error);
      toast.error("Failed to upload banner. Please try again.");
    },
  });
};
