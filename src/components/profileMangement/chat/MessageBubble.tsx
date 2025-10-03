import { useState } from "react";
import {
  MoreVertical,
  Edit3,
  Trash2,
  Copy,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Message {
  _id: string;
  content: string;
  images?: string[];
  video?: string;
  time: string;
  sent: boolean;
  type: "text" | "image" | "video" | "file";
  replyTo?: string;
  isUploading?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  onDelete: () => void;
  onEdit: (content: string) => void;
}

const MessageBubble = ({ message, onDelete, onEdit }: MessageBubbleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (!message.images) return;

    if (direction === "next") {
      setCurrentImageIndex((prev) => (prev + 1) % message.images!.length);
    } else {
      setCurrentImageIndex(
        (prev) => (prev - 1 + message.images!.length) % message.images!.length
      );
    }
  };

  const renderMediaContent = () => {
    switch (message.type) {
      case "image":
        return (
          <div className="max-w-xs space-y-2">
            {message.images && message.images.length > 0 ? (
              <div
                className={`grid gap-2 ${
                  message.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                }`}
              >
                {message.images.slice(0, 4).map((url, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer group ${
                      message.images!.length > 4 && index === 3
                        ? "overflow-hidden"
                        : ""
                    }`}
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={url}
                      alt={`Shared image ${index + 1}`}
                      className={`w-full h-32 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105 ${
                        message.isUploading ? "opacity-50" : ""
                      }`}
                      onError={(e) => {
                        console.log("DEBUG: Image load error:", url);
                        const target = e.currentTarget as HTMLImageElement;
                        const sibling =
                          target.nextElementSibling as HTMLElement;
                        target.style.display = "none";
                        if (sibling) sibling.style.display = "block";
                      }}
                    />

                    {/* Overlay for more images indicator */}
                    {message.images &&
                      message.images.length > 4 &&
                      index === 3 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                          <span className="text-white font-semibold">
                            +{message.images.length - 3}
                          </span>
                        </div>
                      )}

                    {message.isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}

                    <div className="hidden p-2 text-xs rounded bg-chat-muted">
                      📷 Image: {url}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 text-sm rounded-lg bg-chat-muted">
                📷 No images available
              </div>
            )}

            {/* Lightbox Modal */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black border-0">
                <div className="relative flex items-center justify-center h-[80vh]">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                    onClick={() => setLightboxOpen(false)}
                  >
                    <X className="w-6 h-6" />
                  </Button>

                  {message.images && message.images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 z-10 text-white hover:bg-white/20"
                        onClick={() => navigateImage("prev")}
                      >
                        <ChevronLeft className="w-8 h-8" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 z-10 text-white hover:bg-white/20"
                        onClick={() => navigateImage("next")}
                      >
                        <ChevronRight className="w-8 h-8" />
                      </Button>
                    </>
                  )}

                  <img
                    src={message.images?.[currentImageIndex]}
                    alt={`Image ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />

                  {message.images && message.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full">
                      {currentImageIndex + 1} / {message.images.length}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );

      case "video":
        return (
          <div className="relative max-w-xs">
            {message.video ? (
              <>
                <video
                  src={message.video}
                  controls
                  className={`w-full h-48 object-cover rounded-lg ${
                    message.isUploading ? "opacity-50" : ""
                  }`}
                  onError={(e) => {
                    console.log("DEBUG: Video load error:", message.video);
                    const target = e.currentTarget as HTMLVideoElement;
                    const sibling = target.nextElementSibling as HTMLElement;
                    target.style.display = "none";
                    if (sibling) sibling.style.display = "block";
                  }}
                />
                {message.isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </>
            ) : (
              <div className="p-3 text-sm rounded-lg bg-chat-muted">
                🎥 No video available
              </div>
            )}
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
                <p className="text-xs text-muted-foreground">
                  Click to download
                </p>
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
          <p className="break-words whitespace-pre-wrap">{message.content}</p>
        );
    }
  };

  return (
    <div
      className={`flex ${
        message.sent ? "justify-end" : "justify-start"
      } group mb-4`}
    >
      <div className={`max-w-[80%] ${message.sent ? "order-2" : "order-1 "}`}>
        <div
          className={`relative p-3 rounded-2xl ${
            message.sent
              ? "bg-message-sent text-message-sent-foreground shadow-md"
              : "bg-message-received text-message-received-foreground shadow-md"
          } ${message.sent ? "rounded-br-md bg-orange-500 text-white" : "rounded-bl-md"}`}
        >
          {renderMediaContent()}
          <div className="flex items-end justify-between mt-2 space-x-2">
            <span
              className={`text-xs ${
                message.sent
                  ? "text-message-sent-foreground/70"
                  : "text-message-received-foreground/70"
              }`}
            >
              {message.time}
            </span>
            {message.sent &&
              message.type === "text" &&
              !message.isUploading && (
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
                  <DropdownMenuContent
                    align="end"
                    className="bg-card border-chat-border"
                  >
                    <DropdownMenuItem
                      onClick={() => setIsEditing(true)}
                      className="cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleCopy}
                      className="cursor-pointer"
                    >
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
