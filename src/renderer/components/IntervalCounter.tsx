import React, { useState } from "react";
import styled from "styled-components";
import { LOCALIZATION } from "../localization";
import { Tooltip } from "./Tooltip";

export interface IntervalCounterProps {
    numIntervalsCompleted: number;
}

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    max-width: 300px;
    position: relative;
    min-height: 21px;

    .circle-cont {
        width: 15px;
        animation: pop-in 500ms;
        margin: 3px;
    }

    .circle {
        border-radius: 100%;
        width: 15px;
        height: 15px;
        background-color: ${(props) => props.theme.COLORS.WHITE};
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
    }

    @keyframes pop-in {
        0% {
            transform: scale(0);
            width: 0;
        }

        55% {
            transform: scale(1.2);
        }

        75% {
            transform: scale(0.9);
        }

        100% {
            transform: scale(1);
            width: 15px;
        }
    }

    .bold {
        font-weight: bold;
    }
`;

export function IntervalCounter({
    numIntervalsCompleted,
}: IntervalCounterProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    const renderCircles = () => {
        const circles = [];
        for (let i = 0; i < numIntervalsCompleted; i++) {
            circles.push(
                <div className="circle-cont" key={"circle-" + i}>
                    <div className="circle"></div>
                </div>
            );
        }
        return circles;
    };

    return (
        <>
            <Container
                onMouseOver={() => setShowTooltip(true)}
                onMouseOut={() => setShowTooltip(false)}
                aria-label={
                    numIntervalsCompleted +
                    " " +
                    LOCALIZATION["intervalCounter.intervalsCompleted"]
                }
            >
                {renderCircles()}
                <div
                    onMouseOver={(e) => {
                        // prevent hover over on this invisible tooltip triggering it to be visible
                        e.stopPropagation();
                    }}
                >
                    {numIntervalsCompleted > 0 && (
                        <Tooltip bottom={-80} isVisible={showTooltip}>
                            <span className="bold">
                                {numIntervalsCompleted}
                            </span>{" "}
                            {LOCALIZATION["intervalCounter.intervalsCompleted"]}
                        </Tooltip>
                    )}
                </div>
            </Container>
        </>
    );
}
