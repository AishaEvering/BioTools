import { useState } from "react";
import "./OutputPanel.css";
import InputFile from "../../InputFile/InputFile";

export default function OutputPanel() {
  const [inputFile, setInputFile] = useState("");

  return (
    <div className="output-panel">
      <InputFile value={inputFile} onChange={setInputFile} />
    </div>
  );
}
