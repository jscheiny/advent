interface Moon {
    position: Coordinate;
    velocity: Coordinate;
}

type Coordinate = [number, number, number];

// function sum(values: number[]) {
//     return values.reduce((l, r) => l + r, 0);
// }

// function getCoordinateEnergy(coordinate: Coordinate) {
//     return sum(coordinate.map(Math.abs));
// }

// function getMoonEnergy(moon: Moon) {
//     return getCoordinateEnergy(moon.position) * getCoordinateEnergy(moon.velocity);
// }

function zip(left: Coordinate, right: Coordinate, zipper: (left: number, right: number) => number) {
    return left.map((l, i) => zipper(l, right[i])) as Coordinate;
}

function getUpdatedVelocity(moon: Moon, other: Moon) {
    const positionDiff = zip(moon.position, other.position, (l, r) => Math.sign(r - l));
    const velocity = zip(moon.velocity, positionDiff, (v, delta) => v + delta);
    return velocity;
}

function getUpdatedPosition(moon: Moon) {
    return zip(moon.position, moon.velocity, (p, v) => p + v);
}

function stepVelocities(moons: Moon[]) {
    for (let i = 0; i < moons.length; i++) {
        const moon = moons[i];
        for (let j = 0; j < moons.length; j++) {
            if (i === j) {
                continue;
            }
            const other = moons[j];
            moon.velocity = getUpdatedVelocity(moon, other);
        }
    }
}

function stepPositions(moons: Moon[]) {
    for (const moon of moons) {
        moon.position = getUpdatedPosition(moon);
    }
}

function step(moons: Moon[]) {
    stepVelocities(moons);
    stepPositions(moons);
}

export function simulate(positions: Coordinate[], steps: number) {
    // const initialMoons = positions
    //     .map((position): Moon => ({ position, velocity: [0, 0, 0] }))
    //     .map(moon => JSON.stringify(moon));
    const moons = positions.map((position): Moon => ({ position, velocity: [0, 0, 0] }));

    const visitedStates = positions.map(() => new Map<string, number>());
    const cycleLengths = moons.map(() => new Map<number, number>());
    for (let s = 0; s < steps; s++) {
        for (let i = 0; i < moons.length; i++) {
            const moon = moons[i];
            const serializedMoon = JSON.stringify(moon);
            const previousIndex = visitedStates[i].get(serializedMoon);
            if (previousIndex !== undefined) {
                const length = s - previousIndex;
                const count = cycleLengths[i].get(length) || 0;
                cycleLengths[i].set(length, count + 1);
            }

            visitedStates[i].set(serializedMoon, s);
        }

        step(moons);
    }
    console.log(cycleLengths);
}

// const initialPositions: Coordinate[] = [
//     [-1, 0, 2], //
//     [2, -10, -7], //
//     [4, -8, 8], //
//     [3, 5, -1], //
// ];

const initialPositions: Coordinate[] = [
    [-8, -10, 0], //
    [5, 5, 10], //
    [2, -7, 3], //
    [9, -8, -3], //
];

// const initialPositions: Coordinate[] = [
//     [3, 2, -6], //
//     [-13, 18, 10], //
//     [-8, -1, 13], //
//     [5, 10, 4], //
// ];

simulate(initialPositions, 1000000);
