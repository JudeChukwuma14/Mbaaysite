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
    const response = await api.post("/login_vendor", userData);
    return response.data;
  } catch (error: any) {
    console.error("Signup Error:", error.response?.data || error);
    throw error.response?.data?.message || "Failed to create account";
  }
}


export const get_single_vendor = async(token:string | null)=>{
  try {
    const response = await api.get("/find_one_vendor",{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    console.log(response.data.data)
    return response.data.data
  } catch (error) {
    console.log(error)
  }
}