import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { RootState } from "@/redux/store";
import ChatList from "./ChatList";
import { useIsMobile } from "@/hook/use-mobile";
import ChatHeader from "./ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageInput from "./MessageInput";
import { Send } from "lucide-react";
import {
  startChat,
  getUserChats,
  getChatMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  sendMediaMessage,
} from "@/utils/UserChat";
import { toast } from "react-toastify";
import axios from "axios";
import { cn } from "@/lib/utils";
import io, { Socket } from "socket.io-client";
import MessageListWithDates from "./MessageListWithDates";
import ChatListSkeleton from "./ChatListSkeleton";
import MessageSkeleton from "./MessageSkeleton";

// Notification sound
const notificationSound = new Audio("/sounds/notification.mp3");

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface Chat {
  _id: string;
  name: string;
  lastMessage: string;
  time: string;
  timestamp?: Date;
  unread: number;
  avatar?: string;
  online: boolean;
  pinned: boolean;
  isGroup?: boolean;
}

interface Message {
  _id: string;
  content: string;
  images?: string[];
  video?: string;
  time: string;
  timestamp: Date;
  sent: boolean;
  type: "text" | "image" | "video" | "file";
  replyTo?: string;
  isUploading?: boolean;
  isOptimistic?: boolean;
}

const API_NOTIFICATION_BASE_URL =
  "https://mbayy-be.onrender.com/api/v1/notifications";
const SOCKET_URL = "https://mbayy-be.onrender.com";

// Date utility function
// (removed unused formatMessageDate)

