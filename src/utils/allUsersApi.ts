import axios from "axios";

const API_BASE_URL = "https://ilosiwaju-mbaay-2025.com/api/v1/user";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getAllUsers = async () => {
  try {
    const response = await api.get("/alll_users");
    console.log(response.data.data, "All users");
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
