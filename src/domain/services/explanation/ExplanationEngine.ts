import type { SamViewCommand } from "../../command/SamViewCommand";
import { EXPLANATION_GROUP, EXPLANATION_TYPE, type ExplanationMessage } from "../../explanation/ExplanationMessage";
import type { Rule } from "../../rules/Rule";
import { isSelectedOptionRenderable } from "../../options/SelectedViewOption";

export class ExplanationEngine{
    explain(command: SamViewCommand, matchedRules: readonly Rule[]) : readonly ExplanationMessage[]{
        // included flag messages
        const includedFlagMessages = command.flagFilter.includedFlags.map(
            flag => ({
                type: EXPLANATION_TYPE.COMMAND,
                text: flag.inclusionPhrase,
                group: EXPLANATION_GROUP.INCLUDE,
            })
        );
        // excluded flag messages
        const excludedFlagMessages = command.flagFilter.excludedFlags.map(
            flag => ({
                type: EXPLANATION_TYPE.COMMAND,
                text: flag.exclusionPhrase,
                group: EXPLANATION_GROUP.EXCLUDE,
            })
        );
        // option messages
        const optionMessages = command.options
        .filter(isSelectedOptionRenderable)
        .map(selectedOption => ({
                type: EXPLANATION_TYPE.COMMAND,
                text: selectedOption.option.explanation.replace("{value}", String(selectedOption.value)),
                group: EXPLANATION_GROUP.OPTION,
            })
        );
        // rule messages
        const ruleMessages = matchedRules.map(
            rule => ({
                type: EXPLANATION_TYPE.RULE,
                text: rule.message,
                severity: rule.severity,
            })
        );

        return[
            ...includedFlagMessages,
            ...excludedFlagMessages,
            ...optionMessages,
            ...ruleMessages,
        ];
    }
}

