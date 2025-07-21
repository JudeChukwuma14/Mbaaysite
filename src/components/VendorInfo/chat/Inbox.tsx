"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paperclip,
  Smile,
  SendIcon,
  Edit,
  Trash,
  Reply,
  Pin,
  X,
  Video,
  Play,
  Pause,
  Copy,
  Save,
  VolumeX,
  Volume2,
  Maximize,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react"; // Import the new sidebar component
import { ChatListSidebar } from "./chat-list-sidebar";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isVendor: boolean;
  files?: {
    type: "image" | "document" | "video";
    url: string;
    name: string;
    size: number;
    duration?: string;
  }[];
  replyTo?: string;
  isPinned?: boolean;
  isEdited?: boolean;
  deletedFor: "none" | "me" | "everyone";
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string; // This timestamp will be used for sorting chats
  isVendor: boolean;
  isOnline: boolean;
  messages: Message[];
  pinnedMessages: {
    messageId: string;
    unpinTimestamp: number; // Unix timestamp in milliseconds
  }[];
}

interface UserOrVendor {
  id: string;
  name: string;
  avatar: string;
  isVendor: boolean;
}

interface DeleteDialogState {
  isOpen: boolean;
  messageId: string | null;
}

interface VideoPlayerState {
  isOpen: boolean;
  videoUrl: string | null;
}

interface MediaGalleryState {
  isOpen: boolean;
  files: Message["files"] | null;
  startIndex: number;
}

interface PinDurationDialogState {
  isOpen: boolean;
  messageId: string | null;
}

const LOCAL_STORAGE_KEY = "chatInterfaceData";

