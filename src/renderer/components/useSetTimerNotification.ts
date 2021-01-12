import { useEffect, useRef } from "react";
import { IntervalType, INTERVAL_LENGTH } from "../interval";
import { LOCALIZATION } from "../localization";

export function useSetTimerNotification(
    timeInMs: number,
    intervalType: IntervalType,
    isTimerActive: boolean
) {
    const timeInMsRemaining = INTERVAL_LENGTH[intervalType] - timeInMs;
    const timeInMsRemainingRef = useRef(timeInMsRemaining);
    const tidRef = useRef(null);

    useEffect(() => {
        timeInMsRemainingRef.current = timeInMsRemaining;
    });

    useEffect(() => {
        const focusHandler = () => {
            clearTimeout(tidRef.current);
            tidRef.current = null;
        };

        const blurHandler = () => {
            if (isTimerActive) {
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
                }, timeInMsRemainingRef.current);
            }
        };

        window.addEventListener("focus", focusHandler);
        window.addEventListener("blur", blurHandler);

        return () => {
            window.removeEventListener("focus", focusHandler);
            window.removeEventListener("blur", blurHandler);
        };
    }, [isTimerActive, intervalType]);
}
