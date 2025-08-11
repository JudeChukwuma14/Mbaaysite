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
  ImageIcon,
  Loader2,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { ChatListSidebar } from "./chat-list-sidebar";
import {
  useChats,
  useCreateOrGetChat,
  useDeleteMessage,
  useEditMessage,
  useMessages,
  useSendMediaMessage,
  useSendMessage,
} from "@/hook/chatQueries";
import { FaFacebookMessenger } from "react-icons/fa";
import { useSelector } from "react-redux";

interface Message {
  _id: string;
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
  isOptimistic?: boolean;
}

interface Chat {
  _id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isVendor: string;
  isOnline: boolean;
  messages: Message[];
  storeName?: string;
  pinnedMessages: {
    messageId: string;
    unpinTimestamp: number;
  }[];
}

interface UserOrVendor {
  _id: string;
  name: string;
  avatar: string;
  isVendor: boolean;
  userName?: string;
  storeName?: string;
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

interface ChatInterfaceProps {
  token: string | null;
}

export default function ChatInterface({ token }: ChatInterfaceProps) {
  const [activeChat, setActiveChat] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
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
  const [isVendorTyping, setIsVendorTyping] = useState(false);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);

  const user = useSelector((state: any) => state.vendor);

  // API Queries
  const { data: apiChats = [] } = useChats(user.token);
  const { data: apiMessagesResponse = null, refetch: refetchMessages } =
    useMessages(activeChat);

  // Extract the actual messages array from the API response
  const apiMessages = apiMessagesResponse?.messages || [];
  const createOrGetChatMutation = useCreateOrGetChat();
  const sendMessageMutation = useSendMessage();
  const editMessageMutation = useEditMessage();
  const deleteMessageMutation = useDeleteMessage();
  const sendMediaMessageMutation: ReturnType<typeof useSendMediaMessage> =
    useSendMediaMessage();

  // Sync API data with local state
  useEffect(() => {
    if (apiChats.length > 0) {
      setChats((prevChats) => {
        return apiChats.map((apiChat: any) => {
          const existingChat = prevChats.find((c) => c._id === apiChat._id);

          // Find the other participant (not the current user)
          const currentUserId = user.vendor._id;
          const otherParticipant = apiChat.participants.find(
            (participant: any) => participant.participantId !== currentUserId
          );

          // If no other participant found, use the first one
          const participant = otherParticipant || apiChat.participants[0];

          return {
            _id: apiChat._id,
            name:
              participant?.details?.storeName ||
              participant?.details?.name ||
              "Unknown",
            storeName: participant?.details?.storeName,
            avatar:
              participant?.details?.avatar ||
              participant?.details?.businessLogo,
            lastMessage: apiChat.lastMessage?.content || "No messages yet",
            timestamp: apiChat?.updatedAt,
            isVendor: participant?.model === "vendors",
            isOnline: apiChat.receiver?.isOnline || false,
            messages: existingChat?.messages,
            pinnedMessages: existingChat?.pinnedMessages || [],
          };
        });
      });
    }
  }, [apiChats]);

