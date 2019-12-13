import { execute } from "../intcode/execute";
import { arcadeCode } from "./arcadeCode";

arcadeCode[0] = 2;
const { output } = execute(arcadeCode);

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

interface TilePlacement {
    row: number;
    column: number;
    tile: Tile;
}

const tiles: TilePlacement[] = [];
for (let index = 0; index < output.length; index += 3) {
    const [column, row, tile] = output.slice(index, index + 3);
    tiles.push({ row, column, tile: tile as Tile });
}

const rowValues = tiles.map(tile => tile.row);
const colValues = tiles.map(tile => tile.column);

const rows = Math.max(...rowValues) + 1;
const columns = Math.max(...colValues) + 1;
const grid: Tile[][] = [];

for (let r = 0; r < rows; r++) {
    const row: Tile[] = [];
    for (let c = 0; c < columns; c++) {
        row.push(Tile.EMPTY);
    }
    grid.push(row);
}

for (const { row, column, tile } of tiles) {
    grid[row][column] = tile;
}

for (const r of grid) {
    let row = "";
    for (const c of r) {
        row += TILE_CHARS[c];
    }
    console.log(row);
}
