import { IntervalType } from "../interval";
import { RootState } from "./store";
import { startTimerAndAnimation } from "./thunks";

jest.setTimeout(10000);

describe("thunks", () => {
    describe("startTimerAndAnimation()", () => {
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

            window.Notification = jest.fn() as any;

            window.document.hasFocus = jest.fn().mockReturnValue(true);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it("should break out of raf loop if skip flag is set", (done) => {
            rootState.timer.active = true;
            rootState.timer.skip = true;

            const promise = startTimerAndAnimation(
                draw,
                0,
                5000
            )(dispatch, getState);

            promise.then((time) => {
                expect(dispatch.mock.calls[0][0].type).toBe(
                    "timer/nextInterval"
                );
                expect(dispatch).toHaveBeenCalledTimes(1);
                expect(draw).toHaveBeenCalledWith(0);
                expect(draw).toHaveBeenCalledTimes(1);
                expect(time).toBe(0);
                done();
            });
        });

        it("should break out of raf loop if reset flag is set", (done) => {
            rootState.timer.active = true;
            rootState.timer.reset = true;

            const promise = startTimerAndAnimation(
                draw,
                0,
                5000
            )(dispatch, getState);

            promise.then((time) => {
                expect(dispatch.mock.calls[0][0].type).toBe(
                    "timer/resetInterval"
                );
                expect(dispatch).toHaveBeenCalledTimes(1);
                expect(draw).toHaveBeenCalledWith(0);
                expect(draw).toHaveBeenCalledTimes(1);
                expect(time).toBe(0);
                done();
            });
        });

        it("should break out of raf loop when timer is done and should not show notification when window is focused", (done) => {
            rootState.timer.active = true;
            rootState.timer.time = 5000;

            const promise = startTimerAndAnimation(
                draw,
                0,
                5000
            )(dispatch, getState);

            promise.then((time) => {
                expect(dispatch.mock.calls[0][0].type).toBe(
                    "timer/nextInterval"
                );
                expect(draw).toHaveBeenCalledWith(0);
                expect(time).toBe(0);
                expect(window.Notification).not.toHaveBeenCalled();
                done();
            });
        });

        it("should break out of raf loop when timer is done and should show notification when window is unfocused", (done) => {
            window.document.hasFocus = jest.fn().mockReturnValue(false);
            rootState.timer.active = true;
            rootState.timer.time = 5000;

            const promise = startTimerAndAnimation(
                draw,
                0,
                5000
            )(dispatch, getState);

            promise.then((time) => {
                expect(dispatch.mock.calls[0][0].type).toBe(
                    "timer/nextInterval"
                );
                expect(draw).toHaveBeenCalledWith(0);
                expect(time).toBe(0);
                expect(window.Notification).toHaveBeenCalled();
                done();
            });
        });
    });
});
