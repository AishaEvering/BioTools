import type { SamFlag } from "../../sam/SamFlag";
import type { FlagFilter } from "../../filtering/FlagFilter";

export function createFlagFilter(
    includedFlags: readonly SamFlag[],
    excludedFlags: readonly SamFlag[]
): FlagFilter {
    return { 
        includedFlags,
        excludedFlags,
        calculatedIncludeValue: includedFlags.reduce(
            (total, flag) => total | flag.value,
            0
        ),
        calculatedExcludeValue: excludedFlags.reduce(
            (total, flag) => total | flag.value,
            0
        ),
    };
}
