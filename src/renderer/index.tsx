import React from "react";
import ReactDOM from "react-dom";
import { RootApp } from "./components";
import {
    documentVisibility,
    DocumentVisibilityContext,
} from "./components/DocumentVisibilityContext";

ReactDOM.render(
    <DocumentVisibilityContext.Provider value={documentVisibility}>
        <RootApp />
    </DocumentVisibilityContext.Provider>,
    document.getElementById("app")
);
