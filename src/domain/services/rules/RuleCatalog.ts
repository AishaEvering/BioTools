import type { Rule } from "../../rules/Rule";
import { SamFlagCatalog } from "../samFlags/SamFlagCatalog";
import { ViewOptionCatalog } from "../viewOptions/ViewOptionCatalog";
import { JsonRuleLoader } from "./JsonRuleLoader";

export class RuleCatalog {
    private readonly rules: readonly Rule[];

   	constructor(flagCatalog: SamFlagCatalog, viewOptionCatalog: ViewOptionCatalog)
	{
        const loader = new JsonRuleLoader(flagCatalog, viewOptionCatalog);
        this.rules = loader.load();
    }

    getAll(): readonly Rule[] {
        return this.rules;
    }

    getById(id: number): Rule | undefined {
        return this.rules.find(rule => rule.id === id);
    }
}