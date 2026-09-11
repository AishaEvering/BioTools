import {describe, expect, it} from "vitest";
import { SamFlagCatalog } from "../../samFlags/SamFlagCatalog";
import { ViewOptionCatalog } from "../../viewOptions/ViewOptionCatalog";
import { SamInputDecoder } from "./SamInputDecoder";
import { DECODE_INPUT_TYPE } from "../../../decode/DecodeInputClassifier";


describe("SamInputDecoder", () => {   
    const samFlagCatalog = new SamFlagCatalog();
    const viewOptionCatalog = new ViewOptionCatalog();

    const samInputDecoder = new SamInputDecoder(samFlagCatalog, viewOptionCatalog);


    it("should not decode an invalid input", () => {
        const input = "hello 123 blah -blah";
        const result = samInputDecoder.decode(input);

        expect(result.type).toBe(DECODE_INPUT_TYPE.SAM_VIEW_COMMAND);

        if(result.type === DECODE_INPUT_TYPE.SAM_VIEW_COMMAND){
            const commandResult = result.result;
                
            expect(commandResult.isValid).toBe(false);
            expect(commandResult.errors).toEqual(["Invalid command. Command must start with 'samtools view'."]);
            expect(commandResult.skippedTokens).toEqual([]);
            expect(commandResult.unknownIncludedBits).toEqual([]);
            expect(commandResult.unknownExcludedBits).toEqual([]);

            expect(commandResult.command.options.length).toBe(0);
            expect(commandResult.command.flagFilter.includedFlags.length).toBe(0);
            expect(commandResult.command.flagFilter.excludedFlags.length).toBe(0);
            expect(commandResult.command.inputFile).toBe(undefined);
        }
    });


    describe("Flag Input Only", () => {  
        it("should decode flags correctly", () => {
            const input = "3";
            const result = samInputDecoder.decode(input);

            expect(result.type).toBe(DECODE_INPUT_TYPE.SAM_VIEW_FLAG);

            if(result.type === DECODE_INPUT_TYPE.SAM_VIEW_FLAG){
                const flagResult = result.result;
                
                expect(flagResult.isValid).toBe(true);
                expect(flagResult.value).toBe("3");
                expect(flagResult.unknownBits).toEqual([]);
                expect(flagResult.matched).toHaveLength(2);
            }
        });

        it("should decode flags with spaces correctly", () => {
            const input = "  3  ";
            const result = samInputDecoder.decode(input);

            expect(result.type).toBe(DECODE_INPUT_TYPE.SAM_VIEW_FLAG);

            if(result.type === DECODE_INPUT_TYPE.SAM_VIEW_FLAG){
                const flagResult = result.result;
                
                expect(flagResult.isValid).toBe(true);
                expect(flagResult.value).toBe("3");
                expect(flagResult.unknownBits).toEqual([]);
                expect(flagResult.matched).toHaveLength(2);
            }
        });
    });

    describe("Option Input Only", () => { 
        it("should decode option without a value correctly", () => {
            const input = "-h";
            const result = samInputDecoder.decode(input);

            expect(result.type).toBe(DECODE_INPUT_TYPE.SAM_VIEW_OPTION);

            if(result.type === DECODE_INPUT_TYPE.SAM_VIEW_OPTION){
                const optionResult = result.result;
                
                expect(optionResult.isValid).toBe(true);
                expect(optionResult.option?.option.syntax).toBe("-h");
                expect(optionResult.option?.value).toBe(undefined);
            }
        });

        it("should decode option with a value correctly", () => {
            const input = "-q 10";
            const result = samInputDecoder.decode(input);

            expect(result.type).toBe(DECODE_INPUT_TYPE.SAM_VIEW_OPTION);

            if(result.type === DECODE_INPUT_TYPE.SAM_VIEW_OPTION){
                const optionResult = result.result;
                
                expect(optionResult.isValid).toBe(true);
                expect(optionResult.option?.option.syntax).toBe("-q");
                expect(optionResult.option?.value).toBe("10");
            }
        });

        it("should return invalid result for unknown option", () => {
            const input = "-blah";
            const result = samInputDecoder.decode(input);

            expect(result.type).toBe(DECODE_INPUT_TYPE.SAM_VIEW_OPTION);

            if (result.type === DECODE_INPUT_TYPE.SAM_VIEW_OPTION) {
                expect(result.result.isValid).toBe(false);
            }
        });

        it("should handle option values that have spaces and are quoted correctly", () => {
            const result = samInputDecoder.decode(
                '-o "output file.bam"'
            );

            expect(result.type).toBe(DECODE_INPUT_TYPE.SAM_VIEW_OPTION);

            if(result.type === DECODE_INPUT_TYPE.SAM_VIEW_OPTION){
                const optionResult = result.result;
                

                expect(optionResult.isValid).toBe(true);
                expect(optionResult.error).toEqual(undefined);
                expect(optionResult.option?.option.syntax).toBe("-o");
                expect(optionResult.option?.value).toBe("output file.bam");
            }
        });
    });

    describe("Complete Command", () => {     
        it("should decode complete command correctly", () => {
            const input = "samtools view -f 3 -q 10 input.bam";
            const result = samInputDecoder.decode(input);

            expect(result.type).toBe(DECODE_INPUT_TYPE.SAM_VIEW_COMMAND);

            if(result.type === DECODE_INPUT_TYPE.SAM_VIEW_COMMAND){
                const commandResult = result.result;
                
                expect(commandResult.isValid).toBe(true);
                expect(commandResult.skippedTokens).toEqual([]);
                expect(commandResult.unknownIncludedBits).toEqual([]);
                expect(commandResult.unknownExcludedBits).toEqual([]);

                expect(commandResult.command.options.length).toBe(1);
                expect(commandResult.command.options[0].option.syntax).toBe("-q");
                expect(commandResult.command.options[0].value).toBe("10");

                expect(commandResult.command.flagFilter.calculatedIncludeValue).toBe(3);
                expect(commandResult.command.flagFilter.calculatedExcludeValue).toBe(0);
                expect(commandResult.command.inputFile).toBe("input.bam");
            }
        });

        it("should handle input file names with spaces gracefully", () => {
            const result = samInputDecoder.decode(
                'samtools view -f 3 -q 10 "input file.bam"'
            );

            expect(result.type).toBe(DECODE_INPUT_TYPE.SAM_VIEW_COMMAND);

            if(result.type === DECODE_INPUT_TYPE.SAM_VIEW_COMMAND){
                const commandResult = result.result;

                expect(commandResult.isValid).toBe(true);
                expect(commandResult.errors).toEqual([]);
                expect(commandResult.command.inputFile).toBe("input file.bam");
            }
        });
    });
}); 