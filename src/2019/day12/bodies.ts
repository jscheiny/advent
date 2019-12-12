interface Moon {
    position: Coordinate;
    velocity: Coordinate;
}

type Coordinate = [number, number, number];

function sum(values: number[]) {
    return values.reduce((l, r) => l + r, 0);
}

function getCoordinateEnergy(coordinate: Coordinate) {
    return sum(coordinate.map(Math.abs));
}

function getMoonEnergy(moon: Moon) {
    return getCoordinateEnergy(moon.position) * getCoordinateEnergy(moon.velocity);
}

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
    const moons = positions.map((position): Moon => ({ position, velocity: [0, 0, 0] }));
    for (let s = 0; s < steps; s++) {
        step(moons);
    }
    console.log(sum(moons.map(getMoonEnergy)));
}

const initialPositions: Coordinate[] = [
    [3, 2, -6], //
    [-13, 18, 10], //
    [-8, -1, 13], //
    [5, 10, 4], //
];

simulate(initialPositions, 1000);
