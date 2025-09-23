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
      await queryClient.cancelQueries({
        queryKey: ["messages", variables.chatId],
      });

      const prev = queryClient.getQueryData(["messages", variables.chatId]);

      const optimisticMessage = {
        _id: `opt-${Date.now()}`,
        content: variables.content,
        replyTo: variables.replyTo,
        sender: {
          _id: "current-user",
          name: "You",
          isVendor: false,
        },
        createdAt: new Date().toISOString(),
        isOptimistic: true,
        files: [],
        deletedFor: "none",
        isEdited: false,
      };

      queryClient.setQueryData(["messages", variables.chatId], (old: any) => {
        // server returns { success:true, messages:[...] }
        if (old?.messages && Array.isArray(old.messages)) {
          return { ...old, messages: [...old.messages, optimisticMessage] };
        }
        // fallback (should never happen)
        return { success: true, messages: [optimisticMessage] };
      });

      return { previousMessages: prev };
    },

    onError: (_err, variables, context) => {
      queryClient.setQueryData(
        ["messages", variables.chatId],
        context?.previousMessages // ← was previousMessage
      );
    },
    onSettled: (_data, _error, variables) => {
      // Soft re-fetch so the server id replaces the optimistic one
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.chatId],
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
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
    onSuccess: async (_unused, _, context) => {
      const targetChatId = context?.chatId;
      if (targetChatId) {
        await queryClient.refetchQueries({
          queryKey: ["messages", targetChatId],
          type: "active",
        });
      } else {
        await queryClient.refetchQueries({
          queryKey: ["messages"],
          type: "active",
        });
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
      await queryClient.cancelQueries({
        queryKey: ["messages", variables.chatId],
      });

      const prev = queryClient.getQueryData(["messages", variables.chatId]);

      const optimisticFiles = [];
      variables.files.images?.forEach((f) =>
        optimisticFiles.push({
          type: "image" as const,
          url: URL.createObjectURL(f),
          name: f.name,
          size: f.size,
        })
      );
      if (variables.files.video)
        optimisticFiles.push({
          type: "video" as const,
          url: URL.createObjectURL(variables.files.video),
          name: variables.files.video.name,
          size: variables.files.video.size,
        });

      const optimisticMsg = {
        _id: `opt-media-${Date.now()}`,
        content: variables.content || "",
        sender: { _id: "current-user", name: "You", isVendor: false },
        createdAt: new Date().toISOString(),
        isVendor: false,
        replyTo: variables.replyTo,
        isOptimistic: true,
        files: optimisticFiles,
        deletedFor: "none",
      };

      queryClient.setQueryData(["messages", variables.chatId], (old: any) => {
        if (old?.messages)
          return { ...old, messages: [...old.messages, optimisticMsg] };
        return { success: true, messages: [optimisticMsg] };
      });

      return { previousMessages: prev, chatId: variables.chatId };
    },

    onError: (_err, _vars, context) => {
      if (context?.chatId && context?.previousMessages)
        queryClient.setQueryData(
          ["messages", context.chatId],
          context.previousMessages
        );
    },

    onSuccess: (serverMsg, vars) => {
      // clean up blob URLs
      vars.files.images?.forEach((f) =>
        URL.revokeObjectURL(URL.createObjectURL(f))
      );
      if (vars.files.video)
        URL.revokeObjectURL(URL.createObjectURL(vars.files.video));

      // swap optimistic entry for real one
      queryClient.setQueryData(["messages", vars.chatId], (old: any) => {
        if (!old?.messages) return old;
        return {
          ...old,
          messages: old.messages.map((m: any) =>
            m._id.startsWith("opt-media-") ? serverMsg : m
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
