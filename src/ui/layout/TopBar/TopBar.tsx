import React from "react";
import "./TopBar.css";

export default function TopBar() {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="mark">bt</span>
        <h1>Biotools</h1>
        <span className="crumbs">
          / <strong>SAM View Command Builder</strong>
        </span>
      </div>
      <div className="topbar-actions">{/* TODO: will add actions*/}</div>
    </header>
  );
}
