import { IntervalType } from "../interval";
import { LOCALIZATION } from "../localization";
import { batchPromise } from "./batchPromise";
import { AppDispatch, RootState } from "./store";
import {
    increment,
    setActivate,
    deactivateTimer,
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

    const isConfirmed = confirm(LOCALIZATION["timer.confirm.skip"]);
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

export const startResetInterval = (resetAnimation: () => void) => (
    dispatch: AppDispatch,
    getState: () => RootState
): Promise<number | null> => {
    // if the timer is active, set state to reset interval (as timer animation callback is active)
    // if the timer is not active (timer paused or at not started),
    // run the steps to reset the interval
    // dispatch of this action resolves `0` for the component to track elapsed timer time when timer is not active
    // otherwise when the timer is active, it resolves `null` as the `animationCb` in `startTimerAndAnimation` will
    // return the `0` for elapsed timer time. in this case the component doesn't need to store the elapsed time as
    // when the promise in `animationCb` resolves, it will resolve with `0` anyway
    // if user does not confirm the action, `null` is resolved

    const isConfirmed = confirm(LOCALIZATION["timer.confirm.reset"]);
    if (!isConfirmed) {
        return Promise.resolve(null);
    }

    if (getState().timer.active) {
        dispatch(setToResetInterval());
        return Promise.resolve(null);
    } else {
        dispatch(resetInterval());
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

            // if the state is set to reset the interval
            if (state.timer.reset) {
                dispatch(resetInterval());
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
                // show notification if app is not focused
                if (!document.hasFocus()) {
                    let localizationTitleKey: string;
                    switch (state.timer.intervalType) {
                        case IntervalType.Focus:
                            localizationTitleKey = "interval.focus";
                            break;
                        case IntervalType.ShortBreak:
                            localizationTitleKey = "interval.shortBreak";
                            break;
                        case IntervalType.LongBreak:
                            localizationTitleKey = "interval.longBreak";
                            break;
                    }

                    new Notification(
                        LOCALIZATION[localizationTitleKey] +
                            LOCALIZATION[
                                "notification.intervalComplete.title.intervalComplete"
                            ],
                        {
                            body:
                                state.timer.intervalType === IntervalType.Focus
                                    ? LOCALIZATION[
                                          "notification.intervalComplete.body.focus"
                                      ]
                                    : LOCALIZATION[
                                          "notification.intervalComplete.body.break"
                                      ],
                            silent: false,
                        }
                    );
                }

                dispatch(nextInterval());
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
