import axios from "axios";

const API_BASE_URL = "https://ilosiwaju-mbaay-2025.com/api/v1/community";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const createPost = async (data: any, token: string | null) => {
  try {
    const response = await api.post("/create_post", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const get_vendors_community = async (token: string | null) => {
  try {
    const response = await api.get("/get_vendors_community", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Ven", response);
    return response.data?.vendors;
  } catch (error) {
    console.log(error);
  }
};

export const follow_vendor = async (
  token: string | null,
  vendorId: string | null
) => {
  try {
    const response = await api.patch(
      `/follow_vendor/${vendorId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const unfollow_vendor = async (
  token: string | null,
  vendorId: string | null
) => {
  try {
    const response = await api.patch(
      `/unfollow_vendor/${vendorId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const get_posts_feed = async (token: string | null) => {
  try {
    const response = await api.get("/get_posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response);
    return response.data.data.feedPosts;
  } catch (error) {
    console.log(error);
  }
};

export const like_posts = async (
  token: string | null,
  postId: string | null
) => {
  try {
    const response = await api.patch(
      `/like_post/${postId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const unlike_posts = async (
  token: string | null,
  postId: string | null
) => {
  try {
    const response = await api.patch(
      `/unlike_post/${postId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const comment_on_posts = async (
  token: string | null,
  postId: string | null,
  data: any
) => {
  try {
    const response = await api.patch(`/comment_on_post/${postId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const comment_on_comment = async (
  token: string | null,
  postId: string | null,
  commentId: string | null,
  data: any
) => {
  try {
    if (!postId || !commentId) {
      throw new Error("Post ID and Comment ID are required");
    }

    if (!data?.text || data.text.trim() === "") {
      throw new Error("Reply text is required");
    }

    const replyData = {
      text: data.text.trim(),
      ...data,
    };

    const response = await api.patch(
      `/comment_on_comment/${postId}/${commentId}`,
      replyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Reply to comment successful:", response);
    return response;
  } catch (error) {
    console.error("Error replying to comment:", error);

    // Enhanced error handling
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      const statusCode = error.response?.status;

      console.error(`API Error (${statusCode}):`, errorMessage);

      // Return structured error for better handling in components
      throw {
        message: errorMessage,
        status: statusCode,
        type: "api_error",
      };
    }

    console.log(error);
    throw error;
  }
};

export const get_posts_comments = async (postId: string | null) => {
  try {
    const response = await api.get(`/post/ ${postId}/comments`);
    // console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const create_community = async (token: string | null, data: any) => {
  try {
    const response = await api.post(`/create_community`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/formdata",
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const get_communities = async (token: string | null) => {
  try {
    const response = await api.get(`/total-communities`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data.totalCommunities.communities);
    return response.data.totalCommunities.communities;
  } catch (error) {
    console.log(error);
  }
};

export const join_community = async (
  token: string | null,
  communityid: any
) => {
  try {
    const response = await api.patch(
      `/join_community/${communityid}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data.totalCommunities.communities);
    return response.data.totalCommunities.communities;
  } catch (error) {
    console.log(error);
  }
};

export const leave_community = async (
  token: string | null,
  communityid: any
) => {
  try {
    const response = await api.patch(
      `/leave_community/${communityid}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data.totalCommunities.communities);
    return response.data.totalCommunities.communities;
  } catch (error) {
    console.log(error);
  }
};

export const search_vendor_community = async (
  token: string | null,
  query: string | null
) => {
  try {
    const response = await api.get(`/search_vendor_community?query=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const get_one_community = async (communityid: any) => {
  try {
    const response = await api.get(`/one_community/${communityid}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const get_all_communities = async () => {
  try {
    const response = await api.get(`/all_communities`);
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const get_mutual_recommendation = async (token: string | null) => {
  try {
    const response = await api.get(`/get_mutual_recommendation`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Mutual recommendations:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching mutual recommendations:", error);

    // Enhanced error handling
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      const statusCode = error.response?.status;

      console.error(`API Error (${statusCode}):`, errorMessage);

      throw {
        message: errorMessage,
        status: statusCode,
        type: "api_error",
      };
    }

    throw error;
  }
};
