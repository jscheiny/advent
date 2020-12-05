import { readFileSync } from "fs";

function getSeatId(encoding: string) {
    const rowEncoding = encoding.substr(0, 7);
    const columnEncoding = encoding.substr(7);
    const row = getCoordinate(rowEncoding, "F");
    const column = getCoordinate(columnEncoding, "L");
    return row * 8 + column;
}

function getCoordinate(encoding: string, zeroCharacter: string) {
    const characters = encoding.split("");
    return characters
        .map(character => (character === zeroCharacter ? 0 : 1))
        .map((value, index) => value * Math.pow(2, characters.length - index - 1))
        .reduce((a, b) => a + b, 0);
}

const seatIds = readFileSync("src/2020/day5/input.txt", { encoding: "utf-8" })
    .split("\n")
    .map(getSeatId);

console.log(Math.max(...seatIds));
seatIds.sort((a, b) => a - b);

for (let index = 1; index < seatIds.length; index++) {
    const prevSeatId = seatIds[index - 1];
    const currentSeatId = seatIds[index];
    if (prevSeatId !== currentSeatId - 1) {
        console.log(prevSeatId + 1);
        break;
    }
}
