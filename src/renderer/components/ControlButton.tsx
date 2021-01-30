import React from "react";
import { Button } from "./Button";
import styled from "styled-components";
import pauseImg from "../../../images/pause-white.svg";
import playImg from "../../../images/play_arrow-white.svg";
import skipImg from "../../../images/skip_next-white.svg";
import restartImg from "../../../images/replay-white.svg";
import { LOCALIZATION } from "../localization";

export enum ControlButtonType {
    Play,
    Pause,
    Restart,
    Skip,
}

const StyledImage = styled.img`
    width: 32px;
    height: 32px;
`;

interface ControlButtonProps {
    type: ControlButtonType;
    onClick: () => void;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
    type,
    onClick,
}) => {
    let imageSrc: any;
    let ariaLabel: string;
    switch (type) {
        case ControlButtonType.Play:
            imageSrc = playImg;
            ariaLabel = LOCALIZATION["controls.start"];
            break;
        case ControlButtonType.Pause:
            imageSrc = pauseImg;
            ariaLabel = LOCALIZATION["controls.pause"];
            break;
        case ControlButtonType.Skip:
            imageSrc = skipImg;
            ariaLabel = LOCALIZATION["controls.skip"];
            break;
        case ControlButtonType.Restart:
            imageSrc = restartImg;
            ariaLabel = LOCALIZATION["controls.restart"];
            break;
    }

    return (
        <Button onClick={onClick} ariaLabel={ariaLabel}>
            <StyledImage src={imageSrc} />
        </Button>
    );
};
