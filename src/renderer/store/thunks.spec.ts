import { IntervalType } from "../../shared";
import { RootState } from "./store";
import { startTimer, startTimerAnimation } from "./thunks";

jest.setTimeout(10000);
// jest.mock("react-redux", () => {
//     const mockRedux = {
//         batch: (cb) => {
//             cb();
//         },
//     };
//     return mockRedux;
// });

describe("thunks", () => {
    let draw;
    let dispatch;
    let rootState: RootState;
    let getState;

    beforeEach(() => {
        draw = jest.fn();
        dispatch = jest.fn();
        rootState = {
            timer: {
                time: 0,
                active: false,
                intervalType: IntervalType.Focus,
                numFocusIntervalsCompleted: 0,
                skip: false,
                reset: false,
            },
        };
        getState = jest.fn().mockReturnValue(rootState);
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    describe("startTimerAnimation()", () => {
        it("should break out of raf loop if skip flag is set", (done) => {
            rootState.timer.active = true;
            rootState.timer.skip = true;

            const promise = startTimerAnimation(
                draw,
                0,
                5000
            )(dispatch, getState);

            promise.then((time) => {
                expect(draw).toHaveBeenCalledWith(0);
                expect(draw).toHaveBeenCalledTimes(1);
                expect(time).toBe(0);
                done();
            });
        });

        it("should break out of raf loop if reset flag is set", (done) => {
            rootState.timer.active = true;
            rootState.timer.reset = true;

            const promise = startTimerAnimation(
                draw,
                0,
                5000
            )(dispatch, getState);

            promise.then((time) => {
                expect(draw).toHaveBeenCalledWith(0);
                expect(draw).toHaveBeenCalledTimes(1);
                expect(time).toBe(0);
                done();
            });
        });
    });

    describe("startTimer", () => {
        it("should return an `setInterval` id", () => {
            const total = 5000;
            const id = startTimer(total, () => {})(dispatch, getState);
            expect(typeof id).toBe("number");
        });

        it("should increment the timer every second", () => {
            const total = 5000;
            startTimer(total, () => {})(dispatch, getState);
            jest.advanceTimersByTime(5000);
            const countIncrement = dispatch.mock.calls.filter(
                (call) => call[0].type === "timer/increment"
            ).length;
            expect(countIncrement).toBe(5);
        });

        it("should stop the timer at the end of an interval", () => {
            rootState.timer.time = 5000;
            const total = 5000;
            const cb = jest.fn();
            startTimer(total, cb)(dispatch, getState);
            jest.advanceTimersByTime(1000);
            const nextIntervalCalled =
                dispatch.mock.calls.findIndex(
                    (call) => call[0].type === "timer/nextInterval"
                ) > -1;
            expect(nextIntervalCalled).toBeTruthy();
            dispatch.mock.calls[2][0]();
            expect(jest.getTimerCount()).toBe(0);
            expect(cb).toBeCalled();
        });
    });
});
