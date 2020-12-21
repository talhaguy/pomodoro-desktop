import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "./App";

describe("App", () => {
    it("should render", () => {
        const rendered = render(<App />);
        expect(screen.queryByText("This is an App")).toBeInTheDocument();
    });
});
