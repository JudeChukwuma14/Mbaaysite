import store from "@/redux/store";
import axios from "axios";

const API_CHAT_BASE_URL = "https://ilosiwaju-mbaay-2025.com/api/v1/chat";
const API_VENDOR_BASE_URL = "https://ilosiwaju-mbaay-2025.com/api/v1/vendor";

const getAuthToken = () => {
  const state = store.getState();
  const token = state.vendor.token || state.user.token || null;
  return token;
};

// Start a new chat
export const startChat = async (receiverId: string) => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token found");
  const response = await axios.post(
    `${API_CHAT_BASE_URL}/create_or_get_chat`,
    { receiverId },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Send a message
export const sendMessage = async (
  chatId: string,
  content: string,
  replyTo?: string
) => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token found");
  const response = await axios.post(
    `${API_CHAT_BASE_URL}/chat/${chatId}/message`,
    { chatId, content, replyTo },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const sendMediaMessage = async (
  chatId: string,
  files: File[],
  replyTo?: string
) => {
  const token = getAuthToken();
  if (!token) {
    console.error("DEBUG: No auth token found");
    throw new Error("No auth token found");
  }

  const formData = new FormData();
  // Separate images and videos
  const images = files.filter((file) => file.type.startsWith("image/"));
  const videos = files.filter((file) => file.type.startsWith("video/"));

  // Append images to 'images' field (up to 5, per backend maxCount)
  images.slice(0, 5).forEach((file) => {
    formData.append("images", file);
  });
  // Append video to 'video' field (only 1, per backend maxCount)
  if (videos.length > 0) {
    formData.append("video", videos[0]);
  }
  if (replyTo) {
    formData.append("replyTo", replyTo);
  }
  try {
    const response = await axios.post(
      `${API_CHAT_BASE_URL}/chat/${chatId}/send_media_message`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "DEBUG: Error in sendMediaMessage:",
      JSON.stringify(error.response?.data || error.message, null, 2)
    );
    throw new Error(
      error.response?.data?.message || "Failed to send media message"
    );
  }
};

// Get all user chats
export const getUserChats = async () => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token found");
  const response = await axios.get(`${API_CHAT_BASE_URL}/chats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Get messages for a specific chat
export const getChatMessages = async (chatId: string) => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token found");

  const response = await axios.get(
    `${API_CHAT_BASE_URL}/chat/${chatId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Edit a message
export const editMessage = async (messageId: string, content: string) => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token found");
  const response = await axios.patch(
    `${API_CHAT_BASE_URL}/edit/${messageId}`,
    { content },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Delete a message
export const deleteMessage = async (messageId: string) => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token found");
  const response = await axios.delete(
    `${API_CHAT_BASE_URL}/delete/${messageId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Get all vendors
export const getAllVendor = async () => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token found");
  const response = await axios.get(`${API_VENDOR_BASE_URL}/get_all_vendors`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// NEW: Get total unread chat count for a user
export const getUnreadChatCount = async (userId: string) => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token found");
  
  try {
    console.log(`[CHAT] Getting unread count for user: ${userId}`);
    const response = await axios.get(
      `${API_CHAT_BASE_URL}/get_unread_chat_count/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log("[CHAT] Unread count response:", {
      status: response.status,
      data: response.data,
    });
    
    // Expecting a shape like { count: number }
    return response.data;
  } catch (error: any) {
    console.error("Error getting unread chat count:", error);
    throw new Error(
      error.response?.data?.message || "Failed to get unread count"
    );
  }
};

// NEW: Mark a chat as read for a user
export const markChatAsRead = async (chatId: string, userId: string) => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token found");
  
  try {
    console.log(`[CHAT] Marking chat as read: ${chatId} for user: ${userId}`);
    const response = await axios.patch(
      `${API_CHAT_BASE_URL}/mark_chat_as_read/${chatId}/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log("[CHAT] Mark as read response:", {
      status: response.status,
      data: response.data,
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Error marking chat as read:", error);
    throw new Error(
      error.response?.data?.message || "Failed to mark chat as read"
    );
  }
};