import { useState, useRef, useMemo, useCallback, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MessageCircle, Users, Clock } from "lucide-react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserChats } from "@/utils/vendorChatApi";
import { useSocket } from "./Inbox"; // or wherever you keep it
// Constants
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
  typingMap: Record<string, boolean>;
}

// Utility functions
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffInHours < 48) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
};

const getInitials = (name: string) => {
  return `${name.charAt(0).toUpperCase()}${
    name.split(" ")[1]?.charAt(0).toUpperCase() || ""
  }`;
};

const getContactName = (contact: Contact) => {
  return contact?.storeName || contact?.name;
};

// Skeleton loading component
const ChatSkeleton = memo(() => (
  <div className="flex items-start gap-3 p-4 border-b animate-pulse">
    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
    <div className="flex-1 space-y-2">
      <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
      <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
    </div>
  </div>
));
/* ----------  TYPING HOOK  ---------- */
// const useTypingMap = () => {
//   const [typingMap, setTypingMap] = useState<Record<string, boolean>>({});
//   const socket = useSocket(useSelector((s: any) => s.vendor.token));

//   useEffect(() => {
//     if (!socket) return;

//     const onTyping = ({ chatId }: { chatId: string }) =>
//       setTypingMap((m) => ({ ...m, [chatId]: true }));
//     const onStopTyping = ({ chatId }: { chatId: string }) =>
//       setTypingMap((m) => ({ ...m, [chatId]: false }));

//     socket.on("typing", onTyping);
//     socket.on("stopTyping", onStopTyping);

//     return () => {
//       socket.off("typing", onTyping);
//       socket.off("stopTyping", onStopTyping);
//     };
//   }, [socket]);

//   // ✅ RETURN THE TYPING MAP INSTEAD OF A FUNCTION
//   return typingMap;
// };

// Memoized contact item component
const ContactItem = memo(
  ({
    contact,
    onSelect,
  }: {
    contact: Contact;
    onSelect: (contact: Contact) => void;
  }) => (
    <DropdownMenuItem onSelect={() => onSelect(contact)}>
      <div className="flex items-center w-full gap-3">
        <div className="relative">
          {contact.avatar ? (
            <img
              src={contact.avatar}
              alt={contact.name}
              className="object-cover w-8 h-8 rounded-full"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 text-gray-500 bg-gray-200 rounded-full">
              {getInitials(getContactName(contact))}
            </div>
          )}
          <div
            className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
              contact.isVendor ? "bg-orange-500" : "bg-blue-500"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{getContactName(contact)}</p>
          <p className="text-xs text-gray-500 truncate">
            {contact.storeName ? "Vendor" : "User"}
          </p>
        </div>
      </div>
    </DropdownMenuItem>
  )
);

// Memoized chat item component
const ChatItem = memo(
  ({
    chat,
    isActive,
    onSelect,

    typingMap, // ← rename prop to match parent

  }: {
    chat: Chat;
    isActive: boolean;
    onSelect: (chatId: string) => void;

    typingMap: Record<string, boolean>; // ← correct type
  }) => {
    const isVendor = chat.isVendor === "vendors";
    const hasAvatar = chat.avatar && chat.avatar !== "/placeholder.svg";
    const lastLine = chat.lastMessage || "Media";


    return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ backgroundColor: "rgba(249, 115, 22, 0.05)" }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(chat._id)}
        className={`w-full p-4 flex items-start gap-3 border-b transition-all duration-200 ${
          isActive
            ? "bg-orange-50 border-l-4 border-l-orange-500"
            : "hover:bg-gray-50"
        }`}
      >

        {/* avatar / online dot */}

        <div className="relative">
          {hasAvatar ? (
            <img
              src={chat.avatar}
              alt={chat.name}
              className="object-cover w-12 h-12 rounded-full"
              loading="lazy"
            />
          ) : (
            <div
              className={`flex items-center justify-center w-12 h-12 text-white rounded-full text-[17px] font-bold shadow-lg ${
                isVendor
                  ? "bg-gradient-to-br from-orange-500 to-orange-600"
                  : "bg-gradient-to-br from-blue-500 to-blue-600"
              }`}
            >
              {getInitials(chat.name)}
            </div>
          )}
          {chat.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
          )}
        </div>


        {/* text column */}

        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-start justify-between">
            <div className="truncate">
              <p className="font-semibold text-gray-900 truncate">
                {chat.name}
              </p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  isVendor
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {isVendor ? "Vendor" : "User"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
              <Clock className="w-3 h-3" />
              {formatTime(chat.timestamp)}
            </div>
          </div>


          <p className="mt-2 text-sm leading-relaxed text-gray-600 truncate">
            {lastLine}
          </p>

          {/* typing indicator */}
          {typingMap[chat._id] && (
            <span className="flex items-center gap-1 mt-1 text-xs text-gray-500">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              typing…
            </span>
          )}

        </div>
      </motion.button>
    );
  }
);

