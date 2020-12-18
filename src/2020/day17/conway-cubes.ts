import { readFileSync } from "fs";

interface Coordinate {
    x: number;
    y: number;
    z: number;
    w: number;
}

function flatten<T>(values: T[][]): T[] {
    return [].concat.apply([], values as any);
}

function getCoordinateFunction(fn: (a: number, b: number) => number) {
    return (left: Coordinate, right: Coordinate): Coordinate => {
        return {
            x: fn(left.x, right.x),
            y: fn(left.y, right.y),
            z: fn(left.z, right.z),
            w: fn(left.w, right.w),
        };
    };
}

const Coordinate = {
    min: getCoordinateFunction(Math.min),
    max: getCoordinateFunction(Math.max),
    add: getCoordinateFunction((a, b) => a + b),
    subtract: getCoordinateFunction((a, b) => a - b),
};

function getAdjacentCoordinates(coordinate: Coordinate): Coordinate[] {
    const deltas = [-1, 0, 1];
    const adjacentCoordinates: Coordinate[] = [];
    for (const x of deltas) {
        for (const y of deltas) {
            for (const z of deltas) {
                for (const w of deltas) {
                    if (x === 0 && y === 0 && z === 0 && w === 0) {
                        continue;
                    }
                    adjacentCoordinates.push(Coordinate.add(coordinate, { x, y, z, w }));
                }
            }
        }
    }
    return adjacentCoordinates;
}

class CubeSpace {
    public static fromInitialCubes(input: string): CubeSpace {
        const rows = input.split("\n");
        const space = new CubeSpace();
        for (let x = 0; x < rows.length; x++) {
            const row = rows[x];
            for (let y = 0; y < row.length; y++) {
                if (row[y] === "#") {
                    space.activate({ x, y, z: 0, w: 0 });
                }
            }
        }

        return space;
    }

    private static coordinateToString({ x, y, z, w }: Coordinate): string {
        return `${x},${y},${z},${w}`;
    }

    private static coordinateFromString(coordinate: string): Coordinate {
        const [x, y, z, w] = coordinate.split(",").map(part => parseInt(part, 10));
        return { x, y, z, w };
    }
    private constructor(private activeCubes: Set<string> = new Set()) {}

    public getNextCubeSpace(): CubeSpace {
        const next = this.clone();
        const rawCoordinates = flatten(
            next.getActiveCoordinates().map(coordinate => [coordinate, ...getAdjacentCoordinates(coordinate)]),
        ).map(CubeSpace.coordinateToString);
        const uniqueCoordinates = Array.from(new Set(rawCoordinates)).map(CubeSpace.coordinateFromString);
        for (const coordinate of uniqueCoordinates) {
            const isActive = this.isActive(coordinate);
            const numAdjacentActive = this.getActiveAdjacentCubes(coordinate).length;
            if (isActive && (numAdjacentActive !== 2 && numAdjacentActive !== 3)) {
                next.deactivate(coordinate);
            } else if (!isActive && numAdjacentActive === 3) {
                next.activate(coordinate);
            }
        }

        return next;
    }

    public getActiveCount(): number {
        return this.activeCubes.size;
    }

    private activate(coordinate: Coordinate) {
        this.activeCubes.add(CubeSpace.coordinateToString(coordinate));
    }

    private deactivate(coordinate: Coordinate) {
        this.activeCubes.delete(CubeSpace.coordinateToString(coordinate));
    }

    private isActive(coordinate: Coordinate) {
        return this.activeCubes.has(CubeSpace.coordinateToString(coordinate));
    }

    private getActiveCoordinates(): Coordinate[] {
        return Array.from(this.activeCubes.keys()).map(CubeSpace.coordinateFromString);
    }

    private getActiveAdjacentCubes(coordinate: Coordinate) {
        return getAdjacentCoordinates(coordinate).filter(coordinate => this.isActive(coordinate));
    }

    private clone() {
        return new CubeSpace(new Set(this.activeCubes));
    }
}

const input = readFileSync("src/2020/day17/input.txt", { encoding: "utf-8" });

function simulate(input: string, iterations = 6) {
    let space = CubeSpace.fromInitialCubes(input);
    for (let index = 0; index < iterations; index++) {
        space = space.getNextCubeSpace();
    }
    return space.getActiveCount();
}

console.log(simulate(input));
