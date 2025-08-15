import { useState, useEffect, useRef } from "react";
import { Send, X, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_CHAT_BASE_URL = "https://mbayy-be.onrender.com/api/v1/chat";

export const ChatInterface = ({ isOpen, onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Access user or vendor from Redux
  const user = useSelector((state: RootState) => state.user.user);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const token = useSelector((state: RootState) => state.user.token || state.vendor.token);
  const senderId = user?._id || vendor?._id;

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Start customer care chat
  useEffect(() => {
    if (!isOpen || !senderId || !token) return;

    const startChat = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Starting chat with:", { senderId, token });
        const response = await axios.post(
          `${API_CHAT_BASE_URL}/start-customer-care`,
          { userId: senderId },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        console.log("Start chat response:", response.data);
        setChatId(response.data.chatId);
        setMessages([
          {
            id: "1",
            content: "Hello! Welcome to our customer support. How can I help you today?",
            sender: "agent",
            timestamp: new Date(),
          },
        ]);
      } catch (err: any) {
        console.error("Start chat error:", err.response?.data || err.message);
        setError(`Failed to start chat: ${err.response?.data?.message || err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    startChat();
  }, [isOpen, senderId, token]);

  // Fetch messages
  useEffect(() => {
    if (!chatId || !token) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${API_CHAT_BASE_URL}/customer_care_chatmessages/${chatId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fetchedMessages = response.data.messages.map((msg: any) => ({
          id: msg._id,
          content: msg.content,
          sender: msg.senderId === senderId ? "user" : "agent",
          timestamp: new Date(msg.createdAt),
        }));
        setMessages(fetchedMessages);
      } catch (err: any) {
        setError(`Failed to fetch messages: ${err.response?.data?.message || err.message}`);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [chatId, senderId, token]);

  // Send message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatId || !senderId || !token) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    try {
      await axios.post(
        `${API_CHAT_BASE_URL}/send-message`,
        { chatId, content: inputValue, senderId },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
    } catch (err: any) {
      setError(`Failed to send message: ${err.response?.data?.message || err.message}`);
      setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  if (!senderId || !token) {
    return (
      <Card className="fixed z-40 border-0 shadow-2xl bottom-20 right-6 w-80 h-96">
        <div className="p-4 text-center">
          <p className="text-red-500">Please log in to use the chat feature.</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "fixed bottom-20 right-6 z-40 w-80 h-96",
        "sm:w-96 sm:h-[400px]",
        "lg:w-96 lg:h-[460px]",
        "shadow-2xl border-0",
        "animate-in slide-in-from-bottom-5 duration-300"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white bg-orange-500 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">Customer Support</h3>
            <p className="text-xs opacity-90">We're here to help</p>
          </div>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="w-6 h-6 p-0 text-white hover:bg-white/20"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 h-64 p-4 lg:h-80">
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3 text-sm",
                  message.sender === "user"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-800"
                )}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === "agent" && (
                    <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-orange-500" />
                  )}
                  {message.sender === "user" && (
                    <User className="h-4 w-4 mt-0.5 flex-shrink-0 order-2" />
                  )}
                  <div className={message.sender === "user" ? "order-1" : ""}>
                    <p>{message.content}</p>
                    <p
                      className={cn(
                        "mt-1 text-xs opacity-70",
                        message.sender === "user"
                          ? "text-orange-100"
                          : "text-gray-500"
                      )}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 w-full px-3 py-1 text-base transition-colors bg-transparent border rounded-md shadow-sm h-9 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="text-white bg-orange-500 hover:bg-orange-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};