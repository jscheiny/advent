import { readFileSync } from "fs";

const result = readFileSync("src/2020/day1/input.txt", { encoding: "utf-8" })
    .split("\n")
    .map(line => parseInt(line, 10));

for (let i = 0; i < result.length; i++) {
    for (let j = i + 1; j < result.length; j++) {
        const a = result[i];
        const b = result[j];
        if (a + b === 2020) {
            console.log(a * b);
        }
    }
}
