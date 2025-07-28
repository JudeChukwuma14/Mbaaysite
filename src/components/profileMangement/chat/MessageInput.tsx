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
  onSendMessage: (content: string, type?: "text" | "image" | "video" | "file") => void;
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
      onSendMessage(message.trim());
      setMessage("");
    }
    
    // Send attached files
    attachedFiles.forEach(file => {
      const fileURL = URL.createObjectURL(file);
      if (file.type.startsWith('image/')) {
        onSendMessage(fileURL, "image");
      } else if (file.type.startsWith('video/')) {
        onSendMessage(fileURL, "video");
      } else {
        onSendMessage(file.name, "file");
      }
    });
    
    setAttachedFiles([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (type: "file" | "image" | "video") => {
    const inputRef = type === "image" ? imageInputRef : type === "video" ? videoInputRef : fileInputRef;
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  return (
    <div className="bg-card">
      {/* Attached Files Preview */}
      {attachedFiles.length > 0 && (
        <div className="p-3">
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-2">
                <span className="truncate max-w-32">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
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
          {/* Attachment Options */}
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

          {/* Message Input */}
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="bg-chat-muted border-chat-border focus-visible:ring-chat-primary rounded-full"
            />
          </div>

          {/* Voice Recording */}
          <Button
            variant="ghost"
            size="sm"
            className={`text-muted-foreground hover:text-chat-primary hover:bg-chat-muted ${
              isRecording ? 'text-red-500 bg-red-50' : ''
            }`}
            onClick={toggleRecording}
          >
            <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
          </Button>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() && attachedFiles.length === 0}
            className="bg-orange-600 hover:bg-orange-500 text-white rounded-full h-10 w-10 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Hidden File Inputs */}
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