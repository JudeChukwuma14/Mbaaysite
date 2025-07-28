import { ArrowLeft, MoreVertical, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Chat {
  id: number;
  name: string;
  online: boolean;
  avatar: string;
  isGroup?: boolean;
}

interface ChatHeaderProps {
  chat: Chat;
  onBack?: () => void;
}

const ChatHeader = ({ chat, onBack }: ChatHeaderProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-center justify-between p-4 bg-card border-b">
      <div className="flex items-center space-x-3">
        {/* Back Button (Mobile) */}
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="md:hidden text-muted-foreground hover:text-chat-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}

        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 bg-black rounded-[50%] flex items-center justify-center text-white font-semibold text-sm">
           {chat.isGroup ? (
              <Users className="w-6 h-6" />
            ) : chat.avatar ? (
              <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-[50%] object-cover" />
            ) : (
              getInitials(chat.name)
            )}
          </div>
          {chat.online && !chat.isGroup && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-lg border-2 border-white"></div>
          )}
        </div>

        {/* Chat Info */}
        <div>
          <h3 className="font-semibold text-foreground">{chat.name}</h3>
          <p className="text-sm text-muted-foreground">
            {chat.isGroup 
              ? "Group chat" 
              : chat.online 
                ? "Online" 
                : "Last seen recently"
            }
          </p>
        </div>
      </div>

      {/* Action Buttons */}
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
            <DropdownMenuItem className="cursor-pointer">
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Mute Notifications
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Clear Chat
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              Block User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;