import "./BitMask.css";
import type { SamFlag } from "../../domain/sam/SamFlag";

interface BitMaskProps {
  readonly flag: SamFlag;
  state?: "include" | "exclude";
  isHidden: boolean;
}

export default function BitMask({ flag, state, isHidden }: BitMaskProps) {
  return (
    <div className={`bit-cell ${state ?? ""}`} title={flag.name}>
      <div className={`bit-box ${isHidden ? "hidden-selected" : ""}`} />
      <div className="bit-val">{flag.value}</div>
    </div>
  );
}
