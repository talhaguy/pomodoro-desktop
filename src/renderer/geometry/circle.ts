export type Coordinates = [x: number, y: number];

export function degreesToRadians(degrees: number) {
    return (Math.PI / 180) * degrees;
}

export function calcCoordsForPointOnCirclePerimeter(
    centerOfCircle: Coordinates,
    radius: number,
    degrees: number
): Coordinates {
    const radians = degreesToRadians(degrees);
    const x = centerOfCircle[0] + radius * Math.cos(radians);
    const y = centerOfCircle[1] + radius * Math.sin(radians);
    return [x, y];
}

export function calcDegreesComplete(
    part: number,
    total: number,
    offsetDegrees: number
) {
    const percentage = part / total;
    const degrees = 360 * percentage;
    return degrees - offsetDegrees;
}
