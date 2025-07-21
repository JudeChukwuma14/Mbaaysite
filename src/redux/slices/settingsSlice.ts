import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  language: string; 
  currency: string; 
  countryCode: string; 
}

const initialState: SettingsState = {
  language: "en",
  currency: "NGN",
  countryCode: "ng",
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