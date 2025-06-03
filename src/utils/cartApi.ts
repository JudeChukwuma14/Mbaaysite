import axios from 'axios';

const API_BASE_URL = 'https://mbayy-be.onrender.com/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const addToCart = async (sessionId: string, productId: string, quantity: number) => {
  try {
    const response = await api.post('/products/addtocart', { sessionId, productId, quantity });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add to cart');
  }
};

export const getCart = async (sessionId: string) => {
  try {
    const response = await api.get(`/cart/get/${sessionId}`);
    console.log('getCart response:', response.data); // Debug response
    return response.data.items || response.data; // Adjust based on API response structure
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch cart');
  }
};

export const removeFromCart = async (sessionId: string, productId: string) => {
  try {
    const response = await api.patch('/products/removefromcart', { sessionId, productId });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to remove from cart');
  }
};

export const updateCartQuantity = async (sessionId: string, productId: string, quantity: number) => {
  try {
    const response = await api.patch('/products/update-quantity', { sessionId, productId, quantity });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update cart quantity');
  }
};