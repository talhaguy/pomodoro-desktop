import React from "react";
import { cleanup, render } from "@testing-library/react";
import { IntervalType, INTERVAL_LENGTH } from "../interval";
import { useSetTimerNotification } from "./useSetTimerNotification";
import { DocumentVisibilityContext } from "./DocumentVisibilityContext";

describe("useSetTimerNotification()", () => {
    const OriginalNotification = window.Notification;

    const isVisibleValue = { visibility: true };
    let isVisible = () => isVisibleValue.visibility;

    function makeWindowHidden() {
        isVisibleValue.visibility = false;
        window.dispatchEvent(new Event("visibilitychange"));
    }

    function makeWindowVisible() {
        isVisibleValue.visibility = true;
        window.dispatchEvent(new Event("visibilitychange"));
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

        render(
            <DocumentVisibilityContext.Provider
                value={{
                    isVisible,
                }}
            >
                <Container />
            </DocumentVisibilityContext.Provider>
        );
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

        makeWindowVisible();
    });

    it("should show a notification when app is hidden and timer is active", () => {
        renderContainer(2000, IntervalType.Focus, true);
        makeWindowHidden();

        // end focus interval
        jest.advanceTimersByTime(3000);

        expect(window.Notification).toBeCalled();
    });

    it("should NOT show a notification when app is hidden and timer is not active", () => {
        renderContainer(2000, IntervalType.Focus, false);
        makeWindowHidden();

        // end focus interval
        jest.advanceTimersByTime(3000);

        expect(window.Notification).not.toBeCalled();
    });

    it("should NOT show a notification when app is visible", () => {
        renderContainer(2000, IntervalType.Focus, true);

        // hide window then show it
        makeWindowHidden();
        makeWindowVisible();

        // end focus interval
        jest.advanceTimersByTime(3000);

        expect(window.Notification).not.toBeCalled();
    });
});
