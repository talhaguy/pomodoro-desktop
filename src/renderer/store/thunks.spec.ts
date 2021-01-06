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
    });
});
