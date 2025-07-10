import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface SessionState {
  sessionId: string | null;
}

const initialState: SessionState = {
  sessionId: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    initializeSession: (state) => {
      if (!state.sessionId) {
        state.sessionId = uuidv4();
      }
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    clearSessionId: (state) => {
      state.sessionId = null;
    },
  },
});

export const { initializeSession, setSessionId, clearSessionId } = sessionSlice.actions;
export default sessionSlice.reducer;
