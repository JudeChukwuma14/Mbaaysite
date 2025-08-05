import { useState, useRef, useEffect } from "react";
import { Send, X, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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

export const ChatInterface = ({ isOpen, onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! Welcome to our customer support. How can I help you today?",
      sender: "agent",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate agent response with varied responses
    setTimeout(() => {
      const responses = [
        "Thank you for your message. I'll help you with that right away. Let me check our system for you.",
        "I understand your concern. Let me look into this for you immediately.",
        "Great question! I'm here to assist you. Give me just a moment to find the best solution.",
        "I appreciate you reaching out. Let me gather the information you need.",
        "Thanks for contacting us! I'm checking our database to provide you with accurate information.",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentResponse]);
    }, 1000 + Math.random() * 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

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
