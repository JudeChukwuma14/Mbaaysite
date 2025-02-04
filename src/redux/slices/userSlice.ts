import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  name:string|null
  email: string | null;
  token: string | null;
}

const initialState: UserState = {
  name:null,
  email: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, {payload}) => {
      state.name= payload
      state.email = payload;
      state.token = payload
    },
    logout: (state) => {
      state.name = null
      state.email = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;