import { execute } from "../intcode/execute";
import { program } from "./input";

for (let noun = 0; noun < program.length; noun++) {
    for (let verb = 0; verb < program.length; verb++) {
        const copy = program.slice();
        copy[1] = noun;
        copy[2] = verb;
        if (execute(copy).memory[0] === 19690720) {
            console.log(noun * 100 + verb);
        }
    }
}
