import { readFileSync } from "fs";

interface ParsedInput {
    fields: TicketField[];
    yourTicket: number[];
    tickets: number[][];
}

class TicketField {
    constructor(public readonly name: string, private readonly ranges: TicketFieldRange[]) {}

    public test = (value: number) => {
        return this.ranges.some(({ lower, upper }) => value >= lower && value <= upper);
    };
}

interface TicketFieldRange {
    lower: number;
    upper: number;
}

function parseInput(input: string): ParsedInput {
    const [fieldsContent, yourTicketContent, ticketsContent] = input.split("\n\n");
    const fields = fieldsContent.split("\n").map(parseField);
    const yourTicket = parseTicket(yourTicketContent.split("\n")[1]);
    const [, ...ticketStrings] = ticketsContent.split("\n");
    const tickets = ticketStrings.map(parseTicket);
    return { fields, yourTicket, tickets };
}

function parseField(field: string): TicketField {
    const [name, rangesString] = field.split(": ");
    const ranges = rangesString.split(" or ").map(parseRange);
    return new TicketField(name, ranges);
}

function parseRange(range: string): TicketFieldRange {
    const [lower, upper] = range.split("-").map(part => parseInt(part, 10));
    return { lower, upper };
}

function parseTicket(ticket: string): number[] {
    return ticket.split(",").map(part => parseInt(part, 10));
}

function getErrorRate(input: ParsedInput) {
    console.log(
        input.tickets
            .map(ticket =>
                ticket.filter(value => input.fields.every(field => !field.test(value))).reduce((a, b) => a + b, 0),
            )
            .reduce((a, b) => a + b, 0),
    );
}

function isTicketValid(fields: TicketField[], ticket: number[]) {
    return ticket.every(value => fields.some(field => field.test(value)));
}

function part2(input: ParsedInput) {
    const { tickets, fields, yourTicket } = input;
    const validTickets = tickets.filter(ticket => isTicketValid(fields, ticket));

    const possibleFields: Array<Set<string>> = [];
    for (let index = 0; index < yourTicket.length; index++) {
        const validFields = fields.filter(field => validTickets.every(ticket => field.test(ticket[index])));
        const validFieldNames = new Set(validFields.map(field => field.name));
        possibleFields.push(validFieldNames);
    }

    let updateMade = true;
    while (updateMade) {
        updateMade = false;
        for (let i = 0; i < yourTicket.length; i++) {
            for (let j = 0; j < i; j++) {
                const left = possibleFields[i];
                const right = possibleFields[j];
                if (isSubset(left, right)) {
                    possibleFields[j] = difference(left, right);
                    updateMade = true;
                }
            }
        }

        const singletonFields = new Set<string>();
        for (let index = 0; index < yourTicket.length; index++) {
            const fields = possibleFields[index];
            if (fields.size === 1) {
                singletonFields.add(Array.from(fields.values())[0]);
            }
        }

        if (singletonFields.size === 0) {
            continue;
        }

        for (let index = 0; index < yourTicket.length; index++) {
            const fields = possibleFields[index];
            if (fields.size !== 1) {
                possibleFields[index] = difference(singletonFields, fields);
            }
        }
    }

    if (possibleFields.some(fields => fields.size !== 1)) {
        console.error("Failed!");
        return;
    }

    const determinedFields = possibleFields.map(fields => Array.from(fields)[0]);

    const relevantValues: number[] = [];
    for (let index = 0; index < yourTicket.length; index++) {
        const field = determinedFields[index];
        if (field.startsWith("departure")) {
            relevantValues.push(yourTicket[index]);
        }
    }

    console.log(relevantValues.reduce((a, b) => a * b, 1));
}

function isSubset(left: Set<string>, right: Set<string>) {
    return Array.from(left.values()).every(value => right.has(value));
}

function difference(left: Set<string>, right: Set<string>) {
    const result = new Set(right);
    for (const value of left) {
        result.delete(value);
    }
    return result;
}
const input = parseInput(readFileSync("src/2020/day16/input.txt", { encoding: "utf-8" }));

getErrorRate(input);
part2(input);
