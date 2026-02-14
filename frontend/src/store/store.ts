import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import hoverWindowReducer from "./slice/hoverWindowSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        hoverWindow: hoverWindowReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store