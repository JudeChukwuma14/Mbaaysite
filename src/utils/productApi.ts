import axios from "axios";

const API_BASE_URL = "https://mbayy-be.vercel.app/api/v1/products";
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const AUCTION_BASE_URL = "https://mbayy-be.onrender.com/api/v1/products";
export const auction = axios.create({
  baseURL: AUCTION_BASE_URL,
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

export const getAuctionProduct = async () => {
  try {
    const response = await auction.get("/view_all_auction_products");
    return response.data;
  } catch (error) {
    console.error("Error fetching auction products:", error);
    throw error; // Throw the error to be handled by the caller
  }
};


// Fetch single auction product by ID
export const getAuctionById = async (productId: string) => {
  try {
    const response = await auction.get(`/view_an_auction_product/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching auction product ${productId}:`, error);
    throw error;
  }
};

// Place a bid on a product
export const placeBid = async (productId: string, bidAmount: number, token: string) => {
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
    return response.data;
  } catch (error) {
    console.error(`Error placing bid on ${productId}:`, error);
    throw error;
  }
};


export const upgradeBid = async (productId: string, newBidAmount: number, authToken: string) => {
  if (!authToken) {
    console.error("No valid auth token provided for upgrading bid on product:", productId);
    throw new Error("Authentication token is missing. Please log in.");
  }
  try {
    console.log("Upgrading bid for product:", productId, "New Amount:", newBidAmount, "Token:", authToken);
    const response = await axios.patch(
      `${AUCTION_BASE_URL}/upgrade_bid/${productId}`,
      { newBidAmount },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Upgrade bid response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error upgrading bid on ${productId}:`, error);
    throw error;
  }
};