import React, { useRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { THEME } from "../style";
import { Timer } from "./Timer";
import { IntervalType } from "../interval";
import { LOCALIZATION } from "../localization";

describe("Timer", () => {
    const renderContainer = (type: IntervalType) => {
        const ContainerComponent = () => {
            const canvasRef = useRef();

            return (
                <ThemeProvider theme={THEME}>
                    <Timer
                        timeInMS={12345}
                        progressWidth={100}
                        progressHeight={100}
                        maxMSInInterval={10000}
                        canvasRef={canvasRef}
                        currentIntervalType={type}
                    />
                </ThemeProvider>
            );
        };

        return render(<ContainerComponent />);
    };

    afterEach(() => {
        cleanup();
    });

    it("should show correct interval type label", () => {
        let rendered = renderContainer(IntervalType.Focus);
        expect(screen.queryByTestId("interval-label")).toHaveTextContent(
            LOCALIZATION["interval.focus"]
        );

        cleanup();
        rendered = renderContainer(IntervalType.ShortBreak);
        expect(screen.queryByTestId("interval-label")).toHaveTextContent(
            LOCALIZATION["interval.shortBreak"]
        );

        cleanup();
        rendered = renderContainer(IntervalType.LongBreak);
        expect(screen.queryByTestId("interval-label")).toHaveTextContent(
            LOCALIZATION["interval.longBreak"]
        );
    });
});
