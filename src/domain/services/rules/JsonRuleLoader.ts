import rulesDefinitions from "../../../data/rules.json";
import type { Rule } from "../../rules/Rule";
import { RULE_CONDITION_TYPES, type RuleCondition, type RuleConditionDefinition } from "../../rules/RuleCondition";
import type { SamFlagCatalog } from "../samFlags/SamFlagCatalog";
import type { ViewOptionCatalog } from "../viewOptions/ViewOptionCatalog";
import type { RuleDefinition } from "../../rules/RuleDefinition";
import type { Loader } from "../../loaders/Loader";



export class JsonRuleLoader implements Loader<Rule> {

    private readonly flagCatalog: SamFlagCatalog;
private readonly viewOptionCatalog: ViewOptionCatalog;

	constructor(flagCatalog: SamFlagCatalog, viewOptionCatalog: ViewOptionCatalog)
	{
        this.flagCatalog = flagCatalog;
        this.viewOptionCatalog = viewOptionCatalog;
    }

    load(): Rule[] {
        const definitions = rulesDefinitions as RuleDefinition[];

    return definitions.map(r => ({
        id: r.id,
        condition: this.mapCondition(r.condition),
        severity: r.severity,
        message: r.message,
    }));
}

	private mapCondition(ruleCondition: RuleConditionDefinition): RuleCondition {
		switch (ruleCondition.type) {
			case RULE_CONDITION_TYPES.REQUIRES_FLAGS:
				return {
					type: RULE_CONDITION_TYPES.REQUIRES_FLAGS,
					includedFlags: ruleCondition.includedFlags.map(id => this.getFlag(id)),
					requiredFlags: ruleCondition.requiredFlags.map(id => this.getFlag(id)),
				};

			case RULE_CONDITION_TYPES.CONTRADICTION:
				return {
					type: RULE_CONDITION_TYPES.CONTRADICTION,
					includedFlags: ruleCondition.includedFlags.map(id => this.getFlag(id)),
				};

			case RULE_CONDITION_TYPES.REQUIRES_OPTION:
				return {
					type: RULE_CONDITION_TYPES.REQUIRES_OPTION,
					selectedOption: this.getViewOption(ruleCondition.selectedOption),
					selectedValue: ruleCondition.selectedValue,
					requiredOption: this.getViewOption(ruleCondition.requiredOption),
				};
            
           case RULE_CONDITION_TYPES.INCLUDE_EXCLUDE_OVERLAP:
				return {
					type: RULE_CONDITION_TYPES.INCLUDE_EXCLUDE_OVERLAP,
				};

            case RULE_CONDITION_TYPES.OPTION_VALUE:
                return{
                    type: RULE_CONDITION_TYPES.OPTION_VALUE,
                    selectedOption: this.getViewOption(ruleCondition.selectedOption),
                    selectedValue: ruleCondition.selectedValue,
                };
            
            case RULE_CONDITION_TYPES.INPUT_FILE_EXTENSION:
                return{
                    type: RULE_CONDITION_TYPES.INPUT_FILE_EXTENSION,
                    allowedExtensions: ruleCondition.allowedExtensions,
                };
            
            case RULE_CONDITION_TYPES.EMPTY_COMMAND:
                return{
                    type: RULE_CONDITION_TYPES.EMPTY_COMMAND,
                };
            
            case RULE_CONDITION_TYPES.HAS_FILTERING_SELECTION:
                return{
                    type: RULE_CONDITION_TYPES.HAS_FILTERING_SELECTION,
                };
                
            case RULE_CONDITION_TYPES.CONTAINS_OPTION:
                return{
                    type: RULE_CONDITION_TYPES.CONTAINS_OPTION,
                    selectedOption: this.getViewOption(ruleCondition.selectedOption),
                }

			default:
				throw new Error(`Unknown rule condition: ${ruleCondition}`);
		}
    }

    private getFlag(id: number) {
        const flag = this.flagCatalog.getFlagById(id);

        if (!flag) {
            throw new Error(`Unknown SAM flag with ID ${id} not found in catalog.`);
        }
        return flag;
    }

    private getViewOption(id: number) {
        const option = this.viewOptionCatalog.getViewOptionById(id);

        if (!option) {
            throw new Error(`Unknown view option with ID ${id} not found in catalog.`);
        }
        return option;
    }
}



