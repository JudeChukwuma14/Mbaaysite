import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRecipientCode,
  type CreateRecipientCodePayload,
} from "@/utils/recipientCodeApi";
import { toast } from "react-toastify";
import { bankCodes } from "@/components/VendorInfo/Setting/EditVendorProfile";

export const useCreateRecipientCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      accountData,
    }: {
      token: string;
      accountData: CreateRecipientCodePayload;
    }) => createRecipientCode(token, accountData),
    onSuccess: (data, variables) => {
      // Find the bank name from bankCodes
      const bank = bankCodes.find(
        (b) => b.code === variables.accountData.bank_code
      );
      const bankName = bank?.name || variables.accountData.name;

      // Update the vendor cache
      queryClient.setQueryData(["vendor"], (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            recipientCode: data.recipient_code,
            accountNumber: variables.accountData.account_number,
            accountName: variables.accountData.name,
            bankCode: variables.accountData.bank_code,
            bankName: bankName,
            recipientData: data,
          };
        }
        return oldData;
      });

      toast.success("Account details saved successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      console.error("Recipient code creation failed:", error);

      let errorMessage =
        error.message || "Failed to create recipient code. Please try again.";

      // More specific error messages
      if (error.message.includes("account number")) {
        errorMessage = "Invalid account number. Please verify and try again.";
      } else if (error.message.includes("bank code")) {
        errorMessage = "Invalid bank selected. Please try another bank.";
      } else if (error.message.includes("Session expired")) {
        errorMessage = "Your session has expired. Please login again.";
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    },
  });
};
