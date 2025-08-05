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
  if (!currentUserId) {
    console.log(
      "DEBUG: No user or vendor ID found, user must be authenticated"
    );
    setError("Please log in to use chat.");
    toast.error("Please log in to use chat.");
  }

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
        console.log(
          "DEBUG: Participants for each chat:",
          chatData.chats.map((chat: any) => ({
            chatId: chat._id,
            participants: chat.participants,
          }))
        );
        console.log("DEBUG: Current user/vendor ID:", currentUserId);
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
                chat.name ||
                otherParticipant?.storeName ||
                otherParticipant?.name ||
                `User ${
                  otherParticipant?.participantId?.slice(-4) || "Unknown"
                }`,
              lastMessage: chat.lastMessage?.content || "",
              time: new Date(
                chat.lastMessage?.createdAt || chat.createdAt || Date.now()
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              unread: chat.unreadCount || 0,
              avatar: otherParticipant?.avatar || "",
              online: otherParticipant?.online || false,
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
        console.error("DEBUG: Error fetching chats:", error);
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
    } else {
      console.log("DEBUG: No user or vendor in Redux, skipping fetchChats");
    }
  }, [currentUserId]);

// Update the message formatting in the fetchMessages useEffect
useEffect(() => {
  if (selectedChat && currentUserId) {
    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      setError(null);
      try {
        console.log("DEBUG: Fetching messages for chat:", selectedChat);
        const messageData = await getChatMessages(selectedChat);
        console.log("DEBUG: messageData for chat", selectedChat, ":", JSON.stringify(messageData, null, 2));
        const formattedMessages: Message[] = (messageData.messages || []).map((msg: any) => {
          const isSentByCurrentUser = msg.sender._id === currentUserId;
          const formattedMessage = {
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
          console.log("DEBUG: Formatted message:", JSON.stringify(formattedMessage, null, 2));
          return formattedMessage;
        });
        setMessages(formattedMessages);
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || "Failed to load messages. Please try again.";
        console.error("DEBUG: Error fetching messages:", error);
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoadingMessages(false);
      }
    };
    fetchMessages();
  }
}, [selectedChat, currentUserId]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isMobile && selectedChat) {
      console.log("DEBUG: Mobile view, hiding chat list");
      setShowChatList(false);
    }
  }, [selectedChat, isMobile]);

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
        setMessages((prev) => [
          ...prev,
          {
            _id: newMessage.message._id,
            content: content, // Use input content since API lacks it
            time: new Date(newMessage.message.createdAt).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
            sent: newMessage.message.sender === currentUserId,
            type: newMessage.message.type || "text",
            replyTo: newMessage.message.replyTo || undefined,
          },
        ]);
        // Refresh chats to update lastMessage
        console.log("DEBUG: Refreshing chats after sending message");
        const chatData = await getUserChats();
        const formattedChats: Chat[] = (chatData.chats || []).map(
          (chat: any) => {
            const otherParticipant = chat.participants.find(
              (p: any) => p.participantId !== currentUserId
            );
            return {
              _id: chat._id,
              name:
                chat.name ||
                otherParticipant?.storeName ||
                otherParticipant?.name ||
                `User ${
                  otherParticipant?.participantId?.slice(-4) || "Unknown"
                }`,
              lastMessage: chat.lastMessage?.content || "",
              time: new Date(
                chat.lastMessage?.createdAt || chat.createdAt || Date.now()
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              unread: chat.unreadCount || 0,
              avatar: otherParticipant?.avatar || "",
              online: otherParticipant?.online || false,
              pinned: chat.pinned || false,
              isGroup: chat.isCustomerCareChat || false,
            };
          }
        );
        setChats(formattedChats);
        // Refresh messages to ensure the new message appears
        console.log("DEBUG: Refreshing messages after sending");
        const messageData = await getChatMessages(selectedChat);
        const formattedMessages: Message[] = (messageData.messages || []).map(
          (msg: any) => ({
            _id: msg._id,
            content: msg.content || "",
            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sent: msg.sender === currentUserId,
            type: msg.type || "text",
            replyTo: msg.replyTo || undefined,
          })
        );
        setMessages(formattedMessages);
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
        setMessages((prev) => [
          ...prev,
          {
            _id: mediaMessage.message._id,
            content: mediaMessage.message.content || "",
            time: new Date(mediaMessage.message.createdAt).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
            sent: mediaMessage.message.sender === currentUserId,
            type: mediaMessage.message.type,
            replyTo: mediaMessage.message.replyTo || undefined,
          },
        ]);
        // Refresh chats
        console.log("DEBUG: Refreshing chats after sending media message");
        const chatData = await getUserChats();
        const formattedChats: Chat[] = (chatData.chats || []).map(
          (chat: any) => {
            const otherParticipant = chat.participants.find(
              (p: any) => p.participantId !== currentUserId
            );
            return {
              _id: chat._id,
              name:
                chat.name ||
                otherParticipant?.storeName ||
                otherParticipant?.name ||
                `User ${
                  otherParticipant?.participantId?.slice(-4) || "Unknown"
                }`,
              lastMessage: chat.lastMessage?.content || "",
              time: new Date(
                chat.lastMessage?.createdAt || chat.createdAt || Date.now()
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              unread: chat.unreadCount || 0,
              avatar: otherParticipant?.avatar || "",
              online: otherParticipant?.online || false,
              pinned: chat.pinned || false,
              isGroup: chat.isCustomerCareChat || false,
            };
          }
        );
        setChats(formattedChats);
        // Refresh messages
        console.log("DEBUG: Refreshing messages after sending media");
        const messageData = await getChatMessages(selectedChat);
        const formattedMessages: Message[] = (messageData.messages || []).map(
          (msg: any) => ({
            _id: msg._id,
            content: msg.content || "",
            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sent: msg.sender === currentUserId,
            type: msg.type || "text",
            replyTo: msg.replyTo || undefined,
          })
        );
        setMessages(formattedMessages);
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to send message. Please try again.";
      console.error("DEBUG: Error sending message:", error);
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      console.log("DEBUG: Deleting message:", messageId);
      await deleteMessage(messageId);
      setMessages(messages.filter((msg) => msg._id !== messageId));
      console.log("DEBUG: Message deleted successfully");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to delete message. Please try again.";
      console.error("DEBUG: Error deleting message:", error);
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
      console.log("DEBUG: Message edited successfully");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to edit message. Please try again.";
      console.error("DEBUG: Error editing message:", error);
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

  const handleDeleteChat = (chatId: string) => {
    console.log("DEBUG: Deleting chat:", chatId);
    setChats(chats.filter((chat) => chat._id !== chatId));
    if (selectedChat === chatId) {
      console.log("DEBUG: Clearing selectedChat as it was deleted");
      setSelectedChat(null);
    }
  };

  const handleNewChat = async (receiverId: string) => {
    if (!currentUserId) {
      console.log("DEBUG: No user or vendor ID, cannot start chat");
      toast.error("Please log in to start a chat.");
      return;
    }
    if (receiverId === currentUserId) {
      const errorMsg = "Cannot start a chat with yourself.";
      console.log("DEBUG: Attempted to start chat with self:", receiverId);
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    try {
      console.log("DEBUG: Starting chat with receiverId:", receiverId);
      const newChat = await startChat(receiverId);
      console.log("DEBUG: New chat data:", JSON.stringify(newChat, null, 2));
      const otherParticipant = newChat.data.participants.find(
        (p: any) => p.participantId !== currentUserId
      );
      console.log(
        "DEBUG: Other participant in new chat:",
        JSON.stringify(otherParticipant, null, 2)
      );
      const formattedChat: Chat = {
        _id: newChat.data._id,
        name:
          newChat.data.name ||
          otherParticipant?.storeName ||
          otherParticipant?.name ||
          `User ${otherParticipant?.participantId?.slice(-4) || "Unknown"}`,
        lastMessage: newChat.data.lastMessage?.content || "",
        time: new Date(
          newChat.data.lastMessage?.createdAt ||
            newChat.data.createdAt ||
            Date.now()
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        unread: newChat.data.unreadCount || 0,
        avatar: otherParticipant?.avatar || "",
        online: otherParticipant?.online || false,
        pinned: newChat.data.pinned || false,
        isGroup: newChat.data.isCustomerCareChat || false,
      };
      console.log(
        "DEBUG: Formatted new chat:",
        JSON.stringify(formattedChat, null, 2)
      );
      setChats((prev) => [formattedChat, ...prev]);
      setSelectedChat(formattedChat._id);
      if (isMobile) {
        console.log(
          "DEBUG: Mobile view, hiding chat list after starting new chat"
        );
        setShowChatList(false);
      }
      // Refresh chats to ensure consistency
      console.log("DEBUG: Refreshing chats after starting new chat");
      const chatData = await getUserChats();
      const formattedChats: Chat[] = (chatData.chats || []).map((chat: any) => {
        const otherParticipant = chat.participants.find(
          (p: any) => p.participantId !== currentUserId
        );
        return {
          _id: chat._id,
          name:
            chat.name ||
            otherParticipant?.storeName ||
            otherParticipant?.name ||
            `User ${otherParticipant?.participantId?.slice(-4) || "Unknown"}`,
          lastMessage: chat.lastMessage?.content || "",
          time: new Date(
            chat.lastMessage?.createdAt || chat.createdAt || Date.now()
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          unread: chat.unreadCount || 0,
          avatar: otherParticipant?.avatar || "",
          online: otherParticipant?.online || false,
          pinned: chat.pinned || false,
          isGroup: chat.isCustomerCareChat || false,
        };
      });
      setChats(formattedChats);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to start chat. Please try again.";
      console.error(
        "DEBUG: Error starting chat:",
        JSON.stringify(error, null, 2)
      );
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const selectedChatData = chats.find((chat) => chat._id === selectedChat);
  console.log(
    "DEBUG: selectedChatData:",
    JSON.stringify(selectedChatData, null, 2)
  );

  const handleBackToList = () => {
    console.log("DEBUG: Returning to chat list");
    setShowChatList(true);
    setSelectedChat(null);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] bg-background rounded border">
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
        className={`${
          isMobile ? (showChatList ? "hidden" : "w-full") : "flex-1"
        } flex flex-col relative`}
      >
        {selectedChatData ? (
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
