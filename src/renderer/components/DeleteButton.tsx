import React from "react";
import styled from "styled-components";
import deleteImg from "../../../images/delete-white.svg";
import { LOCALIZATION } from "../localization";

const Container = styled.button`
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 2px 0 0 0;
    border-radius: 3px;

    &:active,
    &:focus {
        box-shadow: 0 0 0 1px white;
        outline: none;
    }
`;

export interface DeleteButtonProps {
    onClick: () => void;
}

export function DeleteButton({ onClick }: DeleteButtonProps) {
    return (
        <Container
            onClick={onClick}
            aria-label={LOCALIZATION["intervalCounter.delete"]}
        >
            <img width="25" src={deleteImg} />
        </Container>
    );
}
