import { readFileSync } from "fs";
import { argMax } from "../../utils";

interface ParsedInput {
    earliestDepartureTime: number;
    busIds: number[];
}

function parseInput(content: string): ParsedInput {
    const [line1, line2] = content.split("\n");
    const earliestDepartureTime = parseInt(line1, 10);
    const busIds = line2
        .split(",")
        .filter(value => value !== "x")
        .map(value => parseInt(value, 10));
    return { earliestDepartureTime, busIds };
}

function findNextDepartureTime({ earliestDepartureTime, busIds }: ParsedInput) {
    const { busId, nextDepartureTime } = argMax(
        busIds.map(busId => ({ busId, nextDepartureTime: getNextDepartureTime(earliestDepartureTime, busId) })),
        x => -x.nextDepartureTime,
    );

    const timeUntilDeparture = nextDepartureTime - earliestDepartureTime;
    return timeUntilDeparture * busId;
}

function getNextDepartureTime(earliestDepartureTime: number, busId: number) {
    return Math.ceil(earliestDepartureTime / busId) * busId;
}

const input = parseInput(readFileSync("src/2020/day13/input.txt", { encoding: "utf-8" }));
console.log(findNextDepartureTime(input));
