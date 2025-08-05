
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send, User, Bot, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  sender: "user" | "agent"
  timestamp: Date
}

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to our customer care service. How can I help you today?",
      sender: "agent",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")

    // Simulate agent response
    setTimeout(
      () => {
        const responses = [
          "Thank you for your message. I'm looking into that for you.",
          "I understand your concern. Let me help you with that.",
          "That's a great question! Here's what I can tell you...",
          "I'd be happy to assist you with that. Can you provide more details?",
          "Let me check our system for the most up-to-date information.",
        ]

        const agentResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: "agent",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, agentResponse])
      },
      1000 + Math.random() * 2000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
      <div
        className={cn(
          "bg-white rounded-lg shadow-2xl border transition-all duration-300 pointer-events-auto",
          "w-full max-w-sm h-[600px] max-h-[80vh]",
          "sm:w-96 sm:h-[500px]",
          "md:w-[400px] md:h-[600px]",
          isMinimized && "h-14",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 text-white bg-blue-600 border-b rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Customer Care</h3>
              <p className="text-xs text-blue-100">Online now</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-8 h-8 text-white hover:bg-blue-500"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8 text-white hover:bg-blue-500">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-120px)]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-2",
                    message.sender === "user" && "flex-row-reverse space-x-reverse",
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.sender === "user" ? "bg-gray-200" : "bg-blue-100",
                    )}
                  >
                    {message.sender === "user" ? (
                      <User className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3 text-sm",
                      message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800",
                    )}
                  >
                    <p>{message.text}</p>
                    <p className={cn("text-xs mt-1", message.sender === "user" ? "text-blue-100" : "text-gray-500")}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon" className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-500">Press Enter to send • We typically reply in a few minutes</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
