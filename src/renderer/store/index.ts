export { store, RootState, AppDispatch } from "./store";

export {
    activateTimer,
    skipInterval,
    startResetInterval,
    startTimerAnimation,
    startTimer,
    stopTimer,
} from "./thunks";

export {
    TimerState,
    timerSlice,
    increment,
    setActivate,
    deactivateTimer,
    setToSkipInterval,
    setToResetInterval,
    resetInterval,
    nextInterval,
    selectTimer,
} from "./timerSlice";
