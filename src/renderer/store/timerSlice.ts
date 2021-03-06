import { createSlice } from "@reduxjs/toolkit";
import { IntervalType } from "../interval";
import { RootState } from "./store";
import {
    increment as incrementReducer,
    setActivate as setActivateReducer,
    deactivateTimer as deactivateTimerReducer,
    setToSkipInterval as setToSkipIntervalReducer,
    setToResetInterval as setToResetIntervalReducer,
    resetInterval as resetIntervalReducer,
    nextInterval as nextIntervalReducer,
} from "./reducers";

export interface TimerState {
    time: number;
    active: boolean;
    intervalType: IntervalType;
    numFocusIntervalsCompleted: number;
    skip: boolean;
    reset: boolean;
}

const initialState: TimerState = {
    time: 0,
    active: false,
    intervalType: IntervalType.Focus,
    numFocusIntervalsCompleted: 0,
    skip: false,
    reset: false,
};

export const timerSlice = createSlice({
    name: "timer",
    initialState,
    reducers: {
        increment: incrementReducer,
        setActivate: setActivateReducer,
        deactivateTimer: deactivateTimerReducer,
        setToSkipInterval: setToSkipIntervalReducer,
        setToResetInterval: setToResetIntervalReducer,
        resetInterval: resetIntervalReducer,
        nextInterval: nextIntervalReducer,
    },
});

export const {
    increment,
    setActivate,
    deactivateTimer,
    setToSkipInterval,
    setToResetInterval,
    resetInterval,
    nextInterval,
} = timerSlice.actions;

export const selectTimer = (state: RootState) => state.timer;
