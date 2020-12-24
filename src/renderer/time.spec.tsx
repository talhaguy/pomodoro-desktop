import { formatMsToMin, fillWithZerosForDigits } from "./time";
describe("time", () => {
    describe("formatMsToMin()", () => {
        it("should format a given ms number to minutes and seconds", () => {
            expect(formatMsToMin(1000)).toBe("00:01");
            expect(formatMsToMin(60000)).toBe("01:00");
            expect(formatMsToMin(825000)).toBe("13:45");
            expect(formatMsToMin(1231231)).toBe("20:31");
        });
    });

    describe("fillWithZerosForDigits()", () => {
        it("should fill in the given number of unused places with zeroes", () => {
            expect(fillWithZerosForDigits(2, 1)).toBe("01");
            expect(fillWithZerosForDigits(5, 9)).toBe("00009");
            expect(fillWithZerosForDigits(3, 100)).toBe("100");
            expect(fillWithZerosForDigits(3, 22)).toBe("022");
            expect(fillWithZerosForDigits(4, 12.54)).toBe("0013");
        });
    });
});
