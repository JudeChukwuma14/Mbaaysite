
import { useRef, useState } from "react";


import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  useCreateOrGetChat,
  useSearchContacts,
} from "@/hook/userVendorQueries";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getUserChats } from "@/utils/vendorChatApi";

interface Message {
  _id: string;
  content: string;
  sender: string;
  timestamp: string;
  isVendor: boolean;
}

interface Chat {
  _id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isVendor: any;
  isOnline: boolean;
  messages: Message[];
}

interface Contact {
  _id: string;
  name: string;
  avatar?: string;
  isVendor: boolean;
  email?: string;
  storeName?: string;
  profileImage?: string;
}

interface ApiChat {
  _id: string;
  participants: {
    _id: string;
    name?: string;
    storeName?: string;
    profileImage?: string;
    avatar?: string;
    isVendor?: boolean;
    isOnline?: boolean;
  }[];
  lastMessage?: {
    content: string;
  };
  updatedAt?: string;
  messages?: Message[];
}

interface ChatListSidebarProps {
  chats: Chat[];
  activeChat: string;
  setActiveChat: (chatId: string) => void;
  token: any;
  onNewChatCreated: (newChat: Chat) => void;
}

export function ChatListSidebar({
  activeChat,
  setActiveChat,
  onNewChatCreated,
}: ChatListSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: any) => state.vendor);

  const {
    data: my_chats,
    isLoading: isChatsLoading,
    error: chatsError,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: () => getUserChats(user.token),
  });

  const { data: searchResults = [], isLoading: isSearchLoading } =
    useSearchContacts(searchQuery);
  const createChatMutation = useCreateOrGetChat();

  const handleSelectContact = async (contact: Contact) => {
    try {
      const result = await createChatMutation.mutateAsync({
        receiverId: contact._id,
        token: user.token,
      });

      const newChat: Chat = {
        _id: result.chatId,
        name: contact.storeName || contact.name,
        avatar: contact.profileImage || contact.avatar || "/placeholder.svg",
        lastMessage: "Chat started",
        timestamp: new Date().toISOString(),
        isVendor: contact.isVendor,
        isOnline: true,
        messages: [],
      };

      onNewChatCreated(newChat);
      setActiveChat(result.chatId);
      setSearchQuery("");
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const formatContactName = (contact: Contact) => {
    return contact?.storeName
      ? contact?.storeName || contact?.name
      : contact?.name;
  };

  // Helper function to get the other participant in the chat
  const getOtherParticipant = (participants: any[], currentUserId: any) => {
    return (
      participants?.find((p) => p.participantId !== currentUserId) ||
      participants?.[1]
    );
  };

  // Transform API response to match Chat interface
  const chatList =
    my_chats?.map((chat: ApiChat) => {
      const participant = getOtherParticipant(
        chat.participants,
        user.vendor._id
      );

      return {
        _id: chat._id,
        name: participant?.details?.name || participant?.details?.storeName,
        avatar:
          participant?.profileImage ||
          participant?.details?.avatar ||
          "/placeholder.svg",
        lastMessage: chat.lastMessage?.content || "No messages yet",
        timestamp: chat.updatedAt || new Date().toISOString(),
        isVendor: participant?.model || false,
        isOnline: participant?.isOnline || false,
        messages: chat.messages || [],
      };
    }) || [];

  // Add loading state
  if (isChatsLoading) {
    return (
      <div className="flex flex-col items-center justify-center bg-white border-r w-80">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  // Add error state
  if (chatsError) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center text-red-500 bg-white border-r w-80">
        <p>Error loading chats</p>
        <p className="mt-2 text-sm">Please try again later</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex flex-col bg-white border-r w-80"
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b">

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Chats</h1>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <motion.button
                className="p-2 rounded-full hover:bg-gray-100"
                whileHover={{ scale: 1.05 }}
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[320px] p-2 mr-60">
              <DropdownMenuItem>New Chat</DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="relative mb-2">
                <Input
                  type="text"
                  placeholder="Search users/vendors..."
                  className="w-full py-2 pl-8 pr-2 text-sm bg-gray-100 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  ref={searchInputRef}
                />
                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-2 top-1/2" />
              </div>

              {isSearchLoading ? (
                <div className="flex items-center justify-center p-2">
                  <Spinner className="w-4 h-4" />
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((contact: Contact) => (
                  <DropdownMenuItem
                    key={contact._id}
                    onSelect={() => handleSelectContact(contact)}
                  >
                    <div className="flex items-center w-full gap-3">
                      <div className="relative">
                        <img
                          src={
                            contact.profileImage ||
                            contact.avatar ||
                            "/placeholder.svg"
                          }
                          alt={contact.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
                            contact.isVendor ? "bg-orange-500" : "bg-blue-500"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {formatContactName(contact)}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {contact.storeName ? "Vendor" : "User"}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : searchQuery.trim() !== "" ? (
                <DropdownMenuItem disabled>No results found</DropdownMenuItem>
              ) : (
                <DropdownMenuItem disabled>
                  Start typing to search
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative">
          <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {chatList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
              <p>No chats yet</p>
              <p className="mt-2 text-sm">
                Start a new chat by clicking the + button
              </p>
            </div>
          ) : (
            chatList.map((chat: Chat) => (
              <motion.button
                key={chat._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                onClick={() => setActiveChat(chat._id)}
                className={`w-full p-4 flex items-start gap-3 border-b ${
                  activeChat === chat._id ? "bg-orange-50" : ""
                }`}
              >
                <div className="relative">
                  {chat.isVendor === "vendors" ? (
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full flex justify-center items-center bg-orange-500 text-white text-[17px]">
                      {`${chat.name.charAt(0).toUpperCase()}${
                        chat.name.split(" ")[1]?.charAt(0).toUpperCase() || ""
                      }`}
                    </div>
                  )}
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-start justify-between">
                    <div className="truncate">
                      <p className="font-semibold truncate">{chat.name}</p>
                      <span className="text-xs text-orange-500">
                        {chat?.isVendor === "vendors" ? "Vendor" : "User"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(chat.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 truncate">
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
