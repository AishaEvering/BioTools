import {describe, expect, it} from "vitest";
import {createFlagFilter} from "./CreateFlagFilter";
import { SamFlagCatalog } from "../samFlags/SamFlagCatalog";

describe("CreateFlagFilter", () => {
    const catalog = new SamFlagCatalog();

    it("creates an empty flag filter", () => {

        const filter = createFlagFilter(
            [],
            []
        );

        expect(filter.calculatedIncludeValue).toBe(0); 
        expect(filter.calculatedExcludeValue).toBe(0); 
    });

    it("creates a flag filter with single included flag", () => {
        const readPaired = catalog.getFlagById(100);

        if(!readPaired) {
            throw new Error("Required SAM flag was not found");
        }
  
        const filter = createFlagFilter(
            [readPaired],
            []
        );

        expect(filter.calculatedIncludeValue).toBe(1); 
        expect(filter.calculatedExcludeValue).toBe(0);
    });

    it("creates a flag filter with multiple included flags", () => {
        const readPaired = catalog.getFlagById(100);
        const properPair = catalog.getFlagById(101);

        if(!readPaired || !properPair) {
            throw new Error("Required SAM flags were not found");
        }
  
        const filter = createFlagFilter(
            [readPaired, properPair],
            []
        );

        expect(filter.calculatedIncludeValue).toBe(3); // 1 | 2 = 3
        expect(filter.calculatedExcludeValue).toBe(0);
    });

    it("creates a flag filter with single excluded flag", () => {
        const readPaired = catalog.getFlagById(100);

        if(!readPaired) {
            throw new Error("Required SAM flag was not found");
        }
  
        const filter = createFlagFilter(
            [],
            [readPaired]
        );

        expect(filter.calculatedIncludeValue).toBe(0);
        expect(filter.calculatedExcludeValue).toBe(1); 
    });

    it("creates a flag filter with multiple excluded flags", () => {
        const readPaired = catalog.getFlagById(100);
        const properPair = catalog.getFlagById(101);

        if(!readPaired || !properPair) {
            throw new Error("Required SAM flags were not found");
        }
  
        const filter = createFlagFilter(
            [],
            [readPaired, properPair]
        );

        expect(filter.calculatedIncludeValue).toBe(0);
        expect(filter.calculatedExcludeValue).toBe(3); // 1 | 2 = 3
    });

    it("creates a flag filter with included and excluded flags", () => {
        const readPaired = catalog.getFlagById(100);
        const properPair = catalog.getFlagById(101);
        const duplicate = catalog.getFlagById(110);

        if(!readPaired || !properPair || !duplicate) {
            throw new Error("Required SAM flags were not found");
        }
  
        const filter = createFlagFilter(
            [readPaired, properPair],
            [duplicate]
        );

        expect(filter.calculatedIncludeValue).toBe(3); // 1 | 2 = 3
        expect(filter.calculatedExcludeValue).toBe(1024); 
    });
});