import { readFileSync } from "fs";

interface Tile {
    id: number;
    sides: string[];
}

function parseTile(input: string): Tile {
    const [head, ...tile] = input.split("\n");
    const id = parseInt(head.substring(5, head.length - 1), 10);
    const top = tile[0];
    const bottom = reverse(tile[tile.length - 1]);

    let left = "";
    let right = "";
    for (let index = 0; index < tile.length; index++) {
        const line = tile[index];
        left = line[0] + left;
        right += line[line.length - 1];
    }

    const sides = [top, right, bottom, left];
    return { id, sides };
}

function reverse(a: string) {
    return Array.from(a)
        .reverse()
        .join("");
}

function countMatches(tile: Tile, otherTiles: Tile[]): number {
    const result = new Map<number, number>();
    let totalMatches = 0;
    for (const otherTile of otherTiles) {
        if (otherTile.id === tile.id) {
            continue;
        }

        const otherSides = otherTile.sides;

        const matches = tile.sides.filter(side => otherSides.includes(side) || otherSides.includes(reverse(side)))
            .length;
        result.set(otherTile.id, matches);
        if (matches > 0) {
            totalMatches++;
        }
    }
    return totalMatches;
}

const tiles = readFileSync("src/2020/day20/input.txt", { encoding: "utf-8" })
    .split("\n\n")
    .map(parseTile);

const corners: number[] = [];
for (const tile of tiles) {
    const degree = countMatches(tile, tiles);
    if (degree === 2) {
        corners.push(tile.id);
    }
}

console.log(corners.reduce((a, b) => a * b, 1));
