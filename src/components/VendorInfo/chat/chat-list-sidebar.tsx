"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, User, Store } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isVendor: boolean;
  files?: {
    type: "image" | "document" | "video";
    url: string;
    name: string;
    size: number;
    duration?: string;
  }[];
  replyTo?: string;
  isPinned?: boolean;
  isEdited?: boolean;
  deletedFor: "none" | "me" | "everyone";
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isVendor: boolean;
  isOnline: boolean;
  messages: Message[];
  pinnedMessages: {
    messageId: string;
    unpinTimestamp: number;
  }[];
}

interface UserOrVendor {
  id: string;
  name: string;
  avatar: string;
  isVendor: boolean;
}

interface ChatListSidebarProps {
  chats: Chat[];
  activeChat: string;
  setActiveChat: (chatId: string) => void;
  onStartNewChat: (user: UserOrVendor) => void;
}

// Mock data for searching users/vendors
const mockUsersAndVendors: UserOrVendor[] = [
  {
    id: "user-alice",
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=48&width=48",
    isVendor: false,
  },
  {
    id: "user-bob",
    name: "Bob Williams",
    avatar: "/placeholder.svg?height=48&width=48",
    isVendor: false,
  },
  {
    id: "vendor-store-a",
    name: "Gadget Hub",
    avatar: "/placeholder.svg?height=48&width=48",
    isVendor: true,
  },
  {
    id: "vendor-store-b",
    name: "Fashion Forward",
    avatar: "/placeholder.svg?height=48&width=48",
    isVendor: true,
  },
  {
    id: "user-charlie",
    name: "Charlie Brown",
    avatar: "/placeholder.svg?height=48&width=48",
    isVendor: false,
  },
  {
    id: "vendor-eats",
    name: "Tasty Bites",
    avatar: "/placeholder.svg?height=48&width=48",
    isVendor: true,
  },
  {
    id: "user-diana",
    name: "Diana Prince",
    avatar: "/placeholder.svg?height=48&width=48",
    isVendor: false,
  },
];

export function ChatListSidebar({
  chats,
  activeChat,
  setActiveChat,
  onStartNewChat,
}: ChatListSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserOrVendor[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const filtered = mockUsersAndVendors.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  const handleSelectUser = (user: UserOrVendor) => {
    onStartNewChat(user);
    setSearchQuery("");
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-white border-r w-80 flex flex-col"
    >
      {/* Fixed Header Section */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Chats</h1>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <motion.button className="p-2 rounded-full hover:bg-gray-100">
                <Plus className="w-5 h-5" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] p-2">
              <DropdownMenuItem
                onSelect={() => {
                  /* Handle New Chat logic if different from search */
                }}
              >
                New Chat
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="relative mb-2">
                {/* <Label htmlFor="search-users" className="sr-only">
                  Search Users/Vendors
                </Label> */}
                <Input
                  id="search-users"
                  type="text"
                  placeholder="Search users/vendors..."
                  className="w-full py-2 pl-8 pr-2 text-sm bg-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                  ref={searchInputRef}
                />
                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-2 top-1/2" />
              </div>
              {searchResults.length > 0
                ? searchResults.map((result) => (
                    <DropdownMenuItem
                      key={result.id}
                      onSelect={() => handleSelectUser(result)}
                    >
                      <div className="flex items-center gap-2">
                        {result.isVendor ? (
                          <Store className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                        <span>{result.name}</span>
                      </div>
                    </DropdownMenuItem>
                  ))
                : searchQuery.trim() !== "" && (
                    <DropdownMenuItem disabled>
                      No results found
                    </DropdownMenuItem>
                  )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative">
          <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search message"
            className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>
      {/* Scrollable Chat List Content */}
      <div
        className={`flex-1 ${
          chats.length > 5 ? "overflow-y-auto" : "overflow-hidden"
        }`}
      >
        <AnimatePresence>
          {chats.length === 0 ? (
            <p className="p-4 text-center text-gray-500">
              Currently don't have Chat list
            </p>
          ) : (
            chats.map((chat) => (
              <motion.button
                key={chat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                onClick={() => setActiveChat(chat.id)}
                className={`w-full p-4 flex items-start gap-3 border-b ${
                  activeChat === chat.id ? "bg-orange-50" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={chat.avatar || "/placeholder.svg"}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full"
                  />
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{chat.name}</p>
                      <span className="text-xs text-orange-500">
                        {chat.isVendor ? "Vendor" : "Customer"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {chat.timestamp
                        ? new Date(chat.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {chat.lastMessage}
                  </p>
                </div>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