// const ChatItem = memo(
//   ({
//     chat,
//     isActive,
//     onSelect,
//     Typing,
//   }: {
//     chat: Chat;
//     isActive: boolean;
//     onSelect: (chatId: string) => void;
//     Typing: Record<string, boolean>;
//   }) => {
//     const isVendor = chat.isVendor === "vendors";
//     const hasAvatar = chat.avatar && chat.avatar !== "/placeholder.svg";
//     const lastLine = chat.lastMessage || "Media";
//     return (
//       <motion.button
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -20 }}
//         whileHover={{ backgroundColor: "rgba(249, 115, 22, 0.05)" }}
//         whileTap={{ scale: 0.98 }}
//         onClick={() => onSelect(chat._id)}
//         className={`w-full p-4 flex items-start gap-3 border-b transition-all duration-200 ${
//           isActive
//             ? "bg-orange-50 border-l-4 border-l-orange-500"
//             : "hover:bg-gray-50"
//         }`}
//       >
//         <div className="relative">
//           {hasAvatar ? (
//             <img
//               src={chat.avatar}
//               alt={chat.name}
//               className="object-cover w-12 h-12 rounded-full"
//               loading="lazy"
//             />
//           ) : (
//             <div
//               className={`flex items-center justify-center w-12 h-12 text-white rounded-full text-[17px] font-bold shadow-lg ${
//                 isVendor
//                   ? "bg-gradient-to-br from-orange-500 to-orange-600"
//                   : "bg-gradient-to-br from-blue-500 to-blue-600"
//               }`}
//             >
//               {getInitials(chat.name)}
//             </div>
//           )}
//           {chat.isOnline && (
//             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
//           )}
//         </div>
//         <div className="flex-1 min-w-0 text-left">
//           <div className="flex items-start justify-between">
//             <div className="truncate">
//               <p className="font-semibold text-gray-900 truncate">
//                 {chat.name}
//               </p>
//               <span
//                 className={`text-xs px-2 py-1 rounded-full ${
//                   isVendor
//                     ? "bg-orange-100 text-orange-700"
//                     : "bg-blue-100 text-blue-700"
//                 }`}
//               >
//                 {isVendor ? "Vendor" : "User"}
//               </span>
//             </div>
//             <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
//               <Clock className="w-3 h-3" />
//               {formatTime(chat.timestamp)}
//             </div>
//           </div>
//           <p className="mt-2 text-sm leading-relaxed text-gray-600 truncate">
//             {lastLine}
//           </p>
//           {Typing[chat._id] && (
//             <span className="flex items-center gap-1 mt-1 text-xs text-gray-500">
//               <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
//               typing…
//             </span>
//           )}
//         </div>
//       </motion.button>
//     );
//   }
// );


