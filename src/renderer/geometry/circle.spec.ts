import {
    calcCoordsForPointOnCirclePerimeter,
    calcDegreesComplete,
    degreesToRadians,
} from "./circle";

describe("circle", () => {
    describe("degreesToRadian()", () => {
        it("should calculate angle in radians given degrees", () => {
            expect(parseFloat(degreesToRadians(0).toFixed(2))).toBe(0);
            expect(parseFloat(degreesToRadians(90).toFixed(2))).toBe(1.57);
            expect(parseFloat(degreesToRadians(180).toFixed(2))).toBe(3.14);
            expect(parseFloat(degreesToRadians(64).toFixed(2))).toBe(1.12);
        });
    });

    describe("calcCoordsForPointOnCirclePerimeter()", () => {
        it("should calculate x and y coords of angle on perimeter of circle", () => {
            expect(calcCoordsForPointOnCirclePerimeter([5, 5], 5, 0)).toEqual([
                10,
                5,
            ]);
            expect(
                calcCoordsForPointOnCirclePerimeter([50, 50], 50, 90)
            ).toEqual([50, 100]);
        });
    });

    describe("calcDegreesComplete()", () => {
        it("should return how many degrees based on a fraction", () => {
            expect(calcDegreesComplete(5, 10, 0)).toBe(180);
            expect(calcDegreesComplete(100, 100, 0)).toBe(360);
            expect(calcDegreesComplete(25, 100, 10)).toBe(80);
        });
    });
});
