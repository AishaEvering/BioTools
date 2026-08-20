import "./BitMaskBar.css";
import type { FlagFilter } from "../../domain/filtering/FlagFilter";
import type { SamFlag } from "../../domain/sam/SamFlag";
import BitMask from "./BitMask";

interface BitMaskBarProps {
  flags: readonly SamFlag[];
  flagFilter: FlagFilter;
}

export default function BitMaskBar({ flags, flagFilter }: BitMaskBarProps) {
  const sortedFlags = [...flags].sort((a, b) => b.value - a.value);

  return (
    <div className="bitstrip">
      {sortedFlags.map((flag) => {
        const isIncluded = flagFilter.includedFlags.some(
          (includedFlag) => includedFlag.id == flag.id,
        );
        const isExcluded = flagFilter.excludedFlags.some(
          (excludedFlag) => excludedFlag.id === flag.id,
        );

        const state = isIncluded
          ? "include"
          : isExcluded
            ? "exclude"
            : undefined;

        return <BitMask key={flag.id} flag={flag} state={state} />;
      })}
    </div>
  );
}
