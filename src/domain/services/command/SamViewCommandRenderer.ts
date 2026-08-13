import type { SamViewCommand } from "../../command/SamViewCommand";
import type { SelectedViewOption } from "../../options/SelectedViewOption";

export function renderSamViewCommand(command: SamViewCommand): string {

    const includedFlags = command.flagFilter.calculatedIncludeValue !== 0 ? 
        `-f ${command.flagFilter.calculatedIncludeValue}` : "";

    const excludedFlags = command.flagFilter.calculatedExcludeValue !== 0 ? 
        `-F ${command.flagFilter.calculatedExcludeValue}` : "";

    const options = renderSelectedOptions(command.options);
    
    const inputFileName = command.inputFile ?? "<input.bam>";

    return [
        "samtools view",
        options,
        includedFlags,
        excludedFlags,
        inputFileName
    ].filter(Boolean).join(" ");
}

function renderSelectedOptions(options: SelectedViewOption[]): string {
    return options.map(({option, value}) => {
        return option.requiresValue ? `${option.syntax} ${value}` : option.syntax;
    }).join(" ");
}

