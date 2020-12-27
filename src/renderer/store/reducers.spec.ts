import { IntervalType } from "../interval";
import {
    deactivateTimer,
    increment,
    nextInterval,
    setActivate,
    setToResetInterval,
    setToSkipInterval,
} from "./reducers";
import { TimerState } from "./timerSlice";

describe("reducers", () => {
    let state: TimerState;

    beforeEach(() => {
        state = {
            time: 0,
            active: false,
            intervalType: IntervalType.Focus,
            numFocusIntervalsCompleted: 0,
            skip: false,
            reset: false,
        };
    });

    describe("increment()", () => {
        it("should increment stored ms value in state by 1 sec", () => {
            increment(state);
            expect(state.time).toBe(1000);
            increment(state);
            expect(state.time).toBe(2000);
            increment(state);
            expect(state.time).toBe(3000);
        });
    });

    describe("setActivate()", () => {
        it("should set state to active/not active", () => {
            setActivate(state, {
                payload: {
                    active: true,
                },
                type: "setActivate",
            });
            expect(state.active).toBeTruthy();
            expect(state.reset).toBeFalsy();
            expect(state.skip).toBeFalsy();

            setActivate(state, {
                payload: {
                    active: false,
                },
                type: "setActivate",
            });
            expect(state.active).toBeFalsy();
            expect(state.reset).toBeFalsy();
            expect(state.skip).toBeFalsy();
        });
    });

    describe("deactivateTimer()", () => {
        it("should set active flag to false", () => {
            deactivateTimer(state);
            expect(state.active).toBeFalsy();
        });
    });

    describe("setToSkipInterval()", () => {
        it("should set skip flag to true", () => {
            setToSkipInterval(state);
            expect(state.skip).toBeTruthy();
        });
    });

    describe("setToResetInterval()", () => {
        it("should set reset flag to true", () => {
            setToResetInterval(state);
            expect(state.reset).toBeTruthy();
        });
    });

    describe("nextInterval()", () => {
        it("should set the interval to the next one", () => {
            state.time = 10000;
            state.active = true;

            nextInterval(state);
            expect(state.time).toBe(0);
            expect(state.active).toBeFalsy();
            expect(state.intervalType).toBe(IntervalType.ShortBreak);

            nextInterval(state);
            expect(state.intervalType).toBe(IntervalType.Focus);

            nextInterval(state);
            expect(state.intervalType).toBe(IntervalType.ShortBreak);

            nextInterval(state);
            expect(state.intervalType).toBe(IntervalType.Focus);

            nextInterval(state);
            expect(state.intervalType).toBe(IntervalType.LongBreak);

            nextInterval(state);
            expect(state.intervalType).toBe(IntervalType.Focus);

            nextInterval(state);
            expect(state.intervalType).toBe(IntervalType.ShortBreak);
        });
    });
});
