import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  inventory?: number; // Optional: track available stock
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
    addItem: (state, action: PayloadAction<Omit<CartItem, "quantity"> & { inventory?: number }>) => {
      const { id, name, price, image, inventory = Infinity } = action.payload;

      // Prevent adding if out of stock
      if (inventory !== undefined && inventory <= 0) {
        toast.error(`${name} is out of stock and cannot be added to cart.`);
        return; // Stop execution — don't modify state
      }

      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        // Optional: Also block increasing quantity beyond available stock
        if (inventory !== undefined && existingItem.quantity >= inventory) {
          toast.error(`Sorry, only ${inventory} unit(s) available for ${name}.`);
          return;
        }
        existingItem.quantity += 1;
        toast.success("Quantity updated in cart!");
      } else {
        state.items.push({ id, name, price, image, quantity: 1 });
        toast.success(`${name} added to cart!`);
      }
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number; inventory?: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        const newQty = action.payload.quantity;
        const available = action.payload.inventory ?? Infinity;

        if (newQty > available) {
          toast.error(`Only ${available} unit(s) available!`);
          return;
        }
        if (newQty <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id);
        } else {
          item.quantity = newQty;
        }
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