import "./ActiveFlag.css";
import type { SamFlag } from "../../domain/sam/SamFlag";

interface ActiveFlagProps {
  readonly flag: SamFlag;
  state?: "include" | "exclude";
}

export default function ActiveFlag({ flag, state }: ActiveFlagProps) {
  return (
    <div className={`mini-flag ${state ?? ""}`}>
      {(state === "include" ? "+" : "-") + " " + flag.name}
    </div>
  );
}
