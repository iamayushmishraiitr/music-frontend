// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import socketReducer from "./Slice/SocketSlice"
import tokenReducer from "./Slice/token"
const store = configureStore({
  reducer: {
    socket:socketReducer ,
    token :tokenReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
});

export default store;