import type React from "react";
import { useEffect, useState } from "react";
import { MessageCircle, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAllVendor } from "@/utils/UserChat";
import { toast } from "react-toastify";

interface Chat {
  _id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar?: string;
  online: boolean;
  pinned: boolean;
  isGroup?: boolean;
}

interface Vendor {
  _id: string;
  storeName: string;
  avatar?: string;
}

interface ChatListProps {
  chats: Chat[];
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
  onPinChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: (
    receiverId: string,
    vendorDetails: { storeName: string; avatar?: string }
  ) => void;
  pendingChats?: string[]; // Add this prop
}

const ChatList: React.FC<ChatListProps> = ({
  chats = [],
  selectedChat,
  onSelectChat,
  onNewChat,
  pendingChats = [],
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorSearch, setVendorSearch] = useState("");
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [vendorError, setVendorError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoadingVendors(true);
      setVendorError(null);
      try {
        const response = await getAllVendor();
        setVendors(response.vendors || []);
      } catch (error: any) {
        const errorMsg =
          error.response?.data?.message || "Failed to load vendors.";
        console.error(
          "DEBUG: Error fetching vendors:",
          JSON.stringify(error, null, 2)
        );
        setVendorError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoadingVendors(false);
      }
    };
    if (isNewChatOpen) {
      fetchVendors();
    }
  }, [isNewChatOpen]);

  const filteredVendors = vendors.filter((vendor) =>
    vendor.storeName.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  // Add duplicate filtering to prevent the key error
  const activeChats = chats.filter(
    (chat) => chat.lastMessage || !pendingChats.includes(chat._id)
  );

  const filteredChats = activeChats
    .filter((chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (chat, index, self) => index === self.findIndex((c) => c._id === chat._id)
    );

  const handleStartNewChat = (vendor: Vendor) => {
    onNewChat(vendor._id, {
      storeName: vendor.storeName,
      avatar: vendor.avatar,
    });
    setVendorSearch("");
    setIsNewChatOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-chat-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-foreground">Messages</h2>
          <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-[50%] h-10 w-10 p-0">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Start New Chat</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <Input
                  placeholder="Search vendors..."
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  className="mb-4"
                />
                {isLoadingVendors ? (
                  <div>Loading vendors...</div>
                ) : vendorError ? (
                  <div className="text-destructive">{vendorError}</div>
                ) : (
                  <div className="overflow-y-auto max-h-40">
                    {filteredVendors.length === 0 && vendorSearch ? (
                      <div className="text-muted-foreground">
                        No vendors found
                      </div>
                    ) : (
                      filteredVendors.map((vendor) => (
                        <div
                          key={vendor._id}
                          className="flex items-center p-2 space-x-2 cursor-pointer hover:bg-muted"
                          onClick={() => handleStartNewChat(vendor)}
                        >
                          {vendor.avatar ? (
                            <img
                              src={vendor.avatar}
                              alt={vendor.storeName}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                              {vendor.storeName[0]}
                            </div>
                          )}
                          <span>{vendor.storeName}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative">
          <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-chat-muted border-chat-border focus-visible:ring-chat-primary"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {filteredChats.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-10 h-10 text-orange-500" />
              </div>
              <p className="text-lg font-medium text-foreground">
                No conversations yet
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Start messaging vendors to see your chats here!
              </p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat._id}
                className={`p-3 rounded-lg cursor-pointer chat-item ${
                  selectedChat === chat._id
                    ? "bg-orange-500 text-white"
                    : "hover:bg-orange-600"
                }`}
                onClick={() => onSelectChat(chat._id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 text-orange-500 bg-white rounded-full ring-1 ring-orange-500">
                    {chat.avatar ? (
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <span className="font-semibold">{chat.name[0]}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{chat.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {chat.time}
                      </span>
                    </div>
                    <p className="text-sm truncate text-muted-foreground max-w-[180px]">
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="px-2 py-1 text-xs text-white bg-orange-500 rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatList;
