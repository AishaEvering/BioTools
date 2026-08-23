import {describe, expect, it} from "vitest";
import { SamFlagCatalog } from "../samFlags/SamFlagCatalog";
import { ViewOptionCatalog } from "../viewOptions/ViewOptionCatalog";
import type { SamViewCommand } from "../../command/SamViewCommand";
import type { SelectedViewOption } from "../../options/SelectedViewOption";
import { ExplanationEngine } from "./ExplanationEngine";
import { RuleCatalog } from "../rules/RuleCatalog";
import { RuleEngine } from "../rules/RuleEngine";
import { RULE_SEVERITY } from "../../rules/Rule";
import { VIEW_OPTION_CATEGORY } from "../../options/ViewOption";



describe("ExplanationEngine", () => {

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
                    requiresValue: false,
                    category: VIEW_OPTION_CATEGORY.OUTPUT
                },
                ...overrides,
            };
    }

    // catalogs
    const samFlagCatalog = new SamFlagCatalog();
    const viewOptionCatalog = new ViewOptionCatalog();
    const ruleCatalog = new RuleCatalog(samFlagCatalog, viewOptionCatalog);
    const ruleEngine = new RuleEngine(ruleCatalog);
    const explanationEngine = new ExplanationEngine();
    const INCLUDE_HEADER = 200;
    const MIN_MAPPING_QUALITY = 202;
    const OUTPUT_FORMAT = 203;

    // flags
    const PROPER_PAIR_FLAG = 101;
    const READ_PAIR_FLAG = 100;

    function getFlag(id: number){
        const flag = samFlagCatalog.getFlagById(id);

        if(!flag){
            throw new Error(`Expected SAM Flag ${id} to exist`);
        }

        return flag;
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

    it("explains commands, rules, and options", () => {
        const properPairFlag = getFlag(PROPER_PAIR_FLAG)
        const includeHeaderOption = getSelectedViewOption(INCLUDE_HEADER)

            const command = createCommand({
                flagFilter: {
                    includedFlags: [properPairFlag],
                    excludedFlags: [],
                    calculatedIncludeValue: 0,
                    calculatedExcludeValue: 0
                },
                options: [includeHeaderOption],
            });

            const rules = ruleEngine.evaluate(command);
            const messages = explanationEngine.explain(command, rules)
            
            expect(messages).toEqual([
                {
                    type: 'command',
                    text: 'Includes reads marked as properly paired.',
                    group: 'include',
                    severity: undefined,
                },
                { 
                    type: 'command', 
                    text: 'Includes the SAM header in the output.',
                    group: 'option',
                    severity: undefined,
             },
             {
                    type: 'rule',
                    text: 'Proper Pair normally applies to reads marked as paired.',
                    group: undefined,
                    severity: RULE_SEVERITY.WARNING,
            },
            {
                    type: 'rule',
                    text: 'Included flags and filtering options are combined with AND, every condition must hold for a read to appear in the output.',
                    group: undefined,
                    severity: RULE_SEVERITY.INFO,
            }
        ])
    });

    it("explains commands and options", () => {
        const properPairFlag = getFlag(PROPER_PAIR_FLAG)
        const readPairFlag = getFlag(READ_PAIR_FLAG)
        const minMappingQualityOption = getSelectedViewOption(MIN_MAPPING_QUALITY, 20)
        const outputFormat = getSelectedViewOption(OUTPUT_FORMAT, 'SAM')

            const command = createCommand({
                flagFilter: {
                    includedFlags: [properPairFlag, readPairFlag],
                    excludedFlags: [],
                    calculatedIncludeValue: 0,
                    calculatedExcludeValue: 0
                },
                options: [minMappingQualityOption, outputFormat],
            });

            const rules = ruleEngine.evaluate(command);
            const messages = explanationEngine.explain(command, rules)
            
            expect(messages).toEqual([
                {
                    type: 'command',
                    text: 'Includes reads marked as properly paired.',
                    group: 'include',
                    severity: undefined,
                },
                {
                    type: 'command',
                    text: 'Includes reads that are part of a paired template.',
                    group: 'include',
                    severity: undefined,
                },
                { 

                    type: 'command', 
                    text: 'Includes only alignments with a minimum mapping quality of 20.',
                    group: 'option',
                    severity: undefined,
                },
                {
                    type:'command',
                    text:'Uses SAM as the output format.',
                    group:'option'
                },
                {
                    text: 'Included flags and filtering options are combined with AND, every condition must hold for a read to appear in the output.',
                    type: 'rule',
                    severity: RULE_SEVERITY.INFO,
                },
                { 

                    text: 'The output format controls how the resulting alignments are written, not which reads are selected.',
                    type: 'rule',
                    severity: RULE_SEVERITY.INFO,
                }
            ])
    });

    it("explains commands and rules", () => {
        const properPairFlag = getFlag(PROPER_PAIR_FLAG)
            const command = createCommand({
                flagFilter: {
                    includedFlags: [properPairFlag],
                    excludedFlags: [],
                    calculatedIncludeValue: 0,
                    calculatedExcludeValue: 0
                },
            });

            const rules = ruleEngine.evaluate(command);
            const messages = explanationEngine.explain(command, rules)
            
            expect(messages).toEqual([
                {
                    type: 'command',
                    text: 'Includes reads marked as properly paired.',
                    group: 'include',
                    severity: undefined,
                },
                { 
                    
                    type: 'rule', 
                    text: 'Proper Pair normally applies to reads marked as paired.',
                    group: undefined,
                    severity: RULE_SEVERITY.WARNING,
                },
                {
                    severity: RULE_SEVERITY.INFO,
                    text: "Included flags and filtering options are combined with AND, every condition must hold for a read to appear in the output.",
                    type: 'rule',
                },
            ])
    });

    it("does not explain an option that requires a value when no value is provided", () => {
        const minMappingQualityOption = getSelectedViewOption(MIN_MAPPING_QUALITY)

        const command = createCommand({
            flagFilter: {
                includedFlags: [],
                excludedFlags: [],
                calculatedIncludeValue: 0,
                calculatedExcludeValue: 0
                },
                options: [minMappingQualityOption],
            });

        const rules = ruleEngine.evaluate(command);
        const messages = explanationEngine.explain(command, rules)
            
        expect(messages).toEqual([
            {
                severity: RULE_SEVERITY.INFO,
                text: "No flags or options selected yet, this command will return every read in the file.",
                type: "rule",
            },
        ])
    });

    it("uses exclusion phrases for excluded flags", () => {
        const properPairFlag = getFlag(PROPER_PAIR_FLAG);

        const command = createCommand({
            flagFilter: {
                includedFlags: [],
                excludedFlags: [properPairFlag],
                calculatedIncludeValue: 0,
                calculatedExcludeValue: 0
            },
        });

        const rules = ruleEngine.evaluate(command);
        const messages = explanationEngine.explain(command, rules);

        expect(messages).toEqual([
            {
                type: "command",
                severity: undefined,
                text: "Excludes reads marked as properly paired.",
                group: 'exclude',
            },
            {
                severity: RULE_SEVERITY.INFO,
                text: "Included flags and filtering options are combined with AND, every condition must hold for a read to appear in the output.",
                type: "rule",
            }
        ]);
    });

    it("returns no messages for an empty command with no matched rules", () => {
        const command = createCommand();

        const messages = explanationEngine.explain(command, []);

        expect(messages).toEqual([]);
    });
});