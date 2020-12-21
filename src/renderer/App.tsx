import React from "react";
import styled from "styled-components";

const AppStyled = styled.div`
    color: blue;
`;

export function App() {
    return (
        <AppStyled>
            <h1>This is an App</h1>
        </AppStyled>
    );
}
