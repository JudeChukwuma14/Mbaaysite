// src/api/sidebar-queries.ts
import { getAllUsers } from "@/utils/allUsersApi";
import { getAlllVendor } from "@/utils/vendorApi";
import { create_or_get_chat, getUserChats } from "@/utils/vendorChatApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
