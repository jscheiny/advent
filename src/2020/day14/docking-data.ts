import { readFileSync } from "fs";

function applyMaskV1(value: number, mask: string) {
    let result: string = "";
    const binString = intToBinString(value);
    for (let index = 0; index < mask.length; index++) {
        const valueChar = binString[index];
        const maskChar = mask[index];
        if (maskChar === "X") {
            result += valueChar;
        } else {
            result += maskChar;
        }
    }
    return parseInt(result, 2);
}

function applyMaskV2(value: number, mask: string) {
    const valueString = intToBinString(value);
    const floatingPlaces = countX(mask);
    const floatingMasks = getAllBinaryStrings(floatingPlaces);
    const results: number[] = [];
    for (const floatingMask of floatingMasks) {
        let result: string = "";
        let floatingIndex = 0;
        for (let index = 0; index < mask.length; index++) {
            const maskChar = mask[index];
            const valueChar = valueString[index];
            if (maskChar === "X") {
                result += floatingMask[floatingIndex];
                floatingIndex++;
            } else if (maskChar === "0") {
                result += valueChar;
            } else {
                result += "1";
            }
        }
        results.push(parseInt(result, 2));
    }
    return results;
}

function getAllBinaryStrings(length: number) {
    const max = 1 << length;
    const strings: string[] = [];
    for (let index = 0; index < max; index++) {
        strings.push(pad(index.toString(2), length));
    }
    return strings;
}

function intToBinString(int: number) {
    return pad(int.toString(2), 36);
}

interface SetMaskCommand {
    type: "mask";
    mask: string;
}

interface SetMemoryCommand {
    type: "mem";
    address: number;
    value: number;
}

type Command = SetMaskCommand | SetMemoryCommand;

function parseCommand(text: string): Command {
    if (text.startsWith("mask =")) {
        const mask = text.substr(7);
        return { type: "mask", mask };
    }

    const [before, after] = text.split("] = ");
    const address = parseInt(before.substr(4), 10);
    const value = parseInt(after, 10);
    return { type: "mem", address, value };
}

function simulateV1(commands: Command[]) {
    let mask = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
    const memory = new Map<number, number>();

    for (const command of commands) {
        if (command.type === "mask") {
            mask = command.mask;
        } else {
            memory.set(command.address, applyMaskV1(command.value, mask));
        }
    }
    return Array.from(memory.values()).reduce((a, b) => a + b, 0);
}

function pad(value: string, digits: number) {
    let result = value;
    while (result.length < digits) {
        result = "0" + result;
    }
    return result;
}

function countX(mask: string) {
    return Array.from(mask).filter(value => value === "X").length;
}

function simulateV2(commands: Command[]) {
    let mask = "000000000000000000000000000000000000";
    const memory = new Map<number, number>();

    for (const command of commands) {
        if (command.type === "mask") {
            mask = command.mask;
        } else {
            const addresses = applyMaskV2(command.address, mask);
            for (const address of addresses) {
                memory.set(address, command.value);
            }
        }
    }

    return Array.from(memory.values()).reduce((a, b) => a + b, 0);
}

const commands = readFileSync("src/2020/day14/input.txt", { encoding: "utf-8" })
    .split("\n")
    .map(parseCommand);

console.log(simulateV1(commands));
console.log(simulateV2(commands));
