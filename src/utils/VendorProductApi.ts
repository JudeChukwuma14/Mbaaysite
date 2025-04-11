import axios from "axios";

const URL = "https://mbayy-be.onrender.com/api/v1/products";

export const uploadVendorProduct = async (
  token: string,
  productData: FormData
) => {
  try {
    const response = await axios.post(`${URL}/upload_products`, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
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
    const response = await axios.get(`${URL}/uploaded}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    throw error;
  }
};

export const getVendorProductById = async (productId: string) => {
  try {
    const response = await axios.get(`${URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor product by ID:", error);
    throw error;
  }
};
