// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const AppStyled = styled.div`
    color: blue;
`;

function App() {
    return (
        <AppStyled>
            <h1>App</h1>
        </AppStyled>
    );
}

ReactDOM.render(<App />, document.getElementById("app"));
