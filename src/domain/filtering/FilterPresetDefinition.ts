export interface FilterPresetDefinition{
    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly filter: {
        readonly includedFlags: number[];
        readonly excludedFlags: number[];
    }
}