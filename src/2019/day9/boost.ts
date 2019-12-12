import { execute } from "../intcode/execute";
import { boostProgram } from "./input";

const result = execute(boostProgram, [2]);
console.log(result.output);
