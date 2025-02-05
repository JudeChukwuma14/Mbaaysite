import axios from "axios";

const API_BASE_URL = "https://mbayy-be.onrender.com/api/v1/vendor";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});



export const createVendor = async (userData: any) => {
   try {
     const response = await api.post("/create_vendor", userData);
     return response.data;
   } catch (error: any) {
     console.error("Signup Error:", error.response?.data || error);
     throw error.response?.data?.message || "Failed to create account";
   }

};

export const LoginVendorAPI = async(userData:any)=>{
  try {
    const response = await api.post("/create_vendor", userData);
    return response.data;
  } catch (error: any) {
    console.error("Signup Error:", error.response?.data || error);
    throw error.response?.data?.message || "Failed to create account";
  }
}