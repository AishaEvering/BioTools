import type { SamFlag } from "../../domain/sam/SamFlag";
import "./HiddenFlag.css";

interface HiddenFlagProps {
  readonly flag: SamFlag;
  readonly onRestore: (flag: SamFlag) => void;
}

export default function HiddenFlag({ flag, onRestore }: HiddenFlagProps) {
  return (
    <button
      type="button"
      className="hidden-card"
      onClick={() => onRestore(flag)}
    >
      + {flag.name}
    </button>
  );
}
