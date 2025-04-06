import axios from "axios"

const URL = "https://mbayy-be.onrender.com/api/v1/vendor"

export const api = axios.create({
    baseURL: API_BASE_URL,
})

export const uploadproduct = async (data:any) => {
    try {
        const response = await api.post("/upload",data)
    } catch (error:any) {
        console.error("Upload Error", error.response?.data || error)
    }
}