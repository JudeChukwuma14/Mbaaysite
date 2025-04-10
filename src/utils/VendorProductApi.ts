import axios from "axios"

const API_BASE_URL = "https://mbayy-be.onrender.com/api/v1/vendor"

export const api = axios.create({
    baseURL: API_BASE_URL,
})

export const uploadproduct = async (data:any) => {
    try {
        const response = await api.post("/upload",data)
        return response.data
    } catch (error) {
        console.error("Upload Error", error || error)
    }
}