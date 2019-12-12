export interface State {
    address: number;
    memory: { [index: number]: number };
    input: number[];
    output: number[];
    halted: boolean;
    relativeBase: number;
}

export enum ParameterMode {
    POSITION = 0,
    IMMEDIATE = 1,
    RELATIVE = 2,
}

export interface Parameter {
    mode: ParameterMode;
    value: number;
}

export enum Result {
    NONE,
    JUMPED,
    PAUSE,
    HALT,
}

export interface Instruction {
    name: string;
    parameters: number;
    execute: (parameters: Parameter[], state: State) => Result;
}
