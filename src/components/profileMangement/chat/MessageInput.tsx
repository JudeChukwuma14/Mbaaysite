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

interface MessageInputProps {
  onSendMessage: (
    content: string,
    type?: "text" | "image" | "video" | "file",
    files?: File[]
  ) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
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
      console.log("DEBUG: Sending media message with files:", attachedFiles.map(f => f.name));
      onSendMessage(
        "",
        attachedFiles[0].type.startsWith("image/") ? "image" : "video",
        attachedFiles
      );
      setAttachedFiles([]);
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
    const inputRef =
      type === "image" ? imageInputRef : type === "video" ? videoInputRef : fileInputRef;
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log("DEBUG: Selected files:", files.map(f => f.name));
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const removeAttachedFile = (index: number) => {
    console.log("DEBUG: Removing attached file at index:", index);
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    console.log("DEBUG: Toggling recording state:", !isRecording);
    setIsRecording(!isRecording);
    // Voice recording not implemented
  };

  return (
    <div className="bg-card">
      {attachedFiles.length > 0 && (
        <div className="p-3">
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-2">
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
            onClick={toggleRecording}
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