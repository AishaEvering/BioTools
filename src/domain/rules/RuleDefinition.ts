import type { RuleSeverity } from "./Rule";
import type { RuleConditionDefinition } from "./RuleCondition";

export interface RuleDefinition {
    readonly id: number;
    readonly condition: RuleConditionDefinition;
    readonly severity: RuleSeverity;
    readonly message: string;
}
