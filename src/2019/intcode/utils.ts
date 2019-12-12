import { Parameter, ParameterMode, State } from "./types";

export function getParameterValue({ mode, value }: Parameter, state: State): number {
    switch (mode) {
        case ParameterMode.IMMEDIATE:
            return value;
        case ParameterMode.POSITION:
            return accessMemory(state, value);
        case ParameterMode.RELATIVE:
            return accessMemory(state, value + state.relativeBase);
    }
}

export function accessMemory({ memory }: State, address: number) {
    if (address in memory) {
        return memory[address];
    }
    memory[address] = 0;
    return memory[address];
}

export function sliceMemory(state: State, start: number, length: number) {
    const slice: number[] = [];
    for (let offset = 0; offset < length; offset++) {
        const address = start + offset;
        slice.push(accessMemory(state, address));
    }
    return slice;
}

export function assignMemory(state: State, result: Parameter, value: number) {
    const offset = result.mode === ParameterMode.RELATIVE ? state.relativeBase : 0;
    state.memory[result.value + offset] = value;
}
