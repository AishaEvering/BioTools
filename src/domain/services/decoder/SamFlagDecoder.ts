import type { DecodeSamFlagResult } from "../../decode/DecodeSamFlagResult";
import type { SamFlag } from "../../sam/SamFlag";
import type { SamFlagCatalog } from "../samFlags/SamFlagCatalog";

export class SamFlagDecoder {
    private readonly flagCatalog: SamFlagCatalog;

    constructor(flagCatalog: SamFlagCatalog)
    {
        this.flagCatalog = flagCatalog;
    }

    decode(input: string): DecodeSamFlagResult{
        const trimmedInput = input.trim();
        const value = Number(trimmedInput);

        if(trimmedInput === "" || !Number.isFinite(value) || !Number.isInteger(value) || value < 0){
            return {
                value: trimmedInput,
                matched: [],
                unknownBits: [],
                isValid: false,
                error: "Enter a non-negative whole number.",
          };
        }
            
        const matched: SamFlag[] = [];
        const unknownBits: number[] = [];
        const samFlags = this.flagCatalog.getAll();

        for(let bit = 1; bit <= value; bit *= 2){
            if((value & bit) !== 0){
                const flag = samFlags.find(f => f.value === bit);
                if (flag) {
                    matched.push(flag);
                } else {
                    unknownBits.push(bit);
                }
            }
        }

        return {value: trimmedInput, matched, unknownBits, isValid: true};
    }
}