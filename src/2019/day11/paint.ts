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

interface Bounds {
    min: Coordinate;
    max: Coordinate;
}

function serializeCoordinate({ x, y }: Coordinate): string {
    return `${x},${y}`;
}

function deserializeCoordinate(str: string): Coordinate {
    const [x, y] = str.split(",").map(v => parseInt(v, 10));
    return { x, y };
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
    paintSquare(paint, position, Color.WHITE);

    while (!computer.halted) {
        computer.input = [getPaintColor(paint, position)];

        computer = executeProgram(computer);
        const [color, turnSignal] = computer.output as [Color, number];
        computer.output = [];
        paintSquare(paint, position, color);

        orientation = turn(orientation, turnSignal);
        position = move(position, orientation);
    }

    printPaint(paint);
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

function getBounds(paint: Map<string, Color>): Bounds {
    const keys = Array.from(paint.keys()).map(deserializeCoordinate);
    const xValues = keys.map(key => key.x);
    const yValues = keys.map(key => key.y);
    return {
        min: { x: Math.min(...xValues), y: Math.min(...yValues) },
        max: { x: Math.max(...xValues), y: Math.max(...yValues) },
    };
}

function printPaint(paint: Map<string, Color>) {
    const { min, max } = getBounds(paint);
    for (let y = min.y; y <= max.y; y++) {
        let row = "";
        for (let x = min.x; x <= max.x; x++) {
            const color = getPaintColor(paint, { x, y });
            row += color === Color.BLACK ? "#" : " ";
        }
        console.log(row);
    }
}

runRobot(robotCode);
