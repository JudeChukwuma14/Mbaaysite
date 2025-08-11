import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  create_or_get_chat,
  sendMessage,
  getUserChats,
  getChatMessages,
  editMessage,
  deleteMessage,
  sendMediaMessage,
  prepareMediaFormData,
} from "../utils/vendorChatApi";

export const useChats = (token: string | null) => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: () => getUserChats(token),
    enabled: !!token,
  });
};

export const useMessages = (chatId: string) => {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => getChatMessages(chatId),
    enabled: !!chatId,
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

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      chatId,
      content,
      token,
      replyTo,
    }: {
      chatId: string;
      content: string;
      token: string | null;
      replyTo?: string;
    }) => sendMessage(chatId, { content, replyTo }, token),
    onMutate: async (variables) => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: ["messages", variables.chatId],
      });

      const previousMessages = queryClient.getQueryData([
        "messages",
        variables.chatId,
      ]);

      // Fix: Handle the API response structure properly
      queryClient.setQueryData(["messages", variables.chatId], (old: any) => {
        // If old is an object with messages array (like {success: true, messages: [...]})
        if (old && old.messages && Array.isArray(old.messages)) {
          return {
            ...old,
            messages: [
              ...old.messages,
              {
                _id: `optimistic-${Date.now()}`,
                content: variables.content,
                sender: { _id: "current-user", name: "You", isVendor: false },
                createdAt: new Date().toISOString(),
                isVendor: false,
                replyTo: variables.replyTo,
                isOptimistic: true,
                files: [],
                deletedFor: "none",
              },
            ],
          };
        }
        // If old is directly an array
        else if (Array.isArray(old)) {
          return [
            ...old,
            {
              _id: `optimistic-${Date.now()}`,
              content: variables.content,
              sender: { _id: "current-user", name: "You", isVendor: false },
              createdAt: new Date().toISOString(),
              isVendor: false,
              replyTo: variables.replyTo,
              isOptimistic: true,
              files: [],
              deletedFor: "none",
            },
          ];
        }
        // If old is null/undefined, create new structure
        else {
          return {
            success: true,
            messages: [
              {
                _id: `optimistic-${Date.now()}`,
                content: variables.content,
                sender: { _id: "current-user", name: "You", isVendor: false },
                createdAt: new Date().toISOString(),
                isVendor: false,
                replyTo: variables.replyTo,
                isOptimistic: true,
                files: [],
                deletedFor: "none",
              },
            ],
          };
        }
      });

      return { previousMessages };
    },
    onError: (err, variables, context) => {
      console.log("Send message error:", err);
      queryClient.setQueryData(
        ["messages", variables.chatId],
        context?.previousMessages
      );
    },
    onSettled: (data, error, variables) => {
      // Fix: onSettled receives (data, error, variables) not just variables
      console.log("onSettled called with:", { data, error, variables });

      if (variables && variables.chatId) {
        queryClient.invalidateQueries({
          queryKey: ["messages", variables.chatId],
        });
        queryClient.invalidateQueries({ queryKey: ["chats"] });
      }
    },
  });
};

