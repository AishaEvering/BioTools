import { useEffect, useRef, useState } from "react";
import "./Options.css";
import Option from "./Option";
import type { ViewOption } from "../../domain/options/ViewOption";
import type { SelectedViewOption } from "../../domain/options/SelectedViewOption";

interface OptionsProps {
  readonly availableOptions: readonly ViewOption[];
  readonly selectedOptions: readonly SelectedViewOption[];
  readonly onAdd: (option: ViewOption) => void;
  readonly onRemove: (option: ViewOption) => void;
  readonly onValueChange: (option: ViewOption, value: string | number) => void;
}

export default function Options({
  availableOptions,
  selectedOptions,
  onAdd,
  onRemove,
  onValueChange,
}: OptionsProps) {
  const [addOptionOpen, setAddOptionOpen] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [newlyAddedOptionId, setNewlyAddedOptionId] = useState<number | null>(
    null,
  );
  const returnFocusToAdd = useRef(false);
  const optionSelectRef = useRef<HTMLSelectElement>(null);
  const addOptionButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!addOptionOpen && returnFocusToAdd.current) {
      addOptionButtonRef.current?.focus();
      returnFocusToAdd.current = false;
    }
  }, [addOptionOpen]);

  useEffect(() => {
    if (addOptionOpen) {
      optionSelectRef.current?.focus();
    }
  }, [addOptionOpen]);

  const optionsToAdd = availableOptions.filter(
    (option) =>
      !selectedOptions.some((selected) => selected.option.id === option.id),
  );

  function handleAdd() {
    if (selectedOptionId === null) return;

    const option = optionsToAdd.find(
      (option) => option.id === selectedOptionId,
    );

    if (!option) return;

    setNewlyAddedOptionId(option.requiresValue ? option.id : null);

    onAdd(option);
    setAddOptionOpen(false);
    setSelectedOptionId(null);
  }

  function validateSelectedViewOption(
    selectedOption: SelectedViewOption,
  ): string | undefined {
    const { option, value } = selectedOption;

    if (value === undefined || value === "") {
      return undefined;
    }

    if (!option.constraints) {
      return undefined;
    }

    switch (option.constraints.type) {
      case "integer":
        if (typeof value !== "number") {
          return "Value must be an integer.";
        }

        if (
          option.constraints.minimum !== undefined &&
          value < option.constraints.minimum
        ) {
          return `Value must be at least ${option.constraints.minimum}.`;
        }

        if (
          option.constraints.maximum !== undefined &&
          value > option.constraints.maximum
        ) {
          return `Value must be no greater than ${option.constraints.maximum}.`;
        }

        return undefined;

      case "enum":
        if (
          typeof value !== "string" ||
          !option.constraints.allowableValues.includes(value)
        ) {
          return "Select a valid value.";
        }

        return undefined;

      case "string":
        return undefined;
    }
  }

  return (
    <section className="options">
      <h2>Options</h2>

      {selectedOptions.map((selectedOption) => {
        const error = validateSelectedViewOption(selectedOption);

        return (
          <Option
            key={selectedOption.option.id}
            selectedOption={selectedOption}
            error={error}
            onRemove={onRemove}
            onValueChange={onValueChange}
            autoFocusValue={selectedOption.option.id === newlyAddedOptionId}
          />
        );
      })}

      {optionsToAdd.length === 0 ? (
        <p className="all-options-added">
          All available options have been added.
        </p>
      ) : !addOptionOpen ? (
        <button
          ref={addOptionButtonRef}
          type="button"
          className="add-option-btn"
          onClick={() => setAddOptionOpen(true)}
        >
          + Add option
        </button>
      ) : (
        <form
          className="add-option-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleAdd();
          }}
        >
          <select
            ref={optionSelectRef}
            value={selectedOptionId ?? ""}
            onChange={(event) =>
              setSelectedOptionId(Number(event.target.value))
            }
          >
            <option value="" disabled>
              Choose an option
            </option>
            {optionsToAdd.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} ({option.syntax})
              </option>
            ))}
          </select>

          <p className="form-note">
            Choose a samtools option to add to the command.
          </p>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-add"
              disabled={selectedOptionId === null}
            >
              Add
            </button>

            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                returnFocusToAdd.current = true;
                setAddOptionOpen(false);
                setSelectedOptionId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
