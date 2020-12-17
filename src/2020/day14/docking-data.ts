import { readFileSync } from "fs";

function applyMask(value: number, mask: string) {
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

function intToBinString(int: number) {
    let result: string = int.toString(2);
    while (result.length < 36) {
        result = "0" + result;
    }
    return result;
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
            memory.set(command.address, applyMask(command.value, mask));
        }
    }
    return Array.from(memory.values()).reduce((a, b) => a + b, 0);
}

const commands = readFileSync("src/2020/day14/input.txt", { encoding: "utf-8" })
    .split("\n")
    .map(parseCommand);

console.log(simulateV1(commands));
