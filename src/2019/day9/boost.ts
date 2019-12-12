import { execute } from "../intcode/execute";
import { boostProgram } from "./input";

const result = execute(boostProgram, [1]);
console.log("OUTPUT", result.output);
console.log(boostProgram[53])
