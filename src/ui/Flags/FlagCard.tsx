import "./FlagCard.css";
import type { SamFlag } from "../../domain/sam/SamFlag";
import { useEffect, useState } from "react";

export type FlagSelectionState = "include" | "exclude" | "none";

interface FlagCardProps {
  readonly flag: SamFlag;
  readonly state: FlagSelectionState;
  readonly onCycle: (flag: SamFlag) => void;
  readonly onHide: (flag: SamFlag) => void;
}

export default function FlagCard({
  flag,
  state,
  onCycle,
  onHide,
}: FlagCardProps) {
  const [flashState, setFlashState] = useState<FlagSelectionState | null>(null);

  useEffect(() => {
    if (!flashState) {
      return;
    }

    const timer = window.setTimeout(() => {
      setFlashState(null);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [flashState]);

  function handleCycle() {
    const nextState =
      state === "none" ? "include" : state === "include" ? "exclude" : "none";

    setFlashState(nextState);
    onCycle(flag);
  }

  const stateClass = state === "none" ? "" : state;

  return (
    <div
      className={`flag-card ${stateClass}`}
      role="button"
      tabIndex={0}
      onClick={handleCycle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCycle();
        }
      }}
    >
      <span className="label">{flag.name}</span>
      <span className="bit">bit {flag.value}</span>
      <button
        type="button"
        className="card-remove"
        title={`Hide ${flag.name}`}
        aria-label={`Hide ${flag.name}`}
        onClick={(event) => {
          event.stopPropagation();
          onHide(flag);
        }}
      >
        ×
      </button>
      <span
        className={[
          "flash",
          flashState ? "show" : "",
          flashState
            ? `flash-${flashState === "none" ? "off" : flashState}`
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {flashState === "include"
          ? "Include"
          : flashState === "exclude"
            ? "Exclude"
            : flashState === "none"
              ? "Cleared"
              : ""}
      </span>
    </div>
  );
}
