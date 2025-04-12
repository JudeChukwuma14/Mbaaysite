import axios from "axios";


const API_BASE_URL = "https://mbayy-be.onrender.com/api/v1/products";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadVendorProduct = async (
  token: string,
  productData: FormData
) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/upload_products`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error uploading vendor product:", error);
    throw error;
  }
};

export const getVendorProducts = async (token: any) => {
  ``;
  try {
    const response = await api.get(`${API_BASE_URL}/uploaded-products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response.data.products;
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    throw error;
  }
};

export const getVendorProductById = async (productId: string) => {
  try {
    const response = await api.get(`${API_BASE_URL}/${productId}`);
    console.log(response);
    return response.data.product;
  } catch (error) {
    console.error("Error fetching vendor product by ID:", error);
    throw error;
  }
};

