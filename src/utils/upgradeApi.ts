import axios from "axios";

const API_URL = "https://mbayy-be.vercel.app/api/v1/vendor";

export interface UpgradePlanPayload {
  token: string;
  currentPlan: string;
  newPlan: "Shelf" | "Counter" | "Shop";
  newCategories: string[];
}

export interface CraftCategoriesResponse {
  craftCategories: string[];
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
    console.log(response);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to upgrade plan");
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
