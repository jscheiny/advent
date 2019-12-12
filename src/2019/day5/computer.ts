import { program } from "../day2/input";
import { executeProgram, getInitialProgramState } from "../intcode/execute";

console.log(executeProgram(getInitialProgramState(program, [5])).output);
