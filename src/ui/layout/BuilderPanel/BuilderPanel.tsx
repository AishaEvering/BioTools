import { useState } from "react";
import "./BuilderPanel.css";
import FlagSearch from "../../Flags/FlagSearch";
import { SamFlagCatalog } from "../../../domain/services/samFlags/SamFlagCatalog";
import FlagCategoryFilter from "../../Flags/FlagCategoryFilter";
import type { SamFlag } from "../../../domain/sam/SamFlag";
import type { FlagSelectionState } from "../../Flags/FlagCard";
import type { FlagFilter } from "../../../domain/filtering/FlagFilter";
import { createFlagFilter } from "../../../domain/services/filtering/CreateFlagFilter";
import FlagGroups from "../../Flags/FlagGroups";
import HiddenFlags from "../../Flags/HiddenFlags";
import Options from "../../Options/Options";
import { ViewOptionCatalog } from "../../../domain/services/viewOptions/ViewOptionCatalog";
import type { ViewOption } from "../../../domain/options/ViewOption";
import type { SelectedViewOption } from "../../../domain/options/SelectedViewOption";

const samFlagCatalog = new SamFlagCatalog();
const viewOptionCatalog = new ViewOptionCatalog();

export default function BuilderPanel() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hiddenFlagIds, setHiddenFlagIds] = useState<Set<number>>(new Set());
  const [flagFilter, setFlagFilter] = useState<FlagFilter>(
    createFlagFilter([], []),
  );
  const [selectedOptions, setSelectedOptions] = useState<SelectedViewOption[]>(
    [],
  );

  const flags = samFlagCatalog.getAll();
  const viewOptions = viewOptionCatalog.getAll();

  const normalizedSearch = searchText.trim().toLowerCase();

  const categories = [
    "All",
    ...Array.from(new Set(flags.map((flag) => flag.category))),
  ];

  const filteredFlags = flags.filter((flag) => {
    if (hiddenFlagIds.has(flag.id)) {
      return false;
    }

    const matchedSearch =
      !normalizedSearch ||
      [
        flag.name,
        flag.description,
        flag.category,
        flag.hex,
        flag.value.toString(),
      ].some((value) => value.toLowerCase().includes(normalizedSearch));

    const matchesCategory =
      selectedCategory === "All" || flag.category === selectedCategory;

    return matchedSearch && matchesCategory;
  });

  function getFlagState(flag: SamFlag): FlagSelectionState {
    if (flagFilter.includedFlags.some((f) => f.id === flag.id)) {
      return "include";
    }

    if (flagFilter.excludedFlags.some((f) => f.id === flag.id)) {
      return "exclude";
    }
    return "none";
  }

  function handleCycleFlag(flag: SamFlag) {
    const currentState = getFlagState(flag);

    if (currentState === "none") {
      setFlagFilter(
        createFlagFilter(
          [...flagFilter.includedFlags, flag],
          flagFilter?.excludedFlags,
        ),
      );
    }

    if (currentState === "include") {
      setFlagFilter(
        createFlagFilter(
          flagFilter.includedFlags.filter((f) => f.id !== flag.id),
          [...flagFilter.excludedFlags, flag],
        ),
      );
    }

    if (currentState === "exclude") {
      setFlagFilter(
        createFlagFilter(
          flagFilter.includedFlags,
          flagFilter.excludedFlags.filter((f) => f.id !== flag.id),
        ),
      );
    }
  }

  function handleHideFlag(flag: SamFlag) {
    setFlagFilter(
      createFlagFilter(
        flagFilter.includedFlags.filter((f) => f.id !== flag.id),
        flagFilter.excludedFlags.filter((f) => f.id !== flag.id),
      ),
    );

    setHiddenFlagIds((current) => {
      const next = new Set(current);
      next.add(flag.id);
      return next;
    });
  }

  const hiddenFlags = flags.filter((flag) => hiddenFlagIds.has(flag.id));

  function handleRestoreFlag(flag: SamFlag) {
    setHiddenFlagIds((current) => {
      const next = new Set(current);
      next.delete(flag.id);
      return next;
    });
  }

  function handleAddOption(option: ViewOption) {
    let value: string | number | undefined;

    if (option.constraints?.type === "enum") {
      value = option.constraints.allowableValues[0];
    }

    setSelectedOptions((current) => [
      ...current,
      {
        option,
        value,
      },
    ]);
  }

  function handleRemoveOption(option: ViewOption) {
    setSelectedOptions((current) =>
      current.filter((selected) => selected.option.id !== option.id),
    );
  }

  function handleOptionValueChange(
    option: ViewOption,
    value: string | number | undefined,
  ) {
    const normalizedValue = Number.isNaN(value) ? undefined : value;

    setSelectedOptions((current) =>
      current.map((selected) =>
        selected.option.id === option.id
          ? {
              ...selected,
              value: normalizedValue,
            }
          : selected,
      ),
    );
  }

  //   const activeOptions = selectedOptions.filter((selected) => {
  //     if (!selected.option.requiresValue) {
  //       return true;
  //     }

  //     return selected.value !== undefined && selected.value !== "";
  //   });

  return (
    <div className="builder">
      <FlagSearch value={searchText} onChange={setSearchText} />
      <FlagCategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onChange={setSelectedCategory}
      />
      <div className="legend">
        <div className="legend-item">
          <span className="swatch include"></span>Include (-f)
        </div>
        <div className="legend-item">
          <span className="swatch exclude"></span>Exclude (-F)
        </div>
        <div className="legend-item">
          <span className="swatch neutral"></span>Not applied
        </div>
        <span className="legend-hint">
          — click a flag to include, again to exclude, and again to clear
        </span>
      </div>

      <HiddenFlags flags={hiddenFlags} onRestore={handleRestoreFlag} />

      <FlagGroups
        flags={filteredFlags}
        categories={categories}
        getState={getFlagState}
        onCycle={handleCycleFlag}
        onHide={handleHideFlag}
      />

      <Options
        availableOptions={viewOptions}
        selectedOptions={selectedOptions}
        onAdd={handleAddOption}
        onRemove={handleRemoveOption}
        onValueChange={handleOptionValueChange}
      />
    </div>
  );
}
