import { createContext } from "react";

export interface DocumentVisibilityMethods {
    isVisible: () => boolean;
}

export const documentVisibility: DocumentVisibilityMethods = {
    isVisible: () => window.document.visibilityState === "visible",
};

export const DocumentVisibilityContext = createContext<DocumentVisibilityMethods>(
    null
);
