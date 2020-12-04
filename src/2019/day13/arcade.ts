import { executeProgram, getInitialProgramState } from "../intcode/execute";
import { arcadeCode } from "./arcadeCode";

enum Tile {
    EMPTY = 0,
    WALL = 1,
    BLOCK = 2,
    PADDLE = 3,
    BALL = 4,
}

const TILE_CHARS: Record<Tile, string> = {
    [Tile.EMPTY]: " ",
    [Tile.WALL]: "#",
    [Tile.BLOCK]: "+",
    [Tile.PADDLE]: "_",
    [Tile.BALL]: "o",
};

function createGrid(rows: number, columns: number) {
    const grid: Tile[][] = [];

    for (let r = 0; r < rows; r++) {
        const row: Tile[] = [];
        for (let c = 0; c < columns; c++) {
            row.push(Tile.EMPTY);
        }
        grid.push(row);
    }

    return grid;
}

function printGrid(grid: Tile[][]) {
    for (const r of grid) {
        let row = "";
        for (const c of r) {
            row += TILE_CHARS[c];
        }
        console.log(row);
    }
}

interface GameState {
    score: number;
    grid: Tile[][];
}

function handleOutput(state: GameState, output: number[]) {
    for (let index = 0; index < output.length; index += 3) {
        const [x, y, arg] = output.slice(index, index + 3);
        if (x === -1) {
            state.score = arg;
        } else {
            state.grid[y][x] = arg as Tile;
        }
    }
}

function findX(grid: Tile[][], tile: Tile) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === tile) {
                return x;
            }
        }
    }
    return -1;
}

function runGame(code: number[]) {
    code[0] = 2;
    let computerState = getInitialProgramState(code, []);
    const gameState: GameState = {
        score: 0,
        grid: createGrid(23, 44),
    };

    while (!computerState.halted) {
        computerState = executeProgram(computerState);
        handleOutput(gameState, computerState.output);
        computerState.output = [];

        printGrid(gameState.grid);

        const paddleX = findX(gameState.grid, Tile.PADDLE);
        const ballX = findX(gameState.grid, Tile.BALL);
        computerState.input = [Math.sign(ballX - paddleX)];
    }

    console.log(gameState.score)
}

runGame(arcadeCode);
