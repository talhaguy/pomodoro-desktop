import React from "react";
import { ControlButton, ControlButtonType } from "./ControlButton";

interface ControlsProps {
    toggleTimer: () => void;
    isActive: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
    toggleTimer,
    isActive,
}) => {
    return (
        <div>
            <ControlButton
                type={
                    isActive ? ControlButtonType.Play : ControlButtonType.Pause
                }
                onClick={toggleTimer}
            />
        </div>
    );
};
