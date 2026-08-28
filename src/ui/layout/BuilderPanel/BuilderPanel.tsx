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
import Presets from "../../FilterPresets/Presets";
import { FilterPresetCatalog } from "../../../domain/services/filtering/FilterPresetCatalog";
import Utility from "../../Utility/Utility";

const samFlagCatalog = new SamFlagCatalog();
const viewOptionCatalog = new ViewOptionCatalog();

interface BuilderPanelProps {
  flagFilter: FlagFilter;
  setFlagFilter: React.Dispatch<React.SetStateAction<FlagFilter>>;
  selectedOptions: SelectedViewOption[];
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<SelectedViewOption[]>
  >;
  setHighlightedKeys: React.Dispatch<React.SetStateAction<string[]>>;
  hiddenFlags: SamFlag[];
  setHiddenFlags: React.Dispatch<React.SetStateAction<SamFlag[]>>;
  onResetAll: () => void;
}

export default function BuilderPanel({
  flagFilter,
  setFlagFilter,
  selectedOptions,
  setSelectedOptions,
  setHighlightedKeys,
  hiddenFlags,
  setHiddenFlags,
  onResetAll,
}: BuilderPanelProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const flagPresetCatalog = new FilterPresetCatalog(samFlagCatalog);
  const flags = samFlagCatalog.getAll();
  const viewOptions = viewOptionCatalog.getAll();

  const normalizedSearch = searchText.trim().toLowerCase();

  const categories = [
    "All",
    ...Array.from(new Set(flags.map((flag) => flag.category))),
  ];

  const filteredFlags = flags.filter((flag) => {
    if (hiddenFlags.some((hiddenFlag) => hiddenFlag.id === flag.id))
      return false;

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
      setHighlightedKeys(["f"]);
    }

    if (currentState === "include") {
      setFlagFilter(
        createFlagFilter(
          flagFilter.includedFlags.filter((f) => f.id !== flag.id),
          [...flagFilter.excludedFlags, flag],
        ),
      );
      setHighlightedKeys(["F"]);
    }

    if (currentState === "exclude") {
      setFlagFilter(
        createFlagFilter(
          flagFilter.includedFlags,
          flagFilter.excludedFlags.filter((f) => f.id !== flag.id),
        ),
      );
      setHighlightedKeys(["F"]);
    }
  }

  function handleHideFlag(flag: SamFlag) {
    setFlagFilter(
      createFlagFilter(
        flagFilter.includedFlags.filter((f) => f.id !== flag.id),
        flagFilter.excludedFlags.filter((f) => f.id !== flag.id),
      ),
    );

    setHiddenFlags((current) =>
      current.some((hiddenFlags) => hiddenFlags.id === flag.id)
        ? current
        : [...current, flag],
    );
  }

  const currentHiddenFlags = flags.filter((flag) =>
    hiddenFlags.some((hf) => hf.id === flag.id),
  );

  function handleRestoreFlag(flag: SamFlag) {
    setHiddenFlags((current) =>
      current.filter((hiddenFlags) => hiddenFlags.id !== flag.id),
    );
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

    if (option.requiresValue) {
      if (value !== undefined || value !== "")
        setHighlightedKeys([`opt-${option.id}`]);
    } else {
      setHighlightedKeys([`opt-${option.id}`]);
    }
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
    setHighlightedKeys([`opt-${option.id}`]);
  }

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

      <Presets
        flagFilter={flagFilter}
        catalog={flagPresetCatalog}
        onPresetSelected={(preset) => {
          setFlagFilter(preset.filter);
        }}
      />

      <Utility onResetAll={onResetAll} />

      <HiddenFlags flags={currentHiddenFlags} onRestore={handleRestoreFlag} />

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
