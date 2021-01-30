import { createSlice } from "@reduxjs/toolkit";
import { IntervalType } from "../../shared";
import { RootState } from "./store";
import {
    increment as incrementReducer,
    setActivate as setActivateReducer,
    deactivateTimer as deactivateTimerReducer,
    setToSkipInterval as setToSkipIntervalReducer,
    setToResetInterval as setToResetIntervalReducer,
    resetInterval as resetIntervalReducer,
    nextInterval as nextIntervalReducer,
    updateStateFromSavedData as updateStateFromSavedDataReducer,
    resetToInitialState as resetToInitialStateReducer,
} from "./reducers";

export interface TimerState {
    time: number;
    active: boolean;
    intervalType: IntervalType;
    numFocusIntervalsCompleted: number;
    skip: boolean;
    reset: boolean;
}

export const getTimerInitialState: () => TimerState = () => ({
    time: 0,
    active: false,
    intervalType: IntervalType.Focus,
    numFocusIntervalsCompleted: 0,
    skip: false,
    reset: false,
});

export const timerSlice = createSlice({
    name: "timer",
    initialState: getTimerInitialState(),
    reducers: {
        increment: incrementReducer,
        setActivate: setActivateReducer,
        deactivateTimer: deactivateTimerReducer,
        setToSkipInterval: setToSkipIntervalReducer,
        setToResetInterval: setToResetIntervalReducer,
        resetInterval: resetIntervalReducer,
        nextInterval: nextIntervalReducer,
        updateStateFromSavedData: updateStateFromSavedDataReducer,
        resetToInitialState: resetToInitialStateReducer,
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
    updateStateFromSavedData,
    resetToInitialState,
} = timerSlice.actions;

export const selectTimer = (state: RootState) => state.timer;
