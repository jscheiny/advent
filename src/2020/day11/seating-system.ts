import { readFileSync } from "fs";

const NO_SEAT = ".";
const EMPTY = "L";
const OCCUPIED = "#";

const directions: [number, number][] = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

const originalSeatGrid = readFileSync("src/2020/day11/input.txt", { encoding: "utf-8" })
    .split("\n")
    .map(line => line.split(""));

function getNextState(seatGrid: string[][]) {
    const seatGridCopy = seatGrid.map(row => [...row]);
    for (let i = 0; i < seatGrid.length; i++) {
        for (let j = 0; j < seatGrid[i].length; j++) {
            const seat = seatGrid[i][j];
            if (seat === NO_SEAT) {
                continue;
            }

            const adjacentOccupiedSeats = getVisibleOccupiedSeats(seatGrid, i, j);
            if (seat === OCCUPIED && adjacentOccupiedSeats >= 5) {
                seatGridCopy[i][j] = EMPTY;
            } else if (seat === EMPTY && adjacentOccupiedSeats === 0) {
                seatGridCopy[i][j] = OCCUPIED;
            }
        }
    }

    return seatGridCopy;
}

function areGridsEqual(a: string[][], b: string[][]) {
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a[i].length; j++) {
            if (a[i][j] !== b[i][j]) {
                return false;
            }
        }
    }

    return true;
}

function getVisibleOccupiedSeats(seatGrid: string[][], row: number, col: number): number {
    let count = 0;
    for (const [rowDelta, colDelta] of directions) {
        if (isVisibleOccupiedSeatInDirection(seatGrid, row, col, rowDelta, colDelta)) {
            count++;
        }
    }
    return count;
}

function isVisibleOccupiedSeatInDirection(
    seatGrid: string[][],
    startRow: number,
    startCol: number,
    rowDelta: number,
    colDelta: number,
) {
    let row = startRow + rowDelta;
    let col = startCol + colDelta;
    while (row >= 0 && col >= 0 && row < seatGrid.length && col < seatGrid[0].length) {
        if (seatGrid[row][col] === OCCUPIED) {
            return true;
        }

        if (seatGrid[row][col] === EMPTY) {
            return false;
        }

        row += rowDelta;
        col += colDelta;
    }

    return false;
}

function countOccupiedSeats(seatGrid: string[][]) {
    let count = 0;
    for (let i = 0; i < seatGrid.length; i++) {
        for (let j = 0; j < seatGrid[i].length; j++) {
            if (seatGrid[i][j] === OCCUPIED) {
                count++;
            }
        }
    }

    return count;
}

function simulate(seatGrid: string[][]) {
    let nextGrid = getNextState(seatGrid);
    while (!areGridsEqual(seatGrid, nextGrid)) {
        seatGrid = nextGrid;
        nextGrid = getNextState(seatGrid);
    }
    console.log(countOccupiedSeats(nextGrid));
}
simulate(originalSeatGrid);