  useEffect(() => {
    if (activeChat && apiMessages.length > 0) {
      const processedMessages = apiMessages.map((msg: any) => {
        return {
          _id: msg._id,
          content: msg.content,
          sender:
            msg.sender._id === user.vendor._id
              ? "You"
              : msg.sender?.storeName ||
                msg.sender?.details?.storeName ||
                "Unknown",
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isVendor:
            msg.sender?.model === "vendors" || msg.sender?.isVendor || false,
          files:
            msg.files?.map((file: any) => ({
              type: file.type,
              url: file.url,
              name: file?.name || "Unknown file",
              size: file.size || 0,
              duration: file.duration,
            })) || [],
          replyTo: msg.replyTo,
          isEdited: msg.isEdited || false,
          deletedFor: msg.deletedFor || "none",
        };
      });

      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat._id === activeChat) {
            return {
              ...chat,
              messages: processedMessages,
            };
          }
          return chat;
        });
        return updatedChats;
      });
    }
  }, [apiMessages, activeChat]);

  const activeChatDetails = chats.find((chat) => chat._id === activeChat);
  const activeMessages = activeChatDetails?.messages || [];

  useEffect(() => {
    scrollToBottom();
  }, [chats, activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fixed image upload handler
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!activeChat) {
      showFeedback("Please select a chat first");
      return;
    }

    const authToken = user.token;
    if (!authToken) {
      showFeedback("Authentication required");
      return;
    }

    // Validate file count (max 5 images as per backend)
    if (files.length > 5) {
      showFeedback("Maximum 5 images allowed per message");
      return;
    }

    // Validate file types
    const invalidFiles = Array.from(files).filter(
      (file) => !file.type.startsWith("image/")
    );
    if (invalidFiles.length > 0) {
      showFeedback("Please select only image files");
      return;
    }

    try {
      setIsUploading(true);

      const imageFiles = Array.from(files);

      await sendMediaMessageMutation.mutateAsync({
        chatId: activeChat,
        files: { images: imageFiles },
        token: authToken,
        content: message.trim() || undefined,
        replyTo: replyingTo || undefined,
      });

      // Clear the input
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }

      setMessage("");
      setReplyingTo(null);
      setShowEmojiPicker(false);

      showFeedback("Images uploaded successfully");
    } catch (error: any) {
      console.error("Image upload error:", error);

      let errorMessage = "Failed to upload images";

      // Handle different types of errors
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        if (
          error.message.includes("Network Error") ||
          error.message.includes("timeout")
        ) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else {
          errorMessage = error.message;
        }
      } else if (error.code === "NETWORK_ERROR") {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      showFeedback(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Fixed video upload handler
  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!activeChat) {
      showFeedback("Please select a chat first");
      return;
    }

    const authToken = token || user.token;
    if (!authToken) {
      showFeedback("Authentication required");
      return;
    }

    // Validate file count (max 1 video as per backend)
    if (files.length > 1) {
      showFeedback("Maximum 1 video allowed per message");
      return;
    }

    // Validate file type
    const videoFile = files[0];
    if (!videoFile.type.startsWith("video/")) {
      showFeedback("Please select only video files");
      return;
    }

    // Optional: Validate file size (e.g., max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (videoFile.size > maxSize) {
      showFeedback("Video file size must be less than 100MB");
      return;
    }

    try {
      setIsUploading(true);

      await sendMediaMessageMutation.mutateAsync({
        chatId: activeChat,
        files: { video: videoFile },
        token: authToken,
        content: message.trim() || undefined,
        replyTo: replyingTo || undefined,
      });

      // Clear the input
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }

      setMessage("");
      setReplyingTo(null);
      setShowEmojiPicker(false);

      showFeedback("Video uploaded successfully");
    } catch (error: any) {
      console.error("Video upload error:", error);

      let errorMessage = "Failed to upload video";

      // Handle different types of errors
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        if (
          error.message.includes("Network Error") ||
          error.message.includes("timeout")
        ) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else {
          errorMessage = error.message;
        }
      } else if (error.code === "NETWORK_ERROR") {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      showFeedback(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Remove the old handleFileUpload function since it's not needed
  // Your backend doesn't seem to support general file uploads, only images and videos

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      showFeedback("Please enter a message");
      return;
    }

    if (!activeChat) {
      showFeedback("Please select a chat first");
      return;
    }

    const authToken = user.token;
    if (!authToken) {
      showFeedback("Authentication required");
      return;
    }

    try {
      const messageData = {
        chatId: activeChat as string,
        content: message.trim(),
        token: authToken,
        ...(replyingTo && { replyTo: replyingTo }),
      };

      await sendMessageMutation.mutateAsync(messageData);
      setMessage("");
      setReplyingTo(null);
      setShowEmojiPicker(false);
    } catch (error: any) {
      console.error("Error sending message:", error);
      showFeedback("Failed to send message");
    }
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
      deleteMessageMutation.mutate({
        messageId: deleteDialog.messageId,
        token,
      });
      setDeleteDialog({ isOpen: false, messageId: null });
      showFeedback("Message deleted");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, messageId: null });
  };

  const handleEdit = (messageId: string) => {
    setEditingMessageId(messageId);

    const messageToEdit = activeMessages.find((msg) => msg._id === messageId);
    if (messageToEdit) {
      setMessage(messageToEdit.content);
    }
    showFeedback("Editing message");
  };

  const handleSaveEdit = () => {
    if (editingMessageId) {
      editMessageMutation.mutate({
        messageId: editingMessageId,
        content: message,
        token,
      });

      setTimeout(() => {
        refetchMessages();
      }, 500);
      setEditingMessageId(null);
      setMessage("");
      showFeedback("Message edited");
    }
  };

  const handlePinClick = (messageId: string) => {
    const currentChat = chats.find((chat) => chat._id === activeChat);
    const isAlreadyPinned = currentChat?.pinnedMessages.some(
      (p) => p.messageId === messageId
    );

    if (isAlreadyPinned) {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === activeChat
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
      setPinDurationDialog({ isOpen: true, messageId });
    }
  };

  const handleSelectPinDuration = (durationHours: number) => {
    if (pinDurationDialog.messageId && activeChatDetails) {
      const unpinTimestamp = Date.now() + durationHours * 60 * 60 * 1000;
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === activeChat
            ? {
                ...chat,
                pinnedMessages: [
                  ...chat.pinnedMessages,
                  {
                    messageId: pinDurationDialog.messageId!,
                    unpinTimestamp,
                  },
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

  useEffect(() => {
    const interval = setInterval(() => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          const now = Date.now();
          const updatedPinnedMessages = chat.pinnedMessages.filter(
            (p) => p.unpinTimestamp > now
          );
          if (updatedPinnedMessages.length !== chat.pinnedMessages.length) {
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
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Utility functions
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    else return (bytes / 1073741824).toFixed(1) + " GB";
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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

  const handleStartNewChat = async (user: UserOrVendor) => {
    try {
      const result = await createOrGetChatMutation.mutateAsync({
        receiverId: user._id,
        token,
      });
      setActiveChat(result._id);
    } catch (error) {
      showFeedback("Failed to start new chat");
      console.error("Error creating new chat:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatListSidebar
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        token={token}
        onNewChatCreated={handleStartNewChat}
      />

      <div className="flex flex-col flex-1">
        {activeChatDetails ? (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
<<<<<<< HEAD
            className="flex items-center flex-shrink-0 gap-3 p-4 bg-white border-b"
=======
            className="flex items-center flex-shrink-0 gap-4 p-4 border-b shadow-sm bg-gradient-to-r from-white to-gray-50"
>>>>>>> eda03fdf5c1d267392e06dfdf65121f07e098694
          >
            <div className="relative">
              {activeChatDetails.isVendor ? (
                <div>
                  {activeChatDetails.avatar ? (
                    <img
                      src={activeChatDetails.avatar || "/placeholder.svg"}
                      alt={activeChatDetails.name}
                      className="object-cover w-12 h-12 rounded-full shadow-md"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-md bg-gradient-to-br from-orange-500 to-orange-600">
                      <span className="text-white text-[20px] font-bold">
                        {activeChatDetails.storeName
                          ? `${activeChatDetails.storeName
                              .charAt(0)
                              .toUpperCase()}${
                              activeChatDetails.storeName
                                .split(" ")[1]
                                ?.charAt(0)
                                .toUpperCase() || ""
                            }`
                          : activeChatDetails.name?.charAt(0).toUpperCase() ||
                            "?"}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-md bg-gradient-to-br from-blue-500 to-blue-600">
                  <span className="text-white text-[20px] font-bold">
                    {activeChatDetails.name?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
              )}
              {activeChatDetails.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeChatDetails.storeName || activeChatDetails.name}
                </h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    activeChatDetails.isVendor
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {activeChatDetails.isVendor ? "Vendor" : "User"}
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full text-center text-gray-500 bg-gradient-to-br from-gray-50 to-white"
          >
            <div className="p-8 mb-6 bg-white rounded-full shadow-lg">
              <FaFacebookMessenger size={80} className="text-orange-500" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-800">
              No Messages Yet
            </h2>
            <p className="max-w-md mb-4 text-gray-600">
              You have no active chats at the moment. Start a conversation with
              customers or vendors to begin messaging.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>New messages will appear here automatically</span>
            </div>
          </motion.div>
        )}

        {activeChatDetails && activeChatDetails.pinnedMessages.length > 0 && (
<<<<<<< HEAD
          <div className="flex flex-col flex-shrink-0 p-2 bg-orange-100">
=======
          <div className="flex flex-col flex-shrink-0 p-3 border-b border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <Pin className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                Pinned Messages
              </span>
            </div>
>>>>>>> eda03fdf5c1d267392e06dfdf65121f07e098694
            {activeChatDetails.pinnedMessages.map((pinnedMsg) => {
              const originalMessage = activeMessages.find(
                (msg) => msg._id === pinnedMsg.messageId
              );
              if (!originalMessage) return null;
              const unpinDate = new Date(pinnedMsg.unpinTimestamp);
              const timeLeft = unpinDate.getTime() - Date.now();
              const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
              const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));

              return (
                <motion.div
                  key={pinnedMsg.messageId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between gap-3 px-3 py-2 bg-white border border-orange-200 rounded-lg shadow-sm"
                >
                  <div className="flex items-center flex-1 gap-2">
                    <Pin className="flex-shrink-0 w-4 h-4 text-orange-500" />
                    <p className="text-sm text-orange-800 truncate">
                      {originalMessage.content}
                    </p>
                    {timeLeft > 0 && (
                      <span className="flex-shrink-0 px-2 py-1 text-xs text-orange-600 bg-orange-100 rounded-full">
                        {daysLeft > 0
                          ? `${daysLeft}d left`
                          : `${hoursLeft}h left`}
                      </span>
                    )}
                  </div>
                  <motion.button
                    onClick={() => handlePinClick(pinnedMsg.messageId)}
                    className="p-1 text-orange-500 transition-colors rounded-full hover:text-orange-700 hover:bg-orange-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}

        {feedbackMessage && (
<<<<<<< HEAD
          <div className="flex-shrink-0 p-2 text-center text-green-800 bg-green-100">
            {feedbackMessage}
          </div>
=======
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-shrink-0 p-3 text-center text-green-800 border-b border-green-200 shadow-sm bg-gradient-to-r from-green-50 to-green-100"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">{feedbackMessage}</span>
            </div>
          </motion.div>
>>>>>>> eda03fdf5c1d267392e06dfdf65121f07e098694
        )}

        {activeChatDetails && (
          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <AnimatePresence mode="wait">
              {activeMessages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center text-gray-500"
                >
                  <div className="p-6 mb-4 bg-white rounded-full shadow-lg">
                    <FaFacebookMessenger size={40} className="text-gray-300" />
                  </div>
                  <p className="text-lg font-semibold text-gray-400">
                    No messages yet
                  </p>
                  <p className="text-sm text-gray-400">
                    Start the conversation!
                  </p>
                </motion.div>
              ) : (
                activeMessages
                  .filter((msg) => msg.deletedFor === "none")
                  .map((msg, index) => (
                    <motion.div
                      key={msg._id}
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
                          className="object-cover w-8 h-8 rounded-full"
                          loading="lazy"
                        />
                      )}
                      <div
                        className={`max-w-[70%] ${
                          msg.isVendor ? "order-2" : "order-1"
                        }`}
                      >
                        {msg.replyTo && (
                          <div className="p-2 mb-1 text-sm text-gray-600 bg-gray-100 border-l-4 border-orange-500 rounded-t-lg">
                            <div className="flex items-center gap-1 mb-1 text-xs text-orange-600">
                              <Reply className="w-3 h-3" />
                              Replying to:
                            </div>
                            {activeMessages
                              .find((m) => m._id === msg.replyTo)
                              ?.content.slice(0, 50)}
                            ...
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-lg shadow-sm ${
                            msg.isVendor
                              ? "bg-white border border-gray-200"
                              : "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
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
                                        alt={file?.name}
                                        className={
                                          msg.files && msg.files.length === 1
                                            ? "object-contain w-full h-full"
                                            : "object-cover w-full h-full"
                                        }
                                      />
<<<<<<< HEAD
                                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-20">
                                        <Play className="w-8 h-8 text-white" />
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full p-2 text-center text-gray-700 bg-gray-200">
                                      <Paperclip className="w-6 h-6 mb-1" />
                                      <span className="w-full px-1 text-xs truncate">
                                        {file?.name}
                                      </span>
                                    </div>
                                  )}
                                  {msg.files &&
                                    msg.files.length > 4 &&
                                    i === 3 && (
                                      <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white bg-black bg-opacity-70">
                                        +{msg.files.length - 4}
=======
                                    ) : file.type === "video" ? (
                                      <>
                                        <video
                                          src={file.url}
                                          className={
                                            msg.files && msg.files.length === 1
                                              ? "object-contain w-full h-full"
                                              : "object-cover w-full h-full"
                                          }
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-20">
                                          <Play className="w-8 h-8 text-white" />
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center w-full h-full p-2 text-center text-gray-700 bg-gray-200">
                                        <Paperclip className="w-6 h-6 mb-1" />
                                        <span className="w-full px-1 text-xs truncate">
                                          {file?.name}
                                        </span>
>>>>>>> eda03fdf5c1d267392e06dfdf65121f07e098694
                                      </div>
                                    )}
                                    {msg.files &&
                                      msg.files.length > 4 &&
                                      i === 3 && (
                                        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white bg-black bg-opacity-70">
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
                          className={`flex items-center gap-1 mt-2 text-xs text-gray-500 ${
                            msg.isVendor ? "justify-start" : "justify-end"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            {msg.timestamp}
                          </div>
                          {msg.isEdited && (
                            <span className="ml-1 text-gray-400">(edited)</span>
                          )}
                          <div className="flex gap-1 ml-2">
                            <button
                              onClick={() => handleReply(msg._id)}
                              className="relative p-1 transition-colors rounded-full hover:text-orange-500 group hover:bg-orange-50"
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
                                  onClick={() => handleEdit(msg._id)}
                                  className="relative hover:text-orange-500 group"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span className="absolute px-2 py-1 text-xs text-white transition-opacity transform -translate-x-1/2 bg-gray-800 rounded opacity-0 bottom-full left-1/2 group-hover:opacity-100">
                                    Edit
                                  </span>
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(msg._id)}
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
                              onClick={() => handlePinClick(msg._id)}
                              className="relative hover:text-orange-500 group"
                            >
                              <Pin className="w-4 h-4" />
                              <span className="absolute px-2 py-1 text-xs text-white transition-opacity transform -translate-x-1/2 bg-gray-800 rounded opacity-0 bottom-full left-1/2 group-hover:opacity-100">
                                {activeChatDetails?.pinnedMessages.some(
                                  (p) => p.messageId === msg._id
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
                          src={user.vendor.avatar || "/placeholder.svg"}
                          alt="You"
                          className="order-3 object-cover w-8 h-8 rounded-full"
                          loading="lazy"
                        />
                      )}
                    </motion.div>
                  ))
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}

        {activeChatDetails && replyingTo && (
<<<<<<< HEAD
          <div className="flex items-center justify-between flex-shrink-0 p-2 bg-gray-100">
            <p className="text-sm text-gray-600">
              Replying to:{" "}
              {activeMessages
                .find((m) => m._id === replyingTo)
                ?.content.slice(0, 50)}
              ...
            </p>
=======
          <div className="flex items-center justify-between flex-shrink-0 p-3 border-t border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100">
            <div className="flex items-center gap-2">
              <Reply className="w-4 h-4 text-orange-600" />
              <p className="text-sm font-medium text-orange-800">
                Replying to:{" "}
                <span className="text-orange-600">
                  {activeMessages
                    .find((m) => m._id === replyingTo)
                    ?.content.slice(0, 50)}
                  ...
                </span>
              </p>
            </div>
>>>>>>> eda03fdf5c1d267392e06dfdf65121f07e098694
            <motion.button
              onClick={() => setReplyingTo(null)}
              className="p-1 text-orange-500 transition-colors rounded-full hover:text-orange-700 hover:bg-orange-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        )}

        {activeChatDetails && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
<<<<<<< HEAD
            className="relative flex-shrink-0 p-4 bg-white border-t"
=======
            className="relative flex-shrink-0 p-4 border-t shadow-lg bg-gradient-to-r from-gray-50 to-white"
>>>>>>> eda03fdf5c1d267392e06dfdf65121f07e098694
          >
            <div className="flex items-center gap-3">
              {/* Image upload input */}
              <motion.input
                type="file"
                multiple
                ref={imageInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                title="Select up to 5 images"
              />

              {/* Video upload input */}
              <motion.input
                type="file"
                ref={videoInputRef}
                className="hidden"
                accept="video/*"
                onChange={handleVideoUpload}
                title="Select 1 video file (max 100MB)"
              />

              {/* Image upload button */}
              <motion.button
                onClick={() => imageInputRef.current?.click()}
                disabled={isUploading}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isUploading
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:bg-orange-100"
                }`}
                whileHover={isUploading ? {} : { scale: 1.05 }}
                whileTap={isUploading ? {} : { scale: 0.95 }}
                title={
                  isUploading ? "Upload in progress..." : "Send images (max 5)"
                }
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-orange-500" />
                )}
              </motion.button>

              {/* Video upload button */}
              <motion.button
                onClick={() => videoInputRef.current?.click()}
                disabled={isUploading}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isUploading
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:bg-orange-100"
                }`}
                whileHover={isUploading ? {} : { scale: 1.05 }}
                whileTap={isUploading ? {} : { scale: 0.95 }}
                title={
                  isUploading
                    ? "Upload in progress..."
                    : "Send video (max 1, 100MB)"
                }
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                ) : (
                  <Video className="w-5 h-5 text-orange-500" />
                )}
              </motion.button>

              <div className="relative flex w-full ">
                {/* <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (e.target.value.trim() !== "") {
                      setIsVendorTyping(true);
                    } else {
                      setIsVendorTyping(false);
                    }
                  }}
                  placeholder={
                    isUploading
                      ? "Uploading media..."
                      : editingMessageId
                      ? "Edit message..."
                      : "Type your message..."
                  }
                  disabled={isUploading}
                  className={`w-[90%] py-3 pl-4 pr-20 text-sm border rounded-full transition-all duration-200 shadow-sm ${
                    isUploading
                      ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                      : "bg-white border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  }`}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    !isUploading &&
                    (editingMessageId ? handleSaveEdit() : handleSendMessage())
                  }
                />

-> */}

                <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (e.target.value.trim() !== "") {
                      setIsVendorTyping(true);
                    } else {
                      setIsVendorTyping(false);
                    }
                  }}
                  placeholder={
                    editingMessageId
                      ? "Edit message..."
                      : "Type your message..."
                  }
                  className="w-[90%] py-3 pl-4 pr-20 text-sm border rounded-full transition-all duration-200 shadow-sm bg-white border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (editingMessageId ? handleSaveEdit() : handleSendMessage())
                  }
                />
                {/* Emoji Picker Button */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-500 transition-colors duration-200 rounded-full hover:text-orange-500 hover:bg-blue-50"
                  title="Add emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="p-2 text-white transition-colors duration-200 bg-blue-500 rounded-full hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  title="Send message"
                  onClick={
                    editingMessageId ? handleSaveEdit : handleSendMessage
                  }
                >
                  <SendIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {showEmojiPicker && (
              <div className="absolute right-0 mb-2 bg-white border rounded-lg shadow-lg bottom-full">
                <EmojiPicker
                  onEmojiClick={(emojiObject) =>
                    handleEmojiSelect(emojiObject.emoji)
                  }
                  autoFocusSearch={false}
                />
              </div>
            )}
          </motion.div>
        )}
      </div>

      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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

      {mediaGallery.isOpen && mediaGallery.files && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative flex items-center justify-center w-full h-full max-w-5xl max-h-5xl">
            <motion.button
              onClick={handleCloseMediaGallery}
              className="absolute z-10 p-2 text-white bg-gray-800 rounded-full top-4 right-4 hover:bg-gray-700"
            >
              <X className="w-6 h-6" />
            </motion.button>
            {mediaGallery.files.length > 1 && (
              <>
                <motion.button
                  onClick={handlePrevMedia}
                  className="absolute z-10 p-2 text-white bg-gray-800 rounded-full left-4 hover:bg-gray-700"
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
                <motion.button
                  onClick={handleNextMedia}
                  className="absolute z-10 p-2 text-white bg-gray-800 rounded-full right-4 hover:bg-gray-700"
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </>
            )}
            <div className="relative flex items-center justify-center w-full h-full">
              {mediaGallery.files[mediaGallery.startIndex] &&
                (mediaGallery.files[mediaGallery.startIndex].type ===
                "image" ? (
                  <img
                    src={
                      mediaGallery.files[mediaGallery.startIndex].url ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={mediaGallery.files[mediaGallery.startIndex].name}
                    className="object-contain max-w-full max-h-full"
                  />
                ) : mediaGallery.files[mediaGallery.startIndex].type ===
                  "video" ? (
                  <video
                    src={mediaGallery.files[mediaGallery.startIndex].url}
                    controls
                    className="object-contain max-w-full max-h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center text-white">
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
                      className="px-4 py-2 mt-4 text-white bg-orange-500 rounded-md hover:bg-orange-600"
                    >
                      Download
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {pinDurationDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
                  value="168"
                  onChange={() => handleSelectPinDuration(168)}
                  className="mr-2"
                />
                <span>7 Days</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pinDuration"
                  value="720"
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
