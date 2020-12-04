import { readFileSync } from "fs";

const lines = readFileSync("src/2020/day3/input.txt", { encoding: "utf-8" }).split("\n");

function countTrees(xSlope: number, ySlope: number) {
    let column = 0;
    let treeCount = 0;
    for (let row = 0; row < lines.length; row += ySlope) {
        const line = lines[row];
        if (line[column] === "#") {
            treeCount++;
        }

        column += xSlope;
        column %= line.length;
    }
    return treeCount;
}

console.log(countTrees(1, 1) * countTrees(3, 1) * countTrees(5, 1) * countTrees(7, 1) * countTrees(1, 2));
