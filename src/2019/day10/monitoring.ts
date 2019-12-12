import { argMax } from "../../utils";
import { asteroidMap } from "./input";

const ASTEROID = "#";

interface Coordinate {
    x: number;
    y: number;
}

function gcd(x: number, y: number): number {
    while (y) {
        let t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function getVector(start: Coordinate, end: Coordinate): Coordinate {
    const xDelta = end.x - start.x;
    const yDelta = end.y - start.y;
    if (xDelta === 0) {
        return { x: 0, y: Math.sign(yDelta) };
    }
    if (yDelta === 0) {
        return { x: Math.sign(xDelta), y: 0 };
    }

    const common = gcd(Math.abs(xDelta), Math.abs(yDelta));
    const x = xDelta / common;
    const y = yDelta / common;
    return { x, y };
}

function getAngle(start: Coordinate, end: Coordinate) {
    const { x, y } = getVector(start, end);
    const angle = Math.atan2(y, x) + Math.PI / 2;
    if (angle < 0) {
        return 2 * Math.PI + angle;
    }
    return angle;
}

function addCoordinates(start: Coordinate, delta: Coordinate): Coordinate {
    return {
        x: start.x + delta.x,
        y: start.y + delta.y,
    };
}

function equalCoordinates(left: Coordinate, right: Coordinate) {
    return left.x === right.x && left.y === right.y;
}

function atCoordinate(map: string[], coord: Coordinate) {
    return map[coord.y][coord.x];
}

function isOutOfBounds({ x, y }: Coordinate, map: string[]) {
    const maxX = map[0].length;
    const maxY = map.length;
    return x < 0 || y < 0 || x >= maxX || y >= maxY;
}

function getAsteroidCoordinates(map: string[]) {
    const coords: Coordinate[] = [];
    for (let y = 0; y < map.length; y++) {
        const row = map[y];
        for (let x = 0; x < row.length; x++) {
            const value = row[x];
            if (value === ASTEROID) {
                coords.push({ x, y });
            }
        }
    }
    return coords;
}

function isPathClear(map: string[], start: Coordinate, end: Coordinate): boolean {
    const vector = getVector(start, end);
    let current = start;
    while (true) {
        current = addCoordinates(current, vector);
        if (equalCoordinates(current, end) || isOutOfBounds(current, map)) {
            return true;
        }
        if (atCoordinate(map, current) === ASTEROID) {
            return false;
        }
    }
}

function getVisibleAsteroids(map: string[], start: Coordinate, asteroids: Coordinate[]) {
    const visible: Coordinate[] = [];
    for (const end of asteroids) {
        if (equalCoordinates(start, end)) {
            continue;
        }
        if (isPathClear(map, start, end)) {
            visible.push(end);
        }
    }
    return visible;
}

function solve(rawMap: string[]) {
    const map = rawMap.map(row => row.slice());
    const asteroids = getAsteroidCoordinates(map);
    const station = argMax(asteroids, start => getVisibleAsteroids(map, start, asteroids).length);
    const visible = getVisibleAsteroids(map, station, asteroids);
    visible.sort((a, b) => getAngle(station, a) - getAngle(station, b));
    const { x, y } = visible[199];
    console.log(100 * x + y);
}

solve(asteroidMap);
