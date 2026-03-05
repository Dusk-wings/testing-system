import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import hoverWindowReducer from "./slice/hoverWindowSlice";
import boardReducer from "./slice/boardSlice";
import currentReducer from './slice/currentData'

const store = configureStore({
    reducer: {
        auth: authReducer,
        hoverWindow: hoverWindowReducer,
        board: boardReducer,
        currentData: currentReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store