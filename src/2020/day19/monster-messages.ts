import { readFileSync } from "fs";

interface ParsedInput {
    rules: RulesMap;
    messages: string[];
}

interface RulesMap {
    [id: string]: RuleDefinition;
}

type RuleDefinition = BaseDefinition | UnionDefinition;

interface BaseDefinition {
    kind: "base";
    character: string;
}

interface UnionDefinition {
    kind: "union";
    sequences: RuleSequence[];
}

interface RuleSequence {
    ruleIds: string[];
}

const BASE_RULE_REGEX = /^"(.)"$/;

function parseRuleDefinition(rule: string): RuleDefinition {
    const baseMatch = BASE_RULE_REGEX.exec(rule);
    if (baseMatch !== null) {
        return { kind: "base", character: baseMatch[1] };
    }

    const parts = rule.split(" | ");
    const sequences = parts.map((part): RuleSequence => ({ ruleIds: part.split(" ") }));
    return { kind: "union", sequences };
}

function parseRule(line: string): [string, RuleDefinition] {
    const [before, after] = line.split(": ");
    const ruleId = before;
    const rule = parseRuleDefinition(after);
    return [ruleId, rule];
}

function parseRules(input: string): RulesMap {
    const ruleLines = input.split("\n");
    const rules: RulesMap = {};
    for (const ruleLine of ruleLines) {
        const [id, definition] = parseRule(ruleLine);
        rules[id] = definition;
    }
    return rules;
}

function parseInput(input: string): ParsedInput {
    const [rulesContent, messagesContent] = input.split("\n\n");
    const rules = parseRules(rulesContent);
    const messages = messagesContent.split("\n");
    return { rules, messages };
}

function getAllMessages(rules: RulesMap, startRuleId: string, memoTable: Map<string, Set<string>>): Set<string> {
    if (memoTable.has(startRuleId)) {
        return memoTable.get(startRuleId)!;
    }

    const rule = rules[startRuleId];
    if (rule.kind === "base") {
        return new Set([rule.character]);
    }

    const messages = new Set<string>();
    for (const { ruleIds } of rule.sequences) {
        const messageSequences = ruleIds.map(ruleId => getAllMessages(rules, ruleId, memoTable));
        const sequenceMessages = cartesianProduct(messageSequences);
        for (const message of sequenceMessages) {
            messages.add(message);
        }
    }

    memoTable.set(startRuleId, messages);
    return messages;
}

function cartesianProduct(messages: Array<Set<string>>): Set<string> {
    if (messages.length === 0) {
        return new Set([]);
    }

    if (messages.length === 1) {
        return messages[0];
    }

    const [head, ...tail] = messages;
    const tailProduct = cartesianProduct(tail);
    const result = new Set<string>();
    for (const prefix of head) {
        for (const suffix of tailProduct) {
            result.add(prefix + suffix);
        }
    }
    return result;
}

const input = parseInput(readFileSync("src/2020/day19/input.txt", { encoding: "utf-8" }));

const allValidMessages = getAllMessages(input.rules, "0", new Map());
console.log(input.messages.filter(message => allValidMessages.has(message)).length);
