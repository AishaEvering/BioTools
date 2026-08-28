import "./Utility.css";

interface UtilityProps {
  readonly onResetAll: () => void;
}

export default function Utility({ onResetAll }: UtilityProps) {
  return (
    <div className="utility-row">
      <button type="button" className="utility-btn" onClick={onResetAll}>
        ↺ Reset all
      </button>
    </div>
  );
}
