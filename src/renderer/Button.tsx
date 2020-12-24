import React, { ReactNode } from "react";
import styled from "styled-components";

const StyledButton = styled.button`
    display: inline-flex;
    border: none;
    background-color: ${(props) => props.theme.COLORS.ORANGE};
    color: ${(props) => props.theme.COLORS.WHITE};
    padding: 3px;
    cursor: pointer;
    filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.25));
    position: relative;

    &:active {
        top: 2px;
        filter: none;
    }
`;

interface ButtonProps {
    onClick: () => void;
    children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
    return <StyledButton onClick={onClick}>{children}</StyledButton>;
};
