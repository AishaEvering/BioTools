import Feedback from "./Feedback";
import "./TopBar.css";

export default function TopBar() {
  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand">
          <span className="mark">bt</span>
          <h1>Biotools</h1>
          <span className="crumbs">
            / <strong>SAM View Command Builder</strong>
          </span>
        </div>
        <div className="project-motto">
          Beautifully boring.
          <div className="project-motto-popover">
            Bioinformatics is complicated enough. BioTools aims to keep the
            software around it simple, predictable, and understandable.
          </div>
        </div>
      </div>
      <Feedback />
    </header>
  );
}
