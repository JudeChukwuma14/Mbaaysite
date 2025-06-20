import axios from "axios";

const API_BASE_URL = "https://mbayy-be.vercel.app/api/v1/products";

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

// Update vendor product
export const updateVendorProduct = async (productId: string, data: any) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/edit/${productId}`,
      data
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete vendor product
export const deleteVendorProduct = async (productId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete/${productId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
