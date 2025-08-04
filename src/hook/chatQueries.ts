import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  create_or_get_chat,
  sendMessage,
  getUserChats,
  getChatMessages,
  editMessage,
  deleteMessage,
  sendMediaMessage,
} from "../utils/vendorChatApi";

export const useChats = (token: string | null) => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: () => getUserChats(token),
    enabled: !!token,
  });
};

export const useMessages = (chatId: string, token: string | null) => {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => getChatMessages(chatId),
    enabled: !!chatId && !!token,
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

      queryClient.setQueryData(["messages", variables.chatId], (old: any) => [
        ...(old || []),
        {
          _id: `optimistic-${Date.now()}`,
          content: variables.content,
          sender: "You",
          timestamp: new Date().toISOString(),
          isVendor: false,
          replyTo: variables.replyTo,
          isOptimistic: true,
        },
      ]);

      return { previousMessages };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["messages", variables.chatId],
        context?.previousMessages
      );
    },
    onSettled: (variables: any) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
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
      formData,
      token,
    }: {
      chatId: string;
      formData: FormData;
      token: string | null;
    }) => sendMediaMessage(chatId, formData, token),
    onSuccess: (variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.chatId],
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
