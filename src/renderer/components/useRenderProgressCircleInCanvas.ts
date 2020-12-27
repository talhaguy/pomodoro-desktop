import { MutableRefObject, useCallback, useEffect, useRef } from "react";
import {
    degreesToRadians,
    calcCoordsForPointOnCirclePerimeter,
    calcDegreesComplete,
} from "../geometry";
import { THEME } from "../style";

export function useRenderProgressCircleInCanvas(
    canvasWidth: number,
    canvasHeight: number,
    circleWidth: number,
    total: number
) {
    const canvasRef = useRef<HTMLCanvasElement>();

    const draw = useCallback(
        (elapsedMs: number) => {
            const degreesOffset = calcDegreesComplete(elapsedMs, total, 90);
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
        },
        [total]
    );

    // draw initial progress
    useEffect(() => {
        draw(0);
    }, []);

    return [canvasRef, draw] as [
        MutableRefObject<HTMLCanvasElement>,
        typeof draw
    ];
}
