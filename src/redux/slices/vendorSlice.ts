import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Vendor {
  id: string;
  storeName: string;
  email: string;
  address1: string;
  country: string;
  city: string;
  state: string;
  storePhone: string;
  craftCategories: string[];
}

// Define the state type
interface VendorState {
  vendor: Vendor | null;
  token: string | null;
}

const initialState: VendorState = {
  vendor: null,
  token: null,
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setVendor: (
      state,
      action: PayloadAction<{ vendor: Vendor; token: string }>
    ) => {
      state.vendor = action.payload.vendor;
      state.token = action.payload.token;
    },
    logoutVendor: (state) => {
      state.vendor = null;
      state.token = null;
    },
  },
});


export const { setVendor, logoutVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