export function ChatListSidebar({
  activeChat,
  setActiveChat,
  onNewChatCreated,
  typingMap,
}: ChatListSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: any) => state.vendor);

  const {
    data: my_chats,
    isLoading: isChatsLoading,
    error: chatsError,
    refetch: refetchChats,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: () => getUserChats(user.token),
    refetchInterval: 30000,
    staleTime: 10000,
  });

  const { data: searchResults = [], isLoading: isSearchLoading } =
    useSearchContacts(searchQuery);
  const createChatMutation = useCreateOrGetChat();

  const handleSelectContact = useCallback(
    async (contact: Contact) => {
      try {
        const result = await createChatMutation.mutateAsync({
          receiverId: contact._id,
          token: user.token,
        });

        const newChat: Chat = {
          _id: result.chatId,
          name: getContactName(contact),
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
        refetchChats();
      } catch (error) {
        // Error handling is managed by the mutation
      }
    },
    [
      createChatMutation,
      user.token,
      onNewChatCreated,
      setActiveChat,
      refetchChats,
    ]
  );

  // Helper function to get the other participant in the chat
  const getOtherParticipant = useCallback(
    (participants: any[], currentUserId: any) => {
      return (
        participants?.find((p) => p.participantId !== currentUserId) ||
        participants?.[1]
      );
    },
    []
  );

  // Transform API response to match Chat interface with useMemo for performance
  const queryClient = useQueryClient();

  const chatList = useMemo(() => {
    return (
      my_chats?.map((chat: ApiChat) => {
        const participant = getOtherParticipant(
          chat.participants,
          user.vendor._id
        );


        // read cached messages for this chat (no hook inside loop)
        const cached = queryClient.getQueryData(["messages", chat._id]) as any;
        const chatMessages = cached?.messages ?? [];

        const lastMsg =
          chatMessages.length > 0
            ? chatMessages[chatMessages.length - 1]
            : chat.lastMessage;


        return {
          _id: chat._id,
          name: participant?.details?.name || participant?.details?.storeName,
          avatar:
            participant?.profileImage ||
            participant?.details?.avatar ||
            "/placeholder.svg",
          lastMessage: lastMsg?.content || lastMsg?.name || "Media",
          timestamp: lastMsg?.createdAt || chat.updatedAt,
          isVendor: participant?.model || false,
          isOnline: participant?.isOnline || false,
          messages: chatMessages,
        };
      }) || []
    );
  }, [my_chats, getOtherParticipant, user.vendor._id, queryClient]);

  // const typingMap = useMemo(() => {
  //   const map: Record<string, boolean> = {};
  //   chats.forEach((chat:any) => {
  //     const other = chat.participants?.find(
  //       (p) => p.participantId !== user.vendor._id
  //     );
  //     if (other) map[chat._id] = isTyping(other.participantId);
  //   });
  //   return map;
  // }, [chatList, isTyping, user.vendor._id]);
  console.log("chatList", chatList);
  const socket = useSocket(user.token);
  useEffect(() => {
    if (!socket) return;
    chatList.forEach((c: any) => socket.emit("joinChat", c._id));
    return () => {
      chatList.forEach((c: any) => socket.emit("leaveChat", c._id));
    };
  }, [socket, chatList]);
  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chatList;
    const query = searchQuery.toLowerCase();
    return chatList.filter(
      (chat: any) =>
        chat.name.toLowerCase().includes(query) ||
        chat.lastMessage.toLowerCase().includes(query)
    );
  }, [chatList, searchQuery]);


  useEffect(() => {
    if (!socket) return;

    const ids = chatList.map((c: any) => c._id).filter(Boolean);
    ids.forEach((id: any) => socket.emit("joinChat", id));

    return () => {
      ids.forEach((id: any) => socket.emit("leaveChat", id));
    };
  }, [socket, chatList]);


  const handleChatSelect = useCallback(
    (chatId: string) => {
      setActiveChat(chatId);
    },
    [setActiveChat]
  );

  // Loading state with skeleton
  if (isChatsLoading) {
    return (
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex flex-col bg-white border-r w-80"
      >
        <div className="flex-shrink-0 p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {Array.from({ length: 8 }).map((_, index) => (
            <ChatSkeleton key={index} />
          ))}
        </div>
      </motion.div>
    );
  }

  // Error state
  if (chatsError) {
    return (
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex flex-col items-center justify-center p-4 text-center text-red-500 bg-white border-r w-80"
      >
        <div className="p-4 rounded-lg bg-red-50">
          <p className="font-semibold">Error loading chats</p>
          <p className="mt-2 text-sm text-red-600">Please try again later</p>
          <button
            onClick={() => refetchChats()}
            className="px-4 py-2 mt-3 text-sm text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex flex-col bg-white border-r shadow-lg w-80"
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b bg-gradient-to-r from-orange-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-bold text-gray-900">Chats</h1>
          </div>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <motion.button
                className="p-2 transition-colors rounded-full hover:bg-orange-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5 text-orange-500" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[320px] p-2 mr-60 shadow-xl border-0">
              <DropdownMenuItem className="font-semibold text-orange-600">
                <Users className="w-4 h-4 mr-2" />
                New Chat
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="relative mb-2">
                <Input
                  type="text"
                  placeholder="Search users/vendors..."
                  className="w-full py-2 pl-8 pr-2 text-sm border-0 rounded-md bg-gray-50 focus:ring-2 focus:ring-orange-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  ref={searchInputRef}
                />
                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-2 top-1/2" />
              </div>

              {isSearchLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Spinner className="w-5 h-5 text-orange-500" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="overflow-y-auto max-h-60">
                  {searchResults.map((contact: Contact) => (
                    <ContactItem
                      key={contact._id}
                      contact={contact}
                      onSelect={handleSelectContact}
                    />
                  ))}
                </div>
              ) : searchQuery.trim() !== "" ? (
                <DropdownMenuItem disabled className="text-gray-500">
                  No results found
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem disabled className="text-gray-500">
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
            className="w-full py-2 pl-10 pr-4 text-sm transition-all duration-200 border-0 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <AnimatePresence mode="wait">
          {filteredChats.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500"
            >
              <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-semibold text-gray-400">
                No chats yet
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Start a new chat by clicking the + button
              </p>
            </motion.div>
          ) : (
            filteredChats.map((chat: Chat) => (
              <ChatItem
                key={chat._id}
                chat={chat}
                isActive={activeChat === chat._id}
                onSelect={handleChatSelect}
                typingMap={typingMap}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
