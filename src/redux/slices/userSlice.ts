// redux/slices/userSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: string;
  isOptimistic?: boolean;
}

interface UserState {
  user: User | null;
  token: string | null;
  chatId: string | null;
  messages: Message[];
}

const initialState: UserState = {
  user: null,
  token: null,
  chatId: null,
  messages: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
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
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.chatId = null;
      state.messages = [];
    },
  },
});

export const { setUser, setChatId, setMessages, addMessage, logout } = userSlice.actions;
export default userSlice.reducer;