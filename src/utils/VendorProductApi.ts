import axios from "axios";

const URL = "https://mbayy-be.onrender.com";
// const URL = "https://mbayy-be.onrender.com/api/v1/vendor"

export const uploadVendorProduct = async (
  vendorId: string,
  productData: FormData
) => {
  try {
    const response = await axios.post(
      `${URL}/upload/${vendorId}`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading vendor product:", error);
    throw error;
  }
};

export const getVendorProducts = async (vendorId: string) => {
  try {
    const response = await axios.get(`${URL}/products/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    throw error;
  }
};

export const getVendorProductById = async (
  vendorId: string,
  productId: string
) => {
  try {
    const response = await axios.get(
      `${URL}/products/${vendorId}/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor product by ID:", error);
    throw error;
  }
};
