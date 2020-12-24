import { Environment } from "../shared/environment";

export enum IntervalType {
    Focus = "Focus",
    ShortBreak = "ShortBreak",
    LongBreak = "LongBreak",
}

// stores length of interval types in ms
export const INTERVAL_LENGTH =
    ENV === Environment.Dev
        ? {
              [IntervalType.Focus]: 5 * 1000,
              [IntervalType.ShortBreak]: 1 * 1000,
              [IntervalType.LongBreak]: 3 * 1000,
          }
        : {
              [IntervalType.Focus]: 25 * 60 * 1000,
              [IntervalType.ShortBreak]: 5 * 60 * 1000,
              [IntervalType.LongBreak]: 15 * 60 * 1000,
          };

export const NUM_FOCUS_INTERVALS_TO_COMPLETE_FOR_LONG_BREAK = 3;
