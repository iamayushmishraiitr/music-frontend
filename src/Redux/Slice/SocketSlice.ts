import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});
export const { setSocket } = socketSlice.actions;
export const getSocket = (state: any) => state.socket;
export default socketSlice.reducer;