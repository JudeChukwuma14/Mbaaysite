import React, { useEffect, useRef, useState } from "react";
import ChatList from "./ChatList";
import { useIsMobile } from "@/hook/use-mobile";
import ChatHeader from "./ChatHeader";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { Send } from "lucide-react";
const mockChats = [
    {
        id: 1,
        name: "John Doe",
        lastMessage: "Hey, how are you doing?",
        time: "2:30 PM",
        unread: 2,
        avatar:
            "https://i.pinimg.com/736x/dc/2a/c0/dc2ac088c51bdc168db8b8e6acd1964f.jpg",
        online: true,
        pinned: true,
    },
    {
        id: 2,
        name: "Sarah Wilson",
        lastMessage: "Can you send me the files?",
        time: "1:45 PM",
        unread: 0,
        avatar: "",
        online: false,
        pinned: false,
    },
    {
        id: 3,
        name: "Team Project",
        lastMessage: "Meeting tomorrow at 10 AM",
        time: "12:20 PM",
        unread: 5,
        avatar: "",
        online: true,
        pinned: true,
        isGroup: true,
    },
    {
        id: 4,
        name: "Jane Smith",
        lastMessage: "I'll call you later.",
        time: "11:15 AM",
        unread: 1,
        avatar: "",
        online: false,
        pinned: false,
    },
    {
        id: 5,
        name: "Alex Johnson",
        lastMessage: "Got the documents!",
        time: "10:00 AM",
        unread: 0,
        avatar:
            "https://i.pinimg.com/736x/f0/71/36/f071360dddfe7088975d0b4813ea9591.jpg",
        online: true,
        pinned: false,
    },
    {
        id: 6,
        name: "Family Group",
        lastMessage: "Dinner at 8?",
        time: "9:45 AM",
        unread: 3,
        avatar: "",
        online: true,
        pinned: true,
        isGroup: true,
    },
    {
        id: 7,
        name: "Dev Team",
        lastMessage: "Code review complete.",
        time: "9:00 AM",
        unread: 0,
        avatar: "",
        online: false,
        pinned: false,
        isGroup: true,
    },
    {
        id: 8,
        name: "Linda Green",
        lastMessage: "Thanks for the gift!",
        time: "8:10 AM",
        unread: 4,
        avatar:
            "https://i.pinimg.com/474x/c6/0a/d0/c60ad03621a3caebd7cd75b551fc56c0.jpg",
        online: true,
        pinned: false,
    },
    {
        id: 9,
        name: "Customer Support",
        lastMessage: "Your issue has been resolved.",
        time: "Yesterday",
        unread: 0,
        avatar: "",
        online: false,
        pinned: false,
    },
    {
        id: 10,
        name: "Mike Tyson",
        lastMessage: "Let’s hit the gym later.",
        time: "Sunday",
        unread: 2,
        avatar: "",
        online: true,
        pinned: false,
    },
];

type MessageType = "text" | "image" | "video" | "file";

interface Message {
    id: number;
    content: string;
    time: string;
    sent: boolean;
    type: MessageType;
}

const mockMessages: Message[] = [
    {
        id: 1,
        content: "Hey, how are you doing?",
        time: "2:30 PM",
        sent: false,
        type: "text",
    },
    {
        id: 2,
        content: "I'm doing great! How about you?",
        time: "2:32 PM",
        sent: true,
        type: "text",
    },
    {
        id: 3,
        content: "https://example.com/image.jpg",
        time: "2:35 PM",
        sent: false,
        type: "image",
    },
    {
        id: 4,
        content: "That's a beautiful photo!",
        time: "2:36 PM",
        sent: true,
        type: "text",
    },
];

const ChatInterface: React.FC = () => {
    const [selectedChat, setSelectedChat] = useState<number | null>(1);
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [chats, setChats] = useState(mockChats);
    const [showChatList, setShowChatList] = useState(true);
    const isMobile = useIsMobile();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle mobile responsiveness
    useEffect(() => {
        if (isMobile && selectedChat) {
            setShowChatList(false);
        }
    }, [selectedChat, isMobile]);

    const handleSendMessage = (content: string, type: MessageType = "text") => {
        const newMessage: Message = {
            id: messages.length + 1,
            content,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            sent: true,
            type,
        };
        setMessages([...messages, newMessage]);
    };

    const handleDeleteMessage = (messageId: number) => {
        setMessages(messages.filter((msg) => msg.id !== messageId));
    };

    const handleEditMessage = (messageId: number, newContent: string) => {
        setMessages(
            messages.map((msg) =>
                msg.id === messageId ? { ...msg, content: newContent } : msg
            )
        );
    };

    const handlePinChat = (chatId: number) => {
        setChats(
            chats.map((chat) =>
                chat.id === chatId ? { ...chat, pinned: !chat.pinned } : chat
            )
        );
    };

    const handleDeleteChat = (chatId: number) => {
        setChats(chats.filter((chat) => chat.id !== chatId));
        if (selectedChat === chatId) {
            setSelectedChat(null);
        }
    };

    const selectedChatData = chats.find((chat) => chat.id === selectedChat);

    const handleBackToList = () => {
        setShowChatList(true);
        setSelectedChat(null);
    };

    return (
        <div className="flex h-[calc(100vh-10rem)] lg:h-[calc(95vh-7rem)] bg-background border rounded">
            <div
                className={`${isMobile
                    ? showChatList
                        ? "w-full"
                        : "hidden"
                    : "w-80 border-r border-chat-border"
                    } bg-card`}
            >
                <ChatList
                    chats={chats}
                    selectedChat={selectedChat}
                    onSelectChat={(chatId) => {
                        setSelectedChat(chatId);
                        if (isMobile) setShowChatList(false);
                    }}
                    onPinChat={handlePinChat}
                    onDeleteChat={handleDeleteChat}
                />
            </div>
            <div
                className={`${isMobile ? (showChatList ? "hidden" : "w-full") : "flex-1"
                    } flex flex-col`}
            >
                {selectedChatData ? (
                    <>
                        <div className="sticky top-0 z-10">
                            <ChatHeader
                                chat={selectedChatData}
                                onBack={isMobile ? handleBackToList : undefined}
                            />
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 overflow-y-auto">
                            <div className="p-4 space-y-4">
                                {messages.map((message) => (
                                    <MessageBubble
                                        key={message.id}
                                        message={message}
                                        onDelete={() => handleDeleteMessage(message.id)}
                                        onEdit={(content) => handleEditMessage(message.id, content)}
                                    />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>
                        <div className="sticky bottom-0 z-10 border">
                            <MessageInput onSendMessage={handleSendMessage} />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-chat-muted">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-chat-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
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
