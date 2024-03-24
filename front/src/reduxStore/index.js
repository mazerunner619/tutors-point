import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import rootReducer from "./reducers/index"; // Assuming you have a root reducer

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

export default store;

// middleware: [...getDefaultMiddleware(), thunk]
// devTools: process.env.NODE_ENV !== 'production' // Enable Redux DevTools Extension in development
