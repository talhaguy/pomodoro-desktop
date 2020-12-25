import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { batch } from "react-redux";
import {
    IntervalType,
    NUM_FOCUS_INTERVALS_TO_COMPLETE_FOR_LONG_BREAK,
} from "./interval";
import { AppDispatch, RootState } from "./store";

export interface TimerState {
    time: number;
    active: boolean;
    intervalType: IntervalType;
    numFocusIntervalsCompleted: number;
    skip: boolean;
}

const initialState: TimerState = {
    time: 0,
    active: false,
    intervalType: IntervalType.Focus,
    numFocusIntervalsCompleted: 0,
    skip: false,
};

export const timerSlice = createSlice({
    name: "timer",
    initialState,
    reducers: {
        increment: (state) => {
            state.time += 1000;
        },

        setActivate: (state, action: PayloadAction<{ active: boolean }>) => {
            state.skip = false;
            state.active = action.payload.active;
        },

        deactivateTimer: (state) => {
            // set the state to deactivated
            // this alone does not stop the timer
            // the `animationCB` in `startTimerAndAnimation` will check for the active state
            // to determine whether to stop or not
            state.active = false;
        },

        setToSkipInterval: (state) => {
            // marks skip as true
            // this alone does not skip the interval
            // the `animationCB` will check for `skip` and resolve the appropriate return value
            // and skip the interval
            state.skip = true;
        },

        nextInterval: (state) => {
            state.active = false;
            state.time = 0;

            switch (state.intervalType) {
                case IntervalType.Focus:
                    state.numFocusIntervalsCompleted += 1;

                    if (
                        state.numFocusIntervalsCompleted %
                            NUM_FOCUS_INTERVALS_TO_COMPLETE_FOR_LONG_BREAK ===
                        0
                    ) {
                        state.intervalType = IntervalType.LongBreak;
                    } else {
                        state.intervalType = IntervalType.ShortBreak;
                    }
                    break;

                case IntervalType.ShortBreak:
                case IntervalType.LongBreak:
                    state.intervalType = IntervalType.Focus;
                    break;
            }
        },
    },
});

// the redux `batch` does not return any value
// this function wraps the original `batch` function so that any promise returned from
// a dispatched action can be accessed
export function batchPromise<T>(cb: () => Promise<T>) {
    return new Promise<T>((res, rej) => {
        batch(() => {
            cb()
                .then((data) => res(data))
                .catch((err) => rej(err));
        });
    });
}

export const {
    increment,
    setActivate,
    deactivateTimer,
    setToSkipInterval,
    nextInterval,
} = timerSlice.actions;

export const activateTimer = (
    draw: (elapsedMs: number) => void,
    timerStartedFrom: number,
    total: number
) => (dispatch: AppDispatch) => {
    return batchPromise(() => {
        dispatch(setActivate({ active: true }));
        return dispatch(startTimerAndAnimation(draw, timerStartedFrom, total));
    });
};

export const skipInterval = (resetAnimation: () => void) => (
    dispatch: AppDispatch,
    getState: () => RootState
): Promise<number | null> => {
    // if the timer is active, set state to skip interval (as timer animation callback is active)
    // if the timer is not active (timer paused or at not started),
    // run the steps to go to the next interval
    // dispatch of this action resolves `0` for the component to track elapsed timer time when timer is not active
    // otherwise when the timer is active, it resolves `null` as the `animationCb` in `startTimerAndAnimation` will
    // return the `0` for elapsed timer time. in this case the component doesn't need to store the elapsed time as
    // when the promise in `animationCb` resolves, it will resolve with `0` anyway
    // if user does not confirm the action, `null` is resolved

    const isConfirmed = confirm("Are you sure you want to skip this interval?");
    if (!isConfirmed) {
        return Promise.resolve(null);
    }

    if (getState().timer.active) {
        dispatch(setToSkipInterval());
        return Promise.resolve(null);
    } else {
        dispatch(nextInterval());
        resetAnimation();
        return Promise.resolve(0);
    }
};

export const startTimerAndAnimation = (
    draw: (elapsedMs: number) => void,
    timerStartedFrom: number,
    total: number
) => (dispatch: AppDispatch, getState: () => RootState) => {
    // return a promise which resolves with the timer's elapsed time in ms when the timer ends
    // the elapsed time is meant to be stored in the component using this action
    // when calling this action again, it should be passed in as `timerStartedFrom`
    return new Promise<number>((res, rej) => {
        let startTime: number = null;

        const animationCb = (time: number) => {
            const state = getState();

            // if the state is set to skip the interval
            if (state.timer.skip) {
                dispatch(nextInterval());
                // reset the progress animation
                draw(0);
                // resolve `0` b/c timer is reset
                res(0);
                return;
            }

            if (!startTime) {
                startTime = time;
            }

            // as long as the timer is still active, rerun the callback. otherwise, deactivate it.
            // deactivation is triggered by the `deactivateTimer` action
            if (state.timer.active) {
                requestAnimationFrame(animationCb);
            } else {
                // resolve the amount of elapsed time for the timer
                res(time - startTime + timerStartedFrom);
                return;
            }

            // draw the animation for elapsed time
            // `time - startTime` is the elapsed time
            // elapsed time + `timerStartedFrom` takes into account the previously elapsed time of the timer
            draw(time - startTime + timerStartedFrom);

            // if a second has passed since the last time in state, increment the time in state
            if (
                time - startTime + timerStartedFrom >=
                state.timer.time + 1000
            ) {
                dispatch(increment());
            }

            // deactivate the timer and reset the time when timer completes
            // use `getState()` to get the latest state
            if (getState().timer.time >= total) {
                dispatch(nextInterval());
                // reset the progress animation
                draw(0);
                // resolve `0` b/c timer is reset
                res(0);
                return;
            }
        };

        requestAnimationFrame(animationCb);
    });
};

export const selectTimer = (state: RootState) => state.timer;
