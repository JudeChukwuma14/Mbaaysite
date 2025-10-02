// vendorApi.ts
import axios, { AxiosError } from "axios";

/* 1. Clean base URL */
const BASE_URL = "https://ilosiwaju-mbaay-2025.com/api/v1/vendor";

/* 2. Axios instance */
const vendorApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

/* 3. Request interceptor – attach token per call */
vendorApi.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

/* 4. Response interceptor – return the raw Axios error so we can log it later */
vendorApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error) // don’t wrap it again
);

/* 5. Public helper */
export interface GetVendorCustomersParams {
  token: string;
}

export const getAllCustomers = async ({ token }: GetVendorCustomersParams) => {
  try {
    const { data } = await vendorApi.get("/allcustomers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    /* 6. Console-log the *real* error object */
    console.error("❌  Error fetching vendor customers:", err);
    throw err;
  }
};

export const getAllPayments = async ({ token }: GetVendorCustomersParams) => {
  try {
    const { data } = await vendorApi.get("/allpayments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    /* 6. Console-log the *real* error object */
    console.error("❌  Error fetching vendor payments:", err);
    throw err;
  }
};
