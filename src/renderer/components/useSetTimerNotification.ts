import { useContext, useEffect, useRef } from "react";
import { IntervalType, INTERVAL_LENGTH } from "../interval";
import { LOCALIZATION } from "../localization";
import { DocumentVisibilityContext } from "./DocumentVisibilityContext";

export function useSetTimerNotification(
    timeInMs: number,
    intervalType: IntervalType,
    isTimerActive: boolean
) {
    const timeInMsRemaining = INTERVAL_LENGTH[intervalType] - timeInMs;
    const tidRef = useRef(null);
    const documentVisibility = useContext(DocumentVisibilityContext);

    useEffect(() => {
        const visibilityHandler = () => {
            const isVisible = documentVisibility.isVisible();

            if (!isVisible) {
                tidRef.current = setTimeout(() => {
                    let localizationTitleKey: string;

                    switch (intervalType) {
                        case IntervalType.Focus:
                            localizationTitleKey = "interval.focus";
                            break;
                        case IntervalType.ShortBreak:
                            localizationTitleKey = "interval.shortBreak";
                            break;
                        case IntervalType.LongBreak:
                            localizationTitleKey = "interval.longBreak";
                            break;
                    }

                    new Notification(
                        LOCALIZATION[localizationTitleKey] +
                            LOCALIZATION[
                                "notification.intervalComplete.title.intervalComplete"
                            ],
                        {
                            body:
                                intervalType === IntervalType.Focus
                                    ? LOCALIZATION[
                                          "notification.intervalComplete.body.focus"
                                      ]
                                    : LOCALIZATION[
                                          "notification.intervalComplete.body.break"
                                      ],
                            silent: false,
                        }
                    );
                }, timeInMsRemaining);
            } else {
                clearTimeout(tidRef.current);
                tidRef.current = null;
            }
        };

        if (isTimerActive) {
            window.addEventListener("visibilitychange", visibilityHandler);
        }

        return () => {
            if (isTimerActive) {
                window.removeEventListener(
                    "visibilitychange",
                    visibilityHandler
                );
            }
        };
    }, [timeInMsRemaining, intervalType, isTimerActive, tidRef.current]);
}
