import React from "react";
import { cleanup, render } from "@testing-library/react";
import { IntervalType } from "../../shared";
import { useSetTimerNotification } from "./useSetTimerNotification";

describe("useSetTimerNotification()", () => {
    const OriginalNotification = window.Notification;

    function focusWindow() {
        const event = new FocusEvent("focus", {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        window.dispatchEvent(event);
    }

    function blurWindow() {
        const event = new FocusEvent("blur", {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        window.dispatchEvent(event);
    }

    function renderContainer(
        timeInMs: number,
        intervalType: IntervalType,
        isTimerActive: boolean
    ) {
        const Container = () => {
            useSetTimerNotification(timeInMs, intervalType, isTimerActive);
            return <></>;
        };

        render(<Container />);
    }

    beforeEach(() => {
        (window as any).Notification = jest.fn<
            Notification,
            [title: string, options?: NotificationOptions]
        >();

        jest.useFakeTimers();
    });

    afterEach(() => {
        window.Notification = OriginalNotification;

        jest.useRealTimers();

        cleanup();

        focusWindow();
    });

    it("should show a notification when app is not focused and timer is active", () => {
        renderContainer(2000, IntervalType.Focus, true);
        blurWindow();

        // end focus interval
        jest.advanceTimersByTime(3000);

        expect(window.Notification).toBeCalled();
    });

    it("should NOT show a notification when app is not focused and timer is not active", () => {
        renderContainer(2000, IntervalType.Focus, false);
        blurWindow();

        // end focus interval
        jest.advanceTimersByTime(3000);

        expect(window.Notification).not.toBeCalled();
    });

    it("should NOT show a notification when app is focused", () => {
        renderContainer(2000, IntervalType.Focus, true);

        // hide window then show it
        blurWindow();
        focusWindow();

        // end focus interval
        jest.advanceTimersByTime(3000);

        expect(window.Notification).not.toBeCalled();
    });
});
