import React, { MutableRefObject, useEffect, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import styled, { createGlobalStyle } from "styled-components";
import { increment, decrement } from "./counterSlice";

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
    current: number,
    total: number
) {
    const canvasRef = useRef<HTMLCanvasElement>();

    useEffect(() => {
        const percentage = current / total;
        const degrees = 360 * percentage;
        const degreesOffset = degrees - 90;
        const radians = degreesToRadians(degreesOffset);

        const context = canvasRef.current.getContext("2d");
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        // render circle
        context.beginPath();
        context.arc(
            canvasWidth / 2,
            canvasHeight / 2,
            circleWidth / 2,
            degreesToRadians(0),
            degreesToRadians(360)
        );
        context.strokeStyle = "lightblue";
        context.lineWidth = 2;
        context.stroke();
        context.closePath();

        // render progress
        context.beginPath();
        context.arc(
            canvasWidth / 2,
            canvasHeight / 2,
            circleWidth / 2,
            degreesToRadians(-90),
            radians
        );
        context.strokeStyle = "blue";
        context.lineWidth = 2;
        context.stroke();
        context.closePath();

        // render nib
        const nibCoords = calcCoordsForPointOnCirclePerimeter(
            [canvasWidth / 2, canvasHeight / 2],
            circleWidth / 2,
            degreesOffset
        );
        context.beginPath();
        context.arc(
            nibCoords[0],
            nibCoords[1],
            4,
            degreesToRadians(0),
            degreesToRadians(360)
        );
        context.fillStyle = "blue";
        context.fill();
        context.closePath();
    });

    return canvasRef;
}

export interface ProgressCircleProps {
    current: number;
    total: number;
}

export function ProgressCircle({ current, total }: ProgressCircleProps) {
    const WIDTH = 300;
    const HEIGHT = 300;

    const canvasRef = useRenderProgressCircleInCanvas(
        WIDTH,
        HEIGHT,
        WIDTH - 10,
        current,
        total
    );

    return <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />;
}

export interface TimeProps {
    ms: number;
}

function Time({ ms }: TimeProps) {
    return (
        <div>
            <div>{ms}</div>
            <ProgressCircle current={ms} total={25 * 60 * 1000} />
        </div>
    );
}

// App

const GlobalStyle = createGlobalStyle`
    body {
        background-color: white;
    }
`;

export function App() {
    const count = useSelector<{ counter: { value: number } }, number>(
        (state) => state.counter.value
    );
    const dispatch = useDispatch();

    return (
        <>
            <GlobalStyle />
            <Time ms={(25 * 60 * 1000) / 2} />
        </>
    );
}
