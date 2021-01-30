import { PayloadAction } from "@reduxjs/toolkit";
import {
    CurrentIntervalData,
    IntervalType,
    NUM_FOCUS_INTERVALS_TO_COMPLETE_FOR_LONG_BREAK,
} from "../../shared";
import { getTimerInitialState, TimerState } from "./timerSlice";

export function increment(state: TimerState) {
    state.time += 1000;
}

export function setActivate(
    state: TimerState,
    action: PayloadAction<{ active: boolean }>
) {
    state.skip = false;
    state.reset = false;
    state.active = action.payload.active;
}

export function deactivateTimer(state: TimerState) {
    // set the state to deactivated
    // this alone does not stop the timer
    // the `animationCB` in `startTimerAnimation` will check for the active state
    // to determine whether to stop or not
    state.active = false;
}

export function setToSkipInterval(state: TimerState) {
    // marks skip as true
    // this alone does not skip the interval
    // the `animationCB` will check for `skip` and resolve the appropriate return value
    // and skip the interval
    state.skip = true;
}

export function setToResetInterval(state: TimerState) {
    // marks reset as true
    // this alone does not reset the interval
    // the `animationCB` will check for `reset` and resolve the appropriate return value
    // and reset the interval
    state.reset = true;
}

export function resetInterval(state: TimerState) {
    // does not stop the actual timer
    // just sets the state values
    state.active = false;
    state.time = 0;
}

export function nextInterval(
    state: TimerState,
    action: PayloadAction<{ didSkip: boolean }>
) {
    // does not stop the actual timer
    // just sets the state values
    state.active = false;
    state.time = 0;
    if (state.intervalType === IntervalType.Focus && !action.payload.didSkip)
        state.numFocusIntervalsCompleted += 1;
    state.intervalType = getNextInterval(
        state.numFocusIntervalsCompleted,
        state.intervalType
    );
}

function getNextInterval(
    numFocusIntervalsCompleted: number,
    currentInterval: IntervalType
) {
    switch (currentInterval) {
        case IntervalType.Focus:
            if (
                numFocusIntervalsCompleted !== 0 &&
                numFocusIntervalsCompleted %
                    NUM_FOCUS_INTERVALS_TO_COMPLETE_FOR_LONG_BREAK ===
                    0
            ) {
                return IntervalType.LongBreak;
            } else {
                return IntervalType.ShortBreak;
            }

        case IntervalType.ShortBreak:
        case IntervalType.LongBreak:
            return IntervalType.Focus;
    }
}

export function updateStateFromSavedData(
    state: TimerState,
    action: PayloadAction<{ savedData: CurrentIntervalData[] }>
) {
    const savedData = action.payload.savedData;
    if (savedData.length > 0) {
        state.numFocusIntervalsCompleted = savedData.filter(
            (data) => data.intervalType === IntervalType.Focus
        ).length;

        state.intervalType = getNextInterval(
            state.numFocusIntervalsCompleted,
            savedData[savedData.length - 1].intervalType
        );
    }
}

export function resetToInitialState(state: TimerState) {
    const initialState = getTimerInitialState();
    for (const key in initialState) {
        state[key] = initialState[key];
    }
}
