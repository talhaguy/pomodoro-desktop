import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MutableRefObject } from "react";
import { AppDispatch, RootState } from "./store";

export interface TimerState {
    time: number;
    active: boolean;
}

const initialState: TimerState = {
    time: 0,
    active: false,
};

export const timerSlice = createSlice({
    name: "timer",
    initialState,
    reducers: {
        increment: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based on those changes
            state.time += 1000;
        },

        setTime: (state, action: PayloadAction<{ time: number }>) => {
            state.time = action.payload.time;
        },

        setActivate: (state, action: PayloadAction<{ active: boolean }>) => {
            state.active = action.payload.active;
        },
    },
});

export const { increment, setTime, setActivate } = timerSlice.actions;

export const toggleTimer = (
    draw: (elapsedMs: number) => void,
    timerStartedFrom: number,
    total: number
) => (dispatch: AppDispatch, getState: () => RootState) => {
    if (getState().timer.active) {
        dispatch(setActivate({ active: false }));
        return Promise.resolve(null);
    } else {
        dispatch(setActivate({ active: true }));
        return dispatch(startTimerAsync(draw, timerStartedFrom, total));
    }
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const startTimerAsync = createAsyncThunk<
//     Promise<NodeJS.Timeout>,
//     undefined,
//     { dispatch: AppDispatch }
// >("startTimer", async (_, thunkAPI) => {
//     const id = setInterval(() => {
//         thunkAPI.dispatch(increment());
//     }, 1000);
//     return id;
// });
// export const startTimerAsync = () => (dispatch: AppDispatch) => {
//     const id = setInterval(() => {
//         dispatch(increment());
//     }, 1000);
//     return id;
// };
export const startTimerAsync = (
    draw: (elapsedMs: number) => void,
    timerStartedFrom: number,
    total: number
) => (dispatch: AppDispatch, getState: () => RootState) => {
    console.log("startTimeAsync");
    // const id = setInterval(() => {
    //     dispatch(increment());
    // }, 1000);
    // return id;

    return new Promise((res, rej) => {
        let startTime: number = null;
        // let timerStartedFrom: number = getState().timer.time;

        const animationCb = (time: number) => {
            // console.log("animation...", time);

            const state = getState();

            if (!startTime) {
                startTime = time;
                console.log("starttime...", startTime);
            }

            draw(time - startTime + timerStartedFrom);
            console.log("draw at ", time - startTime + timerStartedFrom);

            if (
                time - startTime + timerStartedFrom >=
                state.timer.time + 1000
            ) {
                console.log(
                    "second...",
                    time,
                    startTime,
                    state.timer.time + 1000
                );
                console.log("before inc", state.timer.time);
                dispatch(increment());
                console.log("after inc", state.timer.time);
            }

            if (state.timer.time >= total) {
                console.log("time is " + (state.timer.time + 1000));
                dispatch(setActivate({ active: false }));
                dispatch(setTime({ time: 0 }));
                res(0);
            } else {
                // TODO: move to top?
                if (state.timer.active) {
                    requestAnimationFrame(animationCb);
                } else {
                    console.log("timer not active any more...");
                    dispatch(setActivate({ active: false }));
                    res(time - startTime + timerStartedFrom);
                }
            }
        };

        requestAnimationFrame(animationCb);
    });
};

// export const pauseTimerAsync = (timerId: NodeJS.Timeout) => (
//     dispatch: AppDispatch
// ): null => {
//     clearInterval(timerId);
//     dispatch(pause());
//     return null;
// };
// export const pauseTimerAsync = createAsyncThunk<
//     null,
//     number,
//     {
//         dispatch: AppDispatch;
//     }
// >("pauseTimer", async (timerId, thunkAPI) => {
//     console.log("pausetimer", timerId);
//     clearInterval(timerId);
//     thunkAPI.dispatch(pause());
//     return null;
// });

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectTimer = (state: RootState) => state.timer;
