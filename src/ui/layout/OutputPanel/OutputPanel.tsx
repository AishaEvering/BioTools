import { useState } from "react";
import "./OutputPanel.css";
import InputFile from "../../InputFile/InputFile";
import { SamFlagCatalog } from "../../../domain/services/samFlags/SamFlagCatalog";
import type { FlagFilter } from "../../../domain/filtering/FlagFilter";
import BitMaskBar from "../../BitMaskBar/BitMaskBar";
import ActiveFlags from "../../ActiveFlags/ActiveFlags";
import Command from "../../Command/Command";
import type { SelectedViewOption } from "../../../domain/options/SelectedViewOption";
import type { SamViewCommand } from "../../../domain/command/SamViewCommand";
import { ViewOptionCatalog } from "../../../domain/services/viewOptions/ViewOptionCatalog";
import { RuleCatalog } from "../../../domain/services/rules/RuleCatalog";
import { RuleEngine } from "../../../domain/services/rules/RuleEngine";
import { ExplanationEngine } from "../../../domain/services/explanation/ExplanationEngine";
import Explanations from "../../Explanations/Explanations";

interface OutputPanelProps {
  flagFilter: FlagFilter;
  selectedOptions: SelectedViewOption[];
  setHighlightedKeys: React.Dispatch<React.SetStateAction<string[]>>;
  highlightedKeys: string[];
}

const samFlagCatalog = new SamFlagCatalog();
const viewOptionCatalog = new ViewOptionCatalog();
const explanationEngine = new ExplanationEngine();
const ruleCatalog = new RuleCatalog(samFlagCatalog, viewOptionCatalog);

export default function OutputPanel({
  flagFilter,
  selectedOptions,
  setHighlightedKeys,
  highlightedKeys,
}: OutputPanelProps) {
  const [inputFile, setInputFile] = useState("");
  const flags = samFlagCatalog.getAll();

  function handleInputFileChange(value: string) {
    setInputFile(value);
    setHighlightedKeys(["file"]);
  }

  const command: SamViewCommand = {
    flagFilter,
    options: selectedOptions,
    inputFile,
  };

  const ruleEngine = new RuleEngine(ruleCatalog);
  const rules = ruleEngine.evaluate(command);
  const explanations = explanationEngine.explain(command, rules);

  return (
    <div className="output-panel">
      <div className="op-head">
        <h2>Flag bitmask</h2>
      </div>
      <BitMaskBar flags={flags} flagFilter={flagFilter} />
      <InputFile value={inputFile} onChange={handleInputFileChange} />
      <ActiveFlags flags={flags} flagFilter={flagFilter} />
      <Command
        command={command}
        setHighlightedKeys={setHighlightedKeys}
        highlightedKeys={highlightedKeys}
      />
      <Explanations explanations={explanations} />
    </div>
  );
}
