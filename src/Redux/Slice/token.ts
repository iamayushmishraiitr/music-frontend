import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

const tokenSlice = createSlice({
  name: "token",
  initialState: {
    token: Cookies.get("token") || null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});
export const { setToken } = tokenSlice.actions;
export const getToken = (state: any) => state?.token?.token ;
export default tokenSlice.reducer;