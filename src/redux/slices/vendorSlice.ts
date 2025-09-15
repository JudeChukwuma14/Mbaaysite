
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface Vendor {
//   id: string;
//   storeName: string;
//   email: string;
//   address1: string;
//   country: string;
//   city: string;
//   state: string;
//   storePhone: string;
//   craftCategories: string[];
// }

// // Define the state type
// interface VendorState {
//   vendor: Vendor | null;
//   token: string | null;
// }

// const initialState: VendorState = {
//   vendor: null,
//   token: null,
// };

// const vendorSlice = createSlice({
//   name: "vendor",
//   initialState,
//   reducers: {
//     setVendor: (
//       state,
//       action: PayloadAction<{ vendor: Vendor; token: string }>
//     ) => {
//       state.vendor = action.payload.vendor;
//       state.token = action.payload.token;
//     },
//     logoutVendor: (state) => {
//       state.vendor = null;
//       state.token = null;
//     },
//   },
// });

// export const { setVendor, logoutVendor } = vendorSlice.actions;
// export default vendorSlice.reducer;
// src/redux/slices/vendorSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Vendor {
  _id: string;
  storeName: string;
  email: string;
  storePhone: string;
  storeType: string;
  avatar?: string;
  businessLogo?: string;
  bankAccount: {
    account_number: string;
    bank_code: string;
    bankName: string;
    account_name: string;
  };
  communities: string[];
  communityPosts: Array<{ [key: string]: any }>;
  craftCategories: string[];
  createdAt: string;
  emailSent: boolean;
  followers: Array<{ [key: string]: any }>;
  following: Array<{ [key: string]: any }>;
  my_bought_products_orders: string[];
  notifications: any[];
  orders: string[];
  otpCode: string;
  otpExpires: string;
  paystackRecipientCode: string;
  products: string[];
  returnPolicy?: string;
  verificationStatus: string;
  kycStatus: "Pending" | "Approved" | "Rejected"; // Example statuses
  __v: number;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "agent" | "bot"; // Add "bot"
  timestamp: string;
  isOptimistic?: boolean;
  tempId?: string;
}

interface VendorState {
  vendor: Vendor | null;
  token: string | null;
  chatId: string | null;
  messages: Message[];
}

const initialState: VendorState = {
  vendor: null,
  token: null,
  chatId: null,
  messages: [],
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
      state.messages = state.messages || [];
    },
    setChatId: (state, action: PayloadAction<string>) => {
      state.chatId = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload || [];
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages = state.messages || [];
      state.messages.push(action.payload);
    },
    logoutVendor: (state) => {
      state.vendor = null;
      state.token = null;
      state.chatId = null;
      state.messages = [];
    },
  },
});


export const { setVendor, logoutVendor } = vendorSlice.actions;

export default vendorSlice.reducer;
