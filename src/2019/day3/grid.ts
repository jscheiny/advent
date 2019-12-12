// import { path1, path2 } from "./input";

interface Vector {
    start: Point;
    end: Point;
    orientation: Orientation;
    magnitude: number;
}

interface Point {
    x: number;
    y: number;
}

interface Step {
    direction: Direction;
    distance: number;
}

type Direction = "U" | "D" | "L" | "R";
type Orientation = "Horizontal" | "Vertical";

const DIRECTION_TO_ORIENTATION: Record<Direction, Orientation> = {
    U: "Vertical",
    D: "Vertical",
    L: "Horizontal",
    R: "Horizontal",
};

const DIRECTION_TO_SIGN: Record<Direction, -1 | 1> = {
    U: 1,
    D: -1,
    L: 1,
    R: -1,
};

function getVectorEnd({ x, y }: Point, { direction, distance }: Step): Point {
    switch (direction) {
        case "U":
            return { x, y: y + distance };
        case "D":
            return { x, y: y - distance };
        case "L":
            return { x: x - distance, y };
        case "R":
            return { x: x + distance, y };
    }
}

function getVector(start: Point, step: Step): Vector {
    const { direction, distance } = step;
    const orientation = DIRECTION_TO_ORIENTATION[direction];
    const magnitude = DIRECTION_TO_SIGN[direction] * distance;
    return { start, end: getVectorEnd(start, step), orientation, magnitude };
}

function vectorContains(vector: Vector, point: Point) {
    return point.x >= vector.start.x && point.x <= vector.end.x && point.y >= vector.start.y && point.y <= vector.end.y;
}

function getIntersectionPoint(v: Vector, w: Vector): Point | undefined {
    if (v.orientation === w.orientation) {
        return undefined;
    }

    const potentialIntersection: Point =
        v.orientation === "Horizontal" ? { x: w.start.x, y: v.start.y } : { x: v.start.x, y: w.start.y };
    // console.log(potentialIntersection);
    // if (vectorContains(v, potentialIntersection) && vectorContains(w, potentialIntersection)) {
    //     return potentialIntersection;
    // }

    console.log("CHECK");
    console.log(v);
    console.log(w);
    console.log(potentialIntersection);
    console.log(vectorContains(v, potentialIntersection), vectorContains(w, potentialIntersection));
    return undefined;
}

function getPathVectors(steps: Step[]) {
    const vectors: Vector[] = [];
    let currentPoint: Point = { x: 0, y: 0 };
    for (const step of steps) {
        const vector = getVector(currentPoint, step);
        vectors.push(vector);
        currentPoint = vector.end;
    }
    return vectors;
}

// function serializePoint({ x, y }: Point) {
//     return `${x},${y}`;
// }

// function parsePoint(str: string): Point {
//     const [xs, ys] = str.split(",");
//     return { x: parseInt(xs, 10), y: parseInt(ys, 10) };
// }

function parseStep(str: string): Step {
    return {
        direction: str[0] as Direction,
        distance: Number.parseInt(str.slice(1), 10),
    };
}

function parsePath(str: string) {
    return str.split(",").map(parseStep);
}

// function dist({ x, y }: Point): number {
//     return Math.abs(x) + Math.abs(y);
// }

const path1 = "R8,U5,L5,D3";
const path2 = "U7,R6,D4,L4";

// // const path1 = "R75,D30,R83,U83,L12,D49,R71,U7,L72";
// // const path2 = "U62,R66,U55,R34,D71,R55,D58,R83";

// // const path1 = "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51";
// // const path2 = "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7";

function solve(pathA: string, pathB: string) {
    const aSteps = parsePath(pathA);
    const bSteps = parsePath(pathB);
    const aVectors = getPathVectors(aSteps);
    const bVectors = getPathVectors(bSteps);
    const intersections: Point[] = [];

    const a = aVectors[aVectors.length - 1];
    // for (const a of aVectors.slice(aVectors.length - 1)) {
        console.log(bVectors.length);
    for (const b of bVectors) {
        const intersection = getIntersectionPoint(a, b);
        if (intersection !== undefined) {
            intersections.push(intersection);
        }
    }
    // }

    console.log(intersections);
}

console.log(solve(path1, path2));