const ChatInterfaceChat: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [pendingChat, setPendingChat] = useState<Chat | null>(null);
  const [showChatList, setShowChatList] = useState(true);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const socketRef = useRef<Socket | null>(null);

  const user = useSelector((state: RootState) => state.user.user);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const token = useSelector(
    (state: RootState) => state.user.token || state.vendor.token
  );
  const currentUserId = user?._id || vendor?._id;

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        console.log(`✅ Notification permission ${permission}`);
      });
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!currentUserId || !token) return;
    try {
      const response = await axios.get(
        `${API_NOTIFICATION_BASE_URL}/allnotifications/${currentUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(response.data.notifications || []);
    } catch (err: any) {
      console.error(
        "❌ Fetch notifications error:",
        err.response?.data || err.message
      );
      setError("Failed to fetch notifications");
      toast.error("Failed to fetch notifications");
    }
  };

  // Fetch notifications on mount/user change
  useEffect(() => {
    if (currentUserId && token) {
      fetchNotifications();
    }
  }, [currentUserId, token]);

  // Trigger notification
  const triggerNotification = (
    messageContent: string,
    senderName: string = "Unknown"
  ) => {
    notificationSound.play().catch((err) => {
      console.error("❌ Failed to play notification sound:", err);
      document.querySelector(".sticky.top-0")?.classList.add("animate-pulse");
      setTimeout(() => {
        document
          .querySelector(".sticky.top-0")
          ?.classList.remove("animate-pulse");
      }, 1000);
    });

    if (Notification.permission === "granted") {
      new Notification(`New Message from ${senderName}`, {
        body: messageContent,
        icon: "/favicon.ico",
      });
    }
  };

  // Handle new message from socket
  const handleNewMessage = (msg: any) => {
    console.log("📩 New real-time message:", JSON.stringify(msg, null, 2));
    const isSentByCurrentUser = msg.sender?._id === currentUserId;
    const senderName =
      msg.sender?.storeName ||
      msg.sender?.name ||
      `User ${msg.sender?._id?.slice(-4) || "Unknown"}`;

    const newMessage: Message = {
      _id: msg._id,
      content: msg.content || msg.images?.[0] || msg.video || "",
      images: msg.images || undefined,
      video: msg.video || undefined,
      time: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: new Date(msg.createdAt),
      sent: isSentByCurrentUser,
      type:
        msg.type ||
        (msg.images?.length ? "image" : msg.video ? "video" : "text"),
      replyTo: msg.replyTo || undefined,
      isUploading: false,
      isOptimistic: false,
    };

    // Check for existing message
    const existingMessage = messages.find(
      (m) =>
        m._id === msg._id ||
        (m.isOptimistic &&
          m.content === newMessage.content &&
          m.type === newMessage.type &&
          m.sent === isSentByCurrentUser) ||
        (isSentByCurrentUser &&
          m.sent === true &&
          m.content === newMessage.content &&
          Math.abs(
            new Date(m.time).getTime() - new Date(msg.createdAt).getTime()
          ) < 2000)
    );

    if (existingMessage) {
      console.log("🔄 Replacing existing message:", existingMessage._id);
      setMessages((prev) =>
        prev.map((m) =>
          m._id === existingMessage._id ||
          (m.isOptimistic &&
            m.content === newMessage.content &&
            m.type === newMessage.type)
            ? newMessage
            : m
        )
      );
    } else {
      console.log("✅ Adding new message:", msg._id);
      setMessages((prev) => [...prev, newMessage]);
    }

    if (!isSentByCurrentUser && msg.chatId === selectedChat) {
      triggerNotification(newMessage.content, senderName);
      fetchNotifications();
    }

    // Update the chat list with the new last message and sort by timestamp
    setChats((prev) => {
      // Determine the display text for the last message
      let lastMessageText = msg.content || "";

      // Check for media types and set appropriate display text
      if (msg.images && msg.images.length > 0) {
        lastMessageText = "📷 Image";
      } else if (msg.video) {
        lastMessageText = "🎥 Video";
      } else if (
        msg.type === "file" ||
        (msg.content && msg.content.includes("[file]"))
      ) {
        lastMessageText = "📎 File";
      }

      const updatedChats = prev.map((chat) =>
        chat._id === msg.chatId
          ? {
              ...chat,
              lastMessage: lastMessageText,
              time: newMessage.time,
              timestamp: new Date(msg.createdAt),
              unread: isSentByCurrentUser ? chat.unread : chat.unread + 1,
            }
          : chat
      );

      // Sort chats by timestamp (newest first), fallback to time string if no timestamp
      return updatedChats.sort((a, b) => {
        const timeA = a.timestamp
          ? a.timestamp.getTime()
          : new Date(`1970-01-01T${a.time}`).getTime();
        const timeB = b.timestamp
          ? b.timestamp.getTime()
          : new Date(`1970-01-01T${b.time}`).getTime();
        return timeB - timeA; // Newest first
      });
    });
  };

  // Socket.IO setup
  useEffect(() => {
    if (!currentUserId || !token) {
      return;
    }

    socketRef.current = io(SOCKET_URL, {
      auth: { token: `Bearer ${token}` },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log("🔌 Socket.IO connected, socketId:", socketRef.current?.id);
      setIsSocketConnected(true);
      if (selectedChat) {
        socketRef.current?.emit("joinChat", selectedChat);
        console.log("✅ Emitted joinChat for:", selectedChat);
      }
    });

    socketRef.current.on("newMessage", handleNewMessage);

    socketRef.current.on("messageEdited", (msg: any) => {
      console.log("✏️ Message edited:", JSON.stringify(msg, null, 2));
      setMessages((prev) =>
        prev.map((m) =>
          m._id === msg._id
            ? { ...m, content: msg.content, type: msg.type || m.type }
            : m
        )
      );
    });

    socketRef.current.on(
      "messageDeleted",
      (data: { chatId: string; _id: string }) => {
        console.log("🗑️ Message deleted:", JSON.stringify(data, null, 2));
        setMessages((prev) => prev.filter((m) => m._id !== data._id));
      }
    );

    socketRef.current.on("chatStarted", (chat: any) => {
      console.log("🆕 New chat started:", JSON.stringify(chat, null, 2));
      const otherParticipant = chat.participants?.find(
        (p: any) => p.participantId !== currentUserId
      );
      const formattedChat: Chat = {
        _id: chat._id,
        name:
          otherParticipant?.details?.storeName ||
          otherParticipant?.details?.name ||
          `User ${otherParticipant?.participantId?.slice(-4) || "Unknown"}`,
        lastMessage: chat.lastMessage?.content || "",
        time: new Date(chat.createdAt || Date.now()).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: new Date(chat.createdAt || Date.now()),
        unread: chat.unreadCount || 0,
        avatar:
          otherParticipant?.details?.avatar ||
          otherParticipant?.details?.businessLogo ||
          "",
        online: otherParticipant?.details?.online || false,
        pinned: chat.pinned || false,
        isGroup: chat.isCustomerCareChat || false,
      };
      setChats((prev) => {
        if (prev.some((c) => c._id === chat._id)) {
          return prev;
        }
        return [formattedChat, ...prev];
      });
    });

    socketRef.current.on(
      "typing",
      ({ sender, chatId }: { sender: string; chatId: string }) => {
        console.log(`💬 ${sender} is typing in chat ${chatId}`);
        if (chatId === selectedChat && sender !== currentUserId) {
          setTypingUsers((prev) => [...new Set([...prev, sender])]);
        }
      }
    );

    socketRef.current.on(
      "stopTyping",
      ({ sender, chatId }: { sender: string; chatId: string }) => {
        console.log(`🛑 ${sender} stopped typing in chat ${chatId}`);
        if (chatId === selectedChat) {
          setTypingUsers((prev) => prev.filter((user) => user !== sender));
        }
      }
    );

    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Socket.IO connection error:", err.message);
      setIsSocketConnected(false);
      setError("Failed to connect to real-time updates. Please try again.");
      toast.error("Failed to connect to real-time updates");
    });

    socketRef.current.on("reconnect", () => {
      console.log("🔄 Socket.IO reconnected");
      setIsSocketConnected(true);
      if (selectedChat) {
        socketRef.current?.emit("joinChat", selectedChat);
      }
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Socket.IO disconnected");
      setIsSocketConnected(false);
    });

    return () => {
      if (selectedChat) {
        socketRef.current?.emit("leaveChat", selectedChat);
      }
      socketRef.current?.disconnect();
      console.log("🧹 Socket.IO disconnected and cleaned up");
    };
  }, [currentUserId, token, selectedChat, messages]);

  // Join chat room on selection
  useEffect(() => {
    if (selectedChat && socketRef.current) {
      socketRef.current?.emit("joinChat", selectedChat);
      console.log("✅ Emitted joinChat for:", selectedChat);
    }
  }, [selectedChat]);

  // Location state handling
  useEffect(() => {
    const { chatId, vendorDetails } = location.state || {};
    if (chatId && vendorDetails) {
      setSelectedChat(chatId);
      setPendingChat({
        _id: chatId,
        name: vendorDetails.storeName || "Unknown",
        lastMessage: "",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: new Date(),
        unread: 0,
        avatar: vendorDetails.avatar || "",
        online: false,
        pinned: false,
        isGroup: false,
      });
      if (isMobile) {
        setShowChatList(false);
      }
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location, isMobile]);

  // Auth check
  useEffect(() => {
    if (!currentUserId) {
      setError("Please log in to use chat.");
      toast.error("Please log in to use chat.");
      setPendingChat(null);
    }
  }, [currentUserId]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chats
  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!currentUserId) {
        console.log("DEBUG: No currentUserId, skipping fetchChats");
        return;
      }
      setIsLoadingChats(true);
      setError(null);
      try {
        console.log("DEBUG: Fetching chats for user:", currentUserId);
        const chatData = await getUserChats();
        console.log("DEBUG: Raw chat data from API:", chatData);

        const formattedChats: Chat[] = [];
        for (const chat of chatData.chats || []) {
          try {
            console.log("DEBUG: Processing chat:", chat._id);
            const messageData = await getChatMessages(chat._id);
            console.log("DEBUG: Messages for chat", chat._id, ":", messageData);

            if (messageData.success && messageData.messages.length > 0) {
              const otherParticipant = chat.participants.find(
                (p: any) => p.participantId !== currentUserId
              );
              console.log("DEBUG: Other participant:", otherParticipant);

              // Get the last message content with proper media formatting
              let lastMessageContent =
                chat.lastMessage?.content ||
                messageData.messages[messageData.messages.length - 1].content ||
                "";

              // Check if the last message is a media message and format accordingly
              const lastMessage =
                messageData.messages[messageData.messages.length - 1];
              if (lastMessage.images && lastMessage.images.length > 0) {
                lastMessageContent = "📷 Image";
              } else if (lastMessage.video) {
                lastMessageContent = "🎥 Video";
              } else if (
                lastMessage.type === "file" ||
                (lastMessage.content && lastMessage.content.includes("[file]"))
              ) {
                lastMessageContent = "📎 File";
              }

              formattedChats.push({
                _id: chat._id,
                name:
                  otherParticipant?.details?.storeName ||
                  otherParticipant?.details?.name ||
                  `User ${
                    otherParticipant?.participantId?.slice(-4) || "Unknown"
                  }`,
                lastMessage: lastMessageContent,
                time: new Date(
                  chat.lastMessage?.createdAt || chat.createdAt || Date.now()
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                timestamp: new Date(
                  chat.lastMessage?.createdAt || chat.createdAt || Date.now()
                ),
                unread: chat.unreadCount || 0,
                avatar:
                  otherParticipant?.details?.avatar ||
                  otherParticipant?.details?.businessLogo ||
                  "",
                online: otherParticipant?.details?.online || false,
                pinned: chat.pinned || false,
                isGroup: chat.isCustomerCareChat || false,
              });
            } else {
              console.log(
                "DEBUG: Skipping chat",
                chat._id,
                "- no messages or not successful"
              );
            }
          } catch (msgError: any) {
            console.warn(
              "DEBUG: Error fetching messages for chat",
              chat._id,
              ":",
              JSON.stringify(msgError, null, 2)
            );
          }
        }

        console.log("DEBUG: Formatted chats:", formattedChats);

        // Sort chats by timestamp (newest first), fallback to time string if no timestamp
        const sortedChats = formattedChats.sort((a, b) => {
          const timeA = a.timestamp
            ? a.timestamp.getTime()
            : new Date(`1970-01-01T${a.time}`).getTime();
          const timeB = b.timestamp
            ? b.timestamp.getTime()
            : new Date(`1970-01-01T${b.time}`).getTime();
          return timeB - timeA; // Newest first
        });

        console.log("DEBUG: Sorted chats:", sortedChats);
        setChats(sortedChats);

        if (
          !selectedChat &&
          sortedChats.length > 0 &&
          !location.state?.chatId
        ) {
          setSelectedChat(sortedChats[0]._id);
        }
      } catch (error: any) {
        const errorMsg =
          error.response?.data?.message ||
          "Failed to load chats. Please try again.";
        console.error(
          "DEBUG: Error fetching chats:",
          JSON.stringify(error, null, 2)
        );
        setError(errorMsg);
        toast.error(errorMsg);
        setChats([]);
      } finally {
        setIsLoadingChats(false);
      }
    };

    if (currentUserId) {
      console.log("DEBUG: Starting fetchChats for user:", currentUserId);
      fetchChats();
    } else {
      console.log("DEBUG: No currentUserId available");
    }
  }, [currentUserId, location.state]);
  // Fetch initial messages
  useEffect(() => {
    if (selectedChat && currentUserId) {
      const fetchMessages = async () => {
        setIsLoadingMessages(true);
        setError(null);
        try {
          const messageData = await getChatMessages(selectedChat);
          const formattedMessages: Message[] = (messageData.messages || []).map(
            (msg: any) => ({
              _id: msg._id,
              content: msg.content || msg.images?.[0] || msg.video || "",
              images: msg.images || undefined,
              video: msg.video || undefined,
              time: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              timestamp: new Date(msg.createdAt),
              sent: msg.sender?._id === currentUserId,
              type:
                msg.type ||
                (msg.images?.length ? "image" : msg.video ? "video" : "text"),
              replyTo: msg.replyTo || undefined,
              isUploading: false,
              isOptimistic: false,
            })
          );
          setMessages(formattedMessages);
        } catch (error: any) {
          const errorMsg =
            error.response?.data?.message ||
            "Failed to load messages. Please try again.";
          console.error(
            "DEBUG: Error fetching messages:",
            JSON.stringify(error, null, 2)
          );
          setError(errorMsg);
          toast.error(errorMsg);
          setMessages([]);
        } finally {
          setIsLoadingMessages(false);
        }
      };
      fetchMessages();
    } else if (!currentUserId) {
      setMessages([]);
    }
  }, [selectedChat, currentUserId]);

  // Mobile view handling
  useEffect(() => {
    if (isMobile && selectedChat) {
      setShowChatList(false);
    } else if (isMobile && !selectedChat) {
      setShowChatList(true);
    }
  }, [selectedChat, isMobile]);

  // Invalid chat handling
  useEffect(() => {
    if (
      selectedChat &&
      !chats.find((chat) => chat._id === selectedChat) &&
      !pendingChat?._id
    ) {
      setSelectedChat(null);
      setShowChatList(true);
    }
  }, [selectedChat, chats, pendingChat]);

  // Send message with optimistic update
  const handleSendMessage = async (
    content: string,
    type: "text" | "image" | "video" | "file" = "text",
    files?: File[],
    onUploadStart?: () => { tempId: string; previews: string[] },
    onUploadComplete?: (tempId: string) => void
  ) => {
    let tempId: string | undefined;
    if (!selectedChat) {
      toast.error("No chat selected.");
      return;
    }
    if (!currentUserId) {
      toast.error("Please log in to send messages.");
      return;
    }
    try {
      let formattedMessage: Message;
      if (type === "text" && content.trim()) {
        tempId = `temp-${Date.now()}-${Math.random()}`;
        const currentTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        formattedMessage = {
          _id: tempId,
          content,
          images: undefined,
          video: undefined,
          time: currentTime,
          timestamp: new Date(),
          sent: true,
          type: "text",
          isUploading: false,
          isOptimistic: true,
        };
        setMessages((prev) => [...prev, formattedMessage]);

        // Immediately update the chat list with new timestamp and sort
        setChats((prev) => {
          const updatedChats = prev.map((chat) =>
            chat._id === selectedChat
              ? {
                  ...chat,
                  lastMessage: content,
                  time: currentTime,
                  timestamp: new Date(),
                }
              : chat
          );

          // Sort by timestamp (newest first), fallback to time string if no timestamp
          return updatedChats.sort((a, b) => {
            const timeA = a.timestamp
              ? a.timestamp.getTime()
              : new Date(`1970-01-01T${a.time}`).getTime();
            const timeB = b.timestamp
              ? b.timestamp.getTime()
              : new Date(`1970-01-01T${b.time}`).getTime();
            return timeB - timeA; // Newest first
          });
        });

        // Send the message - the socket will handle the response
        await sendMessage(selectedChat, content);
      } else if (
        files &&
        files.length > 0 &&
        onUploadStart &&
        onUploadComplete
      ) {
        const { tempId: tempMessageId, previews } = onUploadStart();
        tempId = tempMessageId;
        const currentTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        formattedMessage = {
          _id: tempId,
          content: previews[0] || files[0].name,
          images: type === "image" ? previews : undefined,
          video: type === "video" ? previews[0] : undefined,
          time: currentTime,
          timestamp: new Date(),
          sent: true,
          type,
          isUploading: true,
          isOptimistic: true,
        };
        setMessages((prev) => [...prev, formattedMessage]);

        // Determine the display text for media messages
        let mediaDisplayText = "📎 File";
        if (type === "image") {
          mediaDisplayText = "📷 Image";
        } else if (type === "video") {
          mediaDisplayText = "🎥 Video";
        }

        // Immediately update the chat list for media messages
        setChats((prev) => {
          const updatedChats = prev.map((chat) =>
            chat._id === selectedChat
              ? {
                  ...chat,
                  lastMessage: mediaDisplayText,
                  time: currentTime,
                  timestamp: new Date(),
                }
              : chat
          );

          // Sort by timestamp (newest first)
          return updatedChats.sort((a, b) => {
            const timeA = a.timestamp
              ? a.timestamp.getTime()
              : new Date(`1970-01-01T${a.time}`).getTime();
            const timeB = b.timestamp
              ? b.timestamp.getTime()
              : new Date(`1970-01-01T${b.time}`).getTime();
            return timeB - timeA;
          });
        });

        // Send the media - the socket will handle the response
        await sendMediaMessage(selectedChat, files);

        onUploadComplete(tempId);
      } else {
        return;
      }

      if (pendingChat && pendingChat._id === selectedChat) {
        setChats((prev) => {
          const updatedChats = [pendingChat, ...prev];
          // Sort the updated chats
          return updatedChats.sort((a, b) => {
            const timeA = a.timestamp
              ? a.timestamp.getTime()
              : new Date(`1970-01-01T${a.time}`).getTime();
            const timeB = b.timestamp
              ? b.timestamp.getTime()
              : new Date(`1970-01-01T${b.time}`).getTime();
            return timeB - timeA;
          });
        });
        setPendingChat(null);
        socketRef.current?.emit("chatStarted", {
          ...pendingChat,
          chatId: selectedChat,
        });
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to send message. Please try again.";
      console.error(
        "DEBUG: Error sending message:",
        JSON.stringify(error, null, 2)
      );
      setError(errorMsg);
      toast.error(errorMsg);
      if (tempId) {
        setMessages((prev) => prev.filter((msg) => msg._id !== tempId));

        // Also revert the chat list update if message sending failed
        setChats((prev) => {
          const updatedChats = prev.map((chat) =>
            chat._id === selectedChat
              ? {
                  ...chat,
                  lastMessage: chat.lastMessage, // Keep original message
                  time: chat.time, // Keep original time
                  timestamp: chat.timestamp, // Keep original timestamp
                }
              : chat
          );
          return updatedChats;
        });
      }
    }
  };

  // Delete message
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      setMessages(messages.filter((msg) => msg._id !== messageId));
      socketRef.current?.emit("messageDeleted", {
        _id: messageId,
        chatId: selectedChat,
      });
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to delete message. Please try again.";
      console.error(
        "DEBUG: Error deleting message:",
        JSON.stringify(error, null, 2)
      );
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Edit message
  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      await editMessage(messageId, newContent);
      setMessages(
        messages.map((msg) =>
          msg._id === messageId ? { ...msg, content: newContent } : msg
        )
      );
      socketRef.current?.emit("messageEdited", {
        _id: messageId,
        content: newContent,
        chatId: selectedChat,
      });
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to edit message. Please try again.";
      console.error(
        "DEBUG: Error editing message:",
        JSON.stringify(error, null, 2)
      );
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Pin chat
  const handlePinChat = (chatId: string) => {
    setChats(
      chats.map((chat) =>
        chat._id === chatId ? { ...chat, pinned: !chat.pinned } : chat
      )
    );
  };

  // New chat
  const handleNewChat = async (
    receiverId: string,
    vendorDetails: { storeName: string; avatar?: string }
  ) => {
    if (!currentUserId) {
      toast.error("Please log in to start a chat.");
      return;
    }
    if (receiverId === currentUserId) {
      toast.error("Cannot start a chat with yourself.");
      return;
    }
    try {
      const newChat = await startChat(receiverId);

      if (!newChat?.success || !newChat?.chat?._id) {
        throw new Error("Invalid chat data received from server");
      }

      const otherParticipant = newChat.chat.participants.find(
        (p: any) => p.participantId !== currentUserId
      );
      if (!otherParticipant) {
        throw new Error("No other participant found in chat data");
      }

      const formattedChat: Chat = {
        _id: newChat.chat._id,
        name:
          vendorDetails.storeName ||
          `User ${otherParticipant.participantId?.slice(-4) || "Unknown"}`,
        lastMessage: newChat.chat.lastMessage?.content || "",
        time: new Date(
          newChat.chat.lastMessage?.createdAt ||
            newChat.chat.createdAt ||
            Date.now()
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: new Date(
          newChat.chat.lastMessage?.createdAt ||
            newChat.chat.createdAt ||
            Date.now()
        ),
        unread: newChat.chat.unreadCount || 0,
        avatar: vendorDetails.avatar || "",
        online: false,
        pinned: newChat.chat.pinned || false,
        isGroup: newChat.chat.isCustomerCareChat || false,
      };

      setPendingChat(formattedChat);
      setSelectedChat(formattedChat._id);

      // Add the new chat to the chats list and sort
      setChats((prev) => {
        const updatedChats = [formattedChat, ...prev];
        return updatedChats.sort((a, b) => {
          const timeA = a.timestamp
            ? a.timestamp.getTime()
            : new Date(`1970-01-01T${a.time}`).getTime();
          const timeB = b.timestamp
            ? b.timestamp.getTime()
            : new Date(`1970-01-01T${b.time}`).getTime();
          return timeB - timeA;
        });
      });

      if (isMobile) {
        setShowChatList(false);
      }
      socketRef.current?.emit("chatStarted", formattedChat);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to start chat. Please try again.";
      console.error(
        "DEBUG: Error starting chat:",
        JSON.stringify(error, null, 2)
      );
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Delete chat
  const handleDeleteChat = (chatId: string) => {
    setChats(chats.filter((chat) => chat._id !== chatId));
    if (selectedChat === chatId) {
      setSelectedChat(null);
      setShowChatList(true);
    }
  };

  // Back to list
  const handleBackToList = () => {
    setSelectedChat(null);
    setPendingChat(null);
    setShowChatList(true);
  };

  const selectedChatData =
    chats.find((chat) => chat._id === selectedChat) || pendingChat;
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div
      onSubmit={handleFormSubmit}
      className="flex h-[calc(100vh-7rem)] bg-gray-50 rounded border "
    >
      {/* Notifications Display */}
      {notifications.length > 0 && (
        <div className="w-full p-2 bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-700">
              Notifications ({notifications.filter((n) => !n.read).length}{" "}
              unread)
            </p>
            <span
              className={cn(
                "text-xs",
                isSocketConnected ? "text-green-500" : "text-red-500"
              )}
            >
              {isSocketConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
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

      <div
        className={`${
          isMobile
            ? showChatList
              ? "w-full"
              : "hidden"
            : "w-80 border-r border-chat-border"
        } bg-card`}
      >
        {isLoadingChats ? (
          <ChatListSkeleton />
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : (
          <ChatList
            chats={chats || []}
            selectedChat={selectedChat}
            onSelectChat={(chatId) => {
              setSelectedChat(chatId);
              if (isMobile) setShowChatList(false);
            }}
            onPinChat={handlePinChat}
            onDeleteChat={handleDeleteChat}
            onNewChat={handleNewChat}
          />
        )}
      </div>
      <div
        className={`${
          isMobile ? (showChatList ? "hidden" : "w-full") : "flex-1"
        } flex flex-col relative`}
      >
        {selectedChat && selectedChatData ? (
          <>
            <div className="sticky top-0 z-10">
              <ChatHeader
                chat={selectedChatData}
                onBack={isMobile ? handleBackToList : undefined}
              />
              {typingUsers.length > 0 && (
                <div className="text-xs text-gray-500 p-2">
                  {typingUsers.join(", ")}{" "}
                  {typingUsers.length > 1 ? "are" : "is"} typing...
                </div>
              )}
            </div>
            <ScrollArea className="flex-1 pt-16 pb-20 overflow-y-auto">
              <div className="p-4">
                {isLoadingMessages ? (
                  <MessageSkeleton />
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    No messages yet
                  </div>
                ) : (
                  <MessageListWithDates
                    messages={messages}
                    onDeleteMessage={handleDeleteMessage}
                    onEditMessage={handleEditMessage}
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="sticky bottom-0 z-10">
              <MessageInput
                onSendMessage={handleSendMessage}
                selectedChat={selectedChat}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 bg-chat-muted">
            <div className="text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-orange-500 rounded-full">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Welcome to Chat
              </h3>
              <p className="text-muted-foreground">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterfaceChat;
