import { readFileSync } from "fs";

const values = readFileSync("src/2020/day1/input.txt", { encoding: "utf-8" })
    .split("\n")
    .map(line => parseInt(line, 10));

const pairwiseSums = new Map<number, [number, number]>();
for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
        const a = values[i];
        const b = values[j];
        pairwiseSums.set(a + b, [a, b]);
        if (a + b === 2020) {
            console.log(a * b);
        }
    }
}

for (const value of values) {
    const expectedSum = 2020 - value;
    if (pairwiseSums.has(expectedSum)) {
        const [a, b] = pairwiseSums.get(expectedSum)!;
        console.log(a * b * value);
        break;
    }
}
