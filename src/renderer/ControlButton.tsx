import React from "react";
import { Button } from "./Button";
import pauseImg from "../../images/pause-white.svg";
import playImg from "../../images/play_arrow-white.svg";
import styled from "styled-components";

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
    switch (type) {
        case ControlButtonType.Play:
            imageSrc = playImg;
            break;
        case ControlButtonType.Pause:
            imageSrc = pauseImg;
            break;
    }

    return (
        <Button onClick={onClick}>
            <StyledImage src={imageSrc} />
        </Button>
    );
};
