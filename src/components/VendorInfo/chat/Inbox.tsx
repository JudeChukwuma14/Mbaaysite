import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebookMessenger } from "react-icons/fa";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import EmojiPicker from "emoji-picker-react";
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
  Clock,
  CheckCircle2,
} from "lucide-react";
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

// Constants
const SOCKET_URL = "https://mbayy-be.onrender.com";

// Types
interface FileAttachment {
  type: "image" | "document" | "video";
  url: string;
  name: string;
  size: number;
  duration?: string;
}

type Status = "pending" | "delivered" | "read";

interface Message {
  _id: string;
  content: string;
  sender: string;
  timestamp: string;
  isVendor: boolean;
  files?: FileAttachment[];
  replyTo?: string;
  isPinned?: boolean;
  isEdited?: boolean;
  deletedFor?: "none" | "me" | "everyone";
  isOptimistic?: boolean;
  isMe?: boolean;
  tempId?: string;
  status: Status;
}

interface ChatParticipant {
  participantId: string;
  model: string;
  details?: {
    storeName?: string;
    name?: string;
    avatar?: string;
    businessLogo?: string;
  };
  isOnline?: boolean;
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
  participants?: ChatParticipant[];
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
  files: FileAttachment[] | null;
  startIndex: number;
}

interface PinDurationDialogState {
  isOpen: boolean;
  messageId: string | null;
}

interface ChatInterfaceProps {
  token: string | null;
}

// Custom hooks
const useSocket = (token?: string) => {
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    socket.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    return () => {
      socket.current?.disconnect();
      socket.current = null;
    };
  }, [token]);

  return socket.current;
};

const useFeedback = () => {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = useCallback((msg: string) => {
    setFeedbackMessage(msg);
    const timer = setTimeout(() => setFeedbackMessage(null), 3000);
    return () => clearTimeout(timer);
  }, []);

  return { feedbackMessage, showFeedback };
};

const useTyping = (socket: Socket | null, chatId: string) => {
  const [typing, setTyping] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!socket || !chatId) return;

    const onTyping = ({ sender }: { sender: string }) =>
      setTyping((t) => ({ ...t, [sender]: true }));

    const onStopTyping = ({ sender }: { sender: string }) =>
      setTyping((t) => ({ ...t, [sender]: false }));

    socket.on("typing", onTyping);
    socket.on("stopTyping", onStopTyping);

    return () => {
      socket.off("typing", onTyping);
      socket.off("stopTyping", onStopTyping);
    };
  }, [socket, chatId]);

  return (participantId: string) => !!typing[participantId];
};

const useChatData = (user: any) => {
  const [activeChat, setActiveChat] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const { data: apiChats = [] } = useChats(user.token);

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
        participants: apiChat.participants,
      };
    });

    setChats(mapped);
  }, [apiChats, user.vendor._id]);

  return { activeChat, setActiveChat, chats, setChats };
};

