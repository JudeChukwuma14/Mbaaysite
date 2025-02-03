import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addWishlistItem: (state, action: PayloadAction<WishlistItem>) => {
      console.log("wishlistitem...",action.payload)
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeWishlistItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateWishlistQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
  },
});

export const { addWishlistItem, removeWishlistItem, updateWishlistQuantity } = wishlistSlice.actions;
export default wishlistSlice.reducer;