import type { SamFlag } from "../sam/SamFlag";

export interface DecodeSamFlagResult {
    readonly value: string;
    readonly matched: SamFlag[];
    readonly unknownBits: number[];
    readonly isValid: boolean;
    readonly error?: string;
}