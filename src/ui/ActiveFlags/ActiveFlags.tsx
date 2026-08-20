import "./ActiveFlags.css";
import type { FlagFilter } from "../../domain/filtering/FlagFilter";
import type { SamFlag } from "../../domain/sam/SamFlag";
import ActiveFlag from "./ActiveFlag";

interface ActiveFlagsProps {
  flags: readonly SamFlag[];
  flagFilter: FlagFilter;
}

export default function ActiveFlags({ flags, flagFilter }: ActiveFlagsProps) {
  return (
    <div className="active-chips">
      {flags.map((flag) => {
        const isIncluded = flagFilter.includedFlags.some(
          (includedFlag) => includedFlag.id === flag.id,
        );

        const isExcluded = flagFilter.excludedFlags.some(
          (excludedFlag) => excludedFlag.id === flag.id,
        );

        if (!isIncluded && !isExcluded) {
          return null;
        }

        const state = isIncluded ? "include" : "exclude";

        return <ActiveFlag key={flag.id} flag={flag} state={state} />;
      })}
    </div>
  );
}
