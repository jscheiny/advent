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

function rotateLeft(direction: Direction): Direction {
    switch (direction) {
        case Direction.NORTH:
            return Direction.WEST;
        case Direction.SOUTH:
            return Direction.EAST;
        case Direction.EAST:
            return Direction.NORTH;
        case Direction.WEST:
            return Direction.SOUTH;
    }
}

function flip(direction: Direction): Direction {
    switch (direction) {
        case Direction.NORTH:
            return Direction.SOUTH;
        case Direction.SOUTH:
            return Direction.NORTH;
        case Direction.EAST:
            return Direction.WEST;
        case Direction.WEST:
            return Direction.EAST;
    }
}

function rotateRight(direction: Direction) {
    return flip(rotateLeft(direction));
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
    direction: Direction;
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
    const { position, direction } = state;
    const { stepType, stepValue } = step;
    switch (stepType) {
        case StepType.NORTH:
            return { position: position.add(getDirectionVector(Direction.NORTH).scale(stepValue)), direction };
        case StepType.SOUTH:
            return { position: position.add(getDirectionVector(Direction.SOUTH).scale(stepValue)), direction };
        case StepType.EAST:
            return { position: position.add(getDirectionVector(Direction.EAST).scale(stepValue)), direction };
        case StepType.WEST:
            return { position: position.add(getDirectionVector(Direction.WEST).scale(stepValue)), direction };
        case StepType.FORWARD:
            return { position: position.add(getDirectionVector(direction).scale(stepValue)), direction };
        case StepType.LEFT:
            return { position, direction: rotate(direction, true, stepValue) };
        case StepType.RIGHT:
            return { position, direction: rotate(direction, false, stepValue) };
    }
}

function rotate(direction: Direction, isLeft: boolean, rawAngle: number): Direction {
    if (rawAngle === 180) {
        return flip(direction);
    }

    const angle = isLeft ? 360 - rawAngle : rawAngle;
    switch (angle) {
        case 90:
            return rotateRight(direction);
        case 270:
            return rotateLeft(direction);
    }

    return direction;
}

function followSteps(steps: Step[]) {
    let state: FerryState = {
        position: new Vector(0, 0),
        direction: Direction.EAST,
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
