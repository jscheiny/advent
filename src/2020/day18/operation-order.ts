import { readFileSync } from "fs";

type Token = OpenParenthesisToken | CloseParenthesisToken | OperatorToken | NumberToken;
type Operation = "+" | "*";

interface OpenParenthesisToken {
    kind: "(";
}

interface CloseParenthesisToken {
    kind: ")";
}

interface OperatorToken {
    kind: "operator";
    operation: Operation;
}

interface NumberToken {
    kind: "number";
    value: number;
}

function tokenize(line: string) {
    const tokens: string[] = [];
    while (line.length > 0) {
        tokens.push(line[0]);
        line = line.substr(1).trimLeft();
    }
    return tokens.map(parseToken);
}

function parseToken(token: string): Token {
    switch (token) {
        case "(":
            return { kind: "(" };
        case ")":
            return { kind: ")" };
        case "+":
            return { kind: "operator", operation: "+" };
        case "*":
            return { kind: "operator", operation: "*" };
        default:
            return { kind: "number", value: parseInt(token, 10) };
    }
}

type Expression = ParenthesizedExpression | ArithmeticExpression | NumberExpression;

interface ParenthesizedExpression {
    kind: "parenthesized";
    nestedExpression: Expression;
}

interface ArithmeticExpression {
    kind: "arithmetic";
    args: Expression[];
    operations: Operation[];
}

interface NumberExpression {
    kind: "number";
    value: number;
}

interface BuildExpressionResult {
    endIndex: number;
    expression: Expression;
}

function buildArithmeticExpression(tokens: Token[], startIndex: number, nesting: number): BuildExpressionResult {
    const expressionList: Expression[] = [];
    const operationList: Operation[] = [];
    let index = startIndex;
    while (index < tokens.length) {
        const token = tokens[index];
        if (token.kind === "number") {
            expressionList.push({ kind: "number", value: token.value });
            index++;
        } else if (token.kind === "(") {
            const { expression, endIndex } = buildParenthesizedExpression(tokens, index, nesting + 1);
            expressionList.push(expression);
            index = endIndex;
        } else {
            throw new Error(`Encounted unexpected token of type ${token.kind}`);
        }

        if (index >= tokens.length) {
            break;
        }

        const nextToken = tokens[index];
        if (nextToken.kind === ")") {
            break;
        }

        if (nextToken.kind === "(" || nextToken.kind === "number") {
            throw new Error(
                `${expressionList[expressionList.length - 1].kind} expression should not be followed by ${
                    nextToken.kind
                }`,
            );
        }

        operationList.push(nextToken.operation);
        index++;
    }

    const expression: Expression = { kind: "arithmetic", args: expressionList, operations: operationList };
    return { endIndex: index, expression };
}

function buildParenthesizedExpression(token: Token[], startIndex: number, nesting: number): BuildExpressionResult {
    const { endIndex, expression } = buildArithmeticExpression(token, startIndex + 1, nesting + 1);
    const result: Expression = { kind: "parenthesized", nestedExpression: expression };
    return { endIndex: endIndex + 1, expression: result };
}

// function buildExpressionImpl(tokens: Token[], startIndex: number): BuildExpressionResult {
//     const firstToken = tokens[startIndex];
//     switch (firstToken.kind) {
//         case "operator":
//             throw new Error("Expression cannot begin with an operator");
//         case ")":
//             throw new Error("Expression cannot begin with a close parenthesis");
//         case "number": {
//             const left: NumberExpression = { kind: "number", value: firstToken.value };
//             const secondToken = tokens[startIndex + 1];
//             if (secondToken.kind === ")") {
//                 return { endIndex: startIndex + 2, expression: left };
//             }
//             if (secondToken.kind !== "operator") {
//                 throw new Error("Number must be followed by an operator or close paren");
//             }
//             const { endIndex, expression: right } = buildExpressionImpl(tokens, startIndex + 2);
//             const expression: ArithmeticExpression = {
//                 kind: "arithmetic",
//                 left,
//                 operation: secondToken.operation,
//                 right,
//             };
//             return { endIndex: endIndex + 1, expression };
//         }
//         case "(": {
//             const { expression, endIndex } = buildExpressionImpl(tokens, startIndex + 1);
//             // if (endIndex >= tokens.length || tokens[endIndex].kind !== ")") {
//             //     throw new Error("Attempted to build incomplete parnethesized expression");
//             // }
//             return { endIndex: endIndex + 1, expression: { kind: "parenthesized", nestedExpression: expression } };
//         }
//     }
// }

function buildExpression(tokens: Token[]) {
    return buildArithmeticExpression(tokens, 0, 0).expression;
}

function evaluateExpression(expression: Expression): number {
    switch (expression.kind) {
        case "number":
            return expression.value;
        case "parenthesized":
            return evaluateExpression(expression.nestedExpression);
        case "arithmetic":
            return evaluateArithmeticExpression(expression);
    }
}

function evaluateArithmeticExpression(expression: ArithmeticExpression) {
    const { args, operations } = expression;
    let result = evaluateExpression(args[0]);
    for (let index = 0; index < operations.length; index++) {
        result = evaluateOperation(operations[index], result, evaluateExpression(args[index + 1]));
    }
    return result;
}

function evaluateOperation(operation: Operation, left: number, right: number) {
    switch (operation) {
        case "+":
            return left + right;
        case "*":
            return left * right;
    }
}

const sum = readFileSync("src/2020/day18/input.txt", { encoding: "utf-8" })
    .split("\n")
    .map(tokenize)
    .map(buildExpression)
    .map(evaluateExpression)
    .reduce((a, b) => a + b, 0);

console.log(sum);

