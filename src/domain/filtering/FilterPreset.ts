import type { FlagFilter } from "./FlagFilter";

export interface FilterPreset{
    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly filter: FlagFilter;
}