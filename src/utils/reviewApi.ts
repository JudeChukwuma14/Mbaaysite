import axios from "axios";

const api = axios.create({
  baseURL: "https://ilosiwaju-mbaay-2025.com/api/v1",
  headers: { "Content-Type": "application/json" },
});

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  review?: {
    _id: string;
    productId: string;
    userId: string;
    rating: number;
    title: string;
    comment: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export const submitReviewApi = async (
  reviewData: CreateReviewRequest, 
  token: string
): Promise<ReviewResponse> => {
  try {
    console.log("Submitting review to API:", {
      ...reviewData,
      imagesCount: reviewData.images?.length || 0
    });
    
    const response = await api.post<ReviewResponse>("/reviews/create", reviewData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("API Response:", response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || "Review submission failed");
    }

    return response.data;
  } catch (error: any) {
    console.error("Review API Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error("Your session has expired. Please log in again.");
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid review data. Please check your input.");
    } else if (error.response?.status === 404) {
      throw new Error("Product not found or review endpoint not available.");
    } else if (error.response?.status === 500) {
      throw new Error("Server error. Please try again later.");
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to submit review. Please check your connection and try again."
    );
  }
};
