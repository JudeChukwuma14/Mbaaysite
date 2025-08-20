import { useState, useRef } from "react";
import { Send, Paperclip, Image, Video, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";

interface MessageInputProps {
  onSendMessage: (
    content: string,
    type?: "text" | "image" | "video" | "file",
    files?: File[],
    onUploadStart?: () => { tempId: string; previews: string[] }, // Return temp ID and previews
    onUploadComplete?: (tempId: string) => void
  ) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      console.log("DEBUG: Sending text message from MessageInput:", message);
      onSendMessage(message.trim(), "text");
      setMessage("");
    }
    if (attachedFiles.length > 0) {
      const images = attachedFiles.filter((file) => file.type.startsWith("image/")).slice(0, 5);
      const videos = attachedFiles.filter((file) => file.type.startsWith("video/")).slice(0, 1);
      const filesToSend = [...images, ...videos];
      if (filesToSend.length === 0) {
        console.log("DEBUG: No valid files to send after filtering");
        return;
      }
      console.log("DEBUG: Sending media message with files:", filesToSend.map(f => f.name));
      const type = filesToSend[0].type.startsWith("image/") ? "image" : filesToSend[0].type.startsWith("video/") ? "video" : "file";
      onSendMessage("", type, filesToSend, () => ({
        tempId: `temp-${Date.now()}-${Math.random()}`,
        previews,
      }), (tempId) => {
        console.log("DEBUG: Upload completed for tempId:", tempId);
      });
      previews.forEach((url) => URL.revokeObjectURL(url));
      setAttachedFiles([]);
      setPreviews([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      console.log("DEBUG: Enter key pressed, triggering send");
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (type: "file" | "image" | "video") => {
    console.log("DEBUG: Selecting file type:", type);
    const inputRef = type === "image" ? imageInputRef : type === "video" ? videoInputRef : fileInputRef;
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      console.log("DEBUG: No files selected");
      return;
    }
    const currentImages = attachedFiles.filter((f) => f.type.startsWith("image/"));
    const currentVideos = attachedFiles.filter((f) => f.type.startsWith("video/"));
    const newImages = files.filter((f) => f.type.startsWith("image/"));
    const newVideos = files.filter((f) => f.type.startsWith("video/"));
    if (currentImages.length + newImages.length > 5) {
      console.log("DEBUG: Too many images selected, limiting to 5");
      toast.error("You can only attach up to 5 images.");
      return;
    }
    if (currentVideos.length + newVideos.length > 1) {
      console.log("DEBUG: Too many videos selected, limiting to 1");
      toast.error("You can only attach 1 video.");
      return;
    }
    console.log("DEBUG: Selected files:", files.map(f => f.name));
    const newPreviews = files
      .filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))
      .map((file) => URL.createObjectURL(file));
    setAttachedFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeAttachedFile = (index: number) => {
    console.log("DEBUG: Removing attached file at index:", index);
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      if (prev[index]) URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  return (
    <div className="bg-card">
      {attachedFiles.length > 0 && (
        <div className="p-3">
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <div key={index} className="relative">
                {previews[index] && file.type.startsWith("image/") ? (
                  <div className="relative w-24 h-24">
                    <img
                      src={previews[index]}
                      alt={file.name}
                      className="object-cover w-full h-full rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-0 right-0 w-6 h-6 p-0 bg-black/50 hover:bg-black/70"
                      onClick={() => removeAttachedFile(index)}
                    >
                      <X className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                ) : previews[index] && file.type.startsWith("video/") ? (
                  <div className="relative w-24 h-24">
                    <video
                      src={previews[index]}
                      className="object-cover w-full h-full rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-0 right-0 w-6 h-6 p-0 bg-black/50 hover:bg-black/70"
                      onClick={() => removeAttachedFile(index)}
                    >
                      <X className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                ) : (
                  <Badge variant="secondary" className="flex items-center gap-2">
                    <span className="truncate max-w-32">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-4 h-4 p-0 hover:bg-transparent"
                      onClick={() => removeAttachedFile(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-end space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-chat-primary hover:bg-chat-muted"
              >
                <Paperclip className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="bg-card border-chat-border">
              <DropdownMenuItem
                onClick={() => handleFileSelect("image")}
                className="cursor-pointer"
              >
                <Image className="w-4 h-4 mr-2" />
                Photo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFileSelect("video")}
                className="cursor-pointer"
              >
                <Video className="w-4 h-4 mr-2" />
                Video
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFileSelect("file")}
                className="cursor-pointer"
              >
                <Paperclip className="w-4 h-4 mr-2" />
                File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative flex-1">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="rounded-full bg-chat-muted border-chat-border focus-visible:ring-chat-primary"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`text-muted-foreground hover:text-chat-primary hover:bg-chat-muted ${
              isRecording ? "text-red-500 bg-red-50" : ""
            }`}
            onClick={() => {
              console.log("DEBUG: Toggling recording state:", !isRecording);
              setIsRecording(!isRecording);
            }}
          >
            <Mic className={`w-5 h-5 ${isRecording ? "animate-pulse" : ""}`} />
          </Button>
          <Button
            onClick={handleSend}
            disabled={!message.trim() && attachedFiles.length === 0}
            className="w-10 h-10 p-0 text-white bg-orange-600 rounded-full hover:bg-orange-500"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default MessageInput;