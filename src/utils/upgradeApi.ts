import axios from "axios";

const API_URL = "https://ilosiwaju-mbaay-2025.com/api/v1/vendor";

export interface CraftCategoriesResponse {
  craftCategories: string[];
}

export interface UpgradePlanPayload {
  token: string;
  newPlan: "Starter plus" | "Shelf" | "Counter" | "Shop" | "Premium";
  newCategories: string[];
  billingCycle: "Monthly" | "Quarterly" | "HalfYearly" | "Yearly";
}

export const upgradePlan = async (payload: UpgradePlanPayload) => {
  try {
    const { token, ...data } = payload;

    const response = await axios.patch(`${API_URL}/upgrade_plan`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
   console.log("up", response)
    return response.data;
  } catch (error: any) {
    console.log("error", error)
    throw new Error(error.response?.data?.message || "Failed to upgrade plan");
  }
};

export const verifySubscriptionPayment = async (reference: string) => {
  try {
    const response = await axios.patch(
      `${API_URL}/verify_subscription_payment?reference=${reference}`,
      {}
    );
    console.log("res" + reference);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to verify payment"
    );
  }
};

export const getCraftCategories = async (token: string) => {
  try {
    const response = await axios.get<CraftCategoriesResponse>(
      `${API_URL}/user_craft_categories`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.craftCategories;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch craft categories"
    );
  }
};
