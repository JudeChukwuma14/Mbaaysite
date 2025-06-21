import axios from "axios";

const BASE_URL = "https://mbayy-be.vercel.app/api/v1/vendor";

export interface CreateRecipientCodePayload {
  account_number: string;
  bank_code: string;
  bankName: string;
  name: string;
}

export const createRecipientCode = async (
  token: string,
  accountData: CreateRecipientCodePayload
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/create_recipient_code`,
      accountData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);

    if (!response.data.recipient_code) {
      console.error("Recipient code missing in response:", response.data);
      throw new Error("Recipient code not found in response");
    }

    return {
      ...response.data,
      bankName: accountData.bankName, // Corrected to use bankName instead of name
    };
  } catch (error) {
    console.error("API Error Details:", error);

    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      const errorData = error.response?.data;
      const status = error.response?.status;

      let errorMessage =
        errorData?.message ||
        errorData?.error ||
        error.message ||
        "Failed to create recipient code";

      // Customize error messages based on status code
      switch (status) {
        case 400:
          if (errorData?.error?.includes("account number")) {
            errorMessage = "Invalid account number provided";
          } else if (errorData?.error?.includes("bank code")) {
            errorMessage = "Invalid bank code provided";
          }
          break;
        case 401:
          errorMessage = "Session expired. Please login again";
          break;
        case 500:
          errorMessage = "Server error. Please try again later";
          break;
      }

      throw new Error(errorMessage);
    }

    // Handle non-Axios errors
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Network error occurred while creating recipient code");
  }
};
