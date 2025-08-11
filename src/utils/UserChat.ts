import store from "@/redux/store";
import axios from "axios";

const API_CHAT_BASE_URL = "https://mbayy-be.onrender.com/api/v1/chat";
const API_VENDOR_BASE_URL = "https://mbayy-be.onrender.com/api/v1/vendor";

const getAuthToken = () => {
  const state = store.getState();
  const token = state.vendor.token || state.user.token || null;
  console.log(
    "DEBUG: Retrieved auth token:",
    token ? "Token present" : "No token"
  );
  return token;
};

// Start a new chat
export const startChat = async (receiverId: string) => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token found");

  console.log("DEBUG: Starting chat with receiverId:", receiverId);
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
  console.log(
    "DEBUG: startChat response:",
    JSON.stringify(response.data, null, 2)
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

  console.log("DEBUG: Sending message to chat:", chatId, "content:", content);
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
  console.log(
    "DEBUG: sendMessage response:",
    JSON.stringify(response.data, null, 2)
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

  console.log(
    "DEBUG: Sending media message to chat:",
    chatId,
    "files:",
    files.map((f) => f.name)
  );
  const formData = new FormData();
  files.forEach((file, index) => {
    // Use a generic 'files' field to support all file types
    formData.append(`files[${index}]`, file);
  });
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
    console.log(
      "DEBUG: sendMediaMessage response:",
      JSON.stringify(response.data, null, 2)
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

  console.log("DEBUG: Fetching user chats...");
  const response = await axios.get(`${API_CHAT_BASE_URL}/chats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(
    "DEBUG: getUserChats response:",
    JSON.stringify(response.data, null, 2)
  );
  return response.data;
};

// Get messages for a specific chat
export const getChatMessages = async (chatId: string) => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token found");

  console.log("DEBUG: Fetching messages for chat:", chatId);
  const response = await axios.get(
    `${API_CHAT_BASE_URL}/chat/${chatId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(
    "DEBUG: getChatMessages response:",
    JSON.stringify(response.data, null, 2)
  );
  return response.data;
};

// Edit a message
export const editMessage = async (messageId: string, content: string) => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token found");

  console.log("DEBUG: Editing message:", messageId, "with content:", content);
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
  console.log(
    "DEBUG: editMessage response:",
    JSON.stringify(response.data, null, 2)
  );
  return response.data;
};

// Delete a message
export const deleteMessage = async (messageId: string) => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token found");

  console.log("DEBUG: Deleting message:", messageId);
  const response = await axios.delete(
    `${API_CHAT_BASE_URL}/delete/${messageId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(
    "DEBUG: deleteMessage response:",
    JSON.stringify(response.data, null, 2)
  );
  return response.data;
};

// Get all vendors
export const getAllVendor = async () => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token found");

  console.log("DEBUG: Fetching all vendors...");
  const response = await axios.get(`${API_VENDOR_BASE_URL}/get_all_vendors`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(
    "DEBUG: getAllVendor response:",
    JSON.stringify(response.data, null, 2)
  );
  return response.data;
};
