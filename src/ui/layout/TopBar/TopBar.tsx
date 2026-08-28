import Feedback from "./Feedback";
import "./TopBar.css";

export default function TopBar() {
  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand">
          <span className="mark">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="var(--terminal-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M8 6L3 12L8 18" />
              <path d="M16 6L21 12L16 18" />
              <path d="M14 4L10 20" />
            </svg>
          </span>
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
