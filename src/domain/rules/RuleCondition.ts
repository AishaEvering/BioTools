import type { ViewOption } from "../options/ViewOption";
import type { SamFlag } from "../sam/SamFlag";

export interface RequiresFlagsCondition {
    readonly type: "requires-flags";
    readonly selectedFlags: readonly SamFlag[];
    readonly requiredFlags?: readonly SamFlag[];
}

export interface ContainsFlagsCondition {
    readonly type: "contradiction";
    readonly selectedFlags: readonly SamFlag[];
}

export interface RequiresOptionCondition {
    readonly type: "requires-option";
    readonly selectedOption: ViewOption;
    readonly selectedValue?: string | number;
    readonly requiredOptions: ViewOption;
}

export type RuleCondition = RequiresFlagsCondition | ContainsFlagsCondition | RequiresOptionCondition;