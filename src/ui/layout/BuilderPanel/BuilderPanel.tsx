import React, { useState } from "react";
import "./BuilderPanel.css";
import FlagSearch from "../../Flags/FlagSearch";
import { SamFlagCatalog } from "../../../domain/services/samFlags/SamFlagCatalog";

const samFlagCatalog = new SamFlagCatalog();

export default function BuilderPanel() {
  const [searchText, setSearchText] = useState("");

  const flags = samFlagCatalog.getAll();

  const normalizedSearch = searchText.trim().toLowerCase();

  const filteredFlags = flags.filter((flag) => {
    if (!normalizedSearch) {
      return true;
    }

    return [
      flag.name,
      flag.description,
      flag.category,
      flag.hex,
      flag.value.toString(),
    ].some((value) => value.toLowerCase().includes(normalizedSearch));
  });

  console.log(filteredFlags);

  return (
    <div className="builder">
      <FlagSearch value={searchText} onChange={setSearchText} />
    </div>
  );
}
