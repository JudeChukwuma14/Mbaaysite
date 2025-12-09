import axios from "axios";

const api = axios.create({
  baseURL: "https://ilosiwaju-mbaay-2025.com/api/v1",
  headers: { "Content-Type": "application/json" },
});

export interface Review {
  _id: string;
  product: string;
  reviewer: string;
  reviewerType: string;
  reviewerName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  status: string;
  helpful: number;
  images: string[];
  vendorPrivateMessages: any[];
  vendorReply?: {
    isPublic: boolean;
    reply?: string;
    repliedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
    verifiedReviewsCount: number;
  };
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  review?: Review;
}

export const submitReviewApi = async (
  reviewData: CreateReviewRequest,
  token: string,
  userId: string // Add userId parameter
): Promise<CreateReviewResponse> => {
  try {
    console.log("Submitting review to API:", {
      ...reviewData,
      imagesCount: reviewData.images?.length || 0,
      userId: userId, // Log userId
    });

    // Update the endpoint to include userId
    const response = await api.post<CreateReviewResponse>(
      `/reviews/create/${userId}`,
      {
        ...reviewData,
        // Make sure images is always an array (even if empty)
        images: reviewData.images || [],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Response:", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message || "Review submission failed");
    }
    return response.data;
  } catch (error: any) {
    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error("Your session has expired. Please log in again.");
    } else if (error.response?.status === 400) {
      throw new Error(
        error.response?.data?.message ||
          "Invalid review data. Please check your input."
      );
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

// In your reviewApi.ts file, update the getProductReviews function:

export const getProductReviews = async (
  productId: string,
  page: number = 1,
  limit: number = 10
): Promise<ReviewsResponse> => {
  try {
    console.log("Fetching reviews for product:", productId);
    
    const response = await api.get(
      `/reviews/product/${productId}`,
      {
        params: { page, limit }
      }
    );

    console.log("Reviews API Raw Response:", response.data);
    
    // Check if response.data has the expected structure
    const responseData = response.data;
    
    // If the API returns the data directly (without success wrapper)
    if (responseData && (responseData.reviews !== undefined || responseData.success === undefined)) {
      console.log("Processing direct API response structure");
      
      // Check if this is the structure you showed earlier
      if (responseData.reviews) {
        return {
          success: true,
          message: responseData.message || "Reviews fetched successfully",
          reviews: responseData.reviews || [],
          pagination: responseData.pagination || {
            page: 1,
            limit: 10,
            total: responseData.reviews?.length || 0,
            pages: 1
          },
          stats: responseData.stats || {
            totalReviews: responseData.reviews?.length || 0,
            averageRating: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            verifiedReviewsCount: 0
          }
        };
      }
    }
    
    // If response has success field
    if (responseData.success !== undefined) {
      console.log("Processing wrapped API response structure");
      return responseData;
    }
    
    // If we get here, the response structure is unexpected
    console.error("Unexpected API response structure:", responseData);
    throw new Error("Unexpected API response structure");
    
  } catch (error: any) {
    console.error("Reviews API Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
      throw new Error("Network error. Please check your connection.");
    }
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      // Product not found or no reviews - return empty
      return {
        success: true,
        message: "No reviews found",
        reviews: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 1
        },
        stats: {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          verifiedReviewsCount: 0
        }
      };
    }
    
    // Try to extract error message
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.message || 
                        "Failed to fetch reviews";
    
    throw new Error(errorMessage);
  }
};