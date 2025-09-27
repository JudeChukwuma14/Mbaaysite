import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  inventory?: number; // Optional inventory field for validation
}

interface CartState {
  items: CartItem[];
  couponCode: string;
  discount: number;
}

const initialState: CartState = {
  items: [],
  couponCode: "",
  discount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      
      if (existingItem) {
        // Check if adding one more would exceed inventory
        const maxAllowed = action.payload.inventory || Infinity;
        if (existingItem.quantity < maxAllowed) {
          existingItem.quantity += 1;
        } else {
          // You can show a toast here or handle the error
          console.warn(`Cannot add more than ${maxAllowed} items`);
        }
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        // Validate against inventory if available
        const maxAllowed = item.inventory || Infinity;
        item.quantity = Math.min(action.payload.quantity, maxAllowed);
      }
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    applyCoupon: (
      state,
      action: PayloadAction<{ code: string; discount: number }>
    ) => {
      state.couponCode = action.payload.code;
      state.discount = action.payload.discount;
    },
    removeCoupon: (state) => {
      state.couponCode = "";
      state.discount = 0;
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  setCartItems,
  applyCoupon,
  removeCoupon,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;