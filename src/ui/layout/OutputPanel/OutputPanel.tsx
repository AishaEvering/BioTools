import { useState } from "react";
import "./OutputPanel.css";
import InputFile from "../../InputFile/InputFile";
import { SamFlagCatalog } from "../../../domain/services/samFlags/SamFlagCatalog";
import type { FlagFilter } from "../../../domain/filtering/FlagFilter";
import BitMaskBar from "../../BitMaskBar/BitMaskBar";

interface OutputPanelProps {
  flagFilter: FlagFilter;
}

const samFlagCatalog = new SamFlagCatalog();

export default function OutputPanel({ flagFilter }: OutputPanelProps) {
  const [inputFile, setInputFile] = useState("");
  const flags = samFlagCatalog.getAll();

  return (
    <div className="output-panel">
      <div className="op-head">
        <h2>Flag bitmask</h2>
      </div>
      <BitMaskBar flags={flags} flagFilter={flagFilter} />
      <InputFile value={inputFile} onChange={setInputFile} />
    </div>
  );
}
