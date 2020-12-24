import React, { MutableRefObject } from "react";
import styled from "styled-components";
import { Clock } from "./Clock";
import { ProgressCircle } from "./ProgressCircle";

const TimerProgressContainer = styled.div`
    position: relative;
    display: inline-block;
    margin-bottom: ${(props) => props.theme.SPACING.SECTION_MARGIN};

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

interface TimerProps {
    timeInMS: number;
    progressWidth: number;
    progressHeight: number;
    maxMSInInterval: number;
    canvasRef: MutableRefObject<HTMLCanvasElement>;
}

export const Timer: React.FC<TimerProps> = ({
    timeInMS,
    progressWidth,
    progressHeight,
    maxMSInInterval,
    canvasRef,
}) => {
    return (
        <TimerProgressContainer>
            <div className="timer">
                <Clock ms={timeInMS} />
            </div>
            <div className="progress">
                <ProgressCircle
                    width={progressWidth}
                    height={progressHeight}
                    total={maxMSInInterval}
                    canvasRef={canvasRef}
                />
            </div>
        </TimerProgressContainer>
    );
};
