import React, { useState } from "react";
import "./BuilderPanel.css";
import FlagSearch from "../../Flags/FlagSearch";
import { SamFlagCatalog } from "../../../domain/services/samFlags/SamFlagCatalog";
import FlagCategoryFilter from "../../Flags/FlagCategoryFilter";

const samFlagCatalog = new SamFlagCatalog();

export default function BuilderPanel() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const flags = samFlagCatalog.getAll();

  const normalizedSearch = searchText.trim().toLowerCase();

  const categories = [
    "All",
    ...Array.from(new Set(flags.map((flag) => flag.category))),
  ];

  const filteredFlags = flags.filter((flag) => {
    const matchedSearch =
      !normalizedSearch ||
      [
        flag.name,
        flag.description,
        flag.category,
        flag.hex,
        flag.value.toString(),
      ].some((value) => value.toLowerCase().includes(normalizedSearch));

    const matchesCategory =
      selectedCategory === "All" || flag.category === selectedCategory;

    return matchedSearch && matchesCategory;
  });

  console.log(filteredFlags);

  return (
    <div className="builder">
      <FlagSearch value={searchText} onChange={setSearchText} />
      <FlagCategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onChange={setSelectedCategory}
      />
    </div>
  );
}
