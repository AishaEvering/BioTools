import { useEffect, useState } from "react";
import type { SamViewCommand } from "../../domain/command/SamViewCommand";
import {
  DEFAULT_INPUT_FILE,
  formatValue,
  renderSamViewCommand,
} from "../../domain/services/command/SamViewCommandRenderer";
import "./Command.css";
import { isSelectedOptionRenderable } from "../../domain/options/SelectedViewOption";

interface CommandProps {
  readonly command: SamViewCommand;
  readonly highlightedKeys: string[];
  setHighlightedKeys: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function SamViewCommand({
  command,
  highlightedKeys,
  setHighlightedKeys,
}: CommandProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const renderedCommand = renderSamViewCommand(command);

  useEffect(() => {
    if (highlightedKeys.length === 0) return;

    const timeout = setTimeout(() => {
      setHighlightedKeys([]);
    }, 900);

    return () => clearTimeout(timeout);
  }, [highlightedKeys, setHighlightedKeys]);

  const handlerCopy = async () => {
    try {
      await navigator.clipboard.writeText(renderedCommand);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    setTimeout(() => {
      setCopyStatus("idle");
    }, 1200);
  };

  return (
    <div>
      <div className="command-block">
        <span className="prompt">$</span>
        <span className="command-name">samtools view</span>

        {command.flagFilter.calculatedIncludeValue !== 0 && (
          <span
            className={`command-include ${highlightedKeys.includes("f") ? "pulse" : ""}`}
            data-key="f"
          >
            {" "}
            -f {command.flagFilter.calculatedIncludeValue}
          </span>
        )}

        {command.flagFilter.calculatedExcludeValue !== 0 && (
          <span
            className={`command-exclude ${highlightedKeys.includes("F") ? "pulse" : ""}`}
            data-key="F"
          >
            {" "}
            -F {command.flagFilter.calculatedExcludeValue}
          </span>
        )}

        {command.options
          .filter(isSelectedOptionRenderable)
          .map(({ option, value }) => {
            if (option.requiresValue && (value === undefined || value === "")) {
              return null;
            }

            return (
              <span
                key={option.id}
                className={`command-option ${highlightedKeys.includes("opt-" + option.id) ? "pulse" : ""}`}
                data-key={`opt-${option.id}`}
              >
                {" "}
                <span className="command-option-syntax">{option.syntax}</span>
                {option.requiresValue && (
                  <span className="command-value">{formatValue(value!)}</span>
                )}
              </span>
            );
          })}

        <span
          className={`command-file ${highlightedKeys.includes("file") ? "pulse" : ""}`}
          data-key="file"
        >
          {" "}
          {command.inputFile === undefined || command.inputFile === ""
            ? DEFAULT_INPUT_FILE
            : formatValue(command.inputFile)}
        </span>
      </div>
      <button className="copy-btn" onClick={handlerCopy}>
        {copyStatus === "copied"
          ? "Copied"
          : copyStatus === "error"
            ? "Copy failed"
            : "Copy command"}
      </button>
    </div>
  );
}
