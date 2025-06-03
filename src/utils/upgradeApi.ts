import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const API_URL = "https://mbayy-be.onrender.com/api/v1";

// Function to upgrade vendor plan
export const upgradeVendorPlan = async ({
  newPlan,
  categories,
  token,
}: {
  newPlan: string;
  categories: string[];
  token: string;
}) => {
  try {
    const response = await axios.patch(
      `${API_URL}/upgrade_plan`,
      { newPlan, categories },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error upgrading plan:", error);
    throw error;
  }
};

// Custom hook for upgrading vendor plan
export const useUpgradeVendorPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upgradeVendorPlan,
    onSuccess: (variables) => {
      toast.success(`Successfully upgraded to ${variables.newPlan} plan!`);

      // Invalidate and refetch vendor data to get updated plan information
      queryClient.invalidateQueries({ queryKey: ["vendor"] });

      // You can also update the cache directly if you know the structure
      queryClient.setQueryData(["vendor"], (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            vendorPlan: variables.newPlan,
            craftCategories: variables.categories,
          };
        }
        return oldData;
      });
    },
    onError: (error) => {
      console.error("Error upgrading plan:", error);
      toast.error("Failed to upgrade plan. Please try again.");
    },
  });
};
