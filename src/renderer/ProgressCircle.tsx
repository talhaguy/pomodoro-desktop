import React, { MutableRefObject } from "react";

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
    return (
        <canvas
            ref={canvasRef}
            width={width * 2}
            height={height * 2}
            style={{ width, height }}
        />
    );
}
