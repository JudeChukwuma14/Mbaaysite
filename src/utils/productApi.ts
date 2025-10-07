import axios from "axios";

const API_BASE_URL = "https://ilosiwaju-mbaay-2025.com";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/products`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const auction = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/products`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllProduct = async () => {
  try {
    const response = await api.get("/all");
    const contentType = response.headers["content-type"];
    if (!contentType?.includes("application/json")) {
      throw new Error("Received non-JSON response from server");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Could not fetch products from the server");
  }
};

export const searchProducts = async (word: string) => {
  try {
    const response = await api.get("/search", { params: { query: word } });
    const contentType = response.headers["content-type"];
    if (!contentType?.includes("application/json")) {
      throw new Error("Received non-JSON response from server");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Could not search products");
  }
};

export const getProductsById = async (productId: string) => {
  try {
    const response = await api.get(`/${productId}`);
    const contentType = response.headers["content-type"];
    if (!contentType?.includes("application/json")) {
      throw new Error("Received non-JSON response from server");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Could not fetch product ${productId}`);
  }
};

export const getAuctionProduct = async () => {
  try {
    const response = await auction.get("/view_all_auction_products");
    const contentType = response.headers["content-type"];
    if (!contentType?.includes("application/json")) {
      throw new Error("Received non-JSON response from server");
    }
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404 && error.response?.data?.message === "No auctions found") {
      return []; // Return empty array for "No auctions found"
    }
    throw new Error(error.response?.data?.message || "Could not fetch auction products");
  }
};

export const getAuctionById = async (productId: string) => {
  try {
    const response = await auction.get(`/view_an_auction_product/${productId}`);
    const contentType = response.headers["content-type"];
    if (!contentType?.includes("application/json")) {
      throw new Error("Received non-JSON response from server");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Could not fetch auction product ${productId}`);
  }
};

export const placeBid = async (productId: string, bidAmount: number, token: string) => {
  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }
  try {
    const response = await auction.patch(
      `/place_bid/${productId}`,
      { bidAmount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const contentType = response.headers["content-type"];
    if (!contentType?.includes("application/json")) {
      throw new Error("Received non-JSON response from server");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Could not place bid on ${productId}`);
  }
};

export const upgradeBid = async (productId: string, newBidAmount: number, authToken: string) => {
  if (!authToken) {
    throw new Error("Authentication token is missing. Please log in.");
  }
  try {
    const response = await auction.patch(
      `/upgrade_bid/${productId}`,
      { newBidAmount },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const contentType = response.headers["content-type"];
    if (!contentType?.includes("application/json")) {
      throw new Error("Received non-JSON response from server");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Could not upgrade bid on ${productId}`);
  }
};