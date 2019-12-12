import { orbits } from "./input";

type ParentsMap = { [id: string]: string };
type MemoTable = { [nodeId: string]: number };

function parseOrbit(text: string) {
    const [base, satellite] = text.split(")");
    return { base, satellite };
}

function parseOrbits(text: string) {
    const parents: ParentsMap = {};
    const orbits = text.split("\n").map(parseOrbit);

    for (const { base, satellite } of orbits) {
        parents[satellite] = base;
    }

    return parents;
}

function computeNodeOrbits(parents: ParentsMap, nodeId: string, memo: MemoTable): number {
    if (nodeId in memo) {
        return memo[nodeId];
    }

    if (nodeId in parents) {
        const count = computeNodeOrbits(parents, parents[nodeId], memo) + 1;
        memo[nodeId] = count;
        return count;
    }

    return 0;
}

function computeAllCheckSums(parents: ParentsMap) {
    const memo: MemoTable = {};
    let sum = 0;
    for (const nodeId of Object.keys(parents)) {
        sum += computeNodeOrbits(parents, nodeId, memo);
    }
    return sum;
}

console.log(computeAllCheckSums(parseOrbits(orbits)));
