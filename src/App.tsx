import TopBar from "./ui/layout/TopBar/TopBar";
import "./styles/global.css";
import BuilderPanel from "./ui/layout/BuilderPanel/BuilderPanel";
import OutputPanel from "./ui/layout/OutputPanel/OutputPanel";
import { createFlagFilter } from "./domain/services/filtering/CreateFlagFilter";
import { useState } from "react";
import type { FlagFilter } from "./domain/filtering/FlagFilter";
import BottomBar from "./ui/layout/BottomBar/BottomBar";
import type { SelectedViewOption } from "./domain/options/SelectedViewOption";
import type { SamFlag } from "./domain/sam/SamFlag";

function App() {
  const [flagFilter, setFlagFilter] = useState<FlagFilter>(
    createFlagFilter([], []),
  );

  const [selectedOptions, setSelectedOptions] = useState<SelectedViewOption[]>(
    [],
  );

  const [highlightedKeys, setHighlightedKeys] = useState<string[]>([]);
  const [hiddenFlags, setHiddenFlags] = useState<SamFlag[]>([]);

  return (
    <>
      <TopBar />

      <main className="workspace">
        <BuilderPanel
          flagFilter={flagFilter}
          setFlagFilter={setFlagFilter}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          setHighlightedKeys={setHighlightedKeys}
          hiddenFlags={hiddenFlags}
          setHiddenFlags={setHiddenFlags}
        />
        <OutputPanel
          flagFilter={flagFilter}
          selectedOptions={selectedOptions}
          setHighlightedKeys={setHighlightedKeys}
          highlightedKeys={highlightedKeys}
          hiddenFlags={hiddenFlags}
        />
      </main>

      <BottomBar />
    </>
  );
}

export default App;
