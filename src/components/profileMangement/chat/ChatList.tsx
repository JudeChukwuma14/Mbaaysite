import { useState } from "react";
import { Search, MoreVertical, Pin, PinOff, Trash2, Users, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
  pinned: boolean;
  isGroup?: boolean;
}

interface ChatListProps {
  chats: Chat[];
  selectedChat: number | null;
  onSelectChat: (chatId: number) => void;
  onPinChat: (chatId: number) => void;
  onDeleteChat: (chatId: number) => void;
}

const ChatList = ({ chats, selectedChat, onSelectChat, onPinChat, onDeleteChat }: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    // Add logic to start a new chat
    console.log("Starting new chat...");
  };

  const pinnedChats = filteredChats.filter(chat => chat.pinned);
  const unpinnedChats = filteredChats.filter(chat => !chat.pinned);

  const ChatItem = ({ chat }: { chat: Chat }) => {
    const getInitials = (name: string) => {
      return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    return (
      <div
        className={`flex items-center p-3 cursor-pointer transition-colors hover:bg-chat-muted group ${
          selectedChat === chat.id ? 'bg-orange-500 text-white' : ''
        }`}
        onClick={() => onSelectChat(chat.id)}
      >
        {/* Avatar */}
        <div className="relative">
          <div className={`w-12 h-12 rounded-[50%] flex items-center justify-center font-semibold text-sm ${
            selectedChat === chat.id 
              ? 'bg-white text-orange-500' 
              : 'bg-orange-500 text-white'
          }`}>
            {chat.isGroup ? (
              <Users className="w-6 h-6" />
            ) : chat.avatar ? (
              <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-[50%] object-cover" />
            ) : (
              getInitials(chat.name)
            )}
          </div>
          {chat.online && !chat.isGroup && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-[50%] border-2 border-white"></div>
          )}
        </div>

        {/* Chat Info */}
        <div className="flex-1 ml-3 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold truncate ${
              selectedChat === chat.id ? 'text-white' : 'text-foreground'
            }`}>
              {chat.name}
              {chat.pinned && (
                <Pin className="inline w-3 h-3 ml-1 opacity-70" />
              )}
            </h3>
            <span className={`text-xs ${
              selectedChat === chat.id ? 'text-white/70' : 'text-muted-foreground'
            }`}>
              {chat.time}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className={`text-sm truncate ${
              selectedChat === chat.id ? 'text-white/80' : 'text-muted-foreground'
            }`}>
              {chat.lastMessage}
            </p>
            {chat.unread > 0 && (
              <Badge className={`ml-2 ${
                selectedChat === chat.id 
                  ? 'bg-white text-gray-800' 
                  : 'bg-orange-500 text-white'
              }`}>
                {chat.unread}
              </Badge>
            )}
          </div>
        </div>

        {/* Options Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`opacity-0 group-hover:opacity-100 transition-opacity ml-2 ${
                selectedChat === chat.id ? 'text-white hover:bg-white/20' : 'hover:bg-chat-muted'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-chat-border">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onPinChat(chat.id);
              }}
              className="cursor-pointer"
            >
              {chat.pinned ? (
                <>
                  <PinOff className="w-4 h-4 mr-2" />
                  Unpin Chat
                </>
              ) : (
                <>
                  <Pin className="w-4 h-4 mr-2" />
                  Pin Chat
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-chat-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-foreground">Messages</h2>
          <Button
            onClick={handleNewChat}
            className="bg-orange-500 hover:bg-hover-primary text-white rounded-[50%] h-10 w-10 p-0"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-chat-muted border-chat-border focus-visible:ring-chat-primary"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Pinned Chats */}
          {pinnedChats.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
                Pinned
              </h3>
              <div className="space-y-1">
                {pinnedChats.map((chat) => (
                  <ChatItem key={chat.id} chat={chat} />
                ))}
              </div>
            </div>
          )}

          {/* Regular Chats */}
          {unpinnedChats.length > 0 && (
            <div>
              {pinnedChats.length > 0 && (
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
                  All Chats
                </h3>
              )}
              <div className="space-y-1">
                {unpinnedChats.map((chat) => (
                  <ChatItem key={chat.id} chat={chat} />
                ))}
              </div>
            </div>
          )}

          {filteredChats.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No chats found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatList;