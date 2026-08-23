import "./InputFile.css";
import { DEFAULT_INPUT_FILE } from "../../domain/services/command/SamViewCommandRenderer";

interface InputFileProps {
  value: string;
  onChange: (value: string) => void;
}

export default function InputFile({ value, onChange }: InputFileProps) {
  return (
    <div className="file-field">
      <label htmlFor="inputFileInput">Input file</label>
      <div className="file-input-row">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
          <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V8l-6-5z" />
          <path d="M14 3v5h5" />
        </svg>
        <input
          type="text"
          id="inputFileInput"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={DEFAULT_INPUT_FILE}
          title={value}
        />
      </div>
      <div className="file-msg" id="fileMsg"></div>
    </div>
  );
}
