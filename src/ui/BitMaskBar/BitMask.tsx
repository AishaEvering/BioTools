import "./BitMask.css";
import type { SamFlag } from "../../domain/sam/SamFlag";

interface BitMaskProps {
  readonly flag: SamFlag;
  state?: "include" | "exclude";
}

export default function BitMask({ flag, state }: BitMaskProps) {
  return (
    <div className={`bit-cell ${state ?? ""}`} title={flag.name}>
      <div className="bit-box" />
      <div className="bit-val">{flag.value}</div>
    </div>
  );
}
