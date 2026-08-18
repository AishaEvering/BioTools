import React from "react";
import "./FlagSearch.css";

interface FlagSearchProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export default function FlagSearch({ value, onChange }: FlagSearchProps) {
  return (
    <div className="search">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <input
        type="search"
        id="searchInput"
        onChange={(event) => onChange(event.target.value)}
        value={value}
        placeholder="Search flags, e.g. duplicate, secondary, paired"
      />
    </div>
  );
}
