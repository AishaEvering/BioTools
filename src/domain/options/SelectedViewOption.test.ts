
import { describe, expect, it } from "vitest";
import { hasSelectedOptionValue } from "./SelectedViewOption";

describe("hasSelectedOptionValue", () => {
    it("returns false for undefined", () => {
        expect(hasSelectedOptionValue(undefined)).toBe(false);
    });

    it("returns false for NaN", () => {
        expect(hasSelectedOptionValue(NaN)).toBe(false);
    });

    it("returns false for an empty string", () => {
        expect(hasSelectedOptionValue("")).toBe(false);
    });

    it("returns false for whitespace", () => {
        expect(hasSelectedOptionValue("   ")).toBe(false);
    });

    it("returns true for a string value", () => {
        expect(hasSelectedOptionValue("BAM")).toBe(true);
    });

    it("returns true for a numeric value", () => {
        expect(hasSelectedOptionValue(0)).toBe(true);
    });
});
