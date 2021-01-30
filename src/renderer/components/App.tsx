import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { createGlobalStyle } from "styled-components";
import { Controls } from "./Controls";
import {
    CurrentIntervalData,
    IntervalType,
    INTERVAL_LENGTH,
} from "../../shared";
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
    saveFocusIntervalEndData,
    retrieveSavedIntervalData,
    deleteAllSavedData,
} from "../store";
import { useRenderProgressCircleInCanvas } from "./useRenderProgressCircleInCanvas";
import { useSetTimerNotification } from "./useSetTimerNotification";
import { IntervalCounter } from "./IntervalCounter";
import { DeleteButton } from "./DeleteButton";

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

    // store if we are in the middle of an interval
    const isIntervalStartedRef = useRef(false);

    const TOTAL = INTERVAL_LENGTH[timerState.intervalType];

    const WIDTH = 240;
    const HEIGHT = 240;

    const [canvasRef, draw] = useRenderProgressCircleInCanvas(
        WIDTH,
        HEIGHT,
        WIDTH - 10,
        TOTAL
    );

    // store current interval data
    const currentIntervalDataRef = useRef<CurrentIntervalData>();

    useEffect(() => {
        resetCurrentIntervalData();
    }, [timerState.intervalType]);

    // get saved data if there is any and set the state
    useEffect(() => {
        dispatch(retrieveSavedIntervalData());
    }, []);

    const resetCurrentIntervalData = () => {
        currentIntervalDataRef.current = {
            startTime: null,
            endTime: null,
            intervalDuration: TOTAL,
            didSkip: false,
            numTimesPaused: 0,
            numTimesReset: 0,
            intervalType: timerState.intervalType,
        };
    };

    const toggleTimer = () => {
        if (timerState.active) {
            dispatch(deactivateTimer());
            dispatch(stopTimer(intervalIdRef.current));
            currentIntervalDataRef.current.numTimesPaused += 1;
        } else {
            dispatch(activateTimer(draw, timerMsStoppedAt.current, TOTAL)).then(
                (endTimeMs) => {
                    timerMsStoppedAt.current = endTimeMs;
                }
            );

            intervalIdRef.current = dispatch(
                startTimer(TOTAL, () => {
                    // TODO: see if notitification can be fired here

                    isIntervalStartedRef.current = false;

                    currentIntervalDataRef.current.endTime = Date.now();

                    dispatch(
                        saveFocusIntervalEndData(currentIntervalDataRef.current)
                    );
                })
            );

            // update interval start time only if this is a new interval being started
            if (!isIntervalStartedRef.current) {
                currentIntervalDataRef.current.startTime = Date.now();
                isIntervalStartedRef.current = true;
            }
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

            isIntervalStartedRef.current = false;
            currentIntervalDataRef.current.didSkip = true;

            dispatch(saveFocusIntervalEndData(currentIntervalDataRef.current));
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

            currentIntervalDataRef.current.numTimesReset += 1;
            isIntervalStartedRef.current = false;
        });
    };

    const resetData = () => {
        dispatch(deleteAllSavedData(intervalIdRef.current));
        isIntervalStartedRef.current = false;
        resetCurrentIntervalData();
        requestAnimationFrame(() => {
            draw(0);
            timerMsStoppedAt.current = 0;
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

                <IntervalCounter
                    numIntervalsCompleted={
                        timerState.numFocusIntervalsCompleted
                    }
                />
            </AppScreenMainContents>

            <DeleteButton onClick={resetData} />
        </>
    );
}
