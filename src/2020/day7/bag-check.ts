import { readFileSync } from "fs";

const BAG_COUNT_REGEX = /(\d+) (\w+ \w+) bags?/;

interface BagCount {
    count: number;
    key: string;
}

const BagLookup: { [key: string]: BagCount[] | undefined } = {};
const InverseBagLookup: { [key: string]: BagCount[] | undefined } = {};

function parseNode(line: string) {
    const [before, after] = line.split(" contain ");
    const containingBag = before.substr(0, before.length - 5);
    const containedBags = after
        .split(",")
        .map(bag => BAG_COUNT_REGEX.exec(bag))
        .filter((x): x is RegExpExecArray => x !== null)
        .map(([, count, key]): BagCount => ({ count: parseInt(count, 10), key }));

    BagLookup[containingBag] = containedBags;

    for (const { key, count } of containedBags) {
        const bagCount: BagCount = { key: containingBag, count };
        if (key in InverseBagLookup) {
            InverseBagLookup[key]!.push(bagCount);
        } else {
            InverseBagLookup[key] = [bagCount];
        }
    }
}

readFileSync("src/2020/day7/input.txt", { encoding: "utf-8" })
    .split("\n")
    .forEach(parseNode);

function findContainingBags(bag: string) {
    const frontier = [bag];
    const visitedBags = new Set<string>();
    while (frontier.length !== 0) {
        const currBag = frontier.pop();
        if (currBag === undefined) {
            break;
        }

        if (visitedBags.has(currBag)) {
            continue;
        }

        visitedBags.add(currBag);
        const maybeNeighbors = InverseBagLookup[currBag];
        if (maybeNeighbors === undefined) {
            continue;
        }

        const neighbors = maybeNeighbors.map(b => b.key);
        for (const neighborBag of neighbors) {
            frontier.push(neighborBag);
        }
    }
    console.log(visitedBags.size - 1);
}

findContainingBags("shiny gold");
