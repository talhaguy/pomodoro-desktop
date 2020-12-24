import React, { MutableRefObject } from "react";
import styled from "styled-components";
import { Clock } from "./Clock";
import { IntervalType } from "./interval";
import { ProgressCircle } from "./ProgressCircle";

const TimerProgressContainer = styled.div`
    position: relative;
    display: inline-block;
    margin-bottom: ${(props) => props.theme.SPACING.SECTION_MARGIN};

    .timer {
        z-index: 2;
        position: absolute;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
    }

    .current-interval {
        font-size: 1.8rem;
        text-transform: uppercase;
        position: absolute;
        bottom: 45px;
        text-align: center;
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
    currentIntervalType: IntervalType;
}

export const Timer: React.FC<TimerProps> = ({
    timeInMS,
    progressWidth,
    progressHeight,
    maxMSInInterval,
    canvasRef,
    currentIntervalType,
}) => {
    let intervalLabel: String;
    switch (currentIntervalType) {
        case IntervalType.Focus:
            intervalLabel = "Focus";
            break;
        case IntervalType.ShortBreak:
            intervalLabel = "Short Break";
            break;
        case IntervalType.LongBreak:
            intervalLabel = "Long Break";
            break;
    }

    return (
        <TimerProgressContainer>
            <div className="timer">
                <Clock ms={timeInMS} />
                <span className="current-interval">{intervalLabel}</span>
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
