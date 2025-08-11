import { useState } from "react";
import { MoreVertical, Edit3, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  _id: string;
  content: string;
  time: string;
  sent: boolean;
  type: "text" | "image" | "video" | "file";
  replyTo?: string;
}

interface MessageBubbleProps {
  message: Message;
  onDelete: () => void;
  onEdit: (content: string) => void;
}

const MessageBubble = ({ message, onDelete, onEdit }: MessageBubbleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  console.log(
    "DEBUG: Rendering MessageBubble with message:",
    JSON.stringify({ ...message, sent: message.sent }, null, 2)
  );

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      console.log("DEBUG: Saving edited message:", editContent);
      onEdit(editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    console.log("DEBUG: Cancelling edit, restoring content:", message.content);
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleCopy = () => {
    console.log("DEBUG: Copying message content:", message.content);
    navigator.clipboard.writeText(message.content);
  };

  const renderMediaContent = () => {
    switch (message.type) {
      case "image":
        return (
          <div className="max-w-xs">
            <img
              src={message.content}
              alt="Shared image"
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                console.log("DEBUG: Image load error:", message.content);
                const target = e.currentTarget as HTMLImageElement;
                const sibling = target.nextElementSibling as HTMLElement;
                target.style.display = "none";
                if (sibling) sibling.style.display = "block";
              }}
            />
            <div className="hidden p-3 text-sm rounded-lg bg-chat-muted">
              📷 Image: {message.content}
            </div>
          </div>
        );
      case "video":
        return (
          <div className="max-w-xs">
            <video
              src={message.content}
              controls
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                console.log("DEBUG: Video load error:", message.content);
                const target = e.currentTarget as HTMLVideoElement;
                const sibling = target.nextElementSibling as HTMLElement;
                target.style.display = "none";
                if (sibling) sibling.style.display = "block";
              }}
            />
            <div className="hidden p-3 text-sm rounded-lg bg-chat-muted">
              🎥 Video: {message.content}
            </div>
          </div>
        );
      case "file":
        return (
          <div className="max-w-xs p-3 rounded-lg bg-chat-muted">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-chat-primary">
                <span className="text-xs text-white">📎</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {message.content.split("/").pop() || "File"}
                </p>
                <p className="text-xs text-muted-foreground">Click to download</p>
              </div>
            </div>
          </div>
        );
      default:
        return isEditing ? (
          <div className="space-y-2">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="text-current bg-transparent border-white/30"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEdit();
                if (e.key === "Escape") handleCancelEdit();
              }}
              autoFocus
            />
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleEdit}
                className="bg-white text-chat-primary hover:bg-white/90"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                className="text-current border-white/30 hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="break-words">{message.content}</p>
        );
    }
  };

  return (
    <div className={`flex ${message.sent ? "justify-end" : "justify-start"} group`}>
      <div className={`max-w-[70%] ${message.sent ? "order-2" : "order-1"}`}>
        <div
          className={`relative p-3 rounded-2xl ${
            message.sent
              ? "bg-message-sent text-message-sent-foreground"
              : "bg-message-received text-message-received-foreground"
          } ${message.sent ? "rounded-br-md" : "rounded-bl-md"}`}
        >
          {renderMediaContent()}
          <div className="flex items-end justify-between mt-1 space-x-2">
            <span
              className={`text-xs ${
                message.sent ? "text-white/70" : "text-muted-foreground"
              }`}
            >
              {message.time}
            </span>
            {message.sent && message.type === "text" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 transition-opacity opacity-0 group-hover:opacity-100 hover:bg-white/20"
                  >
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-chat-border">
                  <DropdownMenuItem
                    onClick={() => setIsEditing(true)}
                    className="cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;