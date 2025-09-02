import type React from "react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
  FileText,
  Download,
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
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

// Toast.tsx
export const Toast = ({ message }: { message: string }) => (
  <motion.div
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -50, opacity: 0 }}
    className="fixed z-50 px-4 py-2 text-white bg-green-600 rounded shadow-lg top-4 right-4"
  >
    {message}
  </motion.div>
);

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
  isMe?: boolean;
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

/* ----------  SOCKET HOOK  ---------- */
const SOCKET_URL = "https://mbayy-be.onrender.com/api/v1/vendor/socket";

const useSocket = (token?: string) => {
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;
    socket.current = io(SOCKET_URL, { auth: { token } });
    return () => {
      socket.current?.disconnect();
      socket.current = null;
    };
  }, [token]);
  return socket.current;
};

export default function ChatInterface({ token }: ChatInterfaceProps) {
  const [activeChat, setActiveChat] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
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
  // const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVendorTyping, setIsVendorTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>();

  // Upload state
  const [isUploading, setIsUploading] = useState(false);

  const user = useSelector((state: any) => state.vendor);

  // API Queries
  const { data: apiChats = [] } = useChats(user.token);
  const { data: apiMessagesResponse = null } = useMessages(activeChat);
  const queryClient = useQueryClient();
  const socket = useSocket(user.token);

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
    if (!apiChats.length) return;
    const mapped = apiChats.map((apiChat: any) => {
      const participant =
        apiChat.participants.find(
          (p: any) => p.participantId !== user.vendor._id
        ) || apiChat.participants[0];
      return {
        _id: apiChat._id,
        name:
          participant?.details?.storeName ||
          participant?.details?.name ||
          "Unknown",
        storeName: participant?.details?.storeName,
        avatar:
          participant?.details?.avatar || participant?.details?.businessLogo,
        lastMessage: apiChat.lastMessage?.content || "No messages yet",
        timestamp: apiChat?.updatedAt,
        isVendor: participant?.model === "vendors",
        isOnline: participant?.isOnline || false,
        messages: [],
        pinnedMessages: [],
      };
    });
    setChats(mapped);
  }, [apiChats, user.vendor._id]);

  /* ----------  REAL-TIME SOCKET  ---------- */
  useEffect(() => {
    if (!activeChat || !socket) return;

    socket.emit("joinChat", activeChat);

    socket.on("newMessage", (msg) => {
      queryClient.setQueryData(["messages", activeChat], (old: any) => ({
        ...old,
        messages: [...(old?.messages || []), msg],
      }));
    });

    socket.on("messageEdited", (updated) => {
      queryClient.setQueryData(["messages", activeChat], (old: any) => ({
        ...old,
        messages: (old?.messages || []).map((m: any) =>
          m._id === updated._id ? updated : m
        ),
      }));
    });

    socket.on("messageDeleted", ({ messageId }) => {
      queryClient.setQueryData(["messages", activeChat], (old: any) => ({
        ...old,
        messages: (old?.messages || []).filter((m: any) => m._id !== messageId),
      }));
    });

    socket.on("typing", ({ sender }) => setIsVendorTyping(sender !== "You"));
    socket.on("stopTyping", () => setIsVendorTyping(false));

    return () => {
      socket.emit("leaveChat", activeChat);
      socket.off("newMessage");
      socket.off("messageEdited");
      socket.off("messageDeleted");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [activeChat, socket, queryClient]);

  /* ----------  ACTIVE MESSAGES  ---------- */
  const activeMessages = useMemo(() => {
    if (!activeChat) return [];
    return apiMessages
      .map((msg: any) => {
        const isMe = msg.sender?._id === user.vendor._id;
        return {
          _id: msg._id,
          content: msg.content,
          sender:
            msg.sender?._id === user.vendor._id
              ? "You"
              : msg.sender?.storeName ||
                msg.sender?.details?.storeName ||
                "Unknown",
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe,
          files: [
            ...(msg.images || []).map((url: string) => ({
              type: "image" as const,
              url,
              name: url.split("/").pop() || "image",
              size: 0,
            })),
            ...(msg.video
              ? [
                  {
                    type: "video" as const,
                    url: msg.video,
                    name: msg.video.split("/").pop() || "video",
                    size: 0,
                    duration: "",
                  },
                ]
              : []),
          ],
          replyTo: msg.replyTo,
          isEdited: msg.isEdited || false,
          deletedFor: msg.deletedFor || "none",
        };
      })
      .filter((m: any) => m.deletedFor === "none");
  }, [apiMessages, activeChat, user.vendor._id]);

  const activeChatDetails = chats.find((chat) => chat._id === activeChat);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !activeChat) return;
    const authToken = user.token || token;
    if (!authToken) return showFeedback("Authentication required");

    if (files.length > 5) {
      showFeedback("Maximum 5 images allowed");
      return;
    }
    const invalid = Array.from(files).filter(
      (f) => !f.type.startsWith("image/")
    );
    if (invalid.length) {
      showFeedback("Please select only image files");
      return;
    }

    try {
      setIsUploading(true);
      const res = await sendMediaMessageMutation.mutateAsync({
        chatId: activeChat,
        files: { images: Array.from(files) },
        token: authToken,
        content: message.trim() || undefined,
        replyTo: replyingTo || undefined,
      });

      // broadcast to socket so sidebar + main pane update instantly
      socket?.emit("newMessage", {
        chatId: activeChat,
        ...res, // server message object
      });

      if (imageInputRef.current) imageInputRef.current.value = "";
      setMessage("");
      setReplyingTo(null);
      showFeedback("Images uploaded");
    } catch (err: any) {
      showFeedback(err.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !activeChat) return;
    const authToken = user.token || token;
    if (!authToken) return showFeedback("Authentication required");

    const videoFile = files[0];
    if (!videoFile.type.startsWith("video/")) {
      showFeedback("Please select only video files");
      return;
    }
    if (videoFile.size > 100 * 1024 * 1024) {
      showFeedback("Video must be < 100 MB");
      return;
    }

    try {
      setIsUploading(true);
      const res = await sendMediaMessageMutation.mutateAsync({
        chatId: activeChat,
        files: { video: videoFile },
        token: authToken,
        content: message.trim() || undefined,
        replyTo: replyingTo || undefined,
      });

      socket?.emit("newMessage", {
        chatId: activeChat,
        ...res,
      });

      if (videoInputRef.current) videoInputRef.current.value = "";
      setMessage("");
      setReplyingTo(null);
      showFeedback("Video uploaded");
    } catch (err: any) {
      showFeedback(err.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "images" | "video" | "documents"
  ) => {
    const files = e.target.files;
    if (!files || !activeChat) return;
    const authToken = user.token || token;
    const filesArray = Array.from(files);
    const payload = {
      chatId: activeChat,
      files: { [type]: type === "images" ? filesArray : filesArray[0] },
      token: authToken,
      content: message.trim() || undefined,
      replyTo: replyingTo || undefined,
    };
    try {
      setIsUploading(true);
      const res = await sendMediaMessageMutation.mutateAsync(payload);
      socket?.emit("newMessage", { chatId: activeChat, ...res });
      setMessage("");
      setReplyingTo(null);
    } catch (err: any) {
      showFeedback(err?.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // Remove the old handleFileUpload function since it's not needed
  // Your backend doesn't seem to support general file uploads, only images and videos

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  const [optimisticMsgs, setOptimisticMsgs] = useState<Message[]>([]);

  // merge real + optimistic
  const visibleMessages = useMemo(
    () => [...optimisticMsgs, ...activeMessages],
    [optimisticMsgs, activeMessages]
  );

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat) return;
    const tempId = Date.now().toString(); // fake id
    const optimisticMsg: Message = {
      _id: tempId,
      content: message.trim(),
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
      isVendor: true,
      files: [],
      isEdited: false,
      deletedFor: "none",
    };

    setOptimisticMsgs((prev) => [...prev, optimisticMsg]);
    setMessage(""); // clear input immediately

    try {
      const res = await sendMessageMutation.mutateAsync({
        chatId: activeChat,
        content: message.trim(),
        token: user.token,
        replyTo: replyingTo || undefined,
      });

      // replace optimistic with real server message
      setOptimisticMsgs((prev) =>
        prev.map((m) =>
          m._id === tempId
            ? { ...res.data, isMe: true } // 👈 use res.data
            : m
        )
      );
      socket?.emit("newMessage", { chatId: activeChat, ...res });
    } catch {
      // remove on error
      setOptimisticMsgs((prev) => prev.filter((m) => m._id !== tempId));
    } finally {
      setReplyingTo(null);
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
      socket?.emit("messageDeleted", {
        chatId: activeChat,
        messageId: deleteDialog.messageId,
      });
      setDeleteDialog({ isOpen: false, messageId: null });
      showFeedback("Message deleted");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, messageId: null });
  };

  const handleTyping = () => {
    if (!socket || !activeChat) return;
    socket.emit("typing", { chatId: activeChat, sender: "You" });
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        socket.emit("stopTyping", { chatId: activeChat });
      }, 1000)
    );
  };
  const messageInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (messageId: string) => {
    const target = activeMessages.find((m: any) => m._id === messageId);
    if (!target) return;
    setEditingMessageId(messageId);
    setMessage(target.content);
    setReplyingTo(null); // cancel any active reply
    setTimeout(() => messageInputRef.current?.focus(), 0);
  };

  const handleSaveEdit = async () => {
    if (!editingMessageId || !message.trim()) return;

    try {
      const res = await editMessageMutation.mutateAsync({
        messageId: editingMessageId,
        content: message.trim(),
        token: user.token,
      });
      socket?.emit("messageEdited", { chatId: activeChat, ...res });
    } catch (e: any) {
      showFeedback(e?.response?.data?.message || "Edit failed");
    } finally {
      setEditingMessageId(null);
      setMessage("");
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setMessage("");
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

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
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

  const FilePreview = ({
    file,
  }: {
    file: NonNullable<Message["files"]>[0];
  }) => {
    // treat PDF/DOC as "document" type for display only
    const displayType =
      /(pdf|msword|text\/plain)/i.test(file.name) &&
      !file.type.startsWith("image") &&
      !file.type.startsWith("video")
        ? "document"
        : file.type;

    switch (displayType) {
      case "image":
        return (
          <img
            src={file.url}
            alt={file.name}
            className="object-cover w-full h-full rounded-lg"
          />
        );
      case "video":
        return (
          <div className="relative w-full h-full">
            <video
              src={file.url}
              className="object-cover w-full h-full rounded-lg"
            />
            <Play className="absolute inset-0 w-8 h-8 m-auto text-white" />
          </div>
        );
      default: // document
        return (
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2 text-center transition bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <FileText className="w-8 h-8 mb-1 text-gray-600" />
            <span className="max-w-full text-xs font-medium truncate">
              {file.name}
            </span>
            <span className="text-xs text-gray-500">
              {formatFileSize(file.size)}
            </span>
            <Download className="w-4 h-4 mt-1 text-gray-500" />
          </a>
        );
    }
  };

  const TypingDot = () => (
    <span className="flex items-center gap-1 text-xs text-gray-500">
      <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />{" "}
      typing…
    </span>
  );

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
            className="flex items-center flex-shrink-0 gap-4 p-4 border-b shadow-sm bg-gradient-to-r from-white to-gray-50"
          >
            <img
              src={activeChatDetails.avatar || "/placeholder.svg"}
              alt={activeChatDetails.name}
              className="object-cover w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  {activeChatDetails.name}
                </h2>
                {isVendorTyping && <TypingDot />}
              </div>
              <span className="text-xs text-gray-500">
                {activeChatDetails.isVendor ? "Vendor" : "User"}
              </span>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FaFacebookMessenger size={80} className="text-orange-500" />
            <h2 className="mt-4 text-2xl">No Messages Yet</h2>
            <p className="mt-2">Start a conversation</p>
          </div>
        )}

        {activeChatDetails && activeChatDetails.pinnedMessages.length > 0 && (
          <div className="flex flex-col flex-shrink-0 p-3 border-b border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <Pin className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                Pinned Messages
              </span>
            </div>
            {activeChatDetails.pinnedMessages.map((pinnedMsg) => {
              const originalMessage = activeMessages.find(
                (msg: any) => msg._id === pinnedMsg.messageId
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

        {feedbackMessage && <Toast message={feedbackMessage} />}

        {activeChatDetails && (
          <div
            key={activeChat}
            className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <AnimatePresence>
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
                visibleMessages
                  .filter((msg: any) => msg.deletedFor === "none")
                  .map((msg: any, index: number) => (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-3 mb-4 ${
                        msg.isMe ? "justify-end" : ""
                      }`}
                    >
                      {/* THEIR avatar (left) */}
                      {!msg.isMe && activeChatDetails && (
                        <img
                          src={activeChatDetails.avatar || "/placeholder.svg"}
                          alt={msg.sender}
                          className="self-end object-cover w-8 h-8 rounded-full"
                          loading="lazy"
                        />
                      )}

                      {/* MESSAGE BLOCK */}
                      <div
                        className={`max-w-[70%] ${
                          msg.isMe ? "order-1" : "order-2"
                        }`}
                      >
                        {/* QUOTED REPLY */}
                        {msg.replyTo && (
                          <div className="p-2 mb-1 text-sm text-gray-600 bg-gray-100 border-l-4 border-orange-500 rounded-t-lg">
                            <div className="flex items-center gap-1 mb-1 text-xs text-orange-600">
                              <Reply className="w-3 h-3" />
                              Replying to:
                            </div>
                            {(
                              activeMessages.find(
                                (m: any) => m._id === msg.replyTo
                              ) as any
                            )?.content?.slice(0, 50)}
                            …
                          </div>
                        )}

                        {/* BUBBLE */}
                        <div
                          className={`p-3 rounded-lg shadow-sm ${
                            msg.isMe
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                              : "bg-white border border-gray-200"
                          }`}
                        >
                          {msg.files && msg.files.length > 0 && (
                            <div className="flex flex-col gap-2 mt-2">
                              {msg.files.map((file: any, i: number) => (
                                <div
                                  key={i}
                                  className="relative overflow-hidden rounded-lg cursor-pointer group"
                                  onClick={() =>
                                    handleOpenMediaGallery(msg.files, i)
                                  }
                                >
                                  <FilePreview file={file} />
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-black/30 group-hover:opacity-100">
                                    <Download className="w-6 h-6 text-white" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <p className="whitespace-pre-line">{msg.content}</p>
                        </div>

                        {/* META + ACTIONS */}
                        <div
                          className={`flex items-center gap-1 mt-2 text-xs ${
                            msg.isMe ? "justify-end" : "justify-start"
                          } ${msg.isMe ? "text-orange-200" : "text-gray-500"}`}
                        >
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-1 h-1 rounded-full ${
                                msg.isMe ? "bg-orange-300" : "bg-gray-400"
                              }`}
                            />
                            {msg.timestamp}
                          </div>
                          {msg.isEdited && (
                            <span
                              className={`ml-1 ${
                                msg.isMe ? "text-orange-200" : "text-gray-400"
                              }`}
                            >
                              (edited)
                            </span>
                          )}

                          {/* ACTION BUTTONS */}
                          <div className="flex gap-1 ml-2">
                            <button
                              onClick={() => handleReply(msg._id)}
                              className="relative p-1 transition-colors rounded-full group hover:bg-white/10"
                            >
                              <Reply className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCopyText(msg.content)}
                              className="relative group"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            {msg.isMe && (
                              <>
                                <button
                                  onClick={() => handleEdit(msg._id)}
                                  className="relative group"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(msg._id)}
                                  className="relative group"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handlePinClick(msg._id)}
                              className="relative group"
                            >
                              <Pin className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* MY avatar (right) */}
                      {msg.isMe && (
                        <img
                          src={user.vendor.avatar || "/placeholder.svg"}
                          alt="You"
                          className="self-end object-cover w-8 h-8 rounded-full"
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
          <div className="flex items-center justify-between flex-shrink-0 p-3 border-t border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100">
            <div className="flex items-center gap-2">
              <Reply className="w-4 h-4 text-orange-600" />
              <p className="text-sm font-medium text-orange-800">
                Replying to:{" "}
                <span className="text-orange-600">
                  {activeMessages
                    .find((m: any) => m._id === replyingTo)
                    ?.content?.slice(0, 50)}
                  ...
                </span>
              </p>
            </div>
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
            className="relative flex-shrink-0 p-4 border-t shadow-lg bg-gradient-to-r from-gray-50 to-white"
          >
            <div className="flex items-center gap-3">
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "images")}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "video")}
              />
              <input
                ref={docInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "documents")}
              />
              <button onClick={() => imageInputRef.current?.click()}>
                <ImageIcon className="w-5 h-5 text-orange-500" />
              </button>
              <button onClick={() => videoInputRef.current?.click()}>
                <Video className="w-5 h-5 text-orange-500" />
              </button>
              <button onClick={() => docInputRef.current?.click()}>
                <FileText className="w-5 h-5 text-orange-500" />
              </button>

              <div className="relative flex w-full ">
                <input
                  ref={messageInputRef}
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      editingMessageId ? handleSaveEdit() : handleSendMessage();
                    }
                    if (e.key === "Escape") {
                      e.preventDefault();
                      handleCancelEdit();
                    }
                  }}
                  placeholder={
                    editingMessageId ? "Editing message…" : "Type your message…"
                  }
                  className="flex-1 px-4 py-2 border rounded-full"
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

                <button
                  onClick={
                    editingMessageId ? handleSaveEdit : handleSendMessage
                  }
                  className="p-2 text-orange-500 rounded-full hover:bg-orange-100"
                >
                  {editingMessageId ? (
                    <Save className="w-5 h-5" />
                  ) : (
                    <SendIcon className="w-5 h-5" />
                  )}
                </button>

                {editingMessageId && (
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 text-gray-500 rounded-full hover:bg-gray-200"
                    title="Cancel edit"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
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
              {mediaGallery.files?.[mediaGallery.startIndex] &&
                (mediaGallery.files?.[mediaGallery.startIndex].type ===
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
