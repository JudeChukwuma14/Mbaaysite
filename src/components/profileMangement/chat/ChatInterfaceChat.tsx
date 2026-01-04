import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import io, { Socket } from "socket.io-client";
import MessageListWithDates from "./MessageListWithDates";
import ChatListSkeleton from "./ChatListSkeleton";
import MessageSkeleton from "./MessageSkeleton";
import { setTotalUnreadMessages } from "@/redux/slices/notificationSlice";

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
  hasMessages?: boolean;
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

const SOCKET_URL = "https://ilosiwaju-mbaay-2025.com";

const ChatInterfaceChat: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [pendingChat, setPendingChat] = useState<Chat | null>(null);
  const [showChatList, setShowChatList] = useState(true);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const socketRef = useRef<Socket | null>(null);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const token = useSelector(
    (state: RootState) => state.user.token || state.vendor.token
  );
  const currentUserId = user?._id || vendor?._id;

  const handleNewMessage = (msg: any) => {
    const isSentByCurrentUser = msg.sender?._id === currentUserId;

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
      setMessages((prev) => [...prev, newMessage]);
    }

    // Removed notification trigger logic since notifications will be handled in Navbar

    setChats((prev) => {
      let lastMessageText = msg.content || "";
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
              hasMessages: true,
            }
          : chat
      );

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
  };

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
      if (selectedChat) {
        socketRef.current?.emit("joinChat", selectedChat);
      }
    });

    socketRef.current.on("newMessage", handleNewMessage);

    socketRef.current.on("messageEdited", (msg: any) => {
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
        setMessages((prev) => prev.filter((m) => m._id !== data._id));

        // Get remaining messages after deletion
        const remainingMessages = messages.filter((m) => m._id !== data._id);

        if (remainingMessages.length === 0 && data.chatId === selectedChat) {
          // Remove chat if no messages left
          setChats((prev) => prev.filter((chat) => chat._id !== data.chatId));
          if (selectedChat === data.chatId) {
            setSelectedChat(null);
            setShowChatList(true);
          }
        } else if (data.chatId === selectedChat) {
          // Update chat with new last message
          const newLastMessage =
            remainingMessages[remainingMessages.length - 1];
          const lastMessageContent = newLastMessage.images?.length
            ? "📷 Image"
            : newLastMessage.video
            ? "🎥 Video"
            : newLastMessage.type === "file"
            ? "📎 File"
            : newLastMessage.content;

          setChats((prev) =>
            prev.map((chat) =>
              chat._id === data.chatId
                ? {
                    ...chat,
                    lastMessage: lastMessageContent,
                    time: newLastMessage.time,
                    timestamp: newLastMessage.timestamp,
                  }
                : chat
            )
          );
        }
      }
    );

    socketRef.current.on("chatStarted", (chat: any) => {
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
        hasMessages: !!chat.lastMessage,
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
        if (chatId === selectedChat && sender !== currentUserId) {
          setTypingUsers((prev) => [...new Set([...prev, sender])]);
        }
      }
    );

    socketRef.current.on(
      "stopTyping",
      ({ sender, chatId }: { sender: string; chatId: string }) => {
        if (chatId === selectedChat) {
          setTypingUsers((prev) => prev.filter((user) => user !== sender));
        }
      }
    );

    socketRef.current.on("connect_error", () => {
      setError("Failed to connect to real-time updates. Please try again.");
      toast.error("Failed to connect to real-time updates");
    });

    socketRef.current.on("reconnect", () => {
      if (selectedChat) {
        socketRef.current?.emit("joinChat", selectedChat);
      }
    });

    socketRef.current.on("disconnect", () => {
      // Handle disconnect if needed
    });

    return () => {
      if (selectedChat) {
        socketRef.current?.emit("leaveChat", selectedChat);
      }
      socketRef.current?.disconnect();
    };
  }, [currentUserId, token, selectedChat, messages]);

  useEffect(() => {
    if (selectedChat && socketRef.current) {
      socketRef.current?.emit("joinChat", selectedChat);
    }
  }, [selectedChat]);

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
        hasMessages: false,
      });
      if (isMobile) {
        setShowChatList(false);
      }
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location, isMobile]);

  useEffect(() => {
    if (!currentUserId) {
      setError("Please log in to use chat.");
      toast.error("Please log in to use chat.");
      setPendingChat(null);
    }
  }, [currentUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedChat && pendingChat && pendingChat._id !== selectedChat) {
      setPendingChat(null);
    }
  }, [selectedChat, pendingChat]);

  useEffect(() => {
    const fetchChats = async () => {
      if (!currentUserId) return;
      setIsLoadingChats(true);
      setError(null);
      try {
        const chatData = await getUserChats();
        const uniqueChats = new Map();

        for (const chat of chatData.chats || []) {
          if (uniqueChats.has(chat._id)) continue;

          const messageData = await getChatMessages(chat._id);
          if (messageData.success && messageData.messages.length > 0) {
            const otherParticipant = chat.participants.find(
              (p: any) => p.participantId !== currentUserId
            );

            let lastMessageContent =
              chat.lastMessage?.content ||
              messageData.messages[messageData.messages.length - 1].content ||
              "";

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

            const formattedChat: Chat = {
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
              hasMessages: true,
            };

            uniqueChats.set(chat._id, formattedChat);
          }
        }

        const formattedChats = Array.from(uniqueChats.values());
        const sortedChats = formattedChats.sort((a, b) => {
          const timeA = a.timestamp
            ? a.timestamp.getTime()
            : new Date(`1970-01-01T${a.time}`).getTime();
          const timeB = b.timestamp
            ? b.timestamp.getTime()
            : new Date(`1970-01-01T${b.time}`).getTime();
          return timeB - timeA;
        });

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
        setError(errorMsg);
        toast.error(errorMsg);
        setChats([]);
      } finally {
        setIsLoadingChats(false);
      }
    };

    if (currentUserId) {
      fetchChats();
    }
  }, [currentUserId, location.state]);

  useEffect(() => {
    if (selectedChat && currentUserId) {
      const fetchMessages = async () => {
        setIsLoadingMessages(true);
        setError(null);
        try {
          const messageData = await getChatMessages(selectedChat);

          if (messageData.messages.length === 0 && !pendingChat?._id) {
            setChats((prev) =>
              prev.filter((chat) => chat._id !== selectedChat)
            );
            setSelectedChat(null);
            setShowChatList(true);
            return;
          }

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

  useEffect(() => {
    if (isMobile && selectedChat) {
      setShowChatList(false);
    } else if (isMobile && !selectedChat) {
      setShowChatList(true);
    }
  }, [selectedChat, isMobile]);

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

  // Add this useEffect in your ChatInterfaceChat component, right after the other useEffects
  useEffect(() => {
    if (selectedChat && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const lastMessageContent = lastMessage.images?.length
        ? "📷 Image"
        : lastMessage.video
        ? "🎥 Video"
        : lastMessage.type === "file"
        ? "📎 File"
        : lastMessage.content;

      // Update the chat with the latest message info
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === selectedChat
            ? {
                ...chat,
                lastMessage: lastMessageContent,
                time: lastMessage.time,
                timestamp: lastMessage.timestamp,
                hasMessages: true,
              }
            : chat
        )
      );
    }
  }, [messages, selectedChat]);

  useEffect(() => {
    const totalUnread = chats.reduce(
      (sum, chat) => sum + (chat.unread || 0),
      0
    );
    dispatch(setTotalUnreadMessages(totalUnread));
  }, [chats, dispatch]);

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
      const isPendingChat = pendingChat && pendingChat._id === selectedChat;

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

        if (isPendingChat && pendingChat) {
          const newChat = {
            ...pendingChat,
            lastMessage: content,
            time: currentTime,
            timestamp: new Date(),
            hasMessages: true,
          };

          setChats((prev) => {
            const updatedChats = [newChat, ...prev];
            return updatedChats.sort((a, b) => {
              const timeA =
                a.timestamp?.getTime() ||
                new Date(`1970-01-01T${a.time}`).getTime();
              const timeB =
                b.timestamp?.getTime() ||
                new Date(`1970-01-01T${b.time}`).getTime();
              return timeB - timeA;
            });
          });

          setPendingChat(null);
        } else {
          setChats((prev) => {
            const updatedChats = prev.map((chat) =>
              chat._id === selectedChat
                ? {
                    ...chat,
                    lastMessage: content,
                    time: currentTime,
                    timestamp: new Date(),
                    hasMessages: true,
                  }
                : chat
            );
            return updatedChats.sort((a, b) => {
              const timeA =
                a.timestamp?.getTime() ||
                new Date(`1970-01-01T${a.time}`).getTime();
              const timeB =
                b.timestamp?.getTime() ||
                new Date(`1970-01-01T${b.time}`).getTime();
              return timeB - timeA;
            });
          });
        }

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

        let mediaDisplayText = "📎 File";
        if (type === "image") mediaDisplayText = "📷 Image";
        else if (type === "video") mediaDisplayText = "🎥 Video";

        if (isPendingChat && pendingChat) {
          const newChat = {
            ...pendingChat,
            lastMessage: mediaDisplayText,
            time: currentTime,
            timestamp: new Date(),
            hasMessages: true,
          };

          setChats((prev) => {
            const updatedChats = [newChat, ...prev];
            return updatedChats.sort((a, b) => {
              const timeA =
                a.timestamp?.getTime() ||
                new Date(`1970-01-01T${a.time}`).getTime();
              const timeB =
                b.timestamp?.getTime() ||
                new Date(`1970-01-01T${b.time}`).getTime();
              return timeB - timeA;
            });
          });

          setPendingChat(null);
        } else {
          setChats((prev) => {
            const updatedChats = prev.map((chat) =>
              chat._id === selectedChat
                ? {
                    ...chat,
                    lastMessage: mediaDisplayText,
                    time: currentTime,
                    timestamp: new Date(),
                    hasMessages: true,
                  }
                : chat
            );
            return updatedChats.sort((a, b) => {
              const timeA =
                a.timestamp?.getTime() ||
                new Date(`1970-01-01T${a.time}`).getTime();
              const timeB =
                b.timestamp?.getTime() ||
                new Date(`1970-01-01T${b.time}`).getTime();
              return timeB - timeA;
            });
          });
        }

        await sendMediaMessage(selectedChat, files);
        onUploadComplete(tempId);
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to send message. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);

      if (tempId) {
        setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      const updatedMessages = messages.filter((msg) => msg._id !== messageId);
      setMessages(updatedMessages);

      if (updatedMessages.length === 0) {
        // If no messages left, remove the chat
        setChats((prev) => prev.filter((chat) => chat._id !== selectedChat));
        setSelectedChat(null);
        setShowChatList(true);
      } else {
        // Update the chat with the new last message and timestamp
        const newLastMessage = updatedMessages[updatedMessages.length - 1];
        const lastMessageContent = newLastMessage.images?.length
          ? "📷 Image"
          : newLastMessage.video
          ? "🎥 Video"
          : newLastMessage.type === "file"
          ? "📎 File"
          : newLastMessage.content;

        setChats((prev) =>
          prev.map((chat) =>
            chat._id === selectedChat
              ? {
                  ...chat,
                  lastMessage: lastMessageContent,
                  time: newLastMessage.time,
                  timestamp: newLastMessage.timestamp,
                }
              : chat
          )
        );
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to delete message. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      await editMessage(messageId, newContent);
      setMessages(
        messages.map((msg) =>
          msg._id === messageId ? { ...msg, content: newContent } : msg
        )
      );
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to edit message. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handlePinChat = (chatId: string) => {
    setChats(
      chats.map((chat) =>
        chat._id === chatId ? { ...chat, pinned: !chat.pinned } : chat
      )
    );
  };

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

      setPendingChat({
        _id: newChat.chat._id,
        name: vendorDetails.storeName || "Unknown Vendor",
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
        hasMessages: false,
      });

      setSelectedChat(newChat.chat._id);

      if (isMobile) {
        setShowChatList(false);
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to start chat. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(chats.filter((chat) => chat._id !== chatId));
    if (selectedChat === chatId) {
      setSelectedChat(null);
      setShowChatList(true);
    }
  };

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
            pendingChats={pendingChat ? [pendingChat._id] : []}
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
                <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-75" />
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {typingUsers.length === 1
                      ? `${typingUsers[0]} is typing`
                      : "Someone is typing"}
                    ...
                  </span>
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
