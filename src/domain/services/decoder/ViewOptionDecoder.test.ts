import {describe, expect, it} from "vitest";
import { ViewOptionCatalog } from "../viewOptions/ViewOptionCatalog";
import { ViewOptionDecoder } from "./ViewOptionDecoder";

describe('ViewOptionDecoder', () => {  

    const viewOptionCatalog = new ViewOptionCatalog();
    const viewOptionDecoder = new ViewOptionDecoder(viewOptionCatalog);
        
    it('should decode a valid view option string', () => { 
        const result = viewOptionDecoder.decode("-h");
        expect(result.option?.option.id).toEqual(200);
        expect(result.option?.value).toEqual(undefined);
        expect(result.isValid).toBe(true);
    });

    it('should decode a valid view option string with a value', () => {
        const result = viewOptionDecoder.decode("-O", "CRAM");
        expect(result.option?.option.id).toEqual(203);
        expect(result.option?.value).toEqual("CRAM");
        expect(result.isValid).toBe(true);
    });

    it('should return an error for a view option that requires a value but none is provided', () => {
        const result = viewOptionDecoder.decode("-O");
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Option -O requires a value, but none was provided.");
    });

    it('should return an error for an invalid view option string', () => {
        const result = viewOptionDecoder.decode("-invalid");
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("BioTools does not recognize or support option: -invalid");
    }); 

    it("should return an error for an invalid enum value", () => {
        const result = viewOptionDecoder.decode("-O", "FASTQ");

        expect(result.isValid).toBe(false);
        expect(result.error).toBe(
            "Option -O requires a value from the following set: SAM, BAM, CRAM, but received: FASTQ"
        );
    });

    it("should return an error for a non-integer value", () => {
        const result = viewOptionDecoder.decode("-q", "20.5");

        expect(result.isValid).toBe(false);
        expect(result.error).toBe(
            "Option -q requires an integer value, but received: 20.5"
        );
    });

    it("should return an error for an integer outside the allowed range", () => {
        const result = viewOptionDecoder.decode("-q", "300");

        expect(result.isValid).toBe(false);
        expect(result.error).toBe(
            "Option -q requires a value less than or equal to 255, but received: 300"
        );
    });

    it("should decode a valid integer option value", () => {
        const result = viewOptionDecoder.decode("-q", "20");

        expect(result.isValid).toBe(true);
        expect(result.option?.option.id).toEqual(202);
        expect(result.option?.value).toEqual("20");
    });
});   