import axios from "axios";

const API_BASE_URL = import.meta.env.API_URL;

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/user`,
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
