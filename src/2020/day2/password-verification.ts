import { readFileSync } from "fs";

interface ParsedPasswordCheck {
    min: number;
    max: number;
    character: string;
    password: string;
}

function parsePasswordCheck(line: string): ParsedPasswordCheck {
    const [beginning, middle, password] = line.split(" ");
    const [min, max] = beginning.split("-").map(x => parseInt(x, 10));
    const character = middle[0];
    return { min, max, character, password };
}

// function isPasswordValidOld({ min, max, character, password }: ParsedPasswordCheck) {
//     let count = 0;
//     for (let index = 0; index < password.length; index++) {
//         if (password[index] === character) {
//             count++;
//         }
//     }

//     return count >= min && count <= max;
// }

function isPasswordValidNew({ min, max, character, password }: ParsedPasswordCheck) {
    const firstMatch = password[min - 1] === character;
    const secondMatch = password[max - 1] === character;
    return firstMatch !== secondMatch;
}

const result = readFileSync("src/2020/day2/input.txt", { encoding: "utf-8" })
    .split("\n")
    .filter(line => line.length > 0)
    .map(parsePasswordCheck)
    .filter(isPasswordValidNew).length;
console.log(result);

