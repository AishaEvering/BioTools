import "./FlagGroups.css";
import type { SamFlag } from "../../domain/sam/SamFlag";
import type { FlagSelectionState } from "./FlagCard";
import FlagCard from "./FlagCard";

interface FlagGroupsProps {
  readonly flags: readonly SamFlag[];
  readonly categories: readonly string[];
  readonly getState: (flag: SamFlag) => FlagSelectionState;
  readonly onCycle: (flag: SamFlag) => void;
  readonly onHide: (flag: SamFlag) => void;
}

export default function FlagGroups({
  flags,
  categories,
  getState,
  onCycle,
  onHide,
}: FlagGroupsProps) {
  if (flags.length === 0) {
    return <p className="no-flags-message">No flags match your search.</p>;
  }
  return (
    <>
      {categories
        .filter((category) => category !== "All")
        .map((category) => {
          const categoryFlags = flags.filter(
            (flag) => flag.category === category,
          );

          if (categoryFlags.length === 0) {
            return null;
          }

          return (
            <section key={category} className="cat-group">
              <div className="cat-heading">
                <h2>{category}</h2>
                <div className="rule" />
              </div>

              <div className="card-grid">
                {categoryFlags.map((flag) => (
                  <FlagCard
                    key={flag.id}
                    flag={flag}
                    state={getState(flag)}
                    onCycle={onCycle}
                    onHide={onHide}
                  />
                ))}
              </div>
            </section>
          );
        })}
    </>
  );
}
