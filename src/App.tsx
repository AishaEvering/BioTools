import TopBar from "./ui/layout/TopBar/TopBar";
import "./styles/global.css";
import BuilderPanel from "./ui/layout/BuilderPanel/BuilderPanel";
import OutputPanel from "./ui/layout/OutputPanel/OutputPanel";

function App() {
  return (
    <>
      <TopBar />

      <main className="workspace">
        <BuilderPanel />
        <OutputPanel />
      </main>
    </>
  );
}

export default App;
