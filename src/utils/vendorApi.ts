import axios from "axios";

const API_BASE_URL = "https://mbayy-be.onrender.com/api/v1/vendor";

export const api = axios.create({
  baseURL: API_BASE_URL,
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

export const LoginVendorAPI = async (userData: any) => {
  try {
    const response = await api.post("/login_vendor", userData);
    console.log(response);
    return response.data;
  } catch (error: any) {
    console.error("Signup Error:", error.response?.data || error);
    throw error.response?.data?.message || "Check your network connection";
  }
};

export const get_single_vendor = async (token: string | null) => {
  try {
    const response = await api.get("/find_one_vendor", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data.data)
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};



// export const get_single_vendor = async (token: string | null) => {
//   if (!token) {
//     throw new Error("No token provided");
//   }
//   try {
//     const response = await api.get("/find_one_vendor", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data.data;
//   } catch (error: any) {
//     console.error("Fetch Vendor Profile Error:", error.response?.data || error);
//     throw error.response?.data?.message || "Failed to fetch vendor profile";
//   }
// };
export const upload_return_policy = async (token: string | null, data: any) => {
  try {
    const response = await api.post("/upload_return_policy", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getAllVendor = async () => {
  try {
    const response = await api.get("/get_all_vendors");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
