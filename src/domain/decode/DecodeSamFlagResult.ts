import type { SamFlag } from "../sam/SamFlag";

export interface DecodeSamFlagResult {
    readonly value: string;
    matched: SamFlag[];
    unknownBits: number[];
    isValid: boolean;
    error?: string;
}