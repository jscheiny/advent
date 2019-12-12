import { orbits } from "./input";
type ParentMap = { [id: string]: string };
type ChildMap = { [id: string]: string[] };
interface Graph {
    parents: ParentMap;
    children: ChildMap;
}

function parseOrbit(text: string) {
    const [base, satellite] = text.split(")");
    return { base, satellite };
}

function parseOrbits(text: string): Graph {
    const parents: ParentMap = {};
    const children: ChildMap = {};
    const orbits = text.split("\n").map(parseOrbit);

    for (const { base, satellite } of orbits) {
        parents[satellite] = base;
        if (base in children) {
            children[base].push(satellite);
        } else {
            children[base] = [satellite];
        }
    }

    return { parents, children };
}

function computeTransfers(graph: Graph) {
    const sourceId = "YOU";
    const destId = "SAN";

    const sourceParentId = graph.parents[sourceId];
    const destParentId = graph.parents[destId];

    return shortestPath(graph, sourceParentId, destParentId);
}

function shortestPath(graph: Graph, source: string, dest: string) {
    const visited: Set<string> = new Set([source]);
    const frontier: string[] = neighbors(source, graph);
    const dist: { [id: string]: number } = { [source]: 0 };
    for (const neighbor of frontier) {
        dist[neighbor] = 1;
    }

    while (frontier.length !== 0) {
        const current = frontier.shift();
        if (current === undefined) {
            break;
        }

        if (current === dest) {
            break;
        }

        if (visited.has(current)) {
            continue;
        }

        const currentDist = dist[current];
        visited.add(current);
        for (const neighbor of neighbors(current, graph)) {
            if (!visited.has(neighbor)) {
                dist[neighbor] = currentDist + 1;
                frontier.push(neighbor);
            }
        }
    }

    return dist[dest];
}

function neighbors(node: string, graph: Graph) {
    return [graph.parents[node], ...graph.children[node]].filter(Boolean);
}

const graph = parseOrbits(orbits);
const transfers = computeTransfers(graph);
console.log(transfers);
