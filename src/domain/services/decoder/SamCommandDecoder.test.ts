import {describe, expect, it} from "vitest";
import { SamFlagCatalog } from "../samFlags/SamFlagCatalog";
import { SamFlagDecoder } from "./SamFlagDecoder";
import { ViewOptionCatalog } from "../viewOptions/ViewOptionCatalog";
import { ViewOptionDecoder } from "./ViewOptionDecoder";
import { SamCommandDecoder } from "./SamCommandDecoder";

describe("SamCommandDecoder", () => {   
    const samFlagCatalog = new SamFlagCatalog();
    const viewOptionCatalog = new ViewOptionCatalog();

    const samFlagDecoder = new SamFlagDecoder(samFlagCatalog);
    const viewOptionDecoder = new ViewOptionDecoder(viewOptionCatalog);
    
    const samCommandDecoder = new SamCommandDecoder(samFlagDecoder, viewOptionDecoder);


    describe("Command Structure", () => {  
        it("should handle missing 'samtools' prefix gracefully", () => {
            const input = "view -f 3 -q 10 input.bam";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual(["Invalid command. Command must start with 'samtools view'."]);
            expect(result.skippedTokens).toEqual([]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.options.length).toBe(0);
            expect(result.command.flagFilter.includedFlags.length).toBe(0);
            expect(result.command.flagFilter.excludedFlags.length).toBe(0);
            expect(result.command.inputFile).toBe(undefined);
        });

        it("should handle missing 'view' prefix gracefully", () => {
            const input = "samtools -f 3 -q 10 input.bam";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual(["Invalid command. Command must start with 'samtools view'."]);
            expect(result.skippedTokens).toEqual([]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.options.length).toBe(0);
            expect(result.command.flagFilter.includedFlags.length).toBe(0);
            expect(result.command.flagFilter.excludedFlags.length).toBe(0);
            expect(result.command.inputFile).toBe(undefined);
        });

        it("should handle completely invalid command gracefully", () => {
            const input = "invalid command";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual(["Invalid command. Command must start with 'samtools view'."]);
            expect(result.skippedTokens).toEqual([]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.options.length).toBe(0);
            expect(result.command.flagFilter.includedFlags.length).toBe(0);
            expect(result.command.flagFilter.excludedFlags.length).toBe(0);
            expect(result.command.inputFile).toBe(undefined);
        });

        it("should handle empty command gracefully", () => {
            const input = "";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual(["Invalid command. Command must start with 'samtools view'."]);
            expect(result.skippedTokens).toEqual([]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.options.length).toBe(0);
            expect(result.command.flagFilter.includedFlags.length).toBe(0);
            expect(result.command.flagFilter.excludedFlags.length).toBe(0);
            expect(result.command.inputFile).toBe(undefined);
        });

        it("should handle command with only 'samtools view' and no flags, options, or input file", () => {
            const input = "samtools view";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.skippedTokens).toEqual([]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.options.length).toBe(0);
            expect(result.command.flagFilter.includedFlags.length).toBe(0);
            expect(result.command.flagFilter.excludedFlags.length).toBe(0);
            expect(result.command.inputFile).toBe(undefined);
        });

        it("should handle extra whitespace around a valid command", () => {
            const input = "   samtools   view   ";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
        });
    });

    describe("Flags", () => {  
        it("should decode included flags correctly", () => {
            const input = "samtools view -f 3";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.skippedTokens).toEqual([]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(3);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(0);
        });

        it("should decode excluded flags correctly", () => {
            const input = "samtools view -F 4";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.skippedTokens).toEqual([]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(0);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(4);
        });

        it("should decode both included and excluded flags correctly", () => {
            const input = "samtools view -f 3 -F 4";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.skippedTokens).toEqual([]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(3);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(4);
        });

        it("should handle invalid included flag values gracefully", () => {
            const input = "samtools view -f -1";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual(["Enter a non-negative whole number."]);
            expect(result.skippedTokens).toEqual(["-1"]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(0);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(0);
        });

        it("should handle invalid excluded flag values gracefully", () => {
            const input = "samtools view -F -1";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual(["Enter a non-negative whole number."]);
            expect(result.skippedTokens).toEqual(["-1"]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(0);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(0);
        });

        it("should handle missing flag values gracefully", () => {
            const input = "samtools view -f";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual(["Expected a value after -f, but got nothing."]);
            expect(result.skippedTokens).toEqual(["-f"]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(0);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(0);
        });
        
        it("should handle missing flag values when next token is another option gracefully", () => {
            const input = "samtools view -f -q 10";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual(["Expected a value after -f, but got -q."]);
            expect(result.skippedTokens).toEqual(["-f"]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(0);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(0);
        });

        it("should handle missing flag values when next token is another flag gracefully", () => {
            const input = "samtools view -f -F 10";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual(["Expected a value after -f, but got -F."]);
            expect(result.skippedTokens).toEqual(["-f"]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(0);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(10);
        });
        
        
        it("should handle missing flag values when next token is a negative integer gracefully", () => {
            const input = "samtools view -f -F -10";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual([
                "Expected a value after -f, but got -F.",
                "Enter a non-negative whole number."
            ]);
            expect(result.skippedTokens).toEqual(["-f", "-10"]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(0);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(0);
        });

        it("should handle included unknown flag bits gracefully", () => {
            const input = "samtools view -f 4106";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.skippedTokens).toEqual([]);
            expect(result.unknownIncludedBits).toEqual([4096]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(10);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(0);
        });

        it("should handle excluded unknown flag bits gracefully", () => {
            const input = "samtools view -F 4106";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.skippedTokens).toEqual([]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([4096]);

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(0);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(10);
        });

        it("should handle both included and excluded unknown flag bits gracefully", () => {
            const input = "samtools view -f 4106 -F 4106";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.skippedTokens).toEqual([]);
            expect(result.unknownIncludedBits).toEqual([4096]);
            expect(result.unknownExcludedBits).toEqual([4096]);

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(10);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(10);
        });
        
        it("should handle duplicate included and excluded unknown flag bits with valid bits gracefully", () => {
            const input = "samtools view -f 4106 -F 4106 -f 3 -F 4";
            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.skippedTokens).toEqual([]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(3); 
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(4); 
        });  
        
        it("should retain valid included flags when a later duplicate value is invalid", () => {
            const input = "samtools view -f 3 -f -1";

            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual(["Enter a non-negative whole number."]);
            expect(result.skippedTokens).toEqual(["-1"]);

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(3);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(0);
        });
    });

    describe("Options", () => {  
        it("should decode a single option without a value correctly", () => {
            const result = samCommandDecoder.decode(
                "samtools view -h input.bam"
            );

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.command.options).toHaveLength(1);
            expect(result.command.options[0].option.syntax).toBe("-h");
            expect(result.command.options[0].value).toBe(undefined);   
        });

        it("should decode a single option with a value correctly", () => {
            const result = samCommandDecoder.decode(
                "samtools view -q 10 input.bam"
            );

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.command.options).toHaveLength(1);
            expect(result.command.options[0].option.syntax).toBe("-q");
            expect(result.command.options[0].value).toBe("10");  
        });   

        it("should decode multiple options correctly", () => {
            const result = samCommandDecoder.decode(
                "samtools view -h -q 10 input.bam"
            );

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.command.options).toHaveLength(2);
            expect(result.command.options[0].option.syntax).toBe("-h");
            expect(result.command.options[0].value).toBe(undefined);
            expect(result.command.options[1].option.syntax).toBe("-q");
            expect(result.command.options[1].value).toBe("10");
        });

        it("should handle negative integer option values gracefully", () => {
            const result = samCommandDecoder.decode(
                "samtools view -q -10 input.bam"
            );

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual([
                "Option -q requires a value greater than or equal to 0, but received: -10",
            ]);
            expect(result.command.options).toHaveLength(0);
        });

        it("uses the last value when an option is repeated", () => {
            const result = samCommandDecoder.decode(
                "samtools view -q 10 -q 20 input.bam"
            );

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.command.options).toHaveLength(1);
            expect(result.command.options[0].option.syntax).toBe("-q");
            expect(result.command.options[0].value).toBe("20");
        });

        it("should handle invalid option values gracefully", () => {
            const result = samCommandDecoder.decode(
                "samtools view -q abc input.bam"
            );

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual(["Option -q requires an integer value, but received: abc"]);
            expect(result.skippedTokens).toEqual(["-q"]);
        });

        it("should handle missing option values gracefully", () => {
            const result = samCommandDecoder.decode(
                "samtools view -q input.bam"
            );

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual(["Option -q requires an integer value, but received: input.bam"]);
            expect(result.skippedTokens).toEqual(["-q"]);
        });

        it("should handle unknown options gracefully", () => {
            const result = samCommandDecoder.decode(
                "samtools view -z 10 input.bam"
            );

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual([
                "BioTools does not recognize or support option: -z",
                "Unexpected token: 10",
            ]);
            expect(result.skippedTokens).toEqual(["-z", "10"]);
        });

        it("should handle options with missing values gracefully", () => {
            const result = samCommandDecoder.decode(
                "samtools view -q -h input.bam"
            );

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual([
                "Option -q requires a value, but none was provided.",
            ]);
            expect(result.skippedTokens).toEqual(["-q"]);
        });

        it("should not duplicate options that do not require values", () => {
            const result = samCommandDecoder.decode(
                "samtools view -h -h input.bam"
            );

            expect(result.isValid).toBe(true);
            expect(result.command.options).toHaveLength(1);
            expect(result.command.options[0].option.syntax).toBe("-h");
        });

        it("should retain the last valid option when a later duplicate value is invalid", () => {
            const result = samCommandDecoder.decode(
                "samtools view -q 10 -q abc input.bam"
            );

            expect(result.isValid).toBe(false);
            expect(result.command.options).toHaveLength(1);
            expect(result.command.options[0].option.syntax).toBe("-q");
            expect(result.command.options[0].value).toBe("10");
        });

        it("should handle option values that have spaces and are quoted correctly", () => {
            const result = samCommandDecoder.decode(
                'samtools view -o "output file.bam" input.bam'
            );

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.command.options).toHaveLength(1);
            expect(result.command.options[0].option.syntax).toBe("-o");
            expect(result.command.options[0].value).toBe("output file.bam");
        });

    });

    describe("Input File", () => {  
        it("should decode the input file correctly", () => {
            const result = samCommandDecoder.decode(
                "samtools view -f 3 -q 10 input.bam"
            );

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.command.inputFile).toBe("input.bam");
        });

        it("should handle missing input file gracefully", () => {
            const result = samCommandDecoder.decode(
                "samtools view -f 3 -q 10"
            );

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.command.inputFile).toBe(undefined);
        });
        
        it("should handle multiple input files gracefully", () => {
            const result = samCommandDecoder.decode(
                "samtools view -f 3 -q 10 input1.bam input2.bam"
            );

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual(["Unexpected token: input1.bam"]);
            expect(result.skippedTokens).toEqual(["input1.bam"]);
            expect(result.command.inputFile).toBe("input2.bam");
        });

        it("should handle input files that look like options gracefully", () => {
            const result = samCommandDecoder.decode(
                "samtools view -f 3 -q 10 -input.bam"
            );

            expect(result.isValid).toBe(false);
            expect(result.skippedTokens).toEqual(["-input.bam"]);
            expect(result.errors).toEqual(["BioTools does not recognize or support option: -input.bam"]);
            expect(result.command.inputFile).toBe(undefined);

            expect(result.command.options.length).toBe(1);
            expect(result.command.options[0].option.syntax).toBe("-q");
            expect(result.command.options[0].value).toBe("10");

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(3);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(0);
        });

        it("should handle input file names with spaces gracefully", () => {
            const result = samCommandDecoder.decode(
                'samtools view -f 3 -q 10 "input file.bam"'
            );

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.command.inputFile).toBe("input file.bam");
        });

        it("should accept any positional token as the input file", () => {
            const result = samCommandDecoder.decode(
                "samtools view reads.cram"
            );

            expect(result.isValid).toBe(true);
            expect(result.command.inputFile).toBe("reads.cram");
        });
    });

    describe("Complete Command", () => {          
        it("should decode a simple samtools command with flags and options", () => {
            // Arrange
            const input = "samtools view -f 3 -q 10 input.bam";

            // Act
            const result = samCommandDecoder.decode(input);

            // Assert
            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.skippedTokens).toEqual([]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);


            expect(result.command.options.length).toBe(1);
            expect(result.command.options[0].option.syntax).toBe("-q");
            expect(result.command.options[0].value).toBe("10");

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(3);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(0);
            expect(result.command.inputFile).toBe("input.bam");
        });

        it("should decode a complex samtools command with multiple flags and options", () => {
            const input = "samtools view -f 3 -F 4 -q 10 -h input.bam";

            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.skippedTokens).toEqual([]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.options.length).toBe(2);
            expect(result.command.options[0].option.syntax).toBe("-q");
            expect(result.command.options[0].value).toBe("10");
            expect(result.command.options[1].option.syntax).toBe("-h");
            expect(result.command.options[1].value).toBe(undefined);

            expect(result.command.flagFilter.calculatedIncludeValue).toBe(3);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(4);
            expect(result.command.inputFile).toBe("input.bam");
        });

        it("should handle a command with unknown flags and options gracefully", () => {
            const input = "samtools view -f 3 -F 9999 -z 10 input.bam";

            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual([
                "BioTools does not recognize or support option: -z",
                "Unexpected token: 10",
            ]);
            expect(result.skippedTokens).toEqual(["-z", "10"]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([8192]);

            expect(result.command.options.length).toBe(0);
            expect(result.command.flagFilter.calculatedIncludeValue).toBe(3);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(1807);
            expect(result.command.inputFile).toBe("input.bam");
        });    
        
        it("should handle a command with invalid flags and options gracefully", () => {
            const input = "samtools view -f -1 -q abc input.bam";

            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual([
                "Enter a non-negative whole number.",
                "Option -q requires an integer value, but received: abc",
            ]);
            expect(result.skippedTokens).toEqual(["-1", "-q"]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.options.length).toBe(0);
            expect(result.command.flagFilter.calculatedIncludeValue).toBe(0);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(0);
            expect(result.command.inputFile).toBe("input.bam");
        });

        it("should handle a command with missing flag and option values gracefully", () => {
            const input = "samtools view -f -q input.bam";

            const result = samCommandDecoder.decode(input);

            expect(result.isValid).toBe(false);
            expect(result.errors).toEqual([
                "Expected a value after -f, but got -q.",
                "Option -q requires an integer value, but received: input.bam",
            ]);
            expect(result.skippedTokens).toEqual(["-f", "-q"]);
            expect(result.unknownIncludedBits).toEqual([]);
            expect(result.unknownExcludedBits).toEqual([]);

            expect(result.command.options.length).toBe(0);
            expect(result.command.flagFilter.calculatedIncludeValue).toBe(0);
            expect(result.command.flagFilter.calculatedExcludeValue).toBe(0);
            expect(result.command.inputFile).toBe(undefined);
        });
    });
}); 