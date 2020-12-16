import { readFileSync } from "fs";

class Vector {
    constructor(public readonly x: number, public readonly y: number) {}

    public add(other: Vector) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    public scale(value: number) {
        return new Vector(this.x * value, this.y * value);
    }

    public get distance() {
        return Math.abs(this.x) + Math.abs(this.y);
    }

    public toString() {
        return `(${this.x}, ${this.y})`;
    }
}

enum Direction {
    NORTH = "NORTH",
    SOUTH = "SOUTH",
    EAST = "EAST",
    WEST = "WEST",
}

function getDirectionVector(direction: Direction): Vector {
    switch (direction) {
        case Direction.NORTH:
            return new Vector(0, 1);
        case Direction.SOUTH:
            return new Vector(0, -1);
        case Direction.EAST:
            return new Vector(1, 0);
        case Direction.WEST:
            return new Vector(-1, 0);
    }
}

interface FerryState {
    position: Vector;
    waypoint: Vector;
}

enum StepType {
    NORTH = "N",
    SOUTH = "S",
    EAST = "E",
    WEST = "W",
    LEFT = "L",
    RIGHT = "R",
    FORWARD = "F",
}

interface Step {
    stepType: StepType;
    stepValue: number;
}

function parseStep(line: string): Step {
    const stepType = line[0] as StepType;
    const stepValue = parseInt(line.substr(1), 10);
    return { stepType, stepValue };
}

function getNextState(state: FerryState, step: Step): FerryState {
    const { position, waypoint } = state;
    const { stepType, stepValue } = step;
    switch (stepType) {
        case StepType.NORTH:
            return { position, waypoint: waypoint.add(getDirectionVector(Direction.NORTH).scale(stepValue)) };
        case StepType.SOUTH:
            return { position, waypoint: waypoint.add(getDirectionVector(Direction.SOUTH).scale(stepValue)) };
        case StepType.EAST:
            return { position, waypoint: waypoint.add(getDirectionVector(Direction.EAST).scale(stepValue)) };
        case StepType.WEST:
            return { position, waypoint: waypoint.add(getDirectionVector(Direction.WEST).scale(stepValue)) };
        case StepType.FORWARD:
            return { position: position.add(waypoint.scale(stepValue)), waypoint };
        case StepType.LEFT:
            return { position, waypoint: rotate(waypoint, true, stepValue) };
        case StepType.RIGHT:
            return { position, waypoint: rotate(waypoint, false, stepValue) };
    }
}

function rotateRight(waypoint: Vector) {
    const { x, y } = waypoint;
    return new Vector(y, -x);
}

function rotateLeft(waypoint: Vector) {
    const { x, y } = waypoint;
    return new Vector(-y, x);
}

function rotate(waypoint: Vector, isLeft: boolean, angle: number): Vector {
    const rotations = angle / 90;
    const rotate = isLeft ? rotateLeft : rotateRight;
    let result = waypoint;
    for (let index = 0; index < rotations; index++) {
        result = rotate(result);
    }
    return result;
}

function followSteps(steps: Step[]) {
    let state: FerryState = {
        position: new Vector(0, 0),
        waypoint: new Vector(10, 1),
    };

    for (const step of steps) {
        state = getNextState(state, step);
    }

    console.log(state.position.distance);
}
const steps = readFileSync("src/2020/day12/input.txt", { encoding: "utf-8" })
    .split("\n")
    .map(parseStep);
followSteps(steps);
