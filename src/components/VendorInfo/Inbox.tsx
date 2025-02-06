

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Paperclip, ImageIcon, Smile, Send, Edit, Trash, Reply, Pin, X, Check } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: string
  timestamp: string
  isVendor: boolean
  attachments?: {
    type: "image" | "file"
    url: string
    name: string
  }[]
  replyTo?: string
  isPinned?: boolean
  isEdited?: boolean
  deletedFor: "none" | "me" | "everyone"
}

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  isVendor: boolean
  isOnline: boolean
  messages: Message[]
  pinnedMessageId?: string
}

interface DeleteDialogState {
  isOpen: boolean
  messageId: string | null
}

const EMOJIS = ["😀", "😂", "😊", "😍", "🤔", "😎", "👍", "❤️", "🎉", "🔥"]

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      name: "Ricky Smith",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-06%20012412-kVJIntAcCA2RgZGcjPeNJsH3c03AlI.png",
      lastMessage: "Hi!, How are You? 👋",
      timestamp: "2 min ago",
      isVendor: true,
      isOnline: true,
      messages: [
        {
          id: "1",
          content: "Hi!, How are You? 👋",
          sender: "Ricky Smith",
          timestamp: "11:00AM",
          isVendor: true,
          deletedFor: "none",
        },
        {
          id: "2",
          content: "Hey Ricky am feeling Amazing\nhow about you?",
          sender: "You",
          timestamp: "11:00AM",
          isVendor: false,
          deletedFor: "none",
        },
      ],
    },
    {
      id: "2",
      name: "John Blessed",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-06%20012412-kVJIntAcCA2RgZGcjPeNJsH3c03AlI.png",
      lastMessage: "You : Okay let's get the...",
      timestamp: "5 min ago",
      isVendor: false,
      isOnline: false,
      messages: [
        {
          id: "1",
          content: "Hello John! How can I help you today?",
          sender: "John Blessed",
          timestamp: "10:45AM",
          isVendor: true,
          deletedFor: "none",
        },
        {
          id: "2",
          content: "I need help with my order",
          sender: "You",
          timestamp: "10:46AM",
          isVendor: false,
          deletedFor: "none",
        },
      ],
    },
    {
        id: "1",
        name: "Ricky Smith",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-06%20012412-kVJIntAcCA2RgZGcjPeNJsH3c03AlI.png",
        lastMessage: "Hi!, How are You? 👋",
        timestamp: "2 min ago",
        isVendor: true,
        isOnline: true,
        messages: [
          {
            id: "1",
            content: "Hi!, How are You? 👋",
            sender: "Ricky Smith",
            timestamp: "11:00AM",
            isVendor: true,
            deletedFor: "none",
          },
          {
            id: "2",
            content: "Hey Ricky am feeling Amazing\nhow about you?",
            sender: "You",
            timestamp: "11:00AM",
            isVendor: false,
            deletedFor: "none",
          },
        ],
      },
    {
      id: "2",
      name: "John Blessed",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-06%20012412-kVJIntAcCA2RgZGcjPeNJsH3c03AlI.png",
      lastMessage: "You : Okay let's get the...",
      timestamp: "5 min ago",
      isVendor: false,
      isOnline: false,
      messages: [
        {
          id: "1",
          content: "Hello John! How can I help you today?",
          sender: "John Blessed",
          timestamp: "10:45AM",
          isVendor: true,
          deletedFor: "none",
        },
        {
          id: "2",
          content: "I need help with my order",
          sender: "You",
          timestamp: "10:46AM",
          isVendor: false,
          deletedFor: "none",
        },
      ],
    },
  ])

  const [activeChat, setActiveChat] = useState<string>("1")
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    messageId: null,
  })
  const [deleteType, setDeleteType] = useState<"me" | "everyone">("me")
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null)

  const activeMessages = chats.find((chat) => chat.id === activeChat)?.messages || []
  const activeChatDetails = chats.find((chat) => chat.id === activeChat)
  const pinnedMessage = activeChatDetails?.messages.find((msg) => msg.id === activeChatDetails.pinnedMessageId)

  useEffect(() => {
    scrollToBottom()
  }, [activeChat]) //Corrected dependency

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "file" | "image") => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newMessage: Message = {
          id: Date.now().toString(),
          content: type === "image" ? "" : file.name,
          sender: "You",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isVendor: false,
          attachments: [
            {
              type: type,
              url: reader.result as string,
              name: file.name,
            },
          ],
          replyTo: replyingTo || undefined,
          deletedFor: "none",
        }
        addMessageToChat(newMessage)
        setReplyingTo(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: "You",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isVendor: false,
        replyTo: replyingTo || undefined,
        deletedFor: "none",
      }
      addMessageToChat(newMessage)
      setMessage("")
      setReplyingTo(null)
    }
  }

  const addMessageToChat = (newMessage: Message) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: `You: ${newMessage.content.slice(0, 20)}${newMessage.content.length > 20 ? "..." : ""}`,
              timestamp: "Just now",
            }
          : chat,
      ),
    )
  }

  const handleReply = (messageId: string) => {
    setReplyingTo(messageId)
  }

  const handleDeleteClick = (messageId: string) => {
    setDeleteDialog({
      isOpen: true,
      messageId,
    })
  }

  const handleDeleteConfirm = () => {
    if (deleteDialog.messageId) {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.id === deleteDialog.messageId ? { ...msg, deletedFor: deleteType } : msg,
                ),
                pinnedMessageId: chat.pinnedMessageId === deleteDialog.messageId ? undefined : chat.pinnedMessageId,
              }
            : chat,
        ),
      )
      setDeleteConfirmation(`Message deleted ${deleteType === "me" ? "for you" : "for everyone"}.`)
      setTimeout(() => setDeleteConfirmation(null), 3000) // Clear the confirmation after 3 seconds
    }
    setDeleteDialog({ isOpen: false, messageId: null })
    setDeleteType("me")
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, messageId: null })
    setDeleteType("me")
  }

  const handleEdit = (messageId: string) => {
    setEditingMessageId(messageId)
    const messageToEdit = activeMessages.find((msg) => msg.id === messageId)
    if (messageToEdit) {
      setMessage(messageToEdit.content)
    }
  }

  const handleSaveEdit = () => {
    if (editingMessageId) {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.id === editingMessageId
                    ? {
                        ...msg,
                        content: message,
                        isEdited: true,
                        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                      }
                    : msg,
                ),
              }
            : chat,
        ),
      )
      setEditingMessageId(null)
      setMessage("")
    }
  }

  const handlePin = (messageId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              pinnedMessageId: chat.pinnedMessageId === messageId ? undefined : messageId,
            }
          : chat,
      ),
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat List Sidebar */}
      <motion.div initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-80 border-r bg-white">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Chats</h1>
            <motion.button className="p-2 hover:bg-gray-100 rounded-full">
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search message"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          <AnimatePresence>
            {chats.map((chat) => (
              <motion.button
                key={chat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                onClick={() => setActiveChat(chat.id)}
                className={`w-full p-4 flex items-start gap-3 border-b ${activeChat === chat.id ? "bg-orange-50" : ""}`}
              >
                <div className="relative">
                  <img src={chat.avatar || "/placeholder.svg"} alt={chat.name} className="w-12 h-12 rounded-full" />
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{chat.name}</p>
                      <span className="text-xs text-orange-500">{chat.isVendor ? "Vendor" : "Customer"}</span>
                    </div>
                    <span className="text-xs text-gray-500">{chat.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{chat.lastMessage}</p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {activeChatDetails && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-4 border-b bg-white flex items-center gap-3"
          >
            <div className="relative">
              <img
                src={activeChatDetails.avatar || "/placeholder.svg"}
                alt={activeChatDetails.name}
                className="w-10 h-10 rounded-full"
              />
              {activeChatDetails.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <h2 className="font-semibold">{activeChatDetails.name}</h2>
              <span className="text-xs text-green-500">{activeChatDetails.isOnline ? "Online" : "Offline"}</span>
            </div>
          </motion.div>
        )}

        {/* Pinned Message */}
        {pinnedMessage && (
          <div className="bg-orange-100 p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-orange-500" />
              <p className="text-sm text-orange-700 truncate">{pinnedMessage.content}</p>
            </div>
            <motion.button onClick={() => handlePin(pinnedMessage.id)} className="text-orange-500 hover:text-orange-700">
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteConfirmation && <div className="bg-green-100 p-2 text-center text-green-800">{deleteConfirmation}</div>}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence>
            {activeMessages
              .filter((msg) => msg.deletedFor !== "everyone" && msg.deletedFor !== "me")
              .map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex gap-3 mb-4 ${msg.isVendor ? "" : "justify-end"}`}
                >
                  {msg.isVendor && activeChatDetails && (
                    <img
                      src={activeChatDetails.avatar || "/placeholder.svg"}
                      alt={msg.sender}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className={`max-w-[70%] ${msg.isVendor ? "order-2" : "order-1"}`}>
                    {msg.replyTo && (
                      <div className="bg-gray-100 p-2 rounded-t-lg text-sm text-gray-600 mb-1">
                        Replying to: {activeMessages.find((m) => m.id === msg.replyTo)?.content.slice(0, 50)}...
                      </div>
                    )}
                    <div className={`p-3 rounded-lg ${msg.isVendor ? "bg-white border" : "bg-orange-500 text-white"}`}>
                      {msg.attachments?.map((attachment, i) => (
                        <div key={i} className="mb-2">
                          {attachment.type === "image" ? (
                            <img
                              src={attachment.url || "/placeholder.svg"}
                              alt={attachment.name}
                              className="max-w-full rounded-lg"
                            />
                          ) : (
                            <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
                              <Paperclip className="w-4 h-4" />
                              <span>{attachment.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                    <div
                      className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                        msg.isVendor ? "justify-start" : "justify-end"
                      }`}
                    >
                      {msg.timestamp}
                      {msg.isEdited && <span className="text-gray-400 ml-1">(edited)</span>}
                      <div className="flex gap-2 ml-2">
                        <motion.button onClick={() => handleReply(msg.id)} className="hover:text-orange-500">
                          <Reply className="w-4 h-4" />
                        </motion.button>
                        {!msg.isVendor && (
                          <>
                            <motion.button onClick={() => handleEdit(msg.id)} className="hover:text-orange-500">
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button onClick={() => handleDeleteClick(msg.id)} className="hover:text-orange-500">
                              <Trash className="w-4 h-4" />
                            </motion.button>
                          </>
                        )}
                        <motion.button onClick={() => handlePin(msg.id)} className="hover:text-orange-500">
                          <Pin className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  {!msg.isVendor && <img src="/placeholder.svg" alt="You" className="w-8 h-8 rounded-full order-3" />}
                </motion.div>
              ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Preview */}
        {replyingTo && (
          <div className="bg-gray-100 p-2 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Replying to: {activeMessages.find((m) => m.id === replyingTo)?.content.slice(0, 50)}...
            </p>
            <motion.button onClick={() => setReplyingTo(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        )}

        {/* Message Input */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-4 border-t bg-white relative"
        >
          <div className="flex items-center gap-2">
            <motion.input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileUpload(e, "file")} />
            <motion.button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-100 rounded-full">
              <Paperclip className="w-5 h-5 text-gray-500" />
            </motion.button>

            <motion.input
              type="file"
              ref={imageInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "image")}
            />
            <motion.button onClick={() => imageInputRef.current?.click()} className="p-2 hover:bg-gray-100 rounded-full">
              <ImageIcon className="w-5 h-5 text-gray-500" />
            </motion.button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={editingMessageId ? "Edit message..." : "Write Something..."}
                className="w-full pl-4 pr-10 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => e.key === "Enter" && (editingMessageId ? handleSaveEdit() : handleSendMessage())}
              />
              <motion.button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
              >
                <Smile className="w-5 h-5 text-gray-500" />
              </motion.button>
            </div>
            <button
              onClick={editingMessageId ? handleSaveEdit : handleSendMessage}
              className="p-2 bg-orange-500 hover:bg-orange-600 rounded-full text-white"
            >
              {editingMessageId ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5" />}
            </button>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2 bg-white border rounded-lg shadow-lg p-2">
              <div className="grid grid-cols-5 gap-2">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="text-2xl hover:bg-gray-100 rounded p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Dialog */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Delete message?</h3>
            <p className="text-sm text-gray-600 mb-4">You can delete messages for everyone or just for yourself.</p>
            <div className="space-y-2 mb-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deleteType"
                  value="me"
                  checked={deleteType === "me"}
                  onChange={() => setDeleteType("me")}
                  className="mr-2"
                />
                <span>Delete for me</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deleteType"
                  value="everyone"
                  checked={deleteType === "everyone"}
                  onChange={() => setDeleteType("everyone")}
                  className="mr-2"
                />
                <span>Delete for everyone</span>
              </label>
            </div>
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
    </div>
  )
}

