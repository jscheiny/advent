import { readFileSync } from "fs";

enum Instruction {
    ACCUMULATE = "acc",
    JUMP = "jmp",
    NOOP = "nop",
}

interface ParsedInstruction {
    instruction: Instruction;
    argument: number;
}

function parseInstruction(line: string): ParsedInstruction {
    const [first, last] = line.split(" ");
    return {
        instruction: first as Instruction,
        argument: parseInt(last, 10),
    };
}
const instructions = readFileSync("src/2020/day8/input.txt", { encoding: "utf-8" })
    .split("\n")
    .map(parseInstruction);

function runInstructions(code: ParsedInstruction[]) {
    let accumulator = 0;
    let instructionPointer = 0;
    const visitedInstructions = new Set<number>();
    let terminated = false;

    while (!visitedInstructions.has(instructionPointer) || instructionPointer >= code.length) {
        visitedInstructions.add(instructionPointer);
        if (code[instructionPointer] === undefined) {
            terminated = true;
            break;
        }

        const { instruction, argument } = code[instructionPointer];

        switch (instruction) {
            case Instruction.ACCUMULATE:
                accumulator += argument;
                break;
            case Instruction.JUMP:
                instructionPointer += argument - 1;
                break;
            case Instruction.NOOP:
                break;
        }

        instructionPointer++;
    }

    return { terminated, accumulator };
}

runInstructions(instructions);

function fixProgram(code: ParsedInstruction[]) {
    for (let index = 0; index < code.length; index++) {
        const { instruction, argument } = code[index];
        if (instruction === Instruction.ACCUMULATE) {
            continue;
        }

        const newInstruction = instruction === Instruction.JUMP ? Instruction.NOOP : Instruction.JUMP;
        const newParsedInstruction: ParsedInstruction = { instruction: newInstruction, argument };
        const codeCopy = [...instructions];

        codeCopy[index] = newParsedInstruction;
        const { terminated, accumulator } = runInstructions(codeCopy);
        if (terminated) {
            console.log(accumulator);
            break;
        }
    }
}

fixProgram(instructions);
