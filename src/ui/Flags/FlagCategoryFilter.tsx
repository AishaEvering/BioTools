import "./FlagCategoryFilter.css";

interface FlagCategoryFilterProps {
  readonly categories: readonly string[];
  readonly selectedCategory: string;
  readonly onChange: (category: string) => void;
}

export default function FlagCategoryFilter({
  categories,
  selectedCategory,
  onChange,
}: FlagCategoryFilterProps) {
  return (
    <div className="flag-category-filters">
      {categories.map((category) => (
        <button
          key={category}
          className={
            selectedCategory === category
              ? "category-button active"
              : "category-button"
          }
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
