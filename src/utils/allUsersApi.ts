import axios from "axios";

const API_BASE_URL = "https://ilosiwaju-mbaay-2025.com/api/v1/user";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getAllUsers = async () => {
  try {
    const response = await api.get("/alll_users");
    console.log(response.data.data, "All users");
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};




const NotBaseUrl = "https://ilosiwaju-mbaay-2025.com/api/v1/notifications"

// Helper to get token from localStorage or Redux
const getToken = () => {
  // Try localStorage first
  const token = localStorage.getItem('authToken')
  
  // If using Redux, you might need to pass token from component
  // For now, use localStorage
  return token || ''
}

export const getVendorNotification = async (id: string | null) => {
  try {
    if (!id) throw new Error("User ID is required")
    
    const response = await axios.get(`${NotBaseUrl}/allnotifications/${id}`, {
      headers: { 
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    })
    
    return response.data
  } catch (error: any) {
    console.error("Error fetching notifications:", error)
    throw error
  }
}


export const markOneAsRead = async ( notificationId: string | null) => {
  try {
    if (!notificationId) throw new Error("IDs required")

    const response = await axios.patch(
      `${NotBaseUrl}/notifications/read-all/${notificationId}`,  // ← Try this
      {},
      {
        headers: { 
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    return response.data
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message)
    throw error
  }
}

// Also check mark all — likely same issue
export const markVendorNotificationAsRead = async (id: string | null) => {
  try {
    if (!id) throw new Error("User ID is required")
    
    const response = await axios.patch(
      `${NotBaseUrl}/read-all/${id}`, // ← This might be correct, or needs fix
      {},
      {
        headers: { 
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    return response.data
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error)
    throw error
  }
}