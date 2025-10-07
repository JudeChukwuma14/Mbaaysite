import axios from "axios";

const API_BASE_URL = "https://ilosiwaju-mbaay-2025.com/api/v1/user";
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add this function in your API file or wherever you're managing API calls
export const fetchUserProfile = async (token: string) => {
  try {
    const response = await api.get("/get-one-use", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Profile Fetch Error:", error.response?.data || error);
    throw error.response?.data?.message || "Failed to fetch user profile";
  }
};
export const createUser = async (userData: any) => {
  try {
    const response = await api.post("/create_user", userData);
    return response.data;
  } catch (error: any) {
    console.error("Signup Error:", error.response?.data || error);
    throw error.response?.data?.message || "Failed to create account";
  }
};

// OTP Verification API Call
export const verifyOtp = async (userId: string, otp: string) => {
  try {
    const response = await api.post(`/verify-otp/${userId}`, { otp });
    return response.data;
  } catch (error: any) {
    console.error("OTP Verification Error:", error.response?.data || error);
    throw error.response?.data?.message || "Invalid OTP";
  }
};

// Resend OTP API Call
export const resendOtp = async (userId: string) => {
  try {
    const response = await api.post(`/resend-otp/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Resend OTP Error:", error.response?.data || error);
    throw error.response?.data?.message || "Failed to resend OTP";
  }
};

export const LoginUser = async (userData: any) => {
  try {
    const response = await api.post("/login-user", userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to Login account";
  }
};

