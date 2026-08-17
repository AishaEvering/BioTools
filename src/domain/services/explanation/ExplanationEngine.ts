import type { SamViewCommand } from "../../command/SamViewCommand";
import { EXPLANATION_TYPE, type ExplanationMessage } from "../../explanation/ExplanationMessage";
import type { Rule } from "../../rules/Rule";

export class ExplanationEngine{
    explain(command: SamViewCommand, matchedRules: readonly Rule[]) : readonly ExplanationMessage[]{
        // included flag messages
        const includedFlagMessages = command.flagFilter.includedFlags.map(
            flag => ({
                type: EXPLANATION_TYPE.COMMAND,
                text: flag.inclusionPhrase,
            })
        );
        // excluded flag messages
        const excludedFlagMessages = command.flagFilter.excludedFlags.map(
            flag => ({
                type: EXPLANATION_TYPE.COMMAND,
                text: flag.exclusionPhrase,
            })
        );
        // option messages
        const optionMessages = command.options.map(
            selectedOption => ({
                type: EXPLANATION_TYPE.COMMAND,
                text: selectedOption.option.explanation.replace("{value}", String(selectedOption.value))
            })
        );
        // rule messages
        const ruleMessages = matchedRules.map(
            rule => ({
                type: EXPLANATION_TYPE.RULE,
                text: rule.message,
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

