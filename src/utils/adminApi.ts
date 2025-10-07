
import axios from "axios";

const API_BASE_URL = import.meta.env.API_URL;
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/admin`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createAdmin = async (userData: any) => {
   try {
     const response = await api.post("/create_admin", userData);
     return response.data;
   } catch (error: any) {
     console.error("Signup Error:", error.response?.data || error);
     throw error.response?.data?.message || "Failed to create account";
   }

};