import axios from "axios";

const API_BASE_URL = "https://ilosiwaju-mbaay-2025.com/api/v1/vendor";
const CHAT_BASE_URL = "https://ilosiwaju-mbaay-2025.com/api/v1/chat";

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
    return response.data.data;
  } catch (error: any) {
    console.error(error);
    throw error.response?.data?.message || "Check your network connection";
  }
};

export const upload_return_policy = async (token: string | null, data: any) => {
  try {
    const response = await api.post("/upload_return_policy", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error: any) {
    console.error(error);
    throw error.response?.data?.message || "Check your network connection";
  }
};

export const getAllVendor = async () => {
  try {
    const response = await api.get("/get_all_vendors");
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw error.response?.data?.message || "Check your network connection";
  }
};

export const getAlllVendor = async () => {
  try {
    const response = await api.get("/get_all_vendors");
    // console.log(response.data.vendors);
    return response.data.vendors;
  } catch (error: any) {
    console.error(error);
    throw error.response?.data?.message || "Check your network connection";
  }
};

// Verify Google ID token
export const verifyVendorGoogle = async (idToken: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/google-verify`,
      { token: idToken },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Google verification failed"
    );
  }
};

// Complete Google signup
export const completeVendorSignup = async (data: {
  tempToken: string;
  storeName: string;
  craftCategories: string[];
  storePhone: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/google-complete`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Signup completion failed"
    );
  }
};

export const getVendorStat = async (token: string | null) => {
  try {
    const response = await api.get("/vendorstats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const vendorKycUpload = async (token: string | null, data: any) => {
  try {
    const response = await api.post("/upload_kyc", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const NotBaseUrl = "https://ilosiwaju-mbaay-2025.com/api/v1/notifications";
export const getVendorNotification = async (id: string | null) => {
  try {
    const response = await axios.get(`${NotBaseUrl}/allnotifications/${id}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const markOneAsRead = async (
  vendorId: string | null,
  notificationId: string | null
) => {
  try {
    // Backend expects: {BASE}/notifications/{notificationId}/{vendorId}
    // Here BASE is .../api/v1/notifications, but routes are under an extra 'notifications' segment, consistent with read-all
    const response = await axios.patch(
      `${NotBaseUrl}/notifications/${notificationId}/${vendorId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const markVendorNotificationAsRead = async (id: string | null) => {
  try {
    const response = await axios.patch(
      `${NotBaseUrl}/notifications/read-all/${id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// ---- Chat helpers (added per request) ----
export const get_unread_chat_count = async (userId: string) => {
  try {
    const res = await axios.get(
      `${CHAT_BASE_URL}/get_unread_chat_count/${userId}`
    );
    console.log("Data" + res);
    return res.data; // expected { count }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const mark_chat_as_read = async (chatId: string, userId: string) => {
  try {
    const res = await axios.patch(
      `${CHAT_BASE_URL}/mark_chat_as_read/${chatId}/${userId}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
