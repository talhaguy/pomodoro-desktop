import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { App } from "./App";
import { store } from "./store";
import { THEME } from "./style";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={THEME}>
                <App />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById("app")
);
