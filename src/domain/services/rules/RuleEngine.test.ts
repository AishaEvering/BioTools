import {describe, expect, it} from "vitest";
import { SamFlagCatalog } from "../samFlags/SamFlagCatalog";
import { ViewOptionCatalog } from "../viewOptions/ViewOptionCatalog";
import { RULE_CONDITION_TYPES } from "../../rules/RuleCondition";
import type { SamViewCommand } from "../../command/SamViewCommand";
import { RuleEngine } from "./RuleEngine";
import { RuleCatalog } from "./RuleCatalog";
import type { SelectedViewOption } from "../../options/SelectedViewOption";



describe("Rules", () => {

    function createCommand(
        overrides: Partial<SamViewCommand> = {},
    ): SamViewCommand {
        return {
            flagFilter: {
            includedFlags: [],
            excludedFlags: [],
            calculatedIncludeValue: 0,
            calculatedExcludeValue: 0,
            },
            options: [],
            ...overrides,
        };
    }

        // catalogs
        const samFlagCatalog = new SamFlagCatalog();
        const viewOptionCatalog = new ViewOptionCatalog();
        const ruleCatalog = new RuleCatalog(samFlagCatalog, viewOptionCatalog);
        const engine = new RuleEngine(ruleCatalog);

        // flags
        const PROPER_PAIR_FLAG = 101;
        const READ_PAIR_FLAG = 100;
        const MATE_UNMAPPED = 103;
        const FIRST_IN_PAIR = 106;
        const SECOND_IN_PAIR = 107;

    function getFlag(id: number){
        const flag = samFlagCatalog.getFlagById(id);

        if(!flag){
            throw new Error(`Expected SAM Flag ${id} to exist`);
        }

        return flag;
    }

    describe(RULE_CONDITION_TYPES.REQUIRES_FLAGS, () => {
        it("matches when an included flag is missing its required flag", () => {
            const properPairFlag = getFlag(PROPER_PAIR_FLAG)

            const command = createCommand({
                flagFilter: {
                    includedFlags: [properPairFlag],
                    excludedFlags: [],
                    calculatedIncludeValue: 0,
                    calculatedExcludeValue: 0
                },
            });


            const rules = engine.evaluate(command);

            expect(rules).toHaveLength(1);
            expect(rules.some(rule => rule.id === 300)).toBe(true);
        });

        it("does not match when the required flag is also included", () => {
            const properPairFlag = getFlag(PROPER_PAIR_FLAG)
            const readPairFlag = getFlag(READ_PAIR_FLAG)

            const command = createCommand({
                flagFilter: {
                    includedFlags: [properPairFlag, readPairFlag],
                    excludedFlags: [],
                    calculatedIncludeValue: 0,
                    calculatedExcludeValue: 0
                },
            });

            const rules = engine.evaluate(command);

            expect(rules).toHaveLength(0);
            expect(rules.some(rule => rule.id === 300)).toBe(false);
        });

        it("does not match when the triggering flag is excluded", () => {
            const properPairFlag = getFlag(PROPER_PAIR_FLAG)

            const command = createCommand({
                flagFilter: {
                    includedFlags: [],
                    excludedFlags: [properPairFlag],
                    calculatedIncludeValue: 0,
                    calculatedExcludeValue: 0
                },
            });

            const rules = engine.evaluate(command);

            expect(rules).toHaveLength(0);
            expect(rules.some(rule => rule.id === 300)).toBe(false);
        });

        it("does not match when the triggering flag is not selected", () => {
            const command = createCommand({
                flagFilter: {
                    includedFlags: [],
                    excludedFlags: [],
                    calculatedIncludeValue: 0,
                    calculatedExcludeValue: 0
                },
            });

            const rules = engine.evaluate(command);

            expect(rules).toHaveLength(0);
            expect(rules.some(rule => rule.id === 300)).toBe(false);
        });

        it("returns multiple matching rules of the same type", () => {
            const properPairFlag = getFlag(PROPER_PAIR_FLAG)
            const mateUnmappedFlag = getFlag(MATE_UNMAPPED)

            const command = createCommand({
                flagFilter: {
                    includedFlags: [properPairFlag, mateUnmappedFlag],
                    excludedFlags: [],
                    calculatedIncludeValue: 0,
                    calculatedExcludeValue: 0
                },
            });

            const rules = engine.evaluate(command);

            const requiredFlagRules = rules.filter(
                rule => rule.condition.type === RULE_CONDITION_TYPES.REQUIRES_FLAGS
            )

            expect(requiredFlagRules).toHaveLength(2);
            expect(requiredFlagRules.map(rule => rule.id)).toEqual([300, 301]);
        });
    });


    describe(RULE_CONDITION_TYPES.CONTRADICTION, () => {
        it("matches when all contradicting flags are included", () => {
            const firstInPair = getFlag(FIRST_IN_PAIR)
            const secondInPair = getFlag(SECOND_IN_PAIR)
            const readPairFlag = getFlag(READ_PAIR_FLAG)

            const command = createCommand({
                flagFilter: {
                    includedFlags: [firstInPair, secondInPair, readPairFlag],
                    excludedFlags: [],
                    calculatedIncludeValue: 0,
                    calculatedExcludeValue: 0
                },
            });

            const rules = engine.evaluate(command);

            expect(rules).toHaveLength(1);
            expect(rules.some(rule => rule.id === 305)).toBe(true);
        });

        it("does not match when all contradicting flags are not included", () => {
            const properPairFlag = getFlag(PROPER_PAIR_FLAG)
            const readPairFlag = getFlag(READ_PAIR_FLAG)
            const secondInPair = getFlag(SECOND_IN_PAIR)

            const command = createCommand({
                flagFilter: {
                    includedFlags: [properPairFlag, readPairFlag, secondInPair],
                    excludedFlags: [],
                    calculatedIncludeValue: 0,
                    calculatedExcludeValue: 0
                },
            });

            const rules = engine.evaluate(command);

            expect(rules).toHaveLength(0);
            expect(rules.some(rule => rule.id === 305)).toBe(false);
        });

        it("does not match when one contradicting flag is excluded", () => {
            const firstInPair = getFlag(FIRST_IN_PAIR);
            const secondInPair = getFlag(SECOND_IN_PAIR);
            const readPairFlag = getFlag(READ_PAIR_FLAG);

            const command = createCommand({
                flagFilter: {
                    includedFlags: [firstInPair, readPairFlag],
                    excludedFlags: [secondInPair],
                    calculatedIncludeValue: 0,
                    calculatedExcludeValue: 0
                },
            });

            const rules = engine.evaluate(command);

            expect(rules.some(rule => rule.id === 305)).toBe(false);
        });
    });

    describe(RULE_CONDITION_TYPES.INCLUDE_EXCLUDE_OVERLAP, () => {
        it("matches when a flag is included and excluded", () => {
            const readPairFlag = getFlag(READ_PAIR_FLAG)

            const command = createCommand({
                flagFilter: {
                    includedFlags: [readPairFlag],
                    excludedFlags: [readPairFlag],
                    calculatedIncludeValue: 0,
                    calculatedExcludeValue: 0
                },
            });

            const rules = engine.evaluate(command);

            expect(rules).toHaveLength(1);
            expect(rules.some(rule => rule.id === 307)).toBe(true);
        });

        it("matches when multiple flags are included and excluded", () => {
            const readPairFlag = getFlag(READ_PAIR_FLAG);
            const properPairFlag = getFlag(PROPER_PAIR_FLAG);

            const command = createCommand({
                flagFilter: {
                    includedFlags: [readPairFlag, properPairFlag],
                    excludedFlags: [readPairFlag, properPairFlag],
                    calculatedIncludeValue: 0,
                    calculatedExcludeValue: 0
                },
            });

            const rules = engine.evaluate(command);

            expect(rules).toHaveLength(1);
            expect(rules.some(rule => rule.id === 307)).toBe(true);
        });

        it("does not match when included and excluded flags do not overlap", () => {
            const readPairFlag = getFlag(READ_PAIR_FLAG);
            const properPairFlag = getFlag(PROPER_PAIR_FLAG);

            const command = createCommand({
                flagFilter: {
                    includedFlags: [readPairFlag],
                    excludedFlags: [properPairFlag],
                    calculatedIncludeValue: 0,
                    calculatedExcludeValue: 0
                },
            });

            const rules = engine.evaluate(command);

            expect(rules.some(rule => rule.id === 307)).toBe(false);
        });
    });
    
    describe("Option_Rules", () => {
        const OUTPUT_FORMAT = 203;
        const REFERENCE_FILE = 205;
        const INCLUDE_HEADER = 200;
        const MIN_MAPPING_QUALITY = 202;

        function createSelectedViewOption(
            overrides: Partial<SelectedViewOption> = {},
        ): SelectedViewOption {
                return {
                    option: {
                        id: 0,
                        name: "",
                        syntax: "",
                        description: "",
                        explanation: "",
                        requiresValue: false
                    },
                    ...overrides,
                };
        }

        function getSelectedViewOption(id: number, value?: string | number):SelectedViewOption{
            const option = viewOptionCatalog.getViewOptionById(id);
                
            if(!option){
                throw new Error(`Expected View Option ${id} to exist`);
            }

            return createSelectedViewOption({
                option,
                value
            });
        }

        describe(RULE_CONDITION_TYPES.OPTION_VALUE, () => {
            it("does not match when option match and value does not match", () => {
                const minMappingQualityOption = getSelectedViewOption(MIN_MAPPING_QUALITY, 50)
  
                const command = createCommand({
                    options: [minMappingQualityOption]
                });

                const rules = engine.evaluate(command);

                expect(rules).toHaveLength(0);
                expect(rules.some(rule => rule.id === 310)).toBe(false);
            });

            it("matches when option and value matches", () => {
                const minMappingQualityOption = getSelectedViewOption(MIN_MAPPING_QUALITY, 255)

                const command = createCommand({
                    options: [minMappingQualityOption]

                });

                const rules = engine.evaluate(command);

                expect(rules).toHaveLength(1);
                expect(rules.some(rule => rule.id === 310)).toBe(true);
            });

            it("does not match when option matches but value is undefined", () => {
                const minMappingQualityOption = getSelectedViewOption(MIN_MAPPING_QUALITY)

                const command = createCommand({
                    options: [minMappingQualityOption]
                });

                const rules = engine.evaluate(command);

                expect(rules).toHaveLength(0);
                expect(rules.some(rule => rule.id === 310)).toBe(false);
            });
        });

        describe(RULE_CONDITION_TYPES.REQUIRES_OPTION, () => {
            it("does not match when option and value match and required option is selected", () => {
                const outputFormatOption = getSelectedViewOption(OUTPUT_FORMAT, "CRAM")
                const referenceFileOption = getSelectedViewOption(REFERENCE_FILE, "ref.fastq")


                const command = createCommand({
                    options: [outputFormatOption, referenceFileOption]
                });

                const rules = engine.evaluate(command);

                expect(rules).toHaveLength(0);
                expect(rules.some(rule => rule.id === 306)).toBe(false);
            });

            it("matches when option and value matches and does not have required option", () => {
                const outputFormatOption = getSelectedViewOption(OUTPUT_FORMAT, "CRAM")


                const command = createCommand({
                    options: [outputFormatOption]
                });

                const rules = engine.evaluate(command);

                expect(rules).toHaveLength(1);
                expect(rules.some(rule => rule.id === 306)).toBe(true);
            });

            it("does not match when option matches but value does not match", () => {
                const outputFormatOption = getSelectedViewOption(OUTPUT_FORMAT, "BAM")


                const command = createCommand({
                    options: [outputFormatOption]
                });

                const rules = engine.evaluate(command);

                expect(rules).toHaveLength(0);
                expect(rules.some(rule => rule.id === 306)).toBe(false);
            });

            it("does not match when option matches but value does not match with required option", () => {
                const outputFormatOption = getSelectedViewOption(OUTPUT_FORMAT, "BAM")
                const referenceFileOption = getSelectedViewOption(REFERENCE_FILE, "ref.fasta")


                const command = createCommand({
                    options: [outputFormatOption, referenceFileOption]
                });

                const rules = engine.evaluate(command);

                expect(rules).toHaveLength(0);
                expect(rules.some(rule => rule.id === 306)).toBe(false);
            });

            it("does not match when option does not match", () => {
                const includeHeaderOption = getSelectedViewOption(INCLUDE_HEADER)

                const command = createCommand({
                    options: [includeHeaderOption]
                });

                const rules = engine.evaluate(command);

                expect(rules).toHaveLength(0);
                expect(rules.some(rule => rule.id === 306)).toBe(false);
            });
        });
    });

    it("has matches for multiple rules", () => {
        const properPairFlag = getFlag(PROPER_PAIR_FLAG)
        const mateUnmappedFlag = getFlag(MATE_UNMAPPED)

        const command = createCommand({
            flagFilter: {
                includedFlags: [properPairFlag, mateUnmappedFlag],
                excludedFlags: [],
                calculatedIncludeValue: 0,
                calculatedExcludeValue: 0
            },
        });

        const rules = engine.evaluate(command);

        expect(rules).toHaveLength(3);
        expect(rules.map(rule => rule.id)).toEqual([300, 301, 309]);
    });
});