import type { RuleCondition } from "./RuleCondition";

export interface Rule {
    readonly id: number;
    readonly condition: RuleCondition;
    readonly severity: RuleSeverity;
    readonly message: string;
}

export type RuleSeverity = "info" | "warning" | "error";