import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { createGlobalStyle } from "styled-components";
import { Controls } from "./Controls";
import { IntervalType, INTERVAL_LENGTH } from "../interval";
import { GlobalStyle } from "../style";
import { Timer } from "./Timer";
import {
    AppDispatch,
    selectTimer,
    activateTimer,
    deactivateTimer,
    skipInterval,
    startResetInterval,
    startTimer,
    stopTimer,
} from "../store";
import { useRenderProgressCircleInCanvas } from "./useRenderProgressCircleInCanvas";
import { useSetTimerNotification } from "./useSetTimerNotification";

const AppScreenMainContents = styled.main`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const IntervalGlobalStyle = createGlobalStyle<{ intervalType: IntervalType }>`
    body {
        background-color: ${(props) =>
            props.intervalType === IntervalType.Focus
                ? props.theme.COLORS.BLUE
                : props.theme.COLORS.GREEN};
    }
`;

export function App() {
    const timerState = useSelector(selectTimer);
    const dispatch = useDispatch<AppDispatch>();

    useSetTimerNotification(
        timerState.time,
        timerState.intervalType,
        timerState.active
    );

    // store accurate no. of ms timer stopped at (as state only stores to the second).
    // important for progress arc to start at right location and not "jump" to the nearest second.
    const timerMsStoppedAt = useRef<number>(timerState.time);

    // store interval id
    const intervalIdRef = useRef<NodeJS.Timer>();

    const TOTAL = INTERVAL_LENGTH[timerState.intervalType];

    const WIDTH = 240;
    const HEIGHT = 240;

    const [canvasRef, draw] = useRenderProgressCircleInCanvas(
        WIDTH,
        HEIGHT,
        WIDTH - 10,
        TOTAL
    );

    const toggleTimer = () => {
        if (timerState.active) {
            dispatch(deactivateTimer());
            dispatch(stopTimer(intervalIdRef.current));
        } else {
            dispatch(activateTimer(draw, timerMsStoppedAt.current, TOTAL)).then(
                (endTimeMs) => {
                    timerMsStoppedAt.current = endTimeMs;
                }
            );

            intervalIdRef.current = dispatch(
                startTimer(TOTAL, () => {
                    // TODO: see if notitification can be fired here
                })
            );
        }
    };

    const skipIntervalCb = () => {
        dispatch(
            skipInterval(intervalIdRef.current, () => {
                draw(0);
            })
        ).then((endTimeMs) => {
            if (endTimeMs !== null) {
                timerMsStoppedAt.current = endTimeMs;
            }
        });
    };

    const resetIntervalCb = () => {
        dispatch(
            startResetInterval(intervalIdRef.current, () => {
                draw(0);
            })
        ).then((endTimeMs) => {
            if (endTimeMs !== null) {
                timerMsStoppedAt.current = endTimeMs;
            }
        });
    };

    return (
        <>
            <GlobalStyle />
            <IntervalGlobalStyle intervalType={timerState.intervalType} />

            <AppScreenMainContents>
                <Timer
                    timeInMS={timerState.time}
                    progressWidth={WIDTH}
                    progressHeight={HEIGHT}
                    maxMSInInterval={TOTAL}
                    canvasRef={canvasRef}
                    currentIntervalType={timerState.intervalType}
                />

                <Controls
                    isActive={timerState.active}
                    toggleTimer={toggleTimer}
                    skipInterval={skipIntervalCb}
                    resetInterval={resetIntervalCb}
                />
            </AppScreenMainContents>
        </>
    );
}