interface StoredData {
  chats: Chat[];
  activeChat: string;
}

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string>("");
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    messageId: null,
  });
  const [videoPlayer, setVideoPlayer] = useState<VideoPlayerState>({
    isOpen: false,
    videoUrl: null,
  });
  const [mediaGallery, setMediaGallery] = useState<MediaGalleryState>({
    isOpen: false,
    files: null,
    startIndex: 0,
  });
  const [pinDurationDialog, setPinDurationDialog] =
    useState<PinDurationDialogState>({
      isOpen: false,
      messageId: null,
    });
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const fallbackStorage = useRef(new Map<string, string>());

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    saveToLocalStorage();
  }, [chats, activeChat]);

  const isLocalStorageAvailable = () => {
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      return true;
    } catch (e) {
      return false;
    }
  };

  const loadFromLocalStorage = () => {
    let storedData: StoredData | null = null;
    if (isLocalStorageAvailable()) {
      try {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (data) {
          storedData = JSON.parse(data);
        }
      } catch (error) {
        console.error("Failed to load from localStorage:", error);
      }
    }

    if (!storedData || !storedData.chats || storedData.chats.length === 0) {
      storedData = loadFallback();
      if (!storedData || !storedData.chats || storedData.chats.length === 0) {
        initializeDefaultData();
        return;
      }
    }

    setChats(storedData.chats);
    setActiveChat(storedData.activeChat);
  };

  const saveToLocalStorage = () => {
    const dataToStore: StoredData = {
      chats,
      activeChat,
    };
    if (isLocalStorageAvailable()) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
        if (
          error instanceof DOMException &&
          (error.name === "QuotaExceededError" ||
            error.name === "NS_ERROR_DOM_QUOTA_REACHED")
        ) {
          showFeedback(
            "Local storage is full. Your changes may not persist across sessions."
          );
        } else {
          showFeedback(
            "Unable to save data locally. Your changes may not persist."
          );
        }
        saveFallback(dataToStore);
      }
    } else {
      console.warn("localStorage is not available. Using fallback storage.");
      saveFallback(dataToStore);
      showFeedback(
        "Unable to use local storage. Your changes may not persist across sessions."
      );
    }
  };

  const saveFallback = (data: StoredData) => {
    try {
      fallbackStorage.current.set(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save to fallback storage:", error);
      showFeedback("Unable to save data. Your changes may not persist.");
    }
  };

  const loadFallback = (): StoredData | null => {
    const data = fallbackStorage.current.get(LOCAL_STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Failed to parse fallback data:", error);
        return null;
      }
    }
    return null;
  };

  const initializeDefaultData = () => {
    const defaultChats: Chat[] = [
      {
        id: "1",
        name: "Ricky Smith",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-11%20170005-w7p56CC6KmLQ43N0vioZq5pqM0k03k.png",
        lastMessage: "Hi!, How are You? 👋",
        timestamp: new Date().toISOString(), // Use ISO string for consistent sorting
        isVendor: true,
        isOnline: true,
        messages: [
          {
            id: "1",
            content: "Hi!, How are You? 👋",
            sender: "Ricky Smith",
            timestamp: "11:00AM",
            isVendor: true,
            deletedFor: "none",
          },
          {
            id: "2",
            content: "I'm doing great, thanks! How about you?",
            sender: "You",
            timestamp: "11:01AM",
            isVendor: false,
            deletedFor: "none",
          },
          {
            id: "3",
            content: "I'm good too! Just working on some new products.",
            sender: "Ricky Smith",
            timestamp: "11:05AM",
            isVendor: true,
            deletedFor: "none",
          },
        ],
        pinnedMessages: [],
      },
      {
        id: "2",
        name: "Jane Doe",
        avatar: "/placeholder.svg?height=48&width=48",
        lastMessage: "Got it, thanks!",
        timestamp: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
        isVendor: false,
        isOnline: false,
        messages: [
          {
            id: "4",
            content: "Hello, I have a question about my order.",
            sender: "Jane Doe",
            timestamp: "10:00AM",
            isVendor: true,
            deletedFor: "none",
          },
          {
            id: "5",
            content: "Sure, how can I help you?",
            sender: "You",
            timestamp: "10:05AM",
            isVendor: false,
            deletedFor: "none",
          },
        ],
        pinnedMessages: [],
      },
      {
        id: "3",
        name: "John Smith",
        avatar: "/placeholder.svg?height=48&width=48",
        lastMessage: "See you later!",
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
        isVendor: false,
        isOnline: true,
        messages: [
          {
            id: "6",
            content: "Hey, how's it going?",
            sender: "John Smith",
            timestamp: "09:00AM",
            isVendor: true,
            deletedFor: "none",
          },
          {
            id: "7",
            content: "All good here! Just finished a project.",
            sender: "You",
            timestamp: "09:05AM",
            isVendor: false,
            deletedFor: "none",
          },
        ],
        pinnedMessages: [],
      },
      {
        id: "4",
        name: "Alice Wonderland",
        avatar: "/placeholder.svg?height=48&width=48",
        lastMessage: "Thanks for the update!",
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
        isVendor: true,
        isOnline: false,
        messages: [
          {
            id: "8",
            content: "Your order has been shipped.",
            sender: "Alice Wonderland",
            timestamp: "08:00AM",
            isVendor: true,
            deletedFor: "none",
          },
        ],
        pinnedMessages: [],
      },
      {
        id: "5",
        name: "Bob The Builder",
        avatar: "/placeholder.svg?height=48&width=48",
        lastMessage: "Can we fix it? Yes we can!",
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4 hours ago
        isVendor: false,
        isOnline: true,
        messages: [
          {
            id: "9",
            content: "Need help with construction.",
            sender: "Bob The Builder",
            timestamp: "07:00AM",
            isVendor: true,
            deletedFor: "none",
          },
        ],
        pinnedMessages: [],
      },
      {
        id: "6",
        name: "Charlie Chaplin",
        avatar: "/placeholder.svg?height=48&width=48",
        lastMessage: "Silent but deadly.",
        timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), // 5 hours ago
        isVendor: false,
        isOnline: false,
        messages: [
          {
            id: "10",
            content: "Just checking in.",
            sender: "Charlie Chaplin",
            timestamp: "06:00AM",
            isVendor: true,
            deletedFor: "none",
          },
        ],
        pinnedMessages: [],
      },
      {
        id: "7",
        name: "David Lee",
        avatar: "/placeholder.svg?height=48&width=48",
        lastMessage: "Checking in on the project.",
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        isVendor: true,
        isOnline: true,
        messages: [
          {
            id: "11",
            content: "Project update?",
            sender: "David Lee",
            timestamp: "05:00AM",
            isVendor: true,
            deletedFor: "none",
          },
        ],
        pinnedMessages: [],
      },
      {
        id: "8",
        name: "Eve Adams",
        avatar: "/placeholder.svg?height=48&width=48",
        lastMessage: "Thanks for the quick response!",
        timestamp: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
        isVendor: false,
        isOnline: false,
        messages: [
          {
            id: "12",
            content: "Got it!",
            sender: "Eve Adams",
            timestamp: "04:00AM",
            isVendor: true,
            deletedFor: "none",
          },
        ],
        pinnedMessages: [],
      },
      {
        id: "9",
        name: "Frank White",
        avatar: "/placeholder.svg?height=48&width=48",
        lastMessage: "Meeting scheduled for tomorrow.",
        timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        isVendor: true,
        isOnline: true,
        messages: [
          {
            id: "13",
            content: "Confirming meeting.",
            sender: "Frank White",
            timestamp: "03:00AM",
            isVendor: true,
            deletedFor: "none",
          },
        ],
        pinnedMessages: [],
      },
      {
        id: "10",
        name: "Grace Green",
        avatar: "/placeholder.svg?height=48&width=48",
        lastMessage: "Looking forward to it!",
        timestamp: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
        isVendor: false,
        isOnline: false,
        messages: [
          {
            id: "14",
            content: "See you then!",
            sender: "Grace Green",
            timestamp: "02:00AM",
            isVendor: true,
            deletedFor: "none",
          },
        ],
        pinnedMessages: [],
      },
    ];
    setChats(defaultChats);
    setActiveChat(""); // Do not set an active chat initially to show the GIF
  };

  const activeChatDetails = chats.find((chat) => chat.id === activeChat);
  const activeMessages = activeChatDetails?.messages || [];

  useEffect(() => {
    scrollToBottom();
  }, [chats, activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFilesUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video" | "document"
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles: Message["files"] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          if (type === "video" && file.type.startsWith("video/")) {
            const video = document.createElement("video");
            video.src = URL.createObjectURL(file);
            video.onloadedmetadata = () => {
              const duration = Math.round(video.duration);
              const minutes = Math.floor(duration / 60);
              const seconds = duration % 60;
              const durationString = `${minutes}:${seconds
                .toString()
                .padStart(2, "0")}`;
              newFiles.push({
                type: "video",
                url: reader.result as string,
                name: file.name,
                size: file.size,
                duration: durationString,
              });
              URL.revokeObjectURL(video.src);
              resolve();
            };
          } else if (file.type.startsWith("image/")) {
            newFiles.push({
              type: "image",
              url: reader.result as string,
              name: file.name,
              size: file.size,
            });
            resolve();
          } else {
            newFiles.push({
              type: "document",
              url: reader.result as string,
              name: file.name,
              size: file.size,
            });
            resolve();
          }
        };
        reader.readAsDataURL(file);
      });
    }

    if (newFiles.length > 0) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content:
          newFiles.length === 1
            ? newFiles[0].name
            : `${newFiles.length} files uploaded`,
        sender: "You",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isVendor: false,
        files: newFiles,
        replyTo: replyingTo || undefined,
        deletedFor: "none",
      };
      addMessageToChat(newMessage);
      setReplyingTo(null);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: "You",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isVendor: false,
        replyTo: replyingTo || undefined,
        deletedFor: "none",
      };
      addMessageToChat(newMessage);
      setMessage("");
      setReplyingTo(null);
      setShowEmojiPicker(false);
    }
  };

  const addMessageToChat = (newMessage: Message) => {
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: `You: ${newMessage.content.slice(0, 20)}${
                newMessage.content.length > 20 ? "..." : ""
              }`,
              timestamp: new Date().toISOString(), // Update chat timestamp for sorting
            }
          : chat
      );
      // Sort chats to bring the most recently updated chat to the top
      return updatedChats.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    });
  };

  const handleReply = (messageId: string) => {
    setReplyingTo(messageId);
    showFeedback("Replying to message");
  };

  const handleDeleteClick = (messageId: string) => {
    setDeleteDialog({
      isOpen: true,
      messageId,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.messageId) {
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat.id === activeChat) {
            const updatedMessages = chat.messages.map((msg) =>
              msg.id === deleteDialog.messageId
                ? { ...msg, deletedFor: "everyone" }
                : msg
            );
            const nonDeletedMessages = updatedMessages.filter(
              (msg) => msg.deletedFor === "none"
            );
            const newLastMessage =
              nonDeletedMessages.length > 0
                ? `You: ${nonDeletedMessages[
                    nonDeletedMessages.length - 1
                  ].content.slice(0, 20)}${
                    nonDeletedMessages[nonDeletedMessages.length - 1].content
                      .length > 20
                      ? "..."
                      : ""
                  }`
                : "No messages yet.";

            return {
              ...chat,
              messages: updatedMessages,
              pinnedMessages: chat.pinnedMessages.filter(
                (p) => p.messageId !== deleteDialog.messageId
              ), // Also unpin if deleted
              lastMessage: newLastMessage,
              timestamp: new Date().toISOString(), // Update chat timestamp for sorting
            };
          }
          return chat;
        });
        // Sort chats to bring the most recently updated chat to the top
        return updatedChats.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });
      showFeedback("Message deleted.");
    }
    setDeleteDialog({ isOpen: false, messageId: null });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, messageId: null });
  };

  const handleEdit = (messageId: string) => {
    setEditingMessageId(messageId);
    const messageToEdit = activeMessages.find((msg) => msg.id === messageId);
    if (messageToEdit) {
      setMessage(messageToEdit.content);
    }
    showFeedback("Editing message");
  };

  const handleSaveEdit = () => {
    if (editingMessageId) {
      setChats(
        (prevChats) =>
          prevChats
            .map((chat) => {
              if (chat.id === activeChat) {
                const updatedMessages = chat.messages.map((msg) =>
                  msg.id === editingMessageId
                    ? {
                        ...msg,
                        content: message,
                        isEdited: true,
                        timestamp: new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                      }
                    : msg
                );
                const editedMessage = updatedMessages.find(
                  (msg) => msg.id === editingMessageId
                );
                const newLastMessage =
                  editedMessage &&
                  editedMessage.id ===
                    updatedMessages[updatedMessages.length - 1].id
                    ? `You: ${editedMessage.content.slice(0, 20)}${
                        editedMessage.content.length > 20 ? "..." : ""
                      }`
                    : chat.lastMessage; // Keep current last message if not the edited one

                return {
                  ...chat,
                  messages: updatedMessages,
                  lastMessage: newLastMessage,
                  timestamp: new Date().toISOString(), // Update chat timestamp for sorting
                };
              }
              return chat;
            })
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            ) // Re-sort
      );
      setEditingMessageId(null);
      setMessage("");
      showFeedback("Message edited");
    }
  };

  const handlePinClick = (messageId: string) => {
    const currentChat = chats.find((chat) => chat.id === activeChat);
    const isAlreadyPinned = currentChat?.pinnedMessages.some(
      (p) => p.messageId === messageId
    );

    if (isAlreadyPinned) {
      // If already pinned, unpin it
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                pinnedMessages: chat.pinnedMessages.filter(
                  (p) => p.messageId !== messageId
                ),
              }
            : chat
        )
      );
      showFeedback("Message unpinned");
    } else {
      // If not pinned, open duration dialog
      setPinDurationDialog({ isOpen: true, messageId });
    }
  };

  const handleSelectPinDuration = (durationHours: number) => {
    if (pinDurationDialog.messageId && activeChatDetails) {
      const unpinTimestamp = Date.now() + durationHours * 60 * 60 * 1000; // Convert hours to milliseconds
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                pinnedMessages: [
                  ...chat.pinnedMessages,
                  { messageId: pinDurationDialog.messageId!, unpinTimestamp },
                ],
              }
            : chat
        )
      );
      showFeedback(`Message pinned for ${durationHours} hours`);
    }
    setPinDurationDialog({ isOpen: false, messageId: null });
  };

  const handleClosePinDurationDialog = () => {
    setPinDurationDialog({ isOpen: false, messageId: null });
  };

  // Effect to unpin messages after their duration
  useEffect(() => {
    const interval = setInterval(() => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          const now = Date.now();
          const updatedPinnedMessages = chat.pinnedMessages.filter(
            (p) => p.unpinTimestamp > now
          );
          if (updatedPinnedMessages.length !== chat.pinnedMessages.length) {
            // If any message was unpinned, show feedback
            const unpinnedCount =
              chat.pinnedMessages.length - updatedPinnedMessages.length;
            if (unpinnedCount > 0) {
              showFeedback(
                `${unpinnedCount} pinned message(s) unpinned automatically.`
              );
            }
            return { ...chat, pinnedMessages: updatedPinnedMessages };
          }
          return chat;
        })
      );
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    else return (bytes / 1073741824).toFixed(1) + " GB";
  };

  const handlePlayVideo = (videoUrl: string) => {
    setVideoPlayer({ isOpen: true, videoUrl });
  };

  const handleCloseVideoPlayer = () => {
    setVideoPlayer({ isOpen: false, videoUrl: null });
    setIsPlaying(false);
    setIsMuted(false);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showFeedback("Message copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        showFeedback("Failed to copy message");
      });
  };

  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleSaveVideo = (videoUrl: string) => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = "video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback("Video saved to device");
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleToggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const updateTime = () => setCurrentTime(videoElement.currentTime);
      const updateDuration = () => setDuration(videoElement.duration);
      videoElement.addEventListener("timeupdate", updateTime);
      videoElement.addEventListener("loadedmetadata", updateDuration);
      return () => {
        videoElement.removeEventListener("timeupdate", updateTime);
        videoElement.removeEventListener("loadedmetadata", updateDuration);
      };
    }
  }, [videoPlayer.isOpen]);

  const handleOpenMediaGallery = useCallback(
    (files: Message["files"], startIndex: number) => {
      setMediaGallery({ isOpen: true, files, startIndex });
    },
    []
  );

  const handleCloseMediaGallery = useCallback(() => {
    setMediaGallery({ isOpen: false, files: null, startIndex: 0 });
  }, []);

  const currentGalleryIndex = useRef(mediaGallery.startIndex);

  const handleNextMedia = () => {
    if (mediaGallery.files && mediaGallery.files.length > 0) {
      currentGalleryIndex.current =
        (currentGalleryIndex.current + 1) % mediaGallery.files.length;
      setMediaGallery((prev) => ({
        ...prev,
        startIndex: currentGalleryIndex.current,
      }));
    }
  };

  const handlePrevMedia = () => {
    if (mediaGallery.files && mediaGallery.files.length > 0) {
      currentGalleryIndex.current =
        (currentGalleryIndex.current - 1 + mediaGallery.files.length) %
        mediaGallery.files.length;
      setMediaGallery((prev) => ({
        ...prev,
        startIndex: currentGalleryIndex.current,
      }));
    }
  };

  const handleStartNewChat = (user: UserOrVendor) => {
    setChats((prevChats) => {
      // Check if a chat with this user already exists
      const existingChat = prevChats.find(
        (chat) => chat.name === user.name && chat.isVendor === user.isVendor
      );

      if (existingChat) {
        setActiveChat(existingChat.id);
        return prevChats; // No change to chats array if already exists
      }

      // Create a new chat
      const newChat: Chat = {
        id: `chat-${Date.now()}`, // Unique ID for the new chat
        name: user.name,
        avatar: user.avatar,
        lastMessage: "New chat started!",
        timestamp: new Date().toISOString(),
        isVendor: user.isVendor,
        isOnline: true, // Assume new chat is with an online user for simplicity
        messages: [],
        pinnedMessages: [],
      };

      // Add new chat to the beginning and sort
      const updatedChats = [newChat, ...prevChats].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setActiveChat(newChat.id); // Set the new chat as active
      return updatedChats;
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat List Sidebar Component */}
      <ChatListSidebar
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        onStartNewChat={handleStartNewChat}
      />

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Chat Header or No Chat Selected Message */}
        {activeChatDetails ? (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-3 p-4 bg-white border-b flex-shrink-0"
          >
            <div className="relative">
              <img
                src={activeChatDetails.avatar || "/placeholder.svg"}
                alt={activeChatDetails.name}
                className="w-10 h-10 rounded-full"
              />
              {activeChatDetails.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <h2 className="font-semibold">{activeChatDetails.name}</h2>
              <span className="text-xs text-green-500">
                {activeChatDetails.isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <img
              src="/placeholder.svg?height=200&width=200" // Placeholder GIF
              alt="No chat selected"
              className="mb-4"
            />
            <p className="text-lg font-semibold">
              GIF Display for No Chat Selected
            </p>
            <p className="text-sm">
              Added a GIF animation when no chat is selected
            </p>
            <p className="text-sm">
              Shows a friendly message prompting the admin to select a chat
            </p>
          </div>
        )}

        {/* Pinned Messages */}
        {activeChatDetails && activeChatDetails.pinnedMessages.length > 0 && (
          <div className="flex flex-col p-2 bg-orange-100 flex-shrink-0">
            {activeChatDetails.pinnedMessages.map((pinnedMsg) => {
              const originalMessage = activeMessages.find(
                (msg) => msg.id === pinnedMsg.messageId
              );
              if (!originalMessage) return null;

              const unpinDate = new Date(pinnedMsg.unpinTimestamp);
              const timeLeft = unpinDate.getTime() - Date.now();
              const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
              const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));

              return (
                <div
                  key={pinnedMsg.messageId}
                  className="flex items-center justify-between gap-2 py-1"
                >
                  <div className="flex items-center gap-2">
                    <Pin className="w-4 h-4 text-orange-500" />
                    <p className="text-sm text-orange-700 truncate">
                      {originalMessage.content}
                      {timeLeft > 0 && (
                        <span className="ml-2 text-xs text-orange-600">
                          (Unpins in{" "}
                          {daysLeft > 0
                            ? `${daysLeft} days`
                            : `${hoursLeft} hours`}
                          )
                        </span>
                      )}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => handlePinClick(pinnedMsg.messageId)}
                    className="text-orange-500 hover:text-orange-700"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              );
            })}
          </div>
        )}

        {/* Feedback Message */}
        {feedbackMessage && (
          <div className="p-2 text-center text-green-800 bg-green-100 flex-shrink-0">
            {feedbackMessage}
          </div>
        )}

        {/* Messages */}
        {activeChatDetails && (
          <div className="flex-1 p-4 overflow-y-auto">
            <AnimatePresence>
              {activeMessages
                .filter((msg) => msg.deletedFor === "none") // Only show messages not deleted for everyone
                .map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-3 mb-4 ${
                      msg.isVendor ? "" : "justify-end"
                    }`}
                  >
                    {msg.isVendor && activeChatDetails && (
                      <img
                        src={activeChatDetails.avatar || "/placeholder.svg"}
                        alt={msg.sender}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div
                      className={`max-w-[70%] ${
                        msg.isVendor ? "order-2" : "order-1"
                      }`}
                    >
                      {msg.replyTo && (
                        <div className="p-2 mb-1 text-sm text-gray-600 bg-gray-100 rounded-t-lg">
                          Replying to:{" "}
                          {activeMessages
                            .find((m) => m.id === msg.replyTo)
                            ?.content.slice(0, 50)}
                          ...
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-lg ${
                          msg.isVendor
                            ? "bg-white border"
                            : "bg-orange-500 text-white"
                        }`}
                      >
                        {msg.files && msg.files.length > 0 && (
                          <div
                            className={
                              msg.files && msg.files.length === 1
                                ? "mb-2"
                                : "grid grid-cols-2 gap-2 mb-2"
                            }
                          >
                            {msg.files
                              .slice(
                                0,
                                msg.files.length > 4 ? 4 : msg.files.length
                              )
                              .map((file, i) => (
                                <div
                                  key={i}
                                  className={
                                    msg.files && msg.files.length === 1
                                      ? "relative w-full h-auto max-h-64 overflow-hidden rounded-lg cursor-pointer group"
                                      : "relative w-32 h-32 overflow-hidden rounded-lg cursor-pointer group"
                                  }
                                  onClick={() =>
                                    handleOpenMediaGallery(msg.files, i)
                                  }
                                >
                                  {file.type === "image" ? (
                                    <img
                                      src={file.url || "/placeholder.svg"}
                                      alt={file.name}
                                      className={
                                        msg.files && msg.files.length === 1
                                          ? "object-contain w-full h-full"
                                          : "object-cover w-full h-full"
                                      }
                                    />
                                  ) : file.type === "video" ? (
                                    <>
                                      <video
                                        src={file.url}
                                        className={
                                          msg.files.length === 1
                                            ? "object-contain w-full h-full"
                                            : "object-cover w-full h-full"
                                        }
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-20">
                                        <Play className="w-8 h-8 text-white" />
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full p-2 text-center bg-gray-200 text-gray-700">
                                      <Paperclip className="w-6 h-6 mb-1" />
                                      <span className="text-xs truncate w-full px-1">
                                        {file.name}
                                      </span>
                                    </div>
                                  )}
                                  {msg.files &&
                                    msg.files.length > 4 &&
                                    i === 3 && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-xl font-bold">
                                        +{msg.files.length - 4}
                                      </div>
                                    )}
                                </div>
                              ))}
                          </div>
                        )}
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>
                      <div
                        className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                          msg.isVendor ? "justify-start" : "justify-end"
                        }`}
                      >
                        {msg.timestamp}
                        {msg.isEdited && (
                          <span className="ml-1 text-gray-400">(edited)</span>
                        )}
                        <div className="flex gap-2 ml-2">
                          <button
                            onClick={() => handleReply(msg.id)}
                            className="relative hover:text-orange-500 group"
                          >
                            <Reply className="w-4 h-4" />
                            <span className="absolute px-2 py-1 text-xs text-white transition-opacity transform -translate-x-1/2 bg-gray-800 rounded opacity-0 bottom-full left-1/2 group-hover:opacity-100">
                              Reply
                            </span>
                          </button>
                          <button
                            onClick={() => handleCopyText(msg.content)}
                            className="relative hover:text-orange-500 group"
                          >
                            <Copy className="w-4 h-4" />
                            <span className="absolute px-2 py-1 text-xs text-white transition-opacity transform -translate-x-1/2 bg-gray-800 rounded opacity-0 bottom-full left-1/2 group-hover:opacity-100">
                              Copy
                            </span>
                          </button>
                          {!msg.isVendor && (
                            <>
                              <button
                                onClick={() => handleEdit(msg.id)}
                                className="relative hover:text-orange-500 group"
                              >
                                <Edit className="w-4 h-4" />
                                <span className="absolute px-2 py-1 text-xs text-white transition-opacity transform -translate-x-1/2 bg-gray-800 rounded opacity-0 bottom-full left-1/2 group-hover:opacity-100">
                                  Edit
                                </span>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(msg.id)}
                                className="relative hover:text-orange-500 group"
                              >
                                <Trash className="w-4 h-4" />
                                <span className="absolute px-2 py-1 text-xs text-white transition-opacity transform -translate-x-1/2 bg-gray-800 rounded opacity-0 bottom-full left-1/2 group-hover:opacity-100">
                                  Delete
                                </span>
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handlePinClick(msg.id)}
                            className="relative hover:text-orange-500 group"
                          >
                            <Pin className="w-4 h-4" />
                            <span className="absolute px-2 py-1 text-xs text-white transition-opacity transform -translate-x-1/2 bg-gray-800 rounded opacity-0 bottom-full left-1/2 group-hover:opacity-100">
                              {activeChatDetails?.pinnedMessages.some(
                                (p) => p.messageId === msg.id
                              )
                                ? "Unpin"
                                : "Pin"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    {!msg.isVendor && (
                      <img
                        src="/placeholder.svg"
                        alt="You"
                        className="order-3 w-8 h-8 rounded-full"
                      />
                    )}
                  </motion.div>
                ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Reply Preview */}
        {activeChatDetails && replyingTo && (
          <div className="flex items-center justify-between p-2 bg-gray-100 flex-shrink-0">
            <p className="text-sm text-gray-600">
              Replying to:{" "}
              {activeMessages
                .find((m) => m.id === replyingTo)
                ?.content.slice(0, 50)}
              ...
            </p>
            <motion.button
              onClick={() => setReplyingTo(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        )}

        {/* Message Input */}
        {activeChatDetails && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative p-4 bg-white border-t flex-shrink-0"
          >
            <div className="flex items-center gap-2">
              <motion.input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => handleFilesUpload(e, "document")}
              />
              <motion.input
                type="file"
                multiple
                ref={videoInputRef}
                className="hidden"
                accept="image/*,video/*"
                onChange={(e) => handleFilesUpload(e, "video")}
              />
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Paperclip className="w-5 h-5 text-gray-500" />
              </motion.button>
              <motion.button
                onClick={() => videoInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Video className="w-5 h-5 text-gray-500" />
              </motion.button>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    editingMessageId ? "Edit message..." : "Write Something..."
                  }
                  className="w-full py-2 pl-4 pr-10 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (editingMessageId ? handleSaveEdit() : handleSendMessage())
                  }
                />
                <motion.button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute p-1 transform -translate-y-1/2 rounded-full right-10 top-1/2 hover:bg-gray-200"
                >
                  <Smile className="w-5 h-5 text-gray-500" />
                </motion.button>
                <motion.button
                  onClick={
                    editingMessageId ? handleSaveEdit : handleSendMessage
                  }
                  className="absolute p-1 text-white transform -translate-y-1/2 bg-orange-500 rounded-full right-2 top-1/2 hover:bg-orange-600"
                >
                  <SendIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute right-0 mb-2 bg-white border rounded-lg shadow-lg bottom-full">
                <EmojiPicker
                  onEmojiClick={(emojiObject) =>
                    handleEmojiSelect(emojiObject.emoji)
                  }
                  autoFocusSearch={false}
                  // native
                />
              </div>
            )}
          </motion.div>
        )}
      </div>
      {/* Delete Dialog */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="p-6 bg-white rounded-lg w-96">
            <h3 className="mb-4 text-lg font-semibold">Delete message?</h3>
            <p className="mb-4 text-sm text-gray-600">
              This message will be permanently deleted.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Enhanced Video Player */}
      {videoPlayer.isOpen && videoPlayer.videoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full max-w-4xl p-4 bg-white rounded-lg aspect-video">
            <div className="absolute z-10 flex items-center gap-2 top-2 right-2">
              <motion.button
                onClick={() => handleSaveVideo(videoPlayer.videoUrl!)}
                className="p-2 text-white bg-gray-800 rounded-full hover:bg-gray-700"
              >
                <Save className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={handleCloseVideoPlayer}
                className="p-2 text-white bg-gray-800 rounded-full hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={videoPlayer.videoUrl}
                className="object-contain w-full h-full rounded-lg"
                onClick={handlePlayPause}
                controls
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePlayPause}
                      className="p-2 text-white bg-gray-800 rounded-full hover:bg-gray-700"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={handleToggleMute}
                      className="p-2 text-white bg-gray-800 rounded-full hover:bg-gray-700"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <div className="text-sm text-white">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={handleToggleFullscreen}
                      className="p-2 text-white bg-gray-800 rounded-full hover:bg-gray-700"
                    >
                      <Maximize className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Media Gallery Dialog */}
      {mediaGallery.isOpen && mediaGallery.files && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative w-full h-full max-w-5xl max-h-5xl flex items-center justify-center">
            <button
              onClick={handleCloseMediaGallery}
              className="absolute top-4 right-4 p-2 text-white bg-gray-800 rounded-full hover:bg-gray-700 z-10"
            >
              <X className="w-6 h-6" />
            </button>
            {mediaGallery.files.length > 1 && (
              <>
                <button
                  onClick={handlePrevMedia}
                  className="absolute left-4 p-2 text-white bg-gray-800 rounded-full hover:bg-gray-700 z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextMedia}
                  className="absolute right-4 p-2 text-white bg-gray-800 rounded-full hover:bg-gray-700 z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            <div className="relative w-full h-full flex items-center justify-center">
              {mediaGallery.files[mediaGallery.startIndex] &&
                (mediaGallery.files[mediaGallery.startIndex].type ===
                "image" ? (
                  <img
                    src={
                      mediaGallery.files[mediaGallery.startIndex].url ||
                      "/placeholder.svg"
                    }
                    alt={mediaGallery.files[mediaGallery.startIndex].name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : mediaGallery.files[mediaGallery.startIndex].type ===
                  "video" ? (
                  <video
                    src={mediaGallery.files[mediaGallery.startIndex].url}
                    controls
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-white text-center p-4">
                    <Paperclip className="w-12 h-12 mb-4" />
                    <p className="text-xl font-semibold">
                      {mediaGallery.files[mediaGallery.startIndex].name}
                    </p>
                    <p className="text-sm">
                      {formatFileSize(
                        mediaGallery.files[mediaGallery.startIndex].size
                      )}
                    </p>
                    <a
                      href={mediaGallery.files[mediaGallery.startIndex].url}
                      download={
                        mediaGallery.files[mediaGallery.startIndex].name
                      }
                      className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    >
                      Download
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {/* Pin Duration Dialog */}
      {pinDurationDialog.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="p-6 bg-white rounded-lg w-96">
            <h3 className="mb-4 text-lg font-semibold">
              Pin message for how long?
            </h3>
            <div className="mb-6 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pinDuration"
                  value="24"
                  onChange={() => handleSelectPinDuration(24)}
                  className="mr-2"
                />
                <span>24 Hours</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pinDuration"
                  value="168" // 7 days * 24 hours
                  onChange={() => handleSelectPinDuration(168)}
                  className="mr-2"
                />
                <span>7 Days</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pinDuration"
                  value="720" // 30 days * 24 hours (approx)
                  onChange={() => handleSelectPinDuration(720)}
                  className="mr-2"
                />
                <span>30 Days</span>
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleClosePinDurationDialog}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
