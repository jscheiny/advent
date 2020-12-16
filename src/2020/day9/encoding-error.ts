import { readFileSync } from "fs";

const values = readFileSync("src/2020/day9/input.txt", { encoding: "utf-8" })
    .split("\n")
    .map(value => parseInt(value, 10));

function findFirstError(values: number[], preampleLength: number = 25) {
    for (let index = preampleLength; index < values.length; index++) {
        const pairwiseSums = getAllPairwiseSums(values, index - preampleLength, index);
        const value = values[index];
        if (!pairwiseSums.has(value)) {
            return value;
        }
    }

    return undefined;
}

function getAllPairwiseSums(values: number[], startIndex: number, endIndex: number) {
    const sums = new Set<number>();
    for (let i = startIndex; i < endIndex; i++) {
        for (let j = i + 1; j < endIndex; j++) {
            sums.add(values[i] + values[j]);
        }
    }
    return sums;
}

function findContiguousSum(values: number[], searchValue: number) {
    for (let i = 1; i < values.length; i++) {
        let sum = values[i];
        for (let j = i + 1; j < values.length; j++) {
            sum += values[j];
            if (sum === searchValue) {
                return { startIndex: i, endIndex: j };
            }
        }
    }

    return undefined;
}

const errorValue = findFirstError(values)!;
const { startIndex, endIndex } = findContiguousSum(values, errorValue)!;

console.log(errorValue);
const range: number[] = [];
for (let index = startIndex; index <= endIndex; index++) {
    range.push(values[index]);
}

const min = Math.min(...range);
const max = Math.max(...range);

console.log(min + max);
