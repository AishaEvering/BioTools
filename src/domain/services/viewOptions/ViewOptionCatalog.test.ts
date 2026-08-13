import { describe, expect, it } from "vitest";
import { ViewOptionCatalog } from "./ViewOptionCatalog";

describe("ViewOptionCatalog", () => {
  const catalog = new ViewOptionCatalog();

  it("returns all view options", () => {
    const options = catalog.getAll();
    expect(options).toHaveLength(6);
  });

  it("returns a view option by id", () => {
    const option = catalog.getViewOptionById(202);

    expect(option).toBeDefined();
    expect(option?.name).toBe("Minimum Mapping Quality");
    expect(option?.syntax).toBe("-q");
    expect(option?.requiresValue).toBe(true);
    expect(option?.constraints?.type).toBe("integer");
    expect(option?.constraints?.minimum).toBe(0);
  });

  it("returns undefined when a view option id is not found", () => {
    const option = catalog.getViewOptionById(999);

    expect(option).toBeUndefined();
  });
});