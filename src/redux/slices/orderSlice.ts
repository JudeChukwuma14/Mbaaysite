// // src/redux/slices/orderSlice.ts
// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { , OrderData } from '@/utils/orderApi';


// interface OrderState {
//   orders: OrderData[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: OrderState = {
//   orders: [],
//   loading: false,
//   error: null,
// };

// // Thunk to fetch orders
// export const fetchGuestOrders = createAsyncThunk(
//   "order/fetchGuestOrders",
//   async (sessionId: string, { rejectWithValue }) => {
//     try {
//       const response = await getGuestOrders(sessionId);
//       return response.orders;
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const orderSlice = createSlice({
//   name: "order",
//   initialState,
//   reducers: {
//     clearOrders(state) {
//       state.orders = [];
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchGuestOrders.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchGuestOrders.fulfilled, (state, action: PayloadAction<OrderData[]>) => {
//         state.loading = false;
//         state.orders = action.payload;
//       })
//       .addCase(fetchGuestOrders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearOrders } = orderSlice.actions;
// export default orderSlice.reducer;