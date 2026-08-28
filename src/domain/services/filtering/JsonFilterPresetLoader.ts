import filterPresetDefinitions from "../../../data/filterpresets.json";
import type { FilterPreset } from "../../filtering/FilterPreset";
import type { FilterPresetDefinition } from "../../filtering/FilterPresetDefinition";
import type { Loader } from "../../loaders/Loader";
import type { SamFlag } from "../../sam/SamFlag";
import type { SamFlagCatalog } from "../samFlags/SamFlagCatalog";
import { createFlagFilter } from "./CreateFlagFilter";

export class JsonFilterPresetLoader implements Loader<FilterPreset> {
    
    private readonly flagCatalog: SamFlagCatalog;

    constructor(flagCatalog: SamFlagCatalog)
    {
        this.flagCatalog = flagCatalog;
    }

    load(): FilterPreset[]{
        const definitions = filterPresetDefinitions as FilterPresetDefinition[];

        return definitions.map(definition => ({
            id: definition.id,
            name: definition.name,
            description: definition.description,
            filter: createFlagFilter(
                definition.filter.includedFlags.map(id => this.getFlag(id)),
                definition.filter.excludedFlags.map(id => this.getFlag(id))
            )
        }));
    }

    private getFlag(id: number): SamFlag{
        const flag = this.flagCatalog.getFlagById(id);

        if(!flag)
            throw new Error(`Unknown SAM flag id: ${id}`);

        return flag;
    }
}