import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { Clock } from "./Clock";

describe("Clock", () => {
    it("should show formatted time", () => {
        let rendered = render(<Clock ms={123456} />);
        expect(screen.queryByText("02:03")).toBeInTheDocument();

        cleanup();
        rendered = render(<Clock ms={987654} />);
        expect(screen.queryByText("16:28")).toBeInTheDocument();
    });
});
