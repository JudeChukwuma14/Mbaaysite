import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import userReducer from "./slices/userSlice";
import vendorReducer from "./slices/vendorSlice";
import SettingsReducer from "./slices/settingsSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import sessionReducer from "./slices/sessionSlice";
import notificationSlice from "./slices/notificationSlice"

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "wishlist", "user", "vendor", "settings", "session", "notifications"],
};

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  user: userReducer,
  vendor: vendorReducer,
  settings: SettingsReducer,
  session: sessionReducer,
  notifications: notificationSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/FLUSH",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;