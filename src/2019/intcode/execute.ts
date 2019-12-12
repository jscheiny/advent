import { INSTRUCTIONS } from "./instructions";
import { Instruction, Parameter, ParameterMode, Result, State } from "./types";
import { accessMemory, getParameterValue, sliceMemory } from "./utils";

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
        if (opCode === 99) {
            state.halted = true;
            break;
        } else if (opCode in INSTRUCTIONS) {
            const instruction = INSTRUCTIONS[opCode];
            const parameters = parseParameters(instruction, state);
            console.log([
                accessMemory(state, state.address),
                ...sliceMemory(state, state.address + 1, instruction.parameters),
            ]);
            printInstruction(instruction, state, parameters);
            const result = instruction.execute(parameters, state);
            if (result === Result.NONE) {
                state.address += instruction.parameters + 1;
            } else if (result === Result.NO_INPUT) {
                break;
            } else {
                console.log("jumped", state.address);
            }
        } else {
            console.error("Unknown opcode received", opCode);
            state.halted = true;
            return state;
        }
    }
    return state;
}

function printInstruction(instruction: Instruction, state: State, parameters: Parameter[]) {
    console.log(`${state.address}: ${instruction.name}`);
    for (let index = 0; index < parameters.length; index++) {
        const parameter = parameters[index];
        if (index === 2) {
            console.log(`   -> ${parameter.value}`);
        } else {
            console.log(
                `   ${parameter.value} -> ${getParameterValue(parameter, state)} (${getModeName(parameter.mode)})`,
            );
        }
    }
}

function getModeName(mode: ParameterMode) {
    switch (mode) {
        case ParameterMode.POSITION:
            return "POSITION";
        case ParameterMode.IMMEDIATE:
            return "IMMEDIATE";
        case ParameterMode.RELATIVE:
            return "RELATIVE";
    }
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
