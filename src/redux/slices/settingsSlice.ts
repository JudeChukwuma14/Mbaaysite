import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  language: string; // e.g., "en", "es", "fr", "ng"
  currency: string; // e.g., "USD", "EUR", "NGN"
  countryCode: string; // e.g., "US", "ES", "NG"
}

const initialState: SettingsState = {
  language: "en",
  currency: "USD",
  countryCode: "US",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (
      state,
      action: PayloadAction<{
        language?: string;
        currency?: string;
        countryCode?: string;
      }>
    ) => {
      if (action.payload.language) state.language = action.payload.language;
      if (action.payload.currency) state.currency = action.payload.currency;
      if (action.payload.countryCode)
        state.countryCode = action.payload.countryCode;
    },
  },
});

export const { setSettings } = settingsSlice.actions;
export default settingsSlice.reducer;