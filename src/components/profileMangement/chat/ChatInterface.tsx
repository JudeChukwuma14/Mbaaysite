import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ChatList from "./ChatList";
import { useIsMobile } from "@/hook/use-mobile";
import ChatHeader from "./ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from "./MessageBubble";
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

interface Chat {
  _id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar?: string;
  online: boolean;
  pinned: boolean;
  isGroup?: boolean;
}

interface Message {
  _id: string;
  content: string;
  time: string;
  sent: boolean;
  type: "text" | "image" | "video" | "file";
  replyTo?: string;
}

const ChatInterface: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [showChatList, setShowChatList] = useState(true);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: RootState) => state.user.user);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  console.log("DEBUG: userRedux:", JSON.stringify(user, null, 2));
  console.log("DEBUG: vendorRedux:", JSON.stringify(vendor, null, 2));

  const currentUserId = user?._id || vendor?._id;
  useEffect(() => {
    if (!currentUserId) {
      console.log(
        "DEBUG: No user or vendor ID found, user must be authenticated"
      );
      setError("Please log in to use chat.");
      toast.error("Please log in to use chat.");
    }
  }, [currentUserId]);

  const scrollToBottom = () => {
    console.log("DEBUG: Scrolling to bottom");
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChats = async () => {
      if (!currentUserId) {
        console.log("DEBUG: Skipping fetchChats, no user or vendor ID");
        return;
      }
      setIsLoadingChats(true);
      setError(null);
      try {
        console.log("DEBUG: Fetching chats...");
        const chatData = await getUserChats();
        console.log("DEBUG: chatData:", JSON.stringify(chatData, null, 2));
        const formattedChats: Chat[] = (chatData.chats || []).map(
          (chat: any) => {
            const otherParticipant = chat.participants.find(
              (p: any) => p.participantId !== currentUserId
            );
            console.log(
              "DEBUG: Other participant for chat",
              chat._id,
              ":",
              JSON.stringify(otherParticipant, null, 2)
            );
            return {
              _id: chat._id,
              name:
                otherParticipant?.details?.storeName ||
                otherParticipant?.details?.name ||
                `User ${otherParticipant?.participantId?.slice(-4) || "Unknown"
                }`,
              lastMessage: chat.lastMessage?.content || "",
              time: new Date(
                chat.lastMessage?.createdAt || chat.createdAt || Date.now()
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              unread: chat.unreadCount || 0,
              avatar:
                otherParticipant?.details?.avatar ||
                otherParticipant?.details?.businessLogo ||
                "",
              online: otherParticipant?.details?.online || false,
              pinned: chat.pinned || false,
              isGroup: chat.isCustomerCareChat || false,
            };
          }
        );
        console.log(
          "DEBUG: Formatted chats:",
          JSON.stringify(formattedChats, null, 2)
        );
        setChats(formattedChats);
        if (!selectedChat && formattedChats.length > 0) {
          console.log(
            "DEBUG: Setting initial selectedChat:",
            formattedChats[0]._id
          );
          setSelectedChat(formattedChats[0]._id);
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
      console.log("DEBUG: Triggering fetchChats with user or vendor present");
      fetchChats();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (selectedChat && currentUserId) {
      const fetchMessages = async () => {
        setIsLoadingMessages(true);
        setError(null);
        try {
          console.log("DEBUG: Fetching messages for chat:", selectedChat);
          const messageData = await getChatMessages(selectedChat);
          console.log(
            "DEBUG: messageData for chat",
            selectedChat,
            ":",
            JSON.stringify(messageData, null, 2)
          );
          const formattedMessages: Message[] = (messageData.messages || []).map(
            (msg: any) => {
              const isSentByCurrentUser = msg.sender?._id === currentUserId;
              console.log(
                "DEBUG: Message sender._id:",
                msg.sender?._id,
                "currentUserId:",
                currentUserId,
                "isSentByCurrentUser:",
                isSentByCurrentUser
              );
              return {
                _id: msg._id,
                content: msg.content || "",
                time: new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                sent: isSentByCurrentUser,
                type: msg.type || "text",
                replyTo: msg.replyTo || undefined,
              };
            }
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
      console.log("DEBUG: No currentUserId, skipping fetchMessages");
      setMessages([]);
    }
  }, [selectedChat, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isMobile && selectedChat) {
      console.log(
        "DEBUG: Mobile view, hiding chat list for selectedChat:",
        selectedChat
      );
      setShowChatList(false);
    } else if (isMobile && !selectedChat) {
      console.log(
        "DEBUG: Mobile view, showing chat list as no chat is selected"
      );
      setShowChatList(true);
    }
  }, [selectedChat, isMobile]);

  useEffect(() => {
    if (selectedChat && !chats.find((chat) => chat._id === selectedChat)) {
      console.log("DEBUG: Invalid selectedChat, resetting to null");
      setSelectedChat(null);
      setShowChatList(true);
    }
  }, [selectedChat, chats]);

  const handleSendMessage = async (
    content: string,
    type: "text" | "image" | "video" | "file" = "text",
    files?: File[]
  ) => {
    if (!selectedChat) {
      console.log("DEBUG: No selectedChat, cannot send message");
      toast.error("No chat selected.");
      return;
    }
    if (!currentUserId) {
      console.log("DEBUG: No user or vendor ID, cannot send message");
      toast.error("Please log in to send messages.");
      return;
    }
    try {
      if (type === "text" && content.trim()) {
        console.log("DEBUG: Sending text message:", content);
        const newMessage = await sendMessage(selectedChat, content);
        console.log(
          "DEBUG: Sent message:",
          JSON.stringify(newMessage, null, 2)
        );
        const formattedMessage: Message = {
          _id: newMessage.message._id,
          content: content,
          time: new Date(newMessage.message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sent: true,
          type: newMessage.message.type || "text",
          replyTo: newMessage.message.replyTo || undefined,
        };
        setMessages((prev) => [...prev, formattedMessage]);
        setChats((prev) =>
          prev.map((chat) =>
            chat._id === selectedChat
              ? {
                ...chat,
                lastMessage: content,
                time: formattedMessage.time,
                unread: 0,
              }
              : chat
          )
        );
      } else if (files && files.length > 0) {
        console.log(
          "DEBUG: Sending media message with files:",
          files.map((f) => f.name)
        );
        const mediaMessage = await sendMediaMessage(selectedChat, files);
        console.log(
          "DEBUG: Sent media message:",
          JSON.stringify(mediaMessage, null, 2)
        );
        const formattedMessage: Message = {
          _id: mediaMessage.message._id,
          content: mediaMessage.message.content || files[0].name,
          time: new Date(mediaMessage.message.createdAt).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
          sent: true,
          type:
            mediaMessage.message.type ||
            (files[0].type.startsWith("image/")
              ? "image"
              : files[0].type.startsWith("video/")
                ? "video"
                : "file"),
          replyTo: mediaMessage.message.replyTo || undefined,
        };
        setMessages((prev) => [...prev, formattedMessage]);
        setChats((prev) =>
          prev.map((chat) =>
            chat._id === selectedChat
              ? {
                ...chat,
                lastMessage:
                  mediaMessage.message.content ||
                  `Sent a ${formattedMessage.type}`,
                time: formattedMessage.time,
                unread: 0,
              }
              : chat
          )
        );
      }
      // Refresh chats to ensure consistency
      console.log("DEBUG: Refreshing chats after sending message");
      const chatData = await getUserChats();
      const formattedChats: Chat[] = (chatData.chats || []).map((chat: any) => {
        const otherParticipant = chat.participants.find(
          (p: any) => p.participantId !== currentUserId
        );
        return {
          _id: chat._id,
          name:
            otherParticipant?.details?.storeName ||
            otherParticipant?.details?.name ||
            `User ${otherParticipant?.participantId?.slice(-4) || "Unknown"}`,
          lastMessage: chat.lastMessage?.content || "",
          time: new Date(
            chat.lastMessage?.createdAt || chat.createdAt || Date.now()
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          unread: chat.unreadCount || 0,
          avatar:
            otherParticipant?.details?.avatar ||
            otherParticipant?.details?.businessLogo ||
            "",
          online: otherParticipant?.details?.online || false,
          pinned: chat.pinned || false,
          isGroup: chat.isCustomerCareChat || false,
        };
      });
      setChats(formattedChats);
      // Refresh messages to ensure consistency
      console.log("DEBUG: Refreshing messages after sending");
      const messageData = await getChatMessages(selectedChat);
      const formattedMessages: Message[] = (messageData.messages || []).map(
        (msg: any) => {
          const isSentByCurrentUser = msg.sender?._id === currentUserId;
          console.log(
            "DEBUG: Message sender._id:",
            msg.sender?._id,
            "currentUserId:",
            currentUserId,
            "isSentByCurrentUser:",
            isSentByCurrentUser
          );
          return {
            _id: msg._id,
            content: msg.content || "",
            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sent: isSentByCurrentUser,
            type: msg.type || "text",
            replyTo: msg.replyTo || undefined,
          };
        }
      );
      setMessages(formattedMessages);
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
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      console.log("DEBUG: Deleting message:", messageId);
      await deleteMessage(messageId);
      setMessages(messages.filter((msg) => msg._id !== messageId));
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

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      console.log(
        "DEBUG: Editing message:",
        messageId,
        "with content:",
        newContent
      );
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
      console.error(
        "DEBUG: Error editing message:",
        JSON.stringify(error, null, 2)
      );
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handlePinChat = (chatId: string) => {
    console.log("DEBUG: Pinning/unpinning chat:", chatId);
    setChats(
      chats.map((chat) =>
        chat._id === chatId ? { ...chat, pinned: !chat.pinned } : chat
      )
    );
  };

  const handleNewChat = async (receiverId: string) => {
    if (!currentUserId) {
      console.log("DEBUG: No user or vendor ID, cannot start chat");
      toast.error("Please log in to start a chat.");
      return;
    }
    if (receiverId === currentUserId) {
      console.log("DEBUG: Attempted to start chat with self:", receiverId);
      toast.error("Cannot start a chat with yourself.");
      return;
    }
    try {
      console.log("DEBUG: Starting chat with receiverId:", receiverId);
      const newChat = await startChat(receiverId);
      console.log("DEBUG: New chat data:", JSON.stringify(newChat, null, 2));

      // Validate response structure
      if (!newChat?.success || !newChat?.chat?._id) {
        throw new Error("Invalid chat data received from server");
      }

      // Find other participant
      const otherParticipant = newChat.chat.participants.find(
        (p: any) => p.participantId !== currentUserId
      );
      if (!otherParticipant) {
        throw new Error("No other participant found in chat data");
      }

      // Format new chat with fallback for missing details
      const formattedChat: Chat = {
        _id: newChat.chat._id,
        name:
          otherParticipant?.details?.storeName ||
          otherParticipant?.details?.name ||
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
        unread: newChat.chat.unreadCount || 0,
        avatar:
          otherParticipant?.details?.avatar ||
          otherParticipant?.details?.businessLogo ||
          "",
        online: otherParticipant?.details?.online || false,
        pinned: newChat.chat.pinned || false,
        isGroup: newChat.chat.isCustomerCareChat || false,
      };
      console.log(
        "DEBUG: Formatted new chat:",
        JSON.stringify(formattedChat, null, 2)
      );

      // Update state to add new chat and select it
      setChats((prev) => {
        // Prevent duplicates
        if (prev.some((chat) => chat._id === formattedChat._id)) {
          console.log("DEBUG: Chat already exists in state, skipping add:", formattedChat._id);
          return prev;
        }
        console.log("DEBUG: Adding new chat to state:", formattedChat._id);
        return [formattedChat, ...prev];
      });
      console.log("DEBUG: Setting selectedChat to:", formattedChat._id);
      setSelectedChat(formattedChat._id);
      if (isMobile) {
        console.log("DEBUG: Mobile view, hiding chat list after starting new chat");
        setShowChatList(false);
      }

      // Optional: Refresh chats to get full participant details
      try {
        console.log("DEBUG: Refreshing chats after starting new chat");
        const chatData = await getUserChats();
        console.log("DEBUG: Refreshed chatData:", JSON.stringify(chatData, null, 2));
        const formattedChats: Chat[] = (chatData.chats || []).map((chat: any) => {
          const otherParticipant = chat.participants.find(
            (p: any) => p.participantId !== currentUserId
          );
          return {
            _id: chat._id,
            name:
              otherParticipant?.details?.storeName ||
              otherParticipant?.details?.name ||
              `User ${otherParticipant?.participantId?.slice(-4) || "Unknown"}`,
            lastMessage: chat.lastMessage?.content || "",
            time: new Date(
              chat.lastMessage?.createdAt || chat.createdAt || Date.now()
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            unread: chat.unreadCount || 0,
            avatar:
              otherParticipant?.details?.avatar ||
              otherParticipant?.details?.businessLogo ||
              "",
            online: otherParticipant?.details?.online || false,
            pinned: chat.pinned || false,
            isGroup: chat.isCustomerCareChat || false,
          };
        });
        console.log(
          "DEBUG: Setting refreshed chats:",
          JSON.stringify(formattedChats, null, 2)
        );
        setChats(formattedChats);
      } catch (refreshError: any) {
        console.warn(
          "DEBUG: Error refreshing chats after new chat:",
          JSON.stringify(refreshError, null, 2)
        );
        toast.warn("Chat created, but failed to refresh chat list.");
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || error.message || "Failed to start chat. Please try again.";
      console.error("DEBUG: Error starting chat:", JSON.stringify(error, null, 2));
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    console.log("DEBUG: Deleting chat:", chatId);
    setChats(chats.filter((chat) => chat._id !== chatId));
    if (selectedChat === chatId) {
      console.log("DEBUG: Clearing selectedChat as it was deleted");
      setSelectedChat(null);
      setShowChatList(true);
    }
  };

  const handleBackToList = () => {
    console.log(
      "DEBUG: handleBackToList called, current selectedChat:",
      selectedChat
    );
    setSelectedChat(null);
    setShowChatList(true);
    console.log(
      "DEBUG: After handleBackToList, selectedChat:",
      null,
      "showChatList:",
      true
    );
  };

  const selectedChatData = chats.find((chat) => chat._id === selectedChat);
  console.log(
    "DEBUG: selectedChatData:",
    JSON.stringify(selectedChatData, null, 2)
  );
  console.log("DEBUG: chats before render:", JSON.stringify(chats, null, 2));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("DEBUG: Prevented form submission in ChatInterface");
  };

  return (
    <div
      onSubmit={handleFormSubmit}
      className="flex h-[calc(100vh-7rem)] bg-background rounded border"
    >
      <div
        className={`${isMobile
            ? showChatList
              ? "w-full"
              : "hidden"
            : "w-80 border-r border-chat-border"
          } bg-card`}
      >
        {isLoadingChats ? (
          <div className="p-4">Loading chats...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : (
          <ChatList
            chats={chats || []}
            selectedChat={selectedChat}
            onSelectChat={(chatId) => {
              console.log("DEBUG: Selecting chat:", chatId);
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
        className={`${isMobile ? (showChatList ? "hidden" : "w-full") : "flex-1"
          } flex flex-col relative`}
      >
        {selectedChat && selectedChatData ? (
          <>
            <div className="sticky top-0 z-10">
              <ChatHeader
                chat={selectedChatData}
                onBack={isMobile ? handleBackToList : undefined}
              />
            </div>
            <ScrollArea className="flex-1 pt-16 pb-20 overflow-y-auto">
              <div className="p-4 space-y-4">
                {isLoadingMessages ? (
                  <div>Loading messages...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    No messages yet
                  </div>
                ) : (
                  messages.map((message) => (
                    <MessageBubble
                      key={message._id}
                      message={message}
                      onDelete={() => handleDeleteMessage(message._id)}
                      onEdit={(content) =>
                        handleEditMessage(message._id, content)
                      }
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="sticky bottom-0 z-10">
              <MessageInput onSendMessage={handleSendMessage} />
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

export default ChatInterface;
