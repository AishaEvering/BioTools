import type { SelectedViewOption } from "../../domain/options/SelectedViewOption";
import type { ViewOption } from "../../domain/options/ViewOption";
import "./Option.css";

interface OptionProps {
  readonly selectedOption: SelectedViewOption;
  readonly error?: string;
  readonly onValueChange: (option: ViewOption, value: string | number) => void;
  readonly onRemove: (option: ViewOption) => void;
}

export default function Option({
  selectedOption,
  error,
  onValueChange,
  onRemove,
}: OptionProps) {
  const { option, value } = selectedOption;

  function renderValueControl() {
    if (!option.requiresValue) {
      return <div className="opt-toggle-note">applied — no value</div>;
    }

    if (option.constraints?.type === "enum") {
      return (
        <select
          className="opt-value"
          value={value ?? ""}
          onChange={(event) => onValueChange(option, event.target.value)}
        >
          {option.constraints.allowableValues.map((allowableValues) => (
            <option key={allowableValues} value={allowableValues}>
              {allowableValues}
            </option>
          ))}
        </select>
      );
    }

    if (option.constraints?.type === "integer") {
      return (
        <input
          className="opt-value"
          type="number"
          min={option.constraints.minimum}
          max={option.constraints.maximum}
          value={value ?? ""}
          placeholder={option.placeholder ?? ""}
          onChange={(event) =>
            onValueChange(option, event.target.valueAsNumber)
          }
        />
      );
    }

    return (
      <input
        className="opt-value"
        type="text"
        value={value ?? ""}
        placeholder={option.placeholder ?? ""}
        onChange={(event) => onValueChange(option, event.target.value)}
      />
    );
  }

  return (
    <div className="option-row-wrap">
      <div className={`option-row${error ? " has-error" : ""}`}>
        <div className="opt-main">
          <div className="opt-label">
            <span className="opt-flag-tag">{option.syntax}</span>

            {option.name}
          </div>

          {renderValueControl()}

          <button
            type="button"
            className="opt-remove"
            title={`Remove ${option.name}`}
            aria-label={`Remove ${option.name}`}
            onClick={() => onRemove(option)}
          >
            ×
          </button>
        </div>

        {error && <div className="opt-error-text">✕ {error}</div>}
      </div>
    </div>
  );
}
