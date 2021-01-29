import React, { ReactNode } from "react";
import styled from "styled-components";

const Container = styled.div<{ bottom: number; isVisible: boolean }>`
    position: absolute;
    bottom: ${(props) => props.bottom + "px"};
    left: 50%;
    transform: translate(-50%);
    background-color: ${(props) => props.theme.COLORS.WHITE};
    color: ${(props) => props.theme.COLORS.BLACK};
    padding: 20px 40px;
    font-size: 1.4rem;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    opacity: ${(props) => (props.isVisible ? "1" : "0")};
    transition: opacity 200ms;
    min-width: 150px;
    text-align: center;

    &::before {
        content: "";
        background-color: ${(props) => props.theme.COLORS.WHITE};
        height: 20px;
        width: 20px;
        position: absolute;
        top: -9px;
        left: 50%;
        transform: translate(-50%) rotate(45deg);
        border-radius: 3px;
    }
`;

export interface TooltipProps {
    bottom: number;
    children: ReactNode;
    isVisible: boolean;
}

export function Tooltip({ bottom, isVisible, children }: TooltipProps) {
    return (
        <Container bottom={bottom} isVisible={isVisible}>
            {children}
        </Container>
    );
}
