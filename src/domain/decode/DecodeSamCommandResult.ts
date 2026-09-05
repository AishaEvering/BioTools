import type { SamViewCommand } from "../command/SamViewCommand";

export interface DecodeSamCommandResult {
    readonly command: SamViewCommand;
    readonly isValid: boolean;
    readonly skippedTokens: string[];
    readonly unknownIncludedBits: number[];
    readonly unknownExcludedBits: number[];
    readonly errors: string[];
}