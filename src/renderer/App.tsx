import React, { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { createGlobalStyle } from "styled-components";
import { AppDispatch } from "./store";
import { THEME } from "./theme";
import { formatMsToMin } from "./time";
import { selectTimer, activateTimer, deactivateTimer } from "./timerSlice";

// Counter

export function degreesToRadians(degrees: number) {
    return (Math.PI / 180) * degrees;
}

export type Coordinates = [x: number, y: number];

export function calcCoordsForPointOnCirclePerimeter(
    centerOfCircle: Coordinates,
    radius: number,
    degrees: number
): Coordinates {
    const radians = degreesToRadians(degrees);
    const x = centerOfCircle[0] + radius * Math.cos(radians);
    const y = centerOfCircle[1] + radius * Math.sin(radians);
    return [x, y];
}

export function useRenderProgressCircleInCanvas(
    canvasWidth: number,
    canvasHeight: number,
    circleWidth: number,
    total: number
) {
    console.log("useRenderProgressCircleInCanvas");
    const canvasRef = useRef<HTMLCanvasElement>();

    const draw = useCallback((elapsedMs: number) => {
        const percentage = elapsedMs / total;
        const degrees = 360 * percentage;
        const degreesOffset = degrees - 90;
        const radians = degreesToRadians(degreesOffset);

        // make 2x bigger for higher device pixel ratio
        const canvasWidth2x = canvasWidth * 2;
        const canvasHeight2x = canvasHeight * 2;
        const circleWidth2x = circleWidth * 2;

        const context = canvasRef.current.getContext("2d");
        context.clearRect(0, 0, canvasWidth2x, canvasHeight2x);

        // render full outline circle
        context.globalAlpha = 0.2;
        context.beginPath();
        context.arc(
            canvasWidth2x / 2,
            canvasHeight2x / 2,
            circleWidth2x / 2,
            degreesToRadians(0),
            degreesToRadians(360)
        );
        context.strokeStyle = THEME.COLORS.WHITE;
        context.lineWidth = 2 * 2;
        context.stroke();
        context.closePath();
        context.globalAlpha = 1;

        // render progress arc
        context.beginPath();
        context.arc(
            canvasWidth2x / 2,
            canvasHeight2x / 2,
            circleWidth2x / 2,
            degreesToRadians(-90),
            radians
        );
        context.strokeStyle = THEME.COLORS.WHITE;
        context.lineWidth = 2 * 2;
        context.stroke();
        context.closePath();

        // render nib for progress arc
        const nibCoords = calcCoordsForPointOnCirclePerimeter(
            [canvasWidth2x / 2, canvasHeight2x / 2],
            circleWidth2x / 2,
            degreesOffset
        );
        context.beginPath();
        context.arc(
            nibCoords[0],
            nibCoords[1],
            4 * 2,
            degreesToRadians(0),
            degreesToRadians(360)
        );
        context.fillStyle = THEME.COLORS.WHITE;
        context.fill();
        context.closePath();
    }, []);

    // draw initial progress
    useEffect(() => {
        draw(0);
    }, []);

    return [canvasRef, draw] as [
        MutableRefObject<HTMLCanvasElement>,
        typeof draw
    ];
}

export interface ProgressCircleProps {
    width: number;
    height: number;
    total: number;
    canvasRef: MutableRefObject<HTMLCanvasElement>;
}

export function ProgressCircle({
    width,
    height,
    canvasRef,
}: ProgressCircleProps) {
    console.log("ProgressCircle");

    return (
        <canvas
            ref={canvasRef}
            width={width * 2}
            height={height * 2}
            style={{ width, height }}
        />
    );
}

const StyledTime = styled.div`
    font-size: 7.2rem;
`;

export interface TimeProps {
    ms: number;
}

function Time({ ms }: TimeProps) {
    return <StyledTime>{formatMsToMin(ms)}</StyledTime>;
}

// App

const GlobalStyle = createGlobalStyle`
    html {
        font-size: 62.5%;
        font-family: ${(props) => props.theme.FONTS.PRIMARY};
        color: ${(props) => props.theme.COLORS.WHITE};
    }

    body {
        margin: 0;
        background-color: ${(props) => props.theme.COLORS.BLUE};
    }
`;

const AppScreenMainContents = styled.main`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const TimerProgressContainer = styled.div`
    position: relative;
    display: inline-block;

    .timer {
        z-index: 2;
        position: absolute;
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
    }

    .progress {
        z-index: 1;
    }
`;

export function App() {
    console.log("DEBUG: render App");

    const timerState = useSelector(selectTimer);
    const dispatch = useDispatch<AppDispatch>();

    // store accurate no. of ms timer stopped at (as state only stores to the second).
    // important for progress arc to start at right location and not "jump" to the nearest second.
    const timerMsStoppedAt = useRef<number>(timerState.time);

    // const TOTAL = 25 * 60 * 1000;
    // const TOTAL = 5 * 60 * 1000;
    const TOTAL = 10000;

    const WIDTH = 240;
    const HEIGHT = 240;

    const [canvasRef, draw] = useRenderProgressCircleInCanvas(
        WIDTH,
        HEIGHT,
        WIDTH - 10,
        TOTAL
    );

    const toggleTimerClick = () => {
        if (timerState.active) {
            dispatch(deactivateTimer());
        } else {
            dispatch(activateTimer(draw, timerMsStoppedAt.current, TOTAL)).then(
                (endTimeMs) => {
                    console.log("timer has stopped!!!", endTimeMs);
                    timerMsStoppedAt.current = endTimeMs;
                }
            );
        }
    };

    return (
        <>
            <GlobalStyle />
            <AppScreenMainContents>
                <TimerProgressContainer>
                    <div className="timer">
                        <Time ms={timerState.time} />
                    </div>
                    <div className="progress">
                        <ProgressCircle
                            width={WIDTH}
                            height={HEIGHT}
                            total={TOTAL}
                            canvasRef={canvasRef}
                        />
                    </div>
                </TimerProgressContainer>
                <button onClick={toggleTimerClick}>Toggle</button>
            </AppScreenMainContents>
        </>
    );
}
