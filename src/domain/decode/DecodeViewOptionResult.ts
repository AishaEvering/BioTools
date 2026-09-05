import type { SelectedViewOption } from "../options/SelectedViewOption";

export interface DecodeViewOptionResult {
    readonly option?: SelectedViewOption;
    readonly isValid: boolean;
    readonly error?: string;
    readonly requiresValue?: boolean;
}