import axios from "axios";

const API_BASE_URL = "https://mbayy-be.onrender.com/api/v1/chat";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Create or get existing chat
export const create_or_get_chat = async (
  data: { receiverId: string },
  token: any
) => {
  try {
    const response = await api.post("/create_or_get_chat", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    return response.data.chat;
  } catch (error) {
    console.error("Error creating/getting chat:", error);
    throw error;
  }
};

// Send message in a chat
export const sendMessage = async (
  chatId: string,
  data: { content: string; replyTo?: string },
  token: string | null
) => {
  try {
    const response = await api.post(`/chat/${chatId}/message`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("message", response);
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Get user's chats
export const getUserChats = async (token: string | null) => {
  try {
    const response = await api.get("/chats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data.chats;
  } catch (error) {
    console.error("Error getting user chats:", error);
    throw error;
  }
};

// Get messages in a chat
export const getChatMessages = async (chatId: string) => {
  try {
    const response = await api.get(`/chat/${chatId}/messages`, {});
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error getting chat messages:", error);
    throw error;
  }
};

// Edit a message
export const editMessage = async (
  messageId: string,
  data: { content: string },
  token: string | null
) => {
  try {
    const response = await api.patch(`/edit/${messageId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error editing message:", error);
    throw error;
  }
};

// Delete a message
export const deleteMessage = async (
  messageId: string,
  token: string | null
) => {
  try {
    const response = await api.delete(`/delete/${messageId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

// Send media message
export const sendMediaMessage = async (
  chatId: string,
  formData: FormData,
  token: string | null
) => {
  try {
    const response = await api.post(
      `/chat/${chatId}/send_media_message`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending media message:", error);
    throw error;
  }
};

// Prepare form data for media messages
export const prepareMediaFormData = (
  files: {
    images?: File[];
    video?: File;
  },
  content?: string,
  replyTo?: string
): FormData => {
  const formData = new FormData();

  // Add text content if provided
  if (content) {
    formData.append("content", content);
  }

  // Add replyTo if provided
  if (replyTo) {
    formData.append("replyTo", replyTo);
  }

  // Add images if provided
  if (files.images && files.images.length > 0) {
    files.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  // Add video if provided
  if (files.video) {
    formData.append("video", files.video);
  }

  return formData;
};