export const useEditMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      messageId,
      content,
      token,
    }: {
      messageId: string;
      content: string;
      token: string | null;
    }) => editMessage(messageId, { content }, token),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["messages"],
      });

      let chatIdForOptimisticUpdate: string | undefined;
      const allQueryData = queryClient.getQueriesData({
        queryKey: ["messages"],
      });

      for (const [queryKey, data] of allQueryData) {
        if (
          queryKey[0] === "messages" &&
          data &&
          typeof data === "object" &&
          "messages" in data &&
          Array.isArray(data.messages)
        ) {
          const foundMessage = data.messages.find(
            (msg: any) => msg._id === variables.messageId
          );
          if (foundMessage) {
            chatIdForOptimisticUpdate = queryKey[1] as string;
            break;
          }
        }
      }

      const previousMessages = chatIdForOptimisticUpdate
        ? queryClient.getQueryData(["messages", chatIdForOptimisticUpdate])
        : undefined;

      if (chatIdForOptimisticUpdate) {
        queryClient.setQueryData(
          ["messages", chatIdForOptimisticUpdate],
          (old: any) => {
            if (old && old.messages && Array.isArray(old.messages)) {
              return {
                ...old,
                messages: old.messages.map((msg: any) =>
                  msg._id === variables.messageId
                    ? { ...msg, content: variables.content, isEdited: true }
                    : msg
                ),
              };
            } else if (Array.isArray(old)) {
              return old.map((msg: any) =>
                msg._id === variables.messageId
                  ? { ...msg, content: variables.content, isEdited: true }
                  : msg
              );
            }
            return old;
          }
        );
      }

      return { previousMessages, chatId: chatIdForOptimisticUpdate };
    },
    onError: (err, _unused, context) => {
      console.error("Edit message error:", err);
      if (context?.chatId && context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", context.chatId],
          context.previousMessages
        );
      }
    },
    onSettled: (data, error, variables, context) => {
      console.log("onSettled for editMessage called with:", {
        data,
        error,
        variables,
        context,
      });

      const targetChatId = context?.chatId;
      if (targetChatId) {
        queryClient.invalidateQueries({
          queryKey: ["messages", targetChatId],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["messages"] });
      }
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      messageId,
      token,
    }: {
      messageId: string;
      token: string | null;
    }) => deleteMessage(messageId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

export const useSendMediaMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      chatId,
      files,
      token,
      content,
      replyTo,
    }: {
      chatId: string;
      files: { images?: File[]; video?: File };
      token: string | null;
      content?: string;
      replyTo?: string;
    }) => {
      const formData = prepareMediaFormData(files, content, replyTo);
      return sendMediaMessage(chatId, formData, token);
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["messages", variables.chatId],
      });

      const previousMessages = queryClient.getQueryData([
        "messages",
        variables.chatId,
      ]);

      // Create optimistic files array
      interface OptimisticFile {
        type: "image" | "video";
        url: string;
        name: string;
        size: number;
      }
      const optimisticFiles: OptimisticFile[] = [];
      if (variables.files.images) {
        variables.files.images.forEach((image) => {
          optimisticFiles.push({
            type: "image" as const,
            url: URL.createObjectURL(image),
            name: image.name,
            size: image.size,
          });
        });
      }
      if (variables.files.video) {
        optimisticFiles.push({
          type: "video" as const,
          url: URL.createObjectURL(variables.files.video),
          name: variables.files.video.name,
          size: variables.files.video.size,
        });
      }

      // Add optimistic media message
      queryClient.setQueryData(["messages", variables.chatId], (old: any) => {
        if (old && old.messages && Array.isArray(old.messages)) {
          return {
            ...old,
            messages: [
              ...old.messages,
              {
                _id: `optimistic-media-${Date.now()}`,
                content: variables.content || "",
                sender: { _id: "current-user", name: "You", isVendor: false },
                createdAt: new Date().toISOString(),
                isVendor: false,
                replyTo: variables.replyTo,
                isOptimistic: true,
                files: optimisticFiles,
                deletedFor: "none",
              },
            ],
          };
        } else if (Array.isArray(old)) {
          return [
            ...old,
            {
              _id: `optimistic-media-${Date.now()}`,
              content: variables.content || "",
              sender: { _id: "current-user", name: "You", isVendor: false },
              createdAt: new Date().toISOString(),
              isVendor: false,
              replyTo: variables.replyTo,
              isOptimistic: true,
              files: optimisticFiles,
              deletedFor: "none",
            },
          ];
        }
        return old;
      });

      return { previousMessages, chatId: variables.chatId };
    },
    onError: (err, _unused, context) => {
      console.error("Send media message error:", err);

      if (context?.chatId && context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", context.chatId],
          context.previousMessages
        );
      }
    },
    onSuccess: (_unused, variables) => {
      // Clean up object URLs to prevent memory leaks
      if (variables.files.images) {
        variables.files.images.forEach((image) => {
          URL.revokeObjectURL(URL.createObjectURL(image));
        });
      }
      if (variables.files.video) {
        URL.revokeObjectURL(URL.createObjectURL(variables.files.video));
      }

      // Invalidate queries to get fresh data
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.chatId],
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
