import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { getSavedIntervalData, saveIntervalData } from "../data";
import { store } from "../store";
import { THEME } from "../style";
import { App } from "./App";
import { GlobalContext } from "./GlobalContext";

export function RootApp() {
    return (
        <React.StrictMode>
            <Provider store={store}>
                <ThemeProvider theme={THEME}>
                    <GlobalContext.Provider
                        value={{
                            ENV,
                        }}
                    >
                        <App />
                    </GlobalContext.Provider>
                </ThemeProvider>
            </Provider>
        </React.StrictMode>
    );
}
