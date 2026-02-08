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
  setChatId as setVendorChatId,
  setMessages as setVendorMessages,
  addMessage as addVendorMessage,
} from "@/redux/slices/vendorSlice";
import io, { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

// Notification sound
const notificationSound = new Audio("/sounds/notification.mp3");

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent" | "bot";
  timestamp: string;
  isOptimistic?: boolean;
  tempId?: string;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_CHAT_BASE_URL = "https://ilosiwaju-mbaay-2025.com/api/v1/admin";
const API_NOTIFICATION_BASE_URL =
  "https://ilosiwaju-mbaay-2025.com/api/v1/notifications";
const SOCKET_URL = "https://ilosiwaju-mbaay-2025.com";
const AUTO_RESPONSE_MESSAGE =
  "Welcome to Mbaay Support! We're here to assist you. An agent will respond shortly.";

export const ChatInterface = ({ isOpen, onClose }: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const hasAutoResponse = useRef<boolean>(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const token = useSelector((state: RootState) => state.vendor.token);
  const senderId = vendor?._id;
  const chatId = useSelector((state: RootState) => state.vendor.chatId);
  const messages = useSelector(
    (state: RootState) => state.vendor.messages || []
  );

  // Request notification permission
  useEffect(() => {
    if (isOpen && "Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted");
        }
      });
    }
  }, [isOpen]);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!senderId || !token) return;
    try {
      const response = await axios.get(
        `${API_NOTIFICATION_BASE_URL}/allnotifications/${senderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(response.data.notifications || []);
    } catch (err: any) {
      console.error(
        "Fetch notifications error:",
        err.response?.data || err.message
      );
      setError("Failed to fetch notifications");
    }
  };

  // Fetch notifications when chat opens
  useEffect(() => {
    if (isOpen && senderId && token) {
      fetchNotifications();
    }
  }, [isOpen, senderId, token]);

  // Play notification sound and show browser notification
  const triggerNotification = (message: Message) => {
    notificationSound.play().catch((err) => {
      console.error("Failed to play notification sound:", err);
      // Fallback: Visual indicator
      document.querySelector(".bg-orange-500")?.classList.add("animate-pulse");
      setTimeout(() => {
        document
          .querySelector(".bg-orange-500")
          ?.classList.remove("animate-pulse");
      }, 1000);
    });

    if (
      "Notification" in window &&
      Notification.permission === "granted" &&
      message.sender !== "user"
    ) {
      new Notification("Mbaay Support", {
        body: message.content,
        icon: "/favicon.ico",
      });
    }
  };

  // Redirect to /selectpath if not authenticated
  useEffect(() => {
    if (isOpen && (!senderId || !token)) {
      // console.log("DEBUG: No senderId or token, redirecting to /selectpath");
      localStorage.setItem("redirectToChat", "true");
      navigate("/selectpath");
      onClose();
    }
  }, [isOpen, senderId, token, navigate, onClose]);

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
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      // console.log("Socket.IO connected, socketId:", socketRef.current?.id);
      if (chatId) {
        socketRef.current?.emit("joinChat", chatId);
      }
    });

    socketRef.current.on("customerCareChatStarted", (chat) => {
      // console.log("🆕 New Chat:", JSON.stringify(chat, null, 2));
      dispatch(setVendorChatId(chat._id));
      localStorage.setItem(`chatId-${senderId}`, chat._id);
      socketRef.current?.emit("joinChat", chat._id);
      fetchMessages(chat._id);
    });

    socketRef.current.on("customerCareMessage", (msg) => {
      // console.log("📩 CC Message:", JSON.stringify(msg, null, 2));
      const isSentByCurrentUser = msg.sender?._id === senderId;
      const newMessage: Message = {
        id: msg._id,
        content: msg.content,
        sender: isSentByCurrentUser
          ? "agent"
          : msg.sender === "bot"
          ? "bot"
          : "user",
        timestamp: new Date(msg.createdAt).toISOString(),
        tempId: msg.tempId,
        isOptimistic: false,
      };

      const existingMessage = messages.find(
        (m) =>
          m.id === msg._id ||
          (msg.tempId && m.tempId === msg.tempId) ||
          (isSentByCurrentUser &&
            m.sender === "agent" &&
            m.content === msg.content &&
            Math.abs(
              new Date(m.timestamp).getTime() -
                new Date(msg.createdAt).getTime()
            ) < 2000)
      );
      if (existingMessage) {
        // console.log(
        //   "DEBUG: Replacing message, id:",
        //   msg._id,
        //   "tempId:",
        //   msg.tempId,
        //   "existing:",
        //   JSON.stringify(existingMessage, null, 2)
        // );
        dispatch(
          setVendorMessages(
            messages.map((m) =>
              m.id === existingMessage.id ||
              (msg.tempId && m.tempId === msg.tempId) ||
              (isSentByCurrentUser &&
                m.sender === "agent" &&
                m.content === msg.content &&
                Math.abs(
                  new Date(m.timestamp).getTime() -
                    new Date(msg.createdAt).getTime()
                ) < 2000)
                ? { ...newMessage }
                : m
            )
          )
        );
      } else {
        // console.log("DEBUG: Adding new message, id:", msg._id);
        dispatch(addVendorMessage(newMessage));
        if (!isSentByCurrentUser) {
          triggerNotification(newMessage);
          fetchNotifications();
        }
      }
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket.IO error:", err.message);
      setError("Failed to connect to real-time updates. Please try again.");
    });

    socketRef.current.on("reconnect", () => {
      // console.log("Socket.IO reconnected, socketId:", socketRef.current?.id);
      if (chatId) {
        socketRef.current?.emit("joinChat", chatId);
        fetchMessages(chatId);
      }
    });

    socketRef.current.on("typing", ({ chatId: typingChatId, sender }) => {
      // console.log(`💬 ${sender} is typing in chat ${typingChatId}`);
      if (typingChatId === chatId && sender !== senderId) {
        setOtherUserTyping(sender);
      }
    });

    socketRef.current.on("stopTyping", ({ chatId: typingChatId, sender }) => {
      // console.log(`🛑 ${sender} stopped typing in chat ${typingChatId}`);
      if (typingChatId === chatId && sender !== senderId) {
        setOtherUserTyping(null);
      }
    });

    return () => {
      socketRef.current?.emit("leaveChat", chatId);
      socketRef.current?.disconnect();
    };
  }, [isOpen, senderId, token, dispatch, chatId]);

  // Reset auto-response flag
  useEffect(() => {
    hasAutoResponse.current = false;
  }, [chatId]);

  // Start chat
  const startChat = async (retries = 3, delay = 1000) => {
    if (!senderId || !token) {
      console.log("DEBUG: No senderId or token in startChat, skipping");
      return;
    }

    const storedChatId = localStorage.getItem(`chatId-${senderId}`);
    if (storedChatId && !chatId) {
      dispatch(setVendorChatId(storedChatId));
      await fetchMessages(storedChatId);
      socketRef.current?.emit("joinChat", storedChatId);
      return;
    }

    if (chatId) {
      await fetchMessages();
      socketRef.current?.emit("joinChat", chatId);
      return;
    }

    for (let i = 0; i < retries; i++) {
      setError(null);
      try {
        // console.log("Starting chat with:", { senderId, token });
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
        // console.log(
        //   "Start chat response:",
        //   JSON.stringify(response.data, null, 2)
        // );
        const newChatId = response.data.chatId || response.data.chat?._id;
        dispatch(setVendorChatId(newChatId));
        localStorage.setItem(`chatId-${senderId}`, newChatId);
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
      }
    }
  };

  // Fetch messages
  const fetchMessages = async (targetChatId: string = chatId!) => {
    if (!targetChatId || !token) return;

    try {
      const response = await axios.get(
        `${API_CHAT_BASE_URL}/customer_care_chatmessages/${targetChatId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const fetchedMessages = (response.data.messages || []).map(
        (msg: any) => ({
          id: msg._id,
          content: msg.content,
          sender:
            msg.sender?._id === senderId
              ? "agent"
              : msg.sender === "bot"
              ? "bot"
              : "user",
          timestamp: new Date(msg.createdAt).toISOString(),
          tempId: msg.tempId,
        })
      );
      dispatch(setVendorMessages(fetchedMessages));
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
    if (isOpen && senderId && token) {
      startChat();
    }
  }, [isOpen, senderId, token]);

  // Send message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatId || !senderId || !token) {
      setError("Cannot send message: Missing input, chatId, or authentication");
      return;
    }

    if (
      !hasAutoResponse.current &&
      !messages.some(
        (m) =>
          m.sender === "agent" ||
          (m.content === AUTO_RESPONSE_MESSAGE && m.sender === "bot")
      )
    ) {
      const autoResponse: Message = {
        id: `auto-${Date.now()}`,
        content: AUTO_RESPONSE_MESSAGE,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      dispatch(addVendorMessage(autoResponse));
      hasAutoResponse.current = true;
    }

    try {
      await axios.post(
        `${API_CHAT_BASE_URL}/send-message`,
        { chatId, content: inputValue, senderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-socket-id": socketRef.current?.id,
          },
        }
      );
      setInputValue("");
    } catch (err: any) {
      console.error("Send message error:", err.response?.data || err.message);
      setError(
        `Failed to send message: ${err.response?.data?.message || err.message}`
      );
    }
  };

  // Handle input change with typing indicators
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    
    if (!isTyping && e.target.value.trim() && chatId) {
      setIsTyping(true);
      socketRef.current?.emit("typing", { chatId, sender: senderId });
    }
  };

  // Handle typing timeout
  useEffect(() => {
    if (isTyping) {
      const timeout = setTimeout(() => {
        setIsTyping(false);
        socketRef.current?.emit("stopTyping", { chatId, sender: senderId });
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [inputValue, isTyping, chatId, senderId]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsTyping(false);
      socketRef.current?.emit("stopTyping", { chatId, sender: senderId });
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <Card
      className={cn(
        "fixed bottom-20 right-6 z-40 w-80 h-96 mb-24",
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

      {/* Notifications Display */}
      {notifications.length > 0 && (
        <div className="p-2 bg-gray-50 border-b">
          <p className="text-sm font-semibold text-gray-700">
            Notifications ({notifications.filter((n) => !n.read).length} unread)
          </p>
          <ul className="mt-1 max-h-20 overflow-y-auto">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={cn(
                  "text-xs p-1",
                  notification.read
                    ? "text-gray-500"
                    : "text-gray-800 font-medium"
                )}
              >
                {notification.message}{" "}
                <span className="text-gray-400">
                  {new Date(notification.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 h-64 p-4 lg:h-80">
        {error && (
          <div className="p-4 text-center">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => startChat()} className="mt-2">
              Retry
            </Button>
          </div>
        )}
        {!error && (!messages || messages.length === 0) && (
          <div className="text-center text-gray-600 p-4">
            <p className="font-semibold">Start a Conversation</p>
            <p className="text-sm mt-1">
              Type your message below to connect with our support team.
            </p>
          </div>
        )}
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "agent" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3 text-sm",
                  message.sender === "agent"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-800",
                  message.isOptimistic ? "opacity-70" : ""
                )}
              >
                <div className="flex items-start space-x-2">
                  {(message.sender === "agent" || message.sender === "bot") && (
                    <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-orange-500" />
                  )}
                  {message.sender === "user" && (
                    <User className="h-4 w-4 mt-0.5 flex-shrink-0 order-2" />
                  )}
                  <div className={message.sender === "agent" ? "order-1" : ""}>
                    <p>{message.content}</p>
                    <p
                      className={cn(
                        "mt-1 text-xs opacity-70",
                        message.sender === "agent"
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
        
        {/* Typing Indicator */}
        {otherUserTyping && (
          <div className="flex justify-start mt-2">
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs">{otherUserTyping} is typing...</span>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="px-3 pt-2 pb-5 border-t">
        <div className="flex items-center space-x-1">
          <input
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 w-full px-3 py-1 text-base transition-colors bg-transparent border rounded-md shadow-sm h-9 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            disabled={!chatId}
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
            disabled={!inputValue.trim() || !chatId}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
