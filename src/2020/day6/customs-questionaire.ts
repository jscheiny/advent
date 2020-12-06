import { readFileSync } from "fs";

function getGroupValue(group: string) {
    const [firstPerson, ...rest] = group.split("\n");
    let result = new Set(firstPerson);
    for (const response of rest) {
        const responseSet = new Set(response);
        result = new Set([...result].filter(value => responseSet.has(value)));
    }
    return result.size;
}

const total = readFileSync("src/2020/day6/input.txt", { encoding: "utf-8" })
    .split("\n\n")
    .map(getGroupValue)
    .reduce((a, b) => a + b, 0);
console.log(total);
