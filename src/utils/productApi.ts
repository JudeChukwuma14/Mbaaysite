import axios from "axios";

const API_BASE_URL = "https://mbayy-be.vercel.app/api/v1/products";
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllProduct = async () => {
  try {
    const response = await api.get("/all");
    return response.data;
  } catch (error) {
    console.error("Oops! Something went wrong", error);
    throw new Error("Could not get all data from the server");
  }
};

export const searchProducts = async (word: string) => {
  try {
    const response = await api.get("/search", { params: { query: word } });
    console.log("Searching.....", response.data);
    return response.data; // Gives back the matching products
  } catch (error) {
    console.log("Search failed:", error);
    throw new Error("Couldn’t find products");
  }
};

export const getProductsById = async (productId: string) => {
  try {
    const response = await api.get(`/${productId}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
