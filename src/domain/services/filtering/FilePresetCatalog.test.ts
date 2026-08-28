import {describe, expect, it} from "vitest";
import { SamFlagCatalog } from "../samFlags/SamFlagCatalog";
import { FilterPresetCatalog } from "./FilterPresetCatalog";
import { createFlagFilter } from "./CreateFlagFilter";

describe("FilePresetCatalog", () => {
    const flagCatalog = new SamFlagCatalog();
    const catalog = new FilterPresetCatalog(flagCatalog);

    describe("getAll", () => {
        it("returns all filter presets", () => {
            const rules = catalog.getAll();
            expect(rules).toHaveLength(7);
        });

        it("contains unique filter preset IDs", () => {
            const rules = catalog.getAll();
            const ids = rules.map(rule => rule.id);

            expect(new Set(ids).size).toBe(ids.length);
        });
    });

    describe("getById", () => {
        it("returns the file preset with the requested ID", () => {
            const preset = catalog.getById(409);
            expect(preset?.id).toBe(409);
            expect(preset?.name).toBe("Non-Duplicate Reads");
        });

        it("returns undefined when the id does not exist", () => {
            const rule = catalog.getById(999);
            expect(rule).toBeUndefined();
        });
    });

    describe("findMatching", () => {

        const readPaired = flagCatalog.getFlagById(100);
        const properPair = flagCatalog.getFlagById(101);
        const firstInPair = flagCatalog.getFlagById(106);
        const duplicate = flagCatalog.getFlagById(110);
        const readUnmapped = flagCatalog.getFlagById(102);

        it("finds a preset with an exact matching filter included", () => {
            if(!readPaired || !properPair) {
                throw new Error("Required SAM flags was not found");
            }

            const filter = createFlagFilter(
                [readPaired, properPair],
                []
            );

            const preset = catalog.findMatching(filter);

            expect(preset?.id).toBe(400);
        });

        it("finds a preset with an exact matching filter excluded", () => {
            if(!duplicate) {
                throw new Error("Required SAM flags was not found");
            }

            const filter = createFlagFilter(
                [],
                [duplicate]
            );

            const preset = catalog.findMatching(filter);

            expect(preset?.id).toBe(409);
        });

        it("matches flags regardless of order", () => {
            if(!readPaired || !properPair) {
                throw new Error("Required SAM flags was not found");
            }

            const filter = createFlagFilter(
                [properPair, readPaired],
                []
            );

            const preset = catalog.findMatching(filter);

            expect(preset?.id).toBe(400);
        });

        it("does not match if all flags are not included", () => {
            if(!properPair) {
                throw new Error("Required SAM flags was not found");
            }

            const filter = createFlagFilter(
                [properPair],
                []
            );

            const preset = catalog.findMatching(filter);

            expect(preset).toBeUndefined();
        });

        it("does not match when additional flags are included", () => {
            if(!readPaired || !properPair || ! firstInPair) {
                throw new Error("Required SAM flags was not found");
            }

            const filter = createFlagFilter(
                [properPair, readPaired, firstInPair],
                []
            );

            const preset = catalog.findMatching(filter);

            expect(preset).toBeUndefined();
        });

        it("does not match when additional flags are excluded", () => {
            if(!duplicate|| !properPair) {
                throw new Error("Required SAM flags was not found");
            }

            const filter = createFlagFilter(
                [],
                [duplicate, properPair]
            );

            const preset = catalog.findMatching(filter);

            expect(preset).toBeUndefined();
        });

        it("does not match when a flag is on the wrong filter side", () => {
            if(!readUnmapped) {
                throw new Error("Required SAM flags was not found");
            }

            const filter = createFlagFilter(
                [],
                [readUnmapped]
            );
            
            const preset = catalog.findMatching(filter);

            expect(preset?.id).toBe(402); // Mapped Reads
        });
    });
});