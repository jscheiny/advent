import { executeProgram, getInitialProgramState } from "../intcode/execute";
import { robotCode } from "./robotCode";

enum Direction {
    UP,
    RIGHT,
    DOWN,
    LEFT,
}

enum Color {
    BLACK = 0,
    WHITE = 1,
}

interface Coordinate {
    x: number;
    y: number;
}

function serializeCoordinate({ x, y }: Coordinate): string {
    return `${x},${y}`;
}

function turnRight(direction: Direction) {
    switch (direction) {
        case Direction.UP:
            return Direction.RIGHT;
        case Direction.RIGHT:
            return Direction.DOWN;
        case Direction.DOWN:
            return Direction.LEFT;
        case Direction.LEFT:
            return Direction.UP;
    }
}

function turnLeft(direction: Direction) {
    switch (direction) {
        case Direction.UP:
            return Direction.LEFT;
        case Direction.RIGHT:
            return Direction.UP;
        case Direction.DOWN:
            return Direction.RIGHT;
        case Direction.LEFT:
            return Direction.DOWN;
    }
}

function turn(direction: Direction, signal: number) {
    return signal === 0 ? turnLeft(direction) : turnRight(direction);
}

function move({ x, y }: Coordinate, direction: Direction) {
    switch (direction) {
        case Direction.UP:
            return { x: x, y: y - 1 };
        case Direction.RIGHT:
            return { x: x + 1, y: y };
        case Direction.DOWN:
            return { x: x, y: y + 1 };
        case Direction.LEFT:
            return { x: x - 1, y: y };
    }
}

function runRobot(code: number[]) {
    const paint = new Map<string, Color>();
    let computer = getInitialProgramState(code, []);
    let position: Coordinate = { x: 0, y: 0 };
    let orientation = Direction.UP;

    while (!computer.halted) {
        computer.input = [getPaintColor(paint, position)];

        computer = executeProgram(computer);
        const [color, turnSignal] = computer.output as [Color, number];
        computer.output = [];
        paintSquare(paint, position, color);

        orientation = turn(orientation, turnSignal);
        position = move(position, orientation);
    }

    console.log(paint.size);
}

function getPaintColor(paint: Map<string, Color>, coordinate: Coordinate) {
    const key = serializeCoordinate(coordinate);
    const color = paint.get(key);
    if (color !== undefined) {
        return color;
    }
    return Color.BLACK;
}

function paintSquare(paint: Map<string, Color>, coordinate: Coordinate, color: Color) {
    const key = serializeCoordinate(coordinate);
    paint.set(key, color);
}

runRobot(robotCode);
