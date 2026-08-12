import type { SamFlag } from "../sam/SamFlag";

export interface FlagFilter {
    readonly includedFlags: readonly SamFlag[];
    readonly excludedFlags: readonly SamFlag[];
    readonly calculatedIncludeValue: number;
    readonly calculatedExcludeValue: number;
}