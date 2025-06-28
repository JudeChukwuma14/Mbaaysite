// src/api/cartApi.ts
import axios from "axios";

const API_URL = "https://mbayy-be.vercel.app/api/v1";

export const addToCart = async (
  sessionId: string,
  productId: string,
  quantity: number
) => {
  try {
    const response = await axios.post(
      `${API_URL}/products/addtocart`,
      { sessionId, productId, quantity },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to add item to cart");
  }
};


export const getCart = async (sessionId: string) => {
  try {
    const response = await axios.get(`${API_URL}/products/get/${sessionId}`);
    return response.data.cart.items; // Return only the items array
  } catch (error) {
    throw new Error("Failed to fetch cart");
  }
};

export const removeFromCart = async (sessionId: string, productId: string) => {
  try {
    const response = await axios.patch(
      `${API_URL}/products/removefromcart`,
      { sessionId, productId },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to remove item from cart");
  }
};

export const updateCartQuantity = async (sessionId: string, productId: string, quantity: number) => {
  try {
    const response = await axios.patch(
      `${API_URL}/products/update-quantity`,
      { sessionId, productId, quantity },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update cart quantity");
  }
};