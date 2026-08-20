import type { SamViewCommand } from "../../command/SamViewCommand";
import type { Rule } from "../../rules/Rule";
import { RULE_CONDITION_TYPES, type RuleCondition } from "../../rules/RuleCondition";
import { DEFAULT_INPUT_FILE } from "../command/SamViewCommandRenderer";
import type { RuleCatalog } from "./RuleCatalog";
import * as path from 'path';
 export class RuleEngine {
  private readonly ruleCatalog: RuleCatalog;

  constructor(ruleCatalog: RuleCatalog){
    this.ruleCatalog = ruleCatalog;
  }


   evaluate(command: SamViewCommand): readonly Rule[] {
    return this.ruleCatalog
        .getAll()
        .filter(rule => this.isConditionSatisfied(rule.condition, command));
   }

   private isConditionSatisfied(condition: RuleCondition, command: SamViewCommand): boolean {
        switch (condition.type) { 
            case RULE_CONDITION_TYPES.REQUIRES_FLAGS: {
                const selectedFlagsAreIncluded = condition.includedFlags.every(
                    flag => command.flagFilter.includedFlags.some(
                        includedFlag => includedFlag.id === flag.id
                    )
                );

                const requiredFlagsAreIncluded = condition.requiredFlags.every(
                    flag => command.flagFilter.includedFlags.some(
                        includedFlag => includedFlag.id === flag.id
                    )
                );
        
                return selectedFlagsAreIncluded && !requiredFlagsAreIncluded;
            }
            case RULE_CONDITION_TYPES.CONTRADICTION:{
                return condition.includedFlags.every(
                    flag => command.flagFilter.includedFlags.some(
                        includedFlag => includedFlag.id === flag.id
                    )
                )
            }
            case RULE_CONDITION_TYPES.REQUIRES_OPTION: {
                const selectedOption = command.options.find(
                    option => option.option.id === condition.selectedOption.id
                );

                // did not find condition option in the command
                if(!selectedOption){
                    return false;
                }

                // do the option values match
                const selectedValueMatches = condition.selectedValue === undefined ||
                    selectedOption.value === condition.selectedValue;
                
                if(!selectedValueMatches)
                    return false; // option values do not match

                // find the required option
                const requiredOptionSelected = command.options.some(
                    option => option.option.id === condition.requiredOption.id
                );

                // the required option was not found
                return !requiredOptionSelected;
            }
            case RULE_CONDITION_TYPES.INCLUDE_EXCLUDE_OVERLAP: {
                return command.flagFilter.includedFlags.some(
                    includedFlag => command.flagFilter.excludedFlags.some(
                        excludedFlag => excludedFlag.id === includedFlag.id
                    )
                );
            }
            case RULE_CONDITION_TYPES.OPTION_VALUE:{
                return command.options.some(
                    selected => selected.option.id === condition.selectedOption.id &&
                    selected.value === condition.selectedValue
                );
            }
            case RULE_CONDITION_TYPES.INPUT_FILE_EXTENSION: {
                if(!command.inputFile || command.inputFile === DEFAULT_INPUT_FILE)
                    return false;
                
                const extension = path.extname(command.inputFile).toLowerCase();

                return !condition.allowedExtensions.includes(extension) 
            }
            default:
                throw new Error(`Unknown rule condition type: ${(condition as RuleCondition).type}`);
        }
    }
}