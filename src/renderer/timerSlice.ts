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

export const activateTimer = (
    draw: (elapsedMs: number) => void,
    timerStartedFrom: number,
    total: number
) => (dispatch: AppDispatch) => {
    dispatch(setActivate({ active: true }));
    return dispatch(startTimerAndAnimation(draw, timerStartedFrom, total));
};

export const deactivateTimer = () => (dispatch: AppDispatch) => {
    dispatch(setActivate({ active: false }));
};

export const startTimerAndAnimation = (
    draw: (elapsedMs: number) => void,
    timerStartedFrom: number,
    total: number
) => (dispatch: AppDispatch, getState: () => RootState) => {
    console.log("startTimeAsync");

    return new Promise<number>((res, rej) => {
        let startTime: number = null;

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
