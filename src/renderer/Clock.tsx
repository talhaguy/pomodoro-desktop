import React from "react";
import styled from "styled-components";
import { formatMsToMin } from "./time";

const StyledTime = styled.div`
    font-size: 7.2rem;
`;

export interface ClockProps {
    ms: number;
}

export function Clock({ ms }: ClockProps) {
    return <StyledTime>{formatMsToMin(ms)}</StyledTime>;
}
