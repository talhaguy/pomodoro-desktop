import React from "react";
import styled from "styled-components";
import { ControlButton, ControlButtonType } from "./ControlButton";

const StyledControlButtons = styled.div`
    display: flex;
    justify-content: center;

    button + button {
        margin-left: 10px;
    }
`;

interface ControlsProps {
    isActive: boolean;
    toggleTimer: () => void;
    skipInterval: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
    isActive,
    toggleTimer,
    skipInterval,
}) => {
    return (
        <StyledControlButtons>
            <ControlButton
                type={
                    isActive ? ControlButtonType.Pause : ControlButtonType.Play
                }
                onClick={toggleTimer}
            />
            <ControlButton
                type={ControlButtonType.Skip}
                onClick={skipInterval}
            />
        </StyledControlButtons>
    );
};
