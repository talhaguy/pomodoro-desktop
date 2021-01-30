import { IntervalType } from "./constants";

export interface CurrentIntervalData {
    startTime: number | null;
    endTime: number | null;
    intervalDuration: number;
    numTimesPaused: number;
    numTimesReset: number;
    didSkip: boolean;
    intervalType: IntervalType;
}
