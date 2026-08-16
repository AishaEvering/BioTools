import type { ViewOption } from "../options/ViewOption";
import type { SamFlag } from "../sam/SamFlag";

export const RULE_CONDITION_TYPES = {
    REQUIRES_FLAGS: "requires-flags",
    CONTRADICTION: "contradiction",
    REQUIRES_OPTION: "requires-option",
    INCLUDE_EXCLUDE_OVERLAP: "include-exclude-overlap"
} as const;

export type RuleConditionType = 
typeof RULE_CONDITION_TYPES[keyof typeof RULE_CONDITION_TYPES];

export interface RequiresFlagsCondition {
    readonly type: typeof RULE_CONDITION_TYPES.REQUIRES_FLAGS;
    readonly includedFlags: readonly SamFlag[];
    readonly requiredFlags: readonly SamFlag[];
}

export interface RequiresFlagsConditionDefinition {
    readonly type: typeof RULE_CONDITION_TYPES.REQUIRES_FLAGS;
    readonly includedFlags: readonly number[];
    readonly requiredFlags: readonly number[];
}

export interface ContradictionCondition {
    readonly type: typeof RULE_CONDITION_TYPES.CONTRADICTION;
    readonly includedFlags: readonly SamFlag[];
}

export interface ContradictionConditionDefinition {
    readonly type: typeof RULE_CONDITION_TYPES.CONTRADICTION;
    readonly includedFlags: readonly number[];
}

export interface RequiresOptionCondition {
    readonly type: typeof RULE_CONDITION_TYPES.REQUIRES_OPTION;
    readonly selectedOption: ViewOption;
    readonly selectedValue?: string | number;
    readonly requiredOption: ViewOption;
}

export interface IncludeExcludeOverlapCondition {
    readonly type: typeof RULE_CONDITION_TYPES.INCLUDE_EXCLUDE_OVERLAP;
}

export interface IncludeExcludeOverlapConditionDefinition {
    readonly type: typeof RULE_CONDITION_TYPES.INCLUDE_EXCLUDE_OVERLAP;
}

export interface RequiresOptionConditionDefinition {
    readonly type: typeof RULE_CONDITION_TYPES.REQUIRES_OPTION;
    readonly selectedOption: number;
    readonly selectedValue?: string | number;
    readonly requiredOption: number;
}

export type RuleConditionDefinition = RequiresFlagsConditionDefinition 
| ContradictionConditionDefinition 
| RequiresOptionConditionDefinition
| IncludeExcludeOverlapConditionDefinition;

export type RuleCondition = RequiresFlagsCondition 
| ContradictionCondition 
| RequiresOptionCondition
| IncludeExcludeOverlapCondition;