import axios from "axios";

const API_BASE_URL = "https://mbayy-be.onrender.com/api/v1/community";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const createPost = async(data:any,token:string | null)=>{
    try {
      const response = await api.post("/create_post",data,{
        headers:{
            Authorization: `Bearer ${token}`
        }
      }) 
      console.log(response)
      return response
    } catch (error) {
        console.log(error)
    }
}