import { batch } from "react-redux";
import { CurrentIntervalData } from "../interval";
import { LOCALIZATION } from "../localization";
import { batchPromise } from "./batchPromise";
import { AppDispatch, RootState } from "./store";
import {
    increment,
    setActivate,
    setToSkipInterval,
    setToResetInterval,
    resetInterval,
    nextInterval,
} from "./timerSlice";

export const activateTimer = (
    draw: (elapsedMs: number) => void,
    timerStartedFrom: number,
    total: number
) => (dispatch: AppDispatch) => {
    return batchPromise(() => {
        dispatch(setActivate({ active: true }));
        return dispatch(startTimerAnimation(draw, timerStartedFrom, total));
    });
};

export const skipInterval = (
    intervalId: NodeJS.Timer,
    resetAnimation: () => void
) => (
    dispatch: AppDispatch,
    getState: () => RootState
): Promise<number | null> => {
    // if the timer is active, set state to skip interval (as timer animation callback is active)
    // if the timer is not active (timer paused or at not started),
    // run the steps to go to the next interval
    // dispatch of this action resolves `0` for the component to track elapsed timer time when timer is not active
    // otherwise when the timer is active, it resolves `null` as the `animationCb` in `startTimerAnimation` will
    // return the `0` for elapsed timer time. in this case the component doesn't need to store the elapsed time as
    // when the promise in `animationCb` resolves, it will resolve with `0` anyway
    // if user does not confirm the action, `null` is resolved

    const isConfirmed = confirm(LOCALIZATION["timer.confirm.skip"]);
    if (!isConfirmed) {
        return Promise.resolve(null);
    }

    if (getState().timer.active) {
        batch(() => {
            dispatch(setToSkipInterval());
            dispatch(nextInterval());
            dispatch(stopTimer(intervalId));
        });
        return Promise.resolve(null);
    } else {
        dispatch(nextInterval());
        resetAnimation();
        return Promise.resolve(0);
    }
};

export const startResetInterval = (
    intervalId: NodeJS.Timer,
    resetAnimation: () => void
) => (
    dispatch: AppDispatch,
    getState: () => RootState
): Promise<number | null> => {
    // if the timer is active, set state to reset interval (as timer animation callback is active)
    // if the timer is not active (timer paused or at not started),
    // run the steps to reset the interval
    // dispatch of this action resolves `0` for the component to track elapsed timer time when timer is not active
    // otherwise when the timer is active, it resolves `null` as the `animationCb` in `startTimerAnimation` will
    // return the `0` for elapsed timer time. in this case the component doesn't need to store the elapsed time as
    // when the promise in `animationCb` resolves, it will resolve with `0` anyway
    // if user does not confirm the action, `null` is resolved

    const isConfirmed = confirm(LOCALIZATION["timer.confirm.reset"]);
    if (!isConfirmed) {
        return Promise.resolve(null);
    }

    if (getState().timer.active) {
        batch(() => {
            dispatch(setToResetInterval());
            dispatch(resetInterval());
            dispatch(stopTimer(intervalId));
        });
        return Promise.resolve(null);
    } else {
        dispatch(resetInterval());
        resetAnimation();
        return Promise.resolve(0);
    }
};

// TODO: see if this can be converted into a hook as there is no dispatch of actions happening and is view only logic now
export const startTimerAnimation = (
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
                // reset the progress animation
                draw(0);
                // resolve `0` b/c timer is reset
                res(0);
                return;
            }

            // if the state is set to reset the interval
            if (state.timer.reset) {
                // reset the progress animation
                draw(0);
                // resolve `0` b/c timer is reset
                res(0);
                return;
            }

            if (!startTime) {
                startTime = time;
            }

            // draw the animation for elapsed time
            // `time - startTime` is the elapsed time
            // elapsed time + `timerStartedFrom` takes into account the previously elapsed time of the timer
            const timeElapsed = time - startTime + timerStartedFrom;
            draw(timeElapsed);

            // when timer completes, reset the time
            // use `getState()` to get the latest state
            if (timeElapsed >= total) {
                // reset the progress animation
                draw(0);
                // resolve `0` b/c timer is reset
                res(0);
                return;
            }

            // as long as the timer is still active, rerun the callback. otherwise, deactivate it.
            // deactivation is triggered by the `deactivateTimer` action
            if (getState().timer.active) {
                requestAnimationFrame(animationCb);
            } else {
                // resolve the amount of elapsed time for the timer
                res(time - startTime + timerStartedFrom);
                return;
            }
        };

        requestAnimationFrame(animationCb);
    });
};

export const startTimer = (total: number, onComplete: () => void) => (
    dispatch: AppDispatch,
    getState: () => RootState
) => {
    const id = setInterval(() => {
        dispatch(increment());

        if (getState().timer.time >= total) {
            batch(() => {
                dispatch(nextInterval());
                dispatch(stopTimer(id));
            });
            onComplete();
            return;
        }
    }, 1000);

    return id;
};

export const stopTimer = (intervalId: NodeJS.Timer) => (
    dispatch: AppDispatch,
    getState: () => RootState
) => {
    clearInterval(intervalId);
};

export const saveFocusIntervalEndData = (
    currentIntervalData: CurrentIntervalData
) => (dispatch: AppDispatch, getState: () => RootState) => {
    // TODO: stub for when data will be persisted
    console.log("started: " + new Date(currentIntervalData.startTime));
    console.log("ended: " + new Date(currentIntervalData.endTime));
    return Promise.resolve();
};
