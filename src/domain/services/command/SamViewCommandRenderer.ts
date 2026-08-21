import type { SamViewCommand } from "../../command/SamViewCommand";
import type { SelectedViewOption } from "../../options/SelectedViewOption";

export const DEFAULT_INPUT_FILE = "<input.bam>";

export function renderSamViewCommand(command: SamViewCommand): string {

    const includedFlags = command.flagFilter.calculatedIncludeValue !== 0 ? 
        `-f ${command.flagFilter.calculatedIncludeValue}` : "";

    const excludedFlags = command.flagFilter.calculatedExcludeValue !== 0 ? 
        `-F ${command.flagFilter.calculatedExcludeValue}` : "";

    const options = renderSelectedOptions(command.options);
    
    const inputFileName = formatValue(command.inputFile) ?? DEFAULT_INPUT_FILE;

    return [
        "samtools view",
        includedFlags,
        excludedFlags,
        options,
        inputFileName
    ].filter(Boolean).join(" ");
}

function renderSelectedOptions(options: SelectedViewOption[]): string {
  return options
    .filter(({ option, value }) => {
      if (!option.requiresValue) {
        return true;
      }

      return value !== undefined && value !== "";
    })
    .map(({ option, value }) => {
      return option.requiresValue
        ? `${option.syntax} ${formatValue(value!)}`
        : option.syntax;
    })
    .join(" ");
}

export function formatValue(value: string | number | undefined): string | number | undefined {
    if (value === undefined || value === "") {
        return undefined;
    }

    if (typeof value === "string") {
        return value.includes(" ") ? `"${value}"` : value;
    }
    return value;
}
