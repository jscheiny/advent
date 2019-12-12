import { INSTRUCTIONS } from "./instructions";
import { Instruction, Parameter, ParameterMode, Result, State } from "./types";
import { accessMemory, sliceMemory } from "./utils";

export function getInitialProgramState(rawMemory: number[], rawInput: number[]): State {
    return {
        address: 0,
        memory: rawMemory.slice(),
        input: rawInput.slice(),
        output: [],
        halted: false,
        relativeBase: 0,
    };
}

export function execute(program: number[], input: number[] = []) {
    return executeProgram(getInitialProgramState(program, input));
}

export function executeProgram(state: State): State {
    if (state.halted) {
        return state;
    }

    while (true) {
        const opCode = accessMemory(state, state.address) % 100;
        if (!(opCode in INSTRUCTIONS)) {
            console.error("Unknown opcode received", opCode);
            state.halted = true;
            break;
        }

        const instruction = INSTRUCTIONS[opCode];
        const parameters = parseParameters(instruction, state);
        const result = instruction.execute(parameters, state);

        if (result === Result.NONE) {
            state.address += instruction.parameters + 1;
        } else if (result === Result.PAUSE) {
            break;
        } else if (result === Result.HALT) {
            state.halted = true;
            break;
        }
    }
    return state;
}

export function parseParameters(instruction: Instruction, state: State) {
    const opCode = accessMemory(state, state.address);
    const values = sliceMemory(state, state.address + 1, instruction.parameters);
    const parameters: Parameter[] = [];
    for (let index = 0; index < instruction.parameters; index++) {
        let digit = index + 2;
        const value = values[index];
        const mode = getDigit(opCode, digit) as ParameterMode;
        parameters.push({ value, mode });
    }
    return parameters;
}

function getDigit(value: number, digit: number) {
    const digits = String(value);
    const index = digits.length - digit - 1;
    if (index < 0) {
        return 0;
    } else {
        return parseInt(digits[index], 10);
    }
}
