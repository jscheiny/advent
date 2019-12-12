import { Instruction, Result } from "./types";
import { assignMemory, getParameterValue } from "./utils";

const add: Instruction = {
    name: "ADD",
    parameters: 3,
    execute: ([left, right, result], state) => {
        const leftValue = getParameterValue(left, state);
        const rightValue = getParameterValue(right, state);
        assignMemory(state, result, leftValue + rightValue);
        return Result.NONE;
    },
};

const multiply: Instruction = {
    name: "MULTIPLY",
    parameters: 3,
    execute: ([left, right, result], state) => {
        const leftValue = getParameterValue(left, state);
        const rightValue = getParameterValue(right, state);
        assignMemory(state, result, leftValue * rightValue);
        return Result.NONE;
    },
};

const read: Instruction = {
    name: "READ",
    parameters: 1,
    execute: ([result], state) => {
        const nextInput = state.input.shift();
        if (nextInput === undefined) {
            return Result.PAUSE;
        } else {
            assignMemory(state, result, nextInput);
            return Result.NONE;
        }
    },
};

const write: Instruction = {
    name: "WRITE",
    parameters: 1,
    execute: ([source], state) => {
        const output = getParameterValue(source, state);
        state.output.push(output);
        return Result.NONE;
    },
};

const jumpIfTrue: Instruction = {
    name: "JUMP_IF_TRUE",
    parameters: 2,
    execute: ([predicate, jump], state) => {
        const predicateValue = getParameterValue(predicate, state);
        const jumpAddress = getParameterValue(jump, state);
        if (predicateValue !== 0) {
            state.address = jumpAddress;
            return Result.JUMPED;
        } else {
            return Result.NONE;
        }
    },
};

const jumpIfFalse: Instruction = {
    name: "JUMP_IF_FALSE",
    parameters: 2,
    execute: ([predicate, jump], state) => {
        const predicateValue = getParameterValue(predicate, state);
        const jumpAddress = getParameterValue(jump, state);
        if (predicateValue === 0) {
            state.address = jumpAddress;
            return Result.JUMPED;
        } else {
            return Result.NONE;
        }
    },
};

const lessThan: Instruction = {
    name: "LESS_THAN",
    parameters: 3,
    execute: ([left, right, result], state) => {
        const leftValue = getParameterValue(left, state);
        const rightValue = getParameterValue(right, state);
        assignMemory(state, result, leftValue < rightValue ? 1 : 0);
        return Result.NONE;
    },
};

const equals: Instruction = {
    name: "EQUALS",
    parameters: 3,
    execute: ([left, right, result], state) => {
        const leftValue = getParameterValue(left, state);
        const rightValue = getParameterValue(right, state);
        assignMemory(state, result, leftValue === rightValue ? 1 : 0);
        return Result.NONE;
    },
};

const modifyRelativeBase: Instruction = {
    name: "MODIFY_RELATIVE_BASE",
    parameters: 1,
    execute: ([offsetParam], state) => {
        const offset = getParameterValue(offsetParam, state);
        state.relativeBase += offset;
        return Result.NONE;
    },
};

const halt: Instruction = {
    name: "HALT",
    parameters: 0,
    execute: () => Result.HALT,
};

export const INSTRUCTIONS: { [opCode: number]: Instruction } = {
    1: add,
    2: multiply,
    3: read,
    4: write,
    5: jumpIfTrue,
    6: jumpIfFalse,
    7: lessThan,
    8: equals,
    9: modifyRelativeBase,
    99: halt,
};
