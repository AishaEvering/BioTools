import type { ViewOption } from "../options/ViewOption";
import type { SamFlag } from "../sam/SamFlag";

export const RULE_CONDITION_TYPES = {
    REQUIRES_FLAGS: "requires-flags",
    CONTRADICTION: "contradiction",
    REQUIRES_OPTION: "requires-option",
    INCLUDE_EXCLUDE_OVERLAP: "include-exclude-overlap",
    OPTION_VALUE: "option-value",
    INPUT_FILE_EXTENSION: "input-file-extension",
    EMPTY_COMMAND: "empty-command",
    HAS_FILTERING_SELECTION: "has-filtering-selection",
    CONTAINS_OPTION: "contains-option"
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

export interface OptionValueCondition {
    readonly type: typeof RULE_CONDITION_TYPES.OPTION_VALUE;
    readonly selectedOption: ViewOption;
    readonly selectedValue?: string | number;
}

export interface OptionValueConditionDefinition {
    readonly type: typeof RULE_CONDITION_TYPES.OPTION_VALUE;
  readonly selectedOption: number;
    readonly selectedValue?: string | number;
}
export interface InputFileExtensionCondition {
    readonly type: typeof RULE_CONDITION_TYPES.INPUT_FILE_EXTENSION;
    readonly allowedExtensions: string[];
}

export interface InputFileExtensionConditionDefinition {
    readonly type: typeof RULE_CONDITION_TYPES.INPUT_FILE_EXTENSION;
    readonly allowedExtensions: string[];
}
export interface EmptyCommandCondition {
    readonly type: typeof RULE_CONDITION_TYPES.EMPTY_COMMAND;
}

export interface EmptyCommandConditionDefinition {
    readonly type: typeof RULE_CONDITION_TYPES.EMPTY_COMMAND;
}
export interface  HasFilteringSelectionCondition {
    readonly type: typeof RULE_CONDITION_TYPES.HAS_FILTERING_SELECTION;
}

export interface HasFilteringSelectionConditionDefinition {
    readonly type: typeof RULE_CONDITION_TYPES.HAS_FILTERING_SELECTION;
}

export interface ContiansOptionCondition {
    readonly type: typeof RULE_CONDITION_TYPES.CONTAINS_OPTION;
    readonly selectedOption: ViewOption;
}

export interface ContiansOptionConditionDefinition {
    readonly type: typeof RULE_CONDITION_TYPES.CONTAINS_OPTION;
    readonly selectedOption: number;
}

export type RuleConditionDefinition = RequiresFlagsConditionDefinition 
| ContradictionConditionDefinition 
| RequiresOptionConditionDefinition
| IncludeExcludeOverlapConditionDefinition
| OptionValueConditionDefinition
| InputFileExtensionConditionDefinition
| EmptyCommandConditionDefinition
| HasFilteringSelectionConditionDefinition
| ContiansOptionConditionDefinition;

export type RuleCondition = RequiresFlagsCondition 
| ContradictionCondition 
| RequiresOptionCondition
| IncludeExcludeOverlapCondition
| OptionValueCondition
| InputFileExtensionCondition
| EmptyCommandCondition
| HasFilteringSelectionCondition
| ContiansOptionCondition;