import type { RuleSeverity } from "../rules/Rule";

export interface ExplanationMessage{
    readonly text: string;
    readonly type: ExplanationType;
    readonly group?: ExplanationGroup;
    readonly severity?: RuleSeverity;
}

export const EXPLANATION_TYPE = {
    COMMAND: "command",
    RULE: "rule",
} as const;

export const EXPLANATION_GROUP = {
    INCLUDE: "include",
    EXCLUDE: "exclude",
    OPTION: "option"
} as const;


export type ExplanationGroup = typeof EXPLANATION_GROUP[keyof typeof EXPLANATION_GROUP];
export type ExplanationType = typeof EXPLANATION_TYPE[keyof typeof EXPLANATION_TYPE];