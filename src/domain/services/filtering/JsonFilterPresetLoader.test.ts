import {describe, expect, it} from "vitest";
import { SamFlagCatalog } from "../samFlags/SamFlagCatalog";
import { JsonFilterPresetLoader } from "./JsonFilterPresetLoader";



describe("JsonFilterPresetLoader", () => {
    const flagCatalog = new SamFlagCatalog();
    const loader = new JsonFilterPresetLoader(flagCatalog);
    const filterPresets = loader.load();

    it("loads all filter preset definitions", () => {
    expect(filterPresets).toHaveLength(7);
    });

    it("resolves flag identifiers for properly paired reads", () => {
        const filterPreset = filterPresets.find(preset => preset.id === 400)!;

        expect(filterPreset.name).toBe("Properly Paired Reads");
        expect(filterPreset.filter.excludedFlags).toHaveLength(0);
        expect(filterPreset.filter.includedFlags).toHaveLength(2);
        expect(filterPreset.filter.includedFlags[0].id).toBe(100);
        expect(filterPreset.filter.includedFlags[1].id).toBe(101);
    });
    
    it("resolves flag identifiers for primary alignments", () => {
        const filterPreset = filterPresets.find(preset => preset.id === 401)!;

        expect(filterPreset.name).toBe("Primary Alignments");
        expect(filterPreset.filter.includedFlags).toHaveLength(0);
        expect(filterPreset.filter.excludedFlags).toHaveLength(2);
        expect(filterPreset.filter.excludedFlags[0].id).toBe(108);
        expect(filterPreset.filter.excludedFlags[1].id).toBe(111);
    });

    it("resolves flag identifiers for mapped reads", () => {
        const filterPreset = filterPresets.find(preset => preset.id === 402)!;

        expect(filterPreset.name).toBe("Mapped Reads");
        expect(filterPreset.filter.includedFlags).toHaveLength(0);
        expect(filterPreset.filter.excludedFlags).toHaveLength(1);
        expect(filterPreset.filter.excludedFlags[0].id).toBe(102);
    });

    it("resolves flag identifiers for forward strand alignments", () => {
        const filterPreset = filterPresets.find(preset => preset.id === 404)!;

        expect(filterPreset.name).toBe("Forward Strand Alignments");
        expect(filterPreset.filter.includedFlags).toHaveLength(0);
        expect(filterPreset.filter.excludedFlags).toHaveLength(1);
        expect(filterPreset.filter.excludedFlags[0].id).toBe(104);
    });

    it("resolves flag identifiers for first in pair", () => {
        const filterPreset = filterPresets.find(preset => preset.id === 406)!;

        expect(filterPreset.name).toBe("First in Pair");
        expect(filterPreset.filter.includedFlags).toHaveLength(2);
        expect(filterPreset.filter.excludedFlags).toHaveLength(0);
        expect(filterPreset.filter.includedFlags[0].id).toBe(100);
        expect(filterPreset.filter.includedFlags[1].id).toBe(106);
    });

    it("resolves flag identifiers for second in pair", () => {
        const filterPreset = filterPresets.find(preset => preset.id === 407)!;

        expect(filterPreset.name).toBe("Second in Pair");
        expect(filterPreset.filter.includedFlags).toHaveLength(2);
        expect(filterPreset.filter.excludedFlags).toHaveLength(0);
        expect(filterPreset.filter.includedFlags[0].id).toBe(100);
        expect(filterPreset.filter.includedFlags[1].id).toBe(107);
    });


    it("resolves flag identifiers for non-duplicate reads", () => {
        const filterPreset = filterPresets.find(preset => preset.id === 409)!;

        expect(filterPreset.name).toBe("Non-Duplicate Reads");
        expect(filterPreset.filter.includedFlags).toHaveLength(0);
        expect(filterPreset.filter.excludedFlags).toHaveLength(1);
        expect(filterPreset.filter.excludedFlags[0].id).toBe(110);
    });


    it("throws when a referenced SAM flag does not exist", () => {
        const badFlagCatalog = {
            getFlagById: () => undefined,
        } as unknown as SamFlagCatalog;

        const loader = new JsonFilterPresetLoader(badFlagCatalog);

        expect(() => loader.load())
            .toThrow("Unknown SAM flag id: 100");
    });
});