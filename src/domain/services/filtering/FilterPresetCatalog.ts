import type { FilterPreset } from "../../filtering/FilterPreset";
import type { FlagFilter } from "../../filtering/FlagFilter";
import type { SamFlag } from "../../sam/SamFlag";
import type { SamFlagCatalog } from "../samFlags/SamFlagCatalog";
import { JsonFilterPresetLoader } from "./JsonFilterPresetLoader";

export class FilterPresetCatalog{
    private readonly presets: readonly FilterPreset[];
    
        
    constructor(flagCatalog: SamFlagCatalog)
    {
        const loader = new JsonFilterPresetLoader(flagCatalog);
        this.presets = loader.load();
    }

    getAll(): readonly FilterPreset[] {
        return this.presets;
    }

    getById(id: number): FilterPreset | undefined {
        return this.presets.find(preset => preset.id === id);
    }

    findMatching(filter: FlagFilter): FilterPreset | undefined{
        return this.presets.find(preset => this.matches(preset.filter, filter));
    }

    private matches(a: FlagFilter, b: FlagFilter): boolean {
        return (this.hasSameFlags(a.includedFlags, b.includedFlags) &&
                this.hasSameFlags(a.excludedFlags, b.excludedFlags)
        );
    }

    private hasSameFlags(a: readonly SamFlag[], b: readonly SamFlag[]):boolean{
        if(a.length !== b.length)
            return false;

        const bIds = new Set(b.map(flag => flag.id));

        return a.every(flag => bIds.has(flag.id));
    }

}