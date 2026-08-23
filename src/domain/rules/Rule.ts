import type { RuleCondition } from "./RuleCondition";

export interface Rule {
    readonly id: number;
    readonly condition: RuleCondition;
    readonly severity: RuleSeverity;
    readonly message: string;
}

export const RULE_SEVERITY= {
    INFO: "info",
    WARNING: "warning",
    ERROR: "error"
} as const;

export type RuleSeverity = typeof RULE_SEVERITY[keyof typeof RULE_SEVERITY];