// Utility functions
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(1)} GB`;
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Components
const Toast = React.memo(({ message }: { message: string }) => (
  <motion.div
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -50, opacity: 0 }}
    className="fixed z-50 px-4 py-2 text-white bg-green-600 rounded shadow-lg top-4 right-4"
  >
    {message}
  </motion.div>
));

const TypingIndicator = React.memo(() => (
  <span className="flex items-center gap-1 text-xs text-gray-500">
    <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
    typing…
  </span>
));

const FilePreview = React.memo(({ file }: { file: FileAttachment }) => {
  const displayType =
    /(pdf|msword|text\/plain)/i.test(file.name) &&
    !file.type.startsWith("image") &&
    !file.type.startsWith("video")
      ? "document"
      : file.type;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {displayType === "image" ? (
        <img
          src={file.url}
          alt={file.name}
          className="object-cover w-full h-full"
          loading="lazy"
        />
      ) : displayType === "video" ? (
        <>
          <video src={file.url} className="object-cover w-full h-full" />
          <Play className="absolute inset-0 w-8 h-8 m-auto text-white" />
        </>
      ) : (
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-2 text-center transition bg-gray-100 hover:bg-gray-200"
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
      )}
    </div>
  );
});

// Extracted Components
const PinnedMessagesSection = React.memo(
  ({
    pinnedMessages,
    activeMessages,
    onUnpin,
  }: {
    pinnedMessages: Chat["pinnedMessages"];
    activeMessages: Message[];
    onUnpin: (messageId: string) => void;
  }) => {
    return (
      <div className="flex flex-col flex-shrink-0 p-3 border-b border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="flex items-center gap-2 mb-2">
          <Pin className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-800">
            Pinned Messages
          </span>
        </div>
        {pinnedMessages.map((pinnedMsg) => {
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
                    {daysLeft > 0 ? `${daysLeft}d left` : `${hoursLeft}h left`}
                  </span>
                )}
              </div>
              <motion.button
                onClick={() => onUnpin(pinnedMsg.messageId)}
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
    );
  }
);

const EmptyState = React.memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-12 text-center text-gray-500"
  >
    <div className="p-6 mb-4 bg-white rounded-full shadow-lg">
      <FaFacebookMessenger size={40} className="text-gray-300" />
    </div>
    <p className="text-lg font-semibold text-gray-400">No messages yet</p>
    <p className="text-sm text-gray-400">Start the conversation!</p>
  </motion.div>
));

const MessageItem = React.memo(
  ({
    message: msg,
    activeChatDetails,
    user,
    onReply,
    onCopy,
    onEdit,
    onDelete,
    onPin,
    onOpenMedia,
  }: {
    message: Message;
    activeChatDetails: Chat;
    user: any;
    onReply: (messageId: string) => void;
    onCopy: (text: string) => void;
    onEdit: (messageId: string) => void;
    onDelete: (messageId: string) => void;
    onPin: (messageId: string) => void;
    onOpenMedia: (files: FileAttachment[], index: number) => void;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex gap-3 mb-4 ${msg.isMe ? "justify-end" : ""}`}
    >
      {!msg.isMe && activeChatDetails && (
        <img
          src={activeChatDetails.avatar || "/placeholder.svg"}
          alt={msg.sender}
          className="self-end object-cover w-8 h-8 rounded-full"
          loading="lazy"
        />
      )}

      <div className={`max-w-[70%] ${msg.isMe ? "order-1" : "order-2"}`}>
        <div
          className={`p-3 rounded-lg shadow-sm ${
            msg.isMe
              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
              : "bg-white border border-gray-200"
          }`}
        >
          {msg.files && msg.files.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              {msg.files.map((file, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-lg cursor-pointer group"
                  onClick={() => onOpenMedia(msg.files!, i)}
                >
                  <FilePreview file={file} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-black/30 group-hover:opacity-100">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}
          <p>{msg.content}</p>
          <div className="flex items-center gap-1 mt-1 text-xs">
            <span>{msg.timestamp}</span>
            {msg.status === "pending" && (
              <Clock size={12} className="animate-spin" />
            )}
            {msg.status === "delivered" && <CheckCircle2 size={12} />}
          </div>
        </div>

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

          <div className="flex gap-1 ml-2">
            <button
              onClick={() => onReply(msg._id)}
              className="relative p-1 transition-colors rounded-full group hover:bg-white/10"
            >
              <Reply className="w-4 h-4" />
            </button>
            <button
              onClick={() => onCopy(msg.content)}
              className="relative group"
            >
              <Copy className="w-4 h-4" />
            </button>
            {msg.isMe && (
              <>
                <button
                  onClick={() => onEdit(msg._id)}
                  className="relative group"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(msg._id)}
                  className="relative group"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </>
            )}
            <button onClick={() => onPin(msg._id)} className="relative group">
              <Pin className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {msg.isMe && (
        <img
          src={user.vendor.avatar || "/placeholder.svg"}
          alt="You"
          className="self-end object-cover w-8 h-8 rounded-full"
          loading="lazy"
        />
      )}
    </motion.div>
  )
);

const MessageList = React.memo(
  ({
    messages,
    activeChatDetails,
    user,
    onReply,
    onCopy,
    onEdit,
    onDelete,
    onPin,
    onOpenMedia,
  }: {
    messages: Message[];
    activeChatDetails: Chat;
    user: any;
    onReply: (messageId: string) => void;
    onCopy: (text: string) => void;
    onEdit: (messageId: string) => void;
    onDelete: (messageId: string) => void;
    onPin: (messageId: string) => void;
    onOpenMedia: (files: FileAttachment[], index: number) => void;
  }) => (
    <>
      {messages
        .filter((msg: any) => msg.deletedFor === "none")
        .map((msg: any, index: number) => (
          <MessageItem
            key={msg._id}
            message={msg}
            activeChatDetails={activeChatDetails}
            user={user}
            onReply={onReply}
            onCopy={onCopy}
            onEdit={onEdit}
            onDelete={onDelete}
            onPin={onPin}
            onOpenMedia={onOpenMedia}
          />
        ))}
    </>
  )
);

const ReplyPreview = React.memo(
  ({
    replyingTo,
    activeMessages,
    onCancel,
    isInline = false,
  }: {
    replyingTo: string;
    activeMessages: Message[];
    onCancel?: () => void;
    isInline?: boolean;
  }) => {
    const replyMessage = activeMessages.find((m: any) => m._id === replyingTo);
    if (!replyMessage) return null;

    return isInline ? (
      <div className="p-2 mb-1 text-sm text-gray-600 bg-gray-100 border-l-4 border-orange-500 rounded-t-lg">
        <div className="flex items-center gap-1 mb-1 text-xs text-orange-600">
          <Reply className="w-3 h-3" />
          Replying to:
        </div>
        {replyMessage.content?.slice(0, 50)}…
      </div>
    ) : (
      <div className="flex items-center justify-between flex-shrink-0 p-3 border-t border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="flex items-center gap-2">
          <Reply className="w-4 h-4 text-orange-600" />
          <p className="text-sm font-medium text-orange-800">
            Replying to:{" "}
            <span className="text-orange-600">
              {replyMessage.content?.slice(0, 50)}...
            </span>
          </p>
        </div>
        {onCancel && (
          <motion.button
            onClick={onCancel}
            className="p-1 text-orange-500 transition-colors rounded-full hover:text-orange-700 hover:bg-orange-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    );
  }
);

const MessageInput = React.memo(
  ({
    message,
    editingMessageId,
    showEmojiPicker,
    isUploading,
    inputRef,
    imageInputRef,
    videoInputRef,
    docInputRef,
    onChange,
    onKeyDown,
    onEmojiSelect,
    onToggleEmojiPicker,
    onFileUpload,
    onSaveEdit,
    onSend,
    onCancelEdit,
  }: {
    message: string;
    editingMessageId: string | null;
    showEmojiPicker: boolean;
    isUploading: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
    imageInputRef: React.RefObject<HTMLInputElement>;
    videoInputRef: React.RefObject<HTMLInputElement>;
    docInputRef: React.RefObject<HTMLInputElement>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onEmojiSelect: (emoji: string) => void;
    onToggleEmojiPicker: () => void;
    onFileUpload: (
      e: React.ChangeEvent<HTMLInputElement>,
      type: "images" | "video" | "documents"
    ) => void;
    onSaveEdit: () => void;
    onSend: () => void;
    onCancelEdit: () => void;
  }) => (
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
          onChange={(e) => onFileUpload(e, "images")}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => onFileUpload(e, "video")}
        />
        <input
          ref={docInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={(e) => onFileUpload(e, "documents")}
        />
        <button
          onClick={() => imageInputRef.current?.click()}
          disabled={isUploading}
        >
          <ImageIcon className="w-5 h-5 text-orange-500" />
        </button>
        <button
          onClick={() => videoInputRef.current?.click()}
          disabled={isUploading}
        >
          <Video className="w-5 h-5 text-orange-500" />
        </button>
        <button
          onClick={() => docInputRef.current?.click()}
          disabled={isUploading}
        >
          <FileText className="w-5 h-5 text-orange-500" />
        </button>

        <div className="relative flex w-full">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={
              editingMessageId ? "Editing message…" : "Type your message…"
            }
            className="flex-1 px-4 py-2 border rounded-full"
            disabled={isUploading}
          />

          <button
            type="button"
            onClick={onToggleEmojiPicker}
            className="p-2 text-gray-500 transition-colors duration-200 rounded-full hover:text-orange-500 hover:bg-blue-50"
            title="Add emoji"
            disabled={isUploading}
          >
            <Smile className="w-5 h-5" />
          </button>

          <button
            onClick={editingMessageId ? onSaveEdit : onSend}
            className="p-2 text-orange-500 rounded-full hover:bg-orange-100"
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : editingMessageId ? (
              <Save className="w-5 h-5" />
            ) : (
              <SendIcon className="w-5 h-5" />
            )}
          </button>

          {editingMessageId && (
            <button
              onClick={onCancelEdit}
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
            onEmojiClick={({ emoji }) => onEmojiSelect(emoji)}
            autoFocusSearch={false}
          />
        </div>
      )}
    </motion.div>
  )
);

const DeleteDialog = React.memo(
  ({
    isOpen,
    onCancel,
    onConfirm,
  }: {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
  }) =>
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="p-6 bg-white rounded-lg w-96">
          <h3 className="mb-4 text-lg font-semibold">Delete message?</h3>
          <p className="mb-4 text-sm text-gray-600">
            This message will be permanently deleted.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
);

const VideoPlayer = React.memo(
  ({
    isOpen,
    videoUrl,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    videoRef,
    onClose,
    onPlayPause,
    onToggleMute,
    onSave,
    onToggleFullscreen,
  }: {
    isOpen: boolean;
    videoUrl: string | null;
    isPlaying: boolean;
    isMuted: boolean;
    currentTime: number;
    duration: number;
    videoRef: React.RefObject<HTMLVideoElement>;
    onClose: () => void;
    onPlayPause: () => void;
    onToggleMute: () => void;
    onSave: (videoUrl: string) => void;
    onToggleFullscreen: () => void;
  }) =>
    isOpen &&
    videoUrl && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div className="relative w-full max-w-4xl p-4 bg-white rounded-lg aspect-video">
          <div className="absolute z-10 flex items-center gap-2 top-2 right-2">
            <motion.button
              onClick={() => onSave(videoUrl)}
              className="p-2 text-white bg-gray-800 rounded-full hover:bg-gray-700"
            >
              <Save className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={onClose}
              className="p-2 text-white bg-gray-800 rounded-full hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={videoUrl}
              className="object-contain w-full h-full rounded-lg"
              onClick={onPlayPause}
              controls
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={onPlayPause}
                    className="p-2 text-white bg-gray-800 rounded-full hover:bg-gray-700"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={onToggleMute}
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
                    onClick={onToggleFullscreen}
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
    )
);

const MediaGallery = React.memo(
  ({
    isOpen,
    files,
    startIndex,
    onClose,
    onNext,
    onPrev,
  }: {
    isOpen: boolean;
    files: FileAttachment[] | null;
    startIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
  }) =>
    isOpen &&
    files && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
        <div className="relative flex items-center justify-center w-full h-full max-w-5xl max-h-5xl">
          <motion.button
            onClick={onClose}
            className="absolute z-10 p-2 text-white bg-gray-800 rounded-full top-4 right-4 hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </motion.button>
          {files.length > 1 && (
            <>
              <motion.button
                onClick={onPrev}
                className="absolute z-10 p-2 text-white bg-gray-800 rounded-full left-4 hover:bg-gray-700"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              <motion.button
                onClick={onNext}
                className="absolute z-10 p-2 text-white bg-gray-800 rounded-full right-4 hover:bg-gray-700"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </>
          )}
          <div className="relative flex items-center justify-center w-full h-full">
            {files[startIndex]?.type === "image" ? (
              <img
                src={files[startIndex].url || "/placeholder.svg"}
                alt={files[startIndex].name}
                className="object-contain max-w-full max-h-full"
              />
            ) : files[startIndex]?.type === "video" ? (
              <video
                src={files[startIndex].url}
                controls
                className="object-contain max-w-full max-h-full"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center text-white">
                <Paperclip className="w-12 h-12 mb-4" />
                <p className="text-xl font-semibold">
                  {files[startIndex].name}
                </p>
                <p className="text-sm">
                  {formatFileSize(files[startIndex].size)}
                </p>
                <a
                  href={files[startIndex].url}
                  download={files[startIndex].name}
                  className="px-4 py-2 mt-4 text-white bg-orange-500 rounded-md hover:bg-orange-600"
                >
                  Download
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    )
);

const PinDurationDialog = React.memo(
  ({
    isOpen,
    onSelectDuration,
    onClose,
  }: {
    isOpen: boolean;
    onSelectDuration: (durationHours: number) => void;
    onClose: () => void;
  }) =>
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="p-6 bg-white rounded-lg w-96">
          <h3 className="mb-4 text-lg font-semibold">
            Pin message for how long?
          </h3>
          <div className="mb-6 space-y-2">
            {[24, 168, 720].map((hours) => (
              <label key={hours} className="flex items-center">
                <input
                  type="radio"
                  name="pinDuration"
                  value={hours}
                  onChange={() => onSelectDuration(hours)}
                  className="mr-2"
                />
                <span>
                  {hours === 24
                    ? "24 Hours"
                    : hours === 168
                    ? "7 Days"
                    : "30 Days"}
                </span>
              </label>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
);

// Main Component
export default function ChatInterface({ token }: ChatInterfaceProps) {
  const user = useSelector((state: any) => state.vendor);
  const { feedbackMessage, showFeedback } = useFeedback();
  const { activeChat, setActiveChat, chats, setChats } = useChatData(user);
  const { data: apiMessagesResponse = null } = useMessages(activeChat);

  // State
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
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [optimisticMsgs, setOptimisticMsgs] = useState<Message[]>([]);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const currentGalleryIndex = useRef(0);
  const queryClient = useQueryClient();
  const socket = useSocket(user.token);

  // API Queries
  const createOrGetChatMutation = useCreateOrGetChat();
  const sendMessageMutation = useSendMessage();
  const editMessageMutation = useEditMessage();
  const deleteMessageMutation = useDeleteMessage();
  const sendMediaMessageMutation = useSendMediaMessage();

  // Derived state
  const apiMessages = apiMessagesResponse?.messages || [];
  const activeChatDetails = useMemo(
    () => chats.find((chat) => chat._id === activeChat),
    [chats, activeChat]
  );

  const serverMessages = useMemo(
    () =>
      (apiMessages || []).map((m: any) => ({
        _id: m._id,
        content: m.content,
        sender:
          m.sender?._id === user.vendor._id
            ? "You"
            : m.sender?.storeName || "Unknown",
        timestamp: new Date(m.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: m.sender?._id === user.vendor._id,
        status: "delivered" as Status,
      })),
    [apiMessages, user.vendor._id]
  );

  const otherParticipantId = useMemo(() => {
    if (!activeChatDetails) return null;
    return activeChatDetails.participants?.find(
      (p: any) => p.participantId !== user.vendor._id
    )?.participantId;
  }, [activeChatDetails, user.vendor._id]);

  const activeMessages = useMemo(
    () =>
      apiMessages.map((m: any) => ({
        _id: m._id,
        content: m.content,
        sender:
          m.sender?._id === user.vendor._id
            ? "You"
            : m.sender?.storeName || "Unknown",
        timestamp: new Date(m.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: m.sender?._id === user.vendor._id,
        status: "delivered" as Status,
        files: [
          ...(m.images || []).map((url: string) => ({
            type: "image" as const,
            url,
            name: url.split("/").pop() || "image",
            size: 0,
          })),
          ...(m.video
            ? [
                {
                  type: "video" as const,
                  url: m.video,
                  name: m.video.split("/").pop() || "video",
                  size: 0,
                },
              ]
            : []),
        ],
        replyTo: m.replyTo,
        isEdited: m.isEdited || false,
        deletedFor: m.deletedFor || "none",
      })),
    [apiMessages, user.vendor._id]
  );

  const visibleMessages = useMemo(
    () => [...optimisticMsgs, ...activeMessages],
    [optimisticMsgs, activeMessages]
  );

  const isTyping = useTyping(socket, activeChat);
  // const messagesContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages]);

  // useEffect(() => {
  //   if (!activeChat || !socket) return;
  //   socket.emit("joinChat", activeChat);

  //   const editHandler = (updated: any) => {
  //     queryClient.setQueryData(["messages", activeChat], (old: any) => ({
  //       ...old,
  //       messages: (old?.messages || []).map((m: any) =>
  //         m._id === updated._id ? updated : m
  //       ),
  //     }));
  //   };

  //   const deleteHandler = ({ messageId }: { messageId: string }) => {
  //     queryClient.setQueryData(["messages", activeChat], (old: any) => ({
  //       ...old,
  //       messages: (old?.messages || []).filter((m: any) => m._id !== messageId),
  //     }));
  //   };

  //   socket.on("newMessage", (msg) => {
  //     queryClient.setQueryData(["messages", activeChat], (old: any) => ({
  //       ...old,
  //       messages: [...(old?.messages || []), msg],
  //     }));
  //   });
  //   socket.on("messageEdited", editHandler);
  //   socket.on("messageDeleted", deleteHandler);

  //   return () => {
  //     socket.emit("leaveChat", activeChat);
  //     socket.off("newMessage");
  //     socket.off("messageEdited", editHandler);
  //     socket.off("messageDeleted", deleteHandler);
  //   };
  // }, [activeChat, socket, queryClient]);

  /* 1.  server-cache sync (edit / delete / new) */
  useEffect(() => {
    if (!activeChat || !socket) return;
    socket.emit("joinChat", activeChat);
    const onNew = (m: any) =>
      queryClient.setQueryData(["messages", activeChat], (o: any) => ({
        ...o,
        messages: [...(o?.messages || []), m],
      }));
    const onEdit = (u: any) =>
      queryClient.setQueryData(["messages", activeChat], (o: any) => ({
        ...o,
        messages: o?.messages?.map((m: any) => (m._id === u._id ? u : m)),
      }));
    const onDelete = ({ messageId }: { messageId: string }) =>
      queryClient.setQueryData(["messages", activeChat], (o: any) => ({
        ...o,
        messages: o?.messages?.filter((m: any) => m._id !== messageId),
      }));
    socket.on("newMessage", onNew);
    socket.on("messageEdited", onEdit);
    socket.on("messageDeleted", onDelete);

    /* optimistic -> delivered tick */
    const onDelivered = ({ tempId, _id }: { tempId: string; _id: string }) =>
      setOptimisticMsgs((prev) =>
        prev.map((m) =>
          m.tempId === tempId ? { ...m, _id, status: "delivered" } : m
        )
      );
    socket.on("messageDelivered", onDelivered);

    return () => {
      socket.emit("leaveChat", activeChat);
      socket.off("newMessage", onNew);
      socket.off("messageEdited", onEdit);
      socket.off("messageDeleted", onDelete);
      socket.off("messageDelivered", onDelivered);
    };
  }, [activeChat, socket, queryClient]);

  useEffect(() => {
    const interval = setInterval(() => {
      setChats((prevChats: Chat[]) =>
        prevChats.map((chat: Chat) => {
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
  }, [showFeedback]);

  // Handlers
  const handleTyping = useCallback(() => {
    if (!socket || !activeChat) return;
    socket.emit("typing", { chatId: activeChat, sender: user.vendor._id });
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        socket.emit("stopTyping", {
          chatId: activeChat,
          sender: user.vendor._id,
        });
      }, 800)
    );
  }, [socket, activeChat, user.vendor._id, typingTimeout]);

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat) return;
    const tempId = Date.now().toString();
    const opt: Message = {
      tempId,
      _id: tempId,
      content: message.trim(),
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
      status: "pending",
      files: [],
      isVendor: true,
    };
    setOptimisticMsgs((prev) => [...prev, opt]);
    setMessage("");
    setReplyingTo(null);
    try {
      const res = await sendMessageMutation.mutateAsync({
        chatId: activeChat,
        content: message.trim(),
        token: user.token,
        replyTo: replyingTo || undefined,
      });
      socket?.emit("sendMessage", { chatId: activeChat, ...res, tempId });
    } catch {
      setOptimisticMsgs((prev) => prev.filter((m) => m.tempId !== tempId));
    }
  };

  const handleFileUpload = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      type: "images" | "video" | "documents"
    ) => {
      const files = e.target.files;
      if (!files || !activeChat) return;
      const authToken = user.token || token;
      if (!authToken) return;
      try {
        const payload = {
          chatId: activeChat,
          files: { [type]: type === "images" ? Array.from(files) : files[0] },
          token: authToken,
          content: message.trim() || undefined,
          replyTo: replyingTo || undefined,
        };
        await sendMediaMessageMutation.mutateAsync(payload);
        setMessage("");
        setReplyingTo(null);
      } catch {}
    },
    [activeChat, user.token, token, message, replyingTo]
  );

  const handleSaveEdit = useCallback(async () => {
    if (!editingMessageId || !message.trim()) return;
    try {
      const res = await editMessageMutation.mutateAsync({
        messageId: editingMessageId,
        content: message.trim(),
        token: user.token,
      });
      socket?.emit("messageEdited", { chatId: activeChat, ...res });
    } catch {}
    setEditingMessageId(null);
    setMessage("");
  }, [editingMessageId, message, user.token, activeChat, socket]);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteDialog.messageId) return;
    deleteMessageMutation.mutate({
      messageId: deleteDialog.messageId,
      token: user.token,
    });
    socket?.emit("messageDeleted", {
      chatId: activeChat,
      messageId: deleteDialog.messageId,
    });
    setDeleteDialog({ isOpen: false, messageId: null });
  }, [deleteDialog.messageId, user.token, activeChat, socket]);

  const handleEdit = useCallback(
    (messageId: string) => {
      const target = activeMessages.find((m: any) => m._id === messageId);
      if (!target) return;
      setEditingMessageId(messageId);
      setMessage(target.content);
      setReplyingTo(null);
      setTimeout(() => messageInputRef.current?.focus(), 0);
    },
    [activeMessages]
  );

  const handlePinClick = useCallback(
    (messageId: string) => {
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
    },
    [chats, activeChat, showFeedback]
  );

  const handleSelectPinDuration = useCallback(
    (durationHours: number) => {
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
    },
    [pinDurationDialog.messageId, activeChat, showFeedback]
  );

  const handleOpenMediaGallery = useCallback(
    (files: FileAttachment[], startIndex: number) => {
      setMediaGallery({ isOpen: true, files, startIndex });
      currentGalleryIndex.current = startIndex;
    },
    []
  );

  const handleStartNewChat = useCallback(
    async (user: UserOrVendor) => {
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
    },
    [token, showFeedback]
  );

  // Video player handlers
  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleToggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleToggleFullscreen = useCallback(() => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  }, []);

  // Media gallery navigation handlers
  const handleNextMedia = useCallback(() => {
    if (!mediaGallery.files) return;
    setMediaGallery((prev) => ({
      ...prev,
      startIndex:
        prev.files && prev.startIndex < prev.files.length - 1
          ? prev.startIndex + 1
          : 0,
    }));
    currentGalleryIndex.current =
      mediaGallery.files &&
      currentGalleryIndex.current < mediaGallery.files.length - 1
        ? currentGalleryIndex.current + 1
        : 0;
  }, [mediaGallery.files]);

  const handlePrevMedia = useCallback(() => {
    if (!mediaGallery.files) return;
    setMediaGallery((prev) => ({
      ...prev,
      startIndex:
        prev.startIndex > 0
          ? prev.startIndex - 1
          : (prev.files?.length ?? 1) - 1,
    }));
    currentGalleryIndex.current =
      currentGalleryIndex.current > 0
        ? currentGalleryIndex.current - 1
        : mediaGallery.files.length - 1;
  }, [mediaGallery.files]);

  const handleSaveVideo = useCallback(
    (videoUrl: string) => {
      const link = document.createElement("a");
      link.href = videoUrl;
      link.download = "video.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showFeedback("Video saved to device");
    },
    [showFeedback]
  );

  const handleCopyText = useCallback(
    (text: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => showFeedback("Message copied to clipboard"))
        .catch(() => showFeedback("Failed to copy message"));
    },
    [showFeedback]
  );

  // Render
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
              loading="lazy"
            />
            <div className="flex-1">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  {activeChatDetails.name}
                </h2>
                {otherParticipantId && isTyping(otherParticipantId) && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    typing…
                  </span>
                )}
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

        {activeChatDetails &&
          (activeChatDetails.pinnedMessages?.length ?? 0) > 0 && (
            <PinnedMessagesSection
              pinnedMessages={activeChatDetails.pinnedMessages ?? []}
              activeMessages={activeMessages}
              onUnpin={handlePinClick}
            />
          )}

        {feedbackMessage && <Toast message={feedbackMessage} />}

        {activeChatDetails && (
          <div
            key={activeChat}
            className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <AnimatePresence>
              {activeMessages.length === 0 ? (
                <EmptyState />
              ) : (
                <MessageList
                  messages={visibleMessages}
                  activeChatDetails={activeChatDetails}
                  user={user}
                  onReply={setReplyingTo}
                  onCopy={handleCopyText}
                  onEdit={handleEdit}
                  onDelete={(messageId: string) =>
                    setDeleteDialog({ isOpen: true, messageId })
                  }
                  onPin={handlePinClick}
                  onOpenMedia={handleOpenMediaGallery}
                />
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}

        {activeChatDetails && replyingTo && (
          <ReplyPreview
            replyingTo={replyingTo}
            activeMessages={activeMessages}
            onCancel={() => setReplyingTo(null)}
          />
        )}

        {activeChatDetails && (
          <MessageInput
            message={message}
            editingMessageId={editingMessageId}
            showEmojiPicker={showEmojiPicker}
            isUploading={isUploading}
            inputRef={messageInputRef}
            imageInputRef={imageInputRef}
            videoInputRef={videoInputRef}
            docInputRef={docInputRef}
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
                setEditingMessageId(null);
                setMessage("");
              }
            }}
            onEmojiSelect={(emoji) => setMessage((prev) => prev + emoji)}
            onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
            onFileUpload={handleFileUpload}
            onSaveEdit={handleSaveEdit}
            onSend={handleSendMessage}
            onCancelEdit={() => {
              setEditingMessageId(null);
              setMessage("");
            }}
          />
        )}
      </div>

      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        onCancel={() => setDeleteDialog({ isOpen: false, messageId: null })}
        onConfirm={handleDeleteConfirm}
      />

      <VideoPlayer
        isOpen={videoPlayer.isOpen}
        videoUrl={videoPlayer.videoUrl}
        isPlaying={isPlaying}
        isMuted={isMuted}
        currentTime={currentTime}
        duration={duration}
        videoRef={videoRef}
        onClose={() => setVideoPlayer({ isOpen: false, videoUrl: null })}
        onPlayPause={handlePlayPause}
        onToggleMute={handleToggleMute}
        onSave={handleSaveVideo}
        onToggleFullscreen={handleToggleFullscreen}
      />

      <MediaGallery
        isOpen={mediaGallery.isOpen}
        files={mediaGallery.files}
        startIndex={mediaGallery.startIndex}
        onClose={() =>
          setMediaGallery({ isOpen: false, files: null, startIndex: 0 })
        }
        onNext={handleNextMedia}
        onPrev={handlePrevMedia}
      />

      <PinDurationDialog
        isOpen={pinDurationDialog.isOpen}
        onSelectDuration={handleSelectPinDuration}
        onClose={() => setPinDurationDialog({ isOpen: false, messageId: null })}
      />
    </div>
  );
}
