import axios from "axios";

const API_BASE_URL = "https://mbayy-be.onrender.com/api/v1/community";

export const api = axios.create({
  baseURL: API_BASE_URL,
});


export const createPost = async(data:any,token:string | null)=>{
    try {
      const response = await api.post("/create_post",data,{
        headers:{
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        }
      }) 
      console.log(response)
      return response
    } catch (error) {
        console.log(error)
    }
}


export const get_vendors_community = async(token:string | null)=>{
    try {
        const response = await api.get("/get_vendors_community",{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        }) 
        // console.log(response)
          return response
    } catch (error) {
        console.log(error)
    }
}


export const follow_vendor = async (token: string | null, vendorId: string | null) => {
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

export const unfollow_vendor = async (token: string | null, vendorId: string | null) => {
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
            }
        );
        // console.log(response);
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const like_posts = async (token: string | null,postId:string | null) => {
    try {
        const response = await api.patch(`/like_post/${postId}`, {}, {
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

export const unlike_posts = async (token: string | null,postId:string | null) => {
    try {
        const response = await api.patch(`/unlike_post/${postId}`, {}, {
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

export const comment_on_posts = async (token: string | null,postId:string | null,data:any) => {
    try {
        const response = await api.patch(`/comment_on_post/${postId}`, data, {
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
