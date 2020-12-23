import { configureStore } from "@reduxjs/toolkit";
import { timerSlice } from "./timerSlice";

export const store = configureStore({
    reducer: {
        timer: timerSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
