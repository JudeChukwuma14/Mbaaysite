import { useState, useEffect, useRef } from "react";
import { Send, X, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setChatId as setUserChatId,
  setMessages as setUserMessages,
  addMessage as addUserMessage,
} from "@/redux/slices/userSlice";
import {
  setChatId as setVendorChatId,
  setMessages as setVendorMessages,
  addMessage as addVendorMessage,
} from "@/redux/slices/vendorSlice";
import io, { Socket } from "socket.io-client";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: string;
  isOptimistic?: boolean; // Flag for optimistic messages
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_CHAT_BASE_URL = "https://mbayy-be.onrender.com/api/v1/admin";
const SOCKET_URL = "https://mbayy-be.onrender.com";

export const ChatInterface = ({ isOpen, onClose }: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Access user, vendor, token, chatId, and messages from Redux
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const token = useSelector(
    (state: RootState) => state.user.token || state.vendor.token
  );
  const senderId = user?._id || vendor?._id;
  const isVendor = !!vendor;
  const chatId = useSelector((state: RootState) =>
    isVendor ? state.vendor.chatId : state.user.chatId
  );
  const messages = useSelector((state: RootState) =>
    isVendor ? state.vendor.messages || [] : state.user.messages || []
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize Socket.IO
  useEffect(() => {
    if (!isOpen || !senderId || !token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token: `Bearer ${token}` },
    });

    socketRef.current.on("connect", () => {
      console.log("Socket.IO connected");
    });

    socketRef.current.on("customerCareChatStarted", (chat) => {
      console.log("🆕 New Chat:", JSON.stringify(chat, null, 2));
      dispatch(isVendor ? setVendorChatId(chat._id) : setUserChatId(chat._id));
      socketRef.current?.emit("joinChat", chat._id);
    });

    socketRef.current.on("customerCareMessage", (msg) => {
      console.log("📩 CC Message:", JSON.stringify(msg, null, 2));
      const newMessage: Message = {
        id: msg._id,
        content: msg.content,
        sender: msg.sender?._id === senderId ? "user" : "agent",
        timestamp: new Date(msg.createdAt).toISOString(),
      };

      // Replace optimistic message if it exists
      const optimisticMessage = messages.find(
        (m) =>
          m.isOptimistic && m.content === msg.content && m.sender === "user"
      );
      if (optimisticMessage) {
        dispatch(
          isVendor
            ? setVendorMessages(
                messages.map((m) =>
                  m.id === optimisticMessage.id
                    ? { ...newMessage, isOptimistic: false }
                    : m
                )
              )
            : setUserMessages(
                messages.map((m) =>
                  m.id === optimisticMessage.id
                    ? { ...newMessage, isOptimistic: false }
                    : m
                )
              )
        );
      } else {
        dispatch(
          isVendor ? addVendorMessage(newMessage) : addUserMessage(newMessage)
        );
      }
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket.IO error:", err.message);
      setError("Failed to connect to real-time updates");
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [isOpen, senderId, token, dispatch, isVendor, messages]);

  // Start chat or fetch existing messages
  const startChat = async (retries = 3, delay = 1000) => {
    if (!senderId || !token) {
      setError("Please log in to start a chat");
      return;
    }

    // If chatId exists, fetch messages
    if (chatId) {
      await fetchMessages();
      socketRef.current?.emit("joinChat", chatId);
      return;
    }

    for (let i = 0; i < retries; i++) {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Starting chat with:", { senderId, token });
        const response = await axios.post(
          `${API_CHAT_BASE_URL}/start-customer-care`,
          { userId: senderId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(
          "Start chat response:",
          JSON.stringify(response.data, null, 2)
        );
        const newChatId = response.data.chatId || response.data.chat?._id;
        dispatch(
          isVendor ? setVendorChatId(newChatId) : setUserChatId(newChatId)
        );
        socketRef.current?.emit("joinChat", newChatId);
        await fetchMessages(newChatId);
        return;
      } catch (err: any) {
        console.error("Start chat error:", err.response?.data || err.message);
        if (i === retries - 1) {
          setError(
            `Failed to start chat: ${
              err.response?.data?.message || err.message
            }`
          );
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Fetch messages for a given chatId
  const fetchMessages = async (targetChatId: string = chatId!) => {
    if (!targetChatId || !token) return;

    try {
      console.log(
        "Fetching messages for chatId:",
        targetChatId,
        "with senderId:",
        senderId
      );
      const response = await axios.get(
        `${API_CHAT_BASE_URL}/customer_care_chatmessages/${targetChatId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(
        "Fetch messages response:",
        JSON.stringify(response.data, null, 2)
      );
      const fetchedMessages = (response.data.messages || []).map(
        (msg: any) => ({
          id: msg._id,
          content: msg.content,
          sender: msg.sender?._id === senderId ? "user" : "agent",
          timestamp: new Date(msg.createdAt).toISOString(),
        })
      );
      dispatch(
        isVendor
          ? setVendorMessages(fetchedMessages)
          : setUserMessages(fetchedMessages)
      );
    } catch (err: any) {
      console.error("Fetch messages error:", err.response?.data || err.message);
      setError(
        `Failed to fetch messages: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  // Start chat when widget opens
  useEffect(() => {
    if (isOpen) {
      startChat();
    }
  }, [isOpen, senderId, token]);

  // Send message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatId || !senderId || !token) {
      setError("Cannot send message: Missing input, chatId, or authentication");
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date().toISOString(),
      isOptimistic: true, // Mark as optimistic
    };

    dispatch(
      isVendor ? addVendorMessage(newMessage) : addUserMessage(newMessage)
    );
    setInputValue("");

    try {
      console.log("Sending message with:", {
        chatId,
        content: inputValue,
        senderId,
        token,
      });
      const response = await axios.post(
        `${API_CHAT_BASE_URL}/send-message`,
        { chatId, content: inputValue, senderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        "Send message response:",
        JSON.stringify(response.data, null, 2)
      );
    } catch (err: any) {
      console.error("Send message error:", err.response?.data || err.message);
      setError(
        `Failed to send message: ${err.response?.data?.message || err.message}`
      );
      dispatch(
        isVendor
          ? setVendorMessages(
              messages.filter((msg) => msg.id !== newMessage.id)
            )
          : setUserMessages(messages.filter((msg) => msg.id !== newMessage.id))
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  if (!senderId || !token) {
    return (
      <Card className="fixed z-40 border-0 shadow-2xl bottom-20 right-6 w-80 h-96">
        <div className="p-4 text-center">
          <p className="text-red-500">Please log in to use the chat feature.</p>
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "fixed bottom-20 right-6 z-40 w-80 h-96",
        "sm:w-96 sm:h-[400px]",
        "lg:w-96 lg:h-[460px]",
        "shadow-2xl border-0",
        "animate-in slide-in-from-bottom-5 duration-300"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white bg-orange-500 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full ring-2 ring-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Mbaay Customer Support</h3>
            <p className="text-xs opacity-90">We're here to help</p>
          </div>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="w-6 h-6 p-0 text-white hover:bg-white/20"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 h-64 p-4 lg:h-80">
        {isLoading && <p className="text-center">Loading...</p>}
        {error && (
          <div className="p-4 text-center">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => startChat()} className="mt-2">
              Retry
            </Button>
          </div>
        )}
        {!isLoading && !error && (!messages || messages.length === 0) && (
          <p className="text-center text-gray-500">
            Waiting for customer support...
          </p>
        )}
        <div className="space-y-4">
          {(messages || []).map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3 text-sm",
                  message.sender === "user"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-800"
                )}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === "agent" && (
                    <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-orange-500" />
                  )}
                  {message.sender === "user" && (
                    <User className="h-4 w-4 mt-0.5 flex-shrink-0 order-2" />
                  )}
                  <div className={message.sender === "user" ? "order-1" : ""}>
                    <p>{message.content}</p>
                    <p
                      className={cn(
                        "mt-1 text-xs opacity-70",
                        message.sender === "user"
                          ? "text-orange-100"
                          : "text-gray-500"
                      )}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="px-3 pt-2 pb-5 border-t ">
        <div className="flex items-center space-x-1">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 w-full px-3 py-1 text-base transition-colors bg-transparent border rounded-md shadow-sm h-9 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            disabled={isLoading || !chatId}
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="text-white bg-orange-500 hover:bg-orange-600"
            disabled={isLoading || !chatId}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
