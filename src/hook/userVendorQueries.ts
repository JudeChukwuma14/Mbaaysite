// src/api/sidebar-queries.ts
import { getAllUsers } from "@/utils/allUsersApi";
import { getAlllVendor } from "@/utils/vendorApi";
import {
  create_or_get_chat,
  getUserChats,
  getUnreadChatCount,
  markChatAsRead,
} from "@/utils/vendorChatApi";
import {
  getVendorReviews,
  replyToReview,
  sendPrivateReviewMessage,
} from "@/utils/vendorApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useVendors = () => {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      try {
        const data = await getAlllVendor();
        // Ensure we always return an array
        console.log(data);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching vendors:", error);
        return []; // Return empty array on error
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const data = await getAllUsers();
        console.log(data);
        // Ensure we always return an array
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching users:", error);
        return []; // Return empty array on error
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateOrGetChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ receiverId, token }: { receiverId: string; token: any }) =>
      create_or_get_chat({ receiverId }, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

export const useSearchContacts = (searchQuery: string) => {
  const { data: vendors = [], isLoading: vendorsLoading } = useVendors();
  const { data: users = [], isLoading: usersLoading } = useUsers();

  const filteredVendors = vendors.filter((vendor: any) =>
    vendor?.storeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter((user: any) =>
    user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    data: [...filteredVendors, ...filteredUsers],
    isLoading: vendorsLoading || usersLoading,
  };
};

export const useUserChats = (token: string | null) => {
  return useQuery({
    queryKey: ["user-chats", token], // include token so cache clears on logout
    queryFn: () => getUserChats(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 2, // 2 min – tune to taste
    retry: 1,
  });
};

// Unread count for chats (by user/vendor id)
export const useUnreadChatCount = (userId: string | null | undefined) => {
  return useQuery({
    queryKey: ["unread-chat-count", userId],
    queryFn: async () => {
      if (!userId) return { count: 0 };
      const data = await getUnreadChatCount(userId);
      // Backend shape:
      // { success: true, data: [{ chatId: string, unreadCount: number }, ...] }
      try {
        const items = Array.isArray(data?.data) ? data.data : [];
        const chats: Record<string, number> = {};
        let total = 0;
        for (const it of items) {
          const cId = String(it?.chatId ?? "");
          const c = Number(it?.unreadCount ?? 0);
          if (!cId) continue;
          chats[cId] = c;
          total += c;
        }
        return { count: total, chats } as any;
      } catch {
        // Fallback compatibility: number or {count}
        if (typeof data === "number") return { count: data } as any;
        return { count: Number((data as any)?.count || 0) } as any;
      }
    },
    enabled: !!userId,
    refetchInterval: 15000,
    staleTime: 10000,
  });
};

// Mark an entire chat as read for a given user/vendor id
export const useMarkChatAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      chatId,
      userId,
    }: {
      chatId: string;
      userId: string;
    }) => markChatAsRead(chatId, userId),
    onSuccess: (_data, variables) => {
      // Refresh chats list and unread badge
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      // Invalidate the specific unread count for this user
      queryClient.invalidateQueries({
        queryKey: ["unread-chat-count", variables.userId],
      });

      // Optimistically set this chat's unread to 0 and recompute total
      queryClient.setQueryData(
        ["unread-chat-count", variables.userId],
        (prev: any) => {
          try {
            const chats = { ...(prev?.chats || {}) } as Record<string, number>;
            if (variables.chatId) chats[variables.chatId] = 0;
            const total = Object.values(chats).reduce(
              (a, b) => a + (Number(b) || 0),
              0
            );
            return { count: total, chats } as any;
          } catch {
            // Fallback simple decrement
            const prevCount = Number(prev?.count ?? 0);
            return { count: Math.max(0, prevCount - 1) } as any;
          }
        }
      );
      // Also update this chat's messages cache to mark my sent messages as read
      queryClient.setQueryData(["messages", variables.chatId], (prev: any) => {
        if (!prev) return prev;
        try {
          const updated = {
            ...prev,
            messages: Array.isArray(prev.messages)
              ? prev.messages.map((m: any) =>
                  m?.isMe && m?.status !== "read" ? { ...m, status: "read" } : m
                )
              : prev.messages,
          };
          return updated;
        } catch {
          return prev;
        }
      });
    },
  });
};

// Hook for fetching vendor reviews (with optional paging and status filter)
export const useVendorReviews = (params: { token?: string | null }) => {
  const { token } = params || {};
  return useQuery({
    queryKey: ["vendorReviews", { token }],
    queryFn: () => getVendorReviews(token ?? null),
    enabled: !!token,
    staleTime: 1000 * 60 * 3, // 3 minutes
    retry: 1,
  });
};

// Mutation: reply publicly or privately to a review
export const useReplyToReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reviewId,
      payload,
    }: {
      reviewId: string;
      payload: { message: string; isPublic?: boolean; reviewId?: string };
    }) => {
      if (!payload?.message || !payload.message.trim())
        throw new Error("Reply message is required");
      return replyToReview(reviewId, payload);
    },
    // Optimistic update: update all vendorReviews queries so UI updates regardless of key shape
    onMutate: async (variables) => {
      const { reviewId, payload } = variables as any;

      // find all queries that start with ['vendorReviews']
      const queries = queryClient.getQueriesData({
        queryKey: ["vendorReviews"],
      });
      await queryClient.cancelQueries({ queryKey: ["vendorReviews"] });

      const previous: Array<any> = queries.map(([k, data]: any) => [k, data]);

      try {
        for (const [key] of queries) {
          queryClient.setQueryData(key, (old: any) => {
            if (!old) return old;
            const cloned = { ...old };
            const reviews = Array.isArray(cloned.reviews) ? cloned.reviews : [];
            cloned.reviews = reviews.map((r: any) => {
              const idMatches = String(r._id ?? r.id) === String(reviewId);
              if (!idMatches) return r;
              return {
                ...r,
                vendorReply: {
                  message: payload.message.trim(),
                  repliedAt: new Date().toISOString(),
                  repliedBy: "you",
                  isPublic: payload.isPublic !== false,
                },
              };
            });
            return cloned;
          });
        }
      } catch (e) {
        // ignore optimistic update failures
      }

      return { previous };
    },
    onError: (error: any, _variables, context: any) => {
      const prev = context?.previous as Array<any> | undefined;
      if (prev) {
        for (const [key, data] of prev) {
          queryClient.setQueryData(key, data);
        }
      }
      console.error("Failed to reply review:", error);
      toast.error(error.message || "Failed to reply review");
    },
    onSuccess: (_data, _variables) => {
      // invalidate vendor reviews to refetch authoritative data
      queryClient.invalidateQueries({ queryKey: ["vendorReviews"] });
      toast.success("Replied to review successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorReviews"] });
    },
  });
};

// Mutation: send a private message related to a review (vendor <-> customer)
export const useSendPrivateReviewMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      body,
    }: {
      token?: string | null;
      body: { reviewId: string; message: string; messageType?: string };
    }) => sendPrivateReviewMessage(token ?? null, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorReviews"] });
      toast.success("Private message sent", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: any) => {
      console.error("Failed to send private message:", error);
      toast.error(error.message || "Failed to send message");
    },
  });
};
