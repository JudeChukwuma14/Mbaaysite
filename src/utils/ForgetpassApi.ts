import axios from "axios";

const API_BASE_URL = "https://ilosiwaju-mbaay-2025.com/api/v1/vendor";
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// forgot-password
export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post("/forgotpassword", { email });
    return response.data;
  } catch (error: any) {
    console.error("Forgot Password Error:", error.response?.data || error);
    throw error.response?.data?.message || "Failed to send reset link";
  }
};

export const CreateNewPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  try {
    const response = await api.post("/resetpassword", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    console.error("Reset Password Error:", error.response?.data || error);
    throw error.response?.data?.message || "Failed to reset password";
  }
};
