import TopBar from "./ui/layout/TopBar/TopBar";
import "./styles/global.css";
import BuilderPanel from "./ui/layout/BuilderPanel/BuilderPanel";
import OutputPanel from "./ui/layout/OutputPanel/OutputPanel";
import { createFlagFilter } from "./domain/services/filtering/CreateFlagFilter";
import { useState } from "react";
import type { FlagFilter } from "./domain/filtering/FlagFilter";

function App() {
  const [flagFilter, setFlagFilter] = useState<FlagFilter>(
    createFlagFilter([], []),
  );

  return (
    <>
      <TopBar />

      <main className="workspace">
        <BuilderPanel flagFilter={flagFilter} setFlagFilter={setFlagFilter} />
        <OutputPanel flagFilter={flagFilter} />
      </main>
    </>
  );
}

export default App;
