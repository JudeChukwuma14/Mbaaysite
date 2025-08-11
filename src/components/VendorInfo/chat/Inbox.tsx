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
  isVendor: boolean;
  isOnline: boolean;
  messages: Message[];
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
  const [isVendorTyping, setIsVendorTyping] = useState(false);

  const user = useSelector((state: any) => state.vendor);

  // API Queries
  const { data: apiChats = [], refetch: refetchChats } = useChats(user.token);
  const { data: apiMessages = [], refetch: refetchMessages } = useMessages(
    activeChat,
    token
  );
  const createOrGetChatMutation = useCreateOrGetChat();
  const sendMessageMutation = useSendMessage();
  const editMessageMutation = useEditMessage();
  const deleteMessageMutation = useDeleteMessage();
  const sendMediaMessageMutation = useSendMediaMessage();

  // Sync API data with local state
  useEffect(() => {
    if (apiChats.length > 0) {
      setChats((prevChats) => {
        const updatedChats = apiChats.map((apiChat: any) => {
          const existingChat = prevChats.find((c) => c._id === apiChat._id);
          return {
            _id: apiChat._id,
            name: apiChat.receiver?.name,
            storeName: apiChat.receiver?.storeName,
            avatar: apiChat.receiver?.avatar,
            lastMessage: apiChat.lastMessage?.content || "No messages yet",
            timestamp: apiChat?.updatedAt,
            isVendor: apiChat.receiver?.isVendor,
            isOnline: apiChat.receiver?.isOnline,
            messages: existingChat?.messages || [],
            pinnedMessages: existingChat?.pinnedMessages || [],
          };
        });
        return updatedChats;
      });
    }
  }, [apiChats]);

  useEffect(() => {
    if (activeChat && apiMessages.length > 0) {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === activeChat
            ? {
                ...chat,
                messages: apiMessages.map((msg: any) => ({
                  _id: msg._id,
                  content: msg.content,
                  sender:
                    msg.sender._id === "current-user-id"
                      ? "You"
                      : msg.sender?.name,
                  timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  isVendor: msg.sender.isVendor,
                  files: msg.files?.map((file: any) => ({
                    type: file.type,
                    url: file.url,
                    name: file?.name,
                    size: file.size,
                    duration: file.duration,
                  })),
                  replyTo: msg.replyTo,
                  isEdited: msg.isEdited,
                  deletedFor: msg.deletedFor || "none",
                })),
              }
            : chat
        )
      );
    }
  }, [apiMessages, activeChat]);

  const activeChatDetails = chats.find((chat) => chat._id === activeChat);
  const activeMessages = activeChatDetails?.messages || [];

  useEffect(() => {
    scrollToBottom();
  }, [chats, activeChat, activeMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFilesUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video" | "document"
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      await sendMediaMessageMutation.mutateAsync({
        chatId: activeChat,
        formData,
        token,
      });
      setReplyingTo(null);
      showFeedback("Files uploaded successfully");
    } catch (error) {
      showFeedback("Failed to upload files");
      console.error("Error uploading files:", error);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  const handleSendMessage = () => {
    if (message.trim() && activeChat) {
      sendMessageMutation.mutate({
        chatId: activeChat,
        content: message,
        token: user.token, // Changed from user?.token to token
        replyTo: replyingTo || undefined,
      });

      setMessage("");
      setReplyingTo(null);
      setShowEmojiPicker(false);
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

  const handleStartNewChat = async (user: UserOrVendor) => {
    try {
      const result = await createOrGetChatMutation.mutateAsync({
        receiverId: user._id,
        token,
      });
      setActiveChat(result._id);
      refetchChats();
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
            className="flex items-center flex-shrink-0 gap-3 p-4 bg-white border-b"
          >
            <div className="relative">
              <img
                src={activeChatDetails.avatar || "/placeholder.svg"}
                alt={activeChatDetails?.name}
                className="w-10 h-10 rounded-full"
              />
              {activeChatDetails.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <h2 className="font-semibold">{activeChatDetails?.name}</h2>
              <span className="text-xs text-green-500">
                {isVendorTyping && activeChatDetails.isVendor ? (
                  <span className="text-orange-500">Typing...</span>
                ) : activeChatDetails.isOnline ? (
                  "Online"
                ) : (
                  "Offline"
                )}
              </span>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <FaFacebookMessenger size={60} className="text-orange-500" />
            <p className="text-lg font-semibold">No Messages Yet</p>
            <p className="text-sm">You have no chats at the moment.</p>
            <p className="text-sm">
              New messages from customers and vendors will appear here.
            </p>
          </div>
        )}

        {activeChatDetails && activeChatDetails.pinnedMessages.length > 0 && (
          <div className="flex flex-col flex-shrink-0 p-2 bg-orange-100">
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

        {feedbackMessage && (
          <div className="flex-shrink-0 p-2 text-center text-green-800 bg-green-100">
            {feedbackMessage}
          </div>
        )}

        {activeChatDetails && (
          <div className="flex-1 p-4 overflow-y-auto">
            <AnimatePresence>
              {activeMessages
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
                            .find((m) => m._id === msg.replyTo)
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
                                      alt={file?.name}
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
                            onClick={() => handleReply(msg._id)}
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

        {activeChatDetails && replyingTo && (
          <div className="flex items-center justify-between flex-shrink-0 p-2 bg-gray-100">
            <p className="text-sm text-gray-600">
              Replying to:{" "}
              {activeMessages
                .find((m) => m._id === replyingTo)
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

        {activeChatDetails && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative flex-shrink-0 p-4 bg-white border-t"
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
