import type { SamFlag } from "../../domain/sam/SamFlag";
import HiddenFlag from "./HiddenFlag";
import "./HiddenFlags.css";

interface HiddenFlagsProps {
  readonly flags: readonly SamFlag[];
  readonly onRestore: (flag: SamFlag) => void;
}

export default function HiddenFlags({ flags, onRestore }: HiddenFlagsProps) {
  if (flags.length === 0) {
    return null;
  }

  return (
    <div className="hidden-bar">
      <span className="hb-label">Hidden flags - click to restore</span>

      {flags.map((flag) => (
        <HiddenFlag key={flag.id} flag={flag} onRestore={onRestore} />
      ))}
    </div>
  );
}
