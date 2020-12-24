export function formatMsToMin(ms: number) {
    const seconds = ms / 1000;
    const minutes = seconds / 60;
    const leftOverSecondsBase10 = minutes % 1;
    const leftOverSecondsBaseSeconds = leftOverSecondsBase10 * 60;
    return `${fillWithZerosForDigits(
        2,
        minutes - leftOverSecondsBase10
    )}:${fillWithZerosForDigits(2, leftOverSecondsBaseSeconds)}`;
}

export function fillWithZerosForDigits(numDigits: number, num: number) {
    const numString = num.toFixed(0);
    const numToFill = numDigits - numString.length;
    return Array(numToFill).fill(0).join("") + numString;
}
