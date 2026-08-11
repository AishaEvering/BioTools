import {describe, expect, it} from "vitest";
import {SamFlagCatalog} from "./SamFlagCatalog";

describe("SamFlagCatalog", () => {
    const catalog = new SamFlagCatalog();

    describe("getAll", () => {
        it("returns all SAM flags", () => {
            const flags = catalog.getAll();
            expect(flags).toHaveLength(12);
        });

        it("contains unique BioTools IDs", () => {
            const flags = catalog.getAll();
            const ids = flags.map(flag => flag.id);

            expect(new Set(ids).size).toBe(ids.length);
        });
    });

    describe("getFlagById", () => {
        it("returns the SAM flag with the requested ID", () => {
            const flag = catalog.getFlagById(101);
            expect(flag?.name).toBe("Proper Pair");
        });

        it("returns undefined when the id does not exist", () => {
            const flag = catalog.getFlagById(999);
            expect(flag).toBeUndefined();
        });
    });
});