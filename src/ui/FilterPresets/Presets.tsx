import "./Presets.css";
import type { FlagFilter } from "../../domain/filtering/FlagFilter";
import type { FilterPreset } from "../../domain/filtering/FilterPreset";
import type { FilterPresetCatalog } from "../../domain/services/filtering/FilterPresetCatalog";

interface PresetProps {
  flagFilter: FlagFilter;
  catalog: FilterPresetCatalog;
  onPresetSelected: (preset: FilterPreset) => void;
}

export default function Presets({
  flagFilter,
  catalog,
  onPresetSelected,
}: PresetProps) {
  const presets = catalog.getAll();
  const activePreset = catalog.findMatching(flagFilter);

  return (
    <div className="preset-row">
      <span className="preset-label">Presets</span>

      <div className="presets-group">
        {presets.map((preset) => {
          const active = preset.id === activePreset?.id;

          return (
            <button
              key={preset.id}
              type="button"
              className={`preset-chip${active ? " applied" : ""}`}
              onClick={() => onPresetSelected(preset)}
            >
              {active && "✓ "}
              {preset.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
