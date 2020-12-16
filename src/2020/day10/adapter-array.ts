import { readFileSync } from "fs";

const adapters = readFileSync("src/2020/day10/input.txt", { encoding: "utf-8" })
    .split("\n")
    .map(value => parseInt(value, 10));
adapters.unshift(0);
const globalMaxJoltage = Math.max(...adapters) + 3;
adapters.push(globalMaxJoltage);

adapters.sort((a, b) => a - b);

function getPartialDifferenceCounts(values: number[]) {
    const counts: number[] = [0, 0, 0, 0];
    const diffs: number[] = [];
    for (let index = 1; index < values.length; index++) {
        const diff = values[index] - values[index - 1];
        diffs.push(diff);
        counts[diff]++;
    }
    return counts;
}

const partialDiffCounts = getPartialDifferenceCounts(adapters);

console.log(partialDiffCounts[1] * partialDiffCounts[3]);

function countValidArrangements(maxJoltage: number, memoTable: Map<number, number>): number {
    if (memoTable.has(maxJoltage)) {
        return memoTable.get(maxJoltage)!;
    }

    if (maxJoltage === 0) {
        return 1;
    }

    let count = 0;
    for (let index = 0; index < adapters.length; index++) {
        const adapterJoltage = adapters[index];
        if (adapterJoltage >= maxJoltage) {
            break;
        }
        if (maxJoltage - adapterJoltage > 3) {
            continue;
        }

        count += countValidArrangements(adapterJoltage, memoTable);
    }
    memoTable.set(maxJoltage, count);
    return count;
}

console.log(countValidArrangements(globalMaxJoltage, new Map()));
