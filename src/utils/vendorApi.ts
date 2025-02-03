import axios from "axios";

const API_BASE_URL = "https://mbayy-be.onrender.com/api/v1/vendor";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface CreateVenderData {
  storeName: string;
  email: string;
  userName: string;
  country: string;
  city: string;
  state: string;
  postcode: string;
  storePhone: string;
  password: string;
  craftCategories: string;
}

export const createVendor = async (userData: CreateVenderData) => {
  try {
    const response = await api.post("/create_vendor", userData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data?.message || "Failed to create account";
    }
    throw "Your Signup Failed";
  }
};

export const LoginVendor = async()=>{
    try {
        const response = await api.post("/login_vendor");
        return response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          throw error.response?.data?.message || "Failed to create account";
        }
        throw "Your Signup Failed";
      }
}