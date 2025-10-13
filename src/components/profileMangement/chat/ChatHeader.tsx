"use client"

import type React from "react"
import { ArrowLeft, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Chat {
  _id: string
  name: string
  online: boolean
  avatar?: string
}

interface ChatHeaderProps {
  chat: Chat
  onBack?: () => void
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat, onBack }) => {
  const getInitials = (name: string) => {
    console.log("DEBUG: Generating initials for name:", name)
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  console.log("DEBUG: ChatHeader rendering with chat:", JSON.stringify(chat, null, 2))

  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault() // Prevent default behavior (e.g., form submission or page reload)
    e.stopPropagation() // Stop event propagation
    console.log("DEBUG: Back button clicked, triggering onBack")
    onBack?.()
  }

  return (
    <div className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center space-x-3">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="md:hidden text-muted-foreground hover:text-chat-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div className="relative">
          <div className="w-10 h-10 bg-orange-500 rounded-[50%] flex items-center justify-center text-white font-semibold text-sm">
            {chat.avatar ? (
              <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-[50%] object-cover" />
            ) : (
              getInitials(chat.name)
            )}
          </div>
          {chat.online && (
            <div className="absolute w-3 h-3 bg-green-500 border-2 border-white rounded-lg -bottom-1 -right-1"></div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{chat.name}</h3>
          <p className="text-sm text-muted-foreground">{chat.online ? "Online" : "Last seen recently"}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-chat-primary hover:bg-chat-muted"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-chat-border">
            <DropdownMenuItem className="cursor-pointer">View Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Mute Notifications</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Clear Chat</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              Block User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default ChatHeader
