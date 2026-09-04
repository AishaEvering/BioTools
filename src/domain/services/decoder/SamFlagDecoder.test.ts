import {describe, expect, it} from "vitest";
import { SamFlagDecoder } from "./SamFlagDecoder";
import { SamFlagCatalog } from "../samFlags/SamFlagCatalog";

describe("SamFlagDecoder", () => {
    const samFlagCatalog = new SamFlagCatalog();
    const samFlagDecoder = new SamFlagDecoder(samFlagCatalog);
    
    it("0 input returns no matched flags, no unknown bits", () => {
        const result = samFlagDecoder.decode("0");
        expect(result.matched).toEqual([]);
        expect(result.unknownBits).toEqual([]);
        expect(result.isValid).toBe(true);
    });

    it("3 input returns Read Paired and Proper pair flags, no unknown bits", () => {
        const result = samFlagDecoder.decode("3");
        expect(result.matched.map(flag => flag.value)).toEqual([1, 2]);
        expect(result.unknownBits).toEqual([]);
        expect(result.isValid).toBe(true);
    });

    it("350 input returns all expected flags, no unknown bits", () => {
        const result = samFlagDecoder.decode("350");
        
        // Proper pair, Read unmapped, Mate unmapped, Reverse strand, 
        // First in pair, Secondary alignment.
        expect(result.matched.map(flag => flag.value)).toEqual([2, 4, 8, 16, 64, 256]);
        expect(result.unknownBits).toEqual([]);
        expect(result.isValid).toBe(true);
    });

    it("-1 input returns an error", () => {
        const result = samFlagDecoder.decode("-1");
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Enter a non-negative whole number.");
    });

    it("non-integer input returns an error", () => {
        const result = samFlagDecoder.decode("3.5");
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Enter a non-negative whole number.");
    });

    it("non-numeric input returns an error", () => {
        const result = samFlagDecoder.decode("abc");
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Enter a non-negative whole number.");
    });

    it("empty input returns an error", () => {
        const result = samFlagDecoder.decode("");
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Enter a non-negative whole number.");
    });

    it("whitespace input returns an error", () => {
        const result = samFlagDecoder.decode(" ");
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Enter a non-negative whole number.");
    });

    it("input with unknown bits returns those bits in unknownBits", () => {
        const result = samFlagDecoder.decode("4106"); // 4096 is not defined in the catalog
        expect(result.matched.map(flag => flag.value)).toEqual([2, 8]);
        expect(result.unknownBits).toEqual([4096]);
        expect(result.isValid).toBe(true);
    });

    it("trims whitespace from input before processing", () => {
        const result = samFlagDecoder.decode(" 3 ");
        expect(result.matched.map(flag => flag.value)).toEqual([1, 2]);
        expect(result.unknownBits).toEqual([]);
        expect(result.isValid).toBe(true);
    });
});