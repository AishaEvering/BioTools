import {describe, expect, it} from "vitest";
import { SamFlagCatalog } from "../samFlags/SamFlagCatalog";
import { ViewOptionCatalog } from "../viewOptions/ViewOptionCatalog";
import type { SamViewCommand } from "../../command/SamViewCommand";
import type { SelectedViewOption } from "../../options/SelectedViewOption";
import { ExplanationEngine } from "./ExplanationEngine";
import { RuleCatalog } from "../rules/RuleCatalog";
import { RuleEngine } from "../rules/RuleEngine";



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
                    requiresValue: false
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
                    text: 'Includes reads marked as properly paired.'
                },
                { type: 'command', text: 'Includes the SAM header in the output.' },
                {
                    type: 'rule',
                    text: 'Proper Pair normally applies to reads marked as paired.'
                }
            ])
    });

    it("explains commands and options", () => {
        const properPairFlag = getFlag(PROPER_PAIR_FLAG)
        const readPairFlag = getFlag(READ_PAIR_FLAG)
        const minMappingQualityOption = getSelectedViewOption(MIN_MAPPING_QUALITY, 20)

            const command = createCommand({
                flagFilter: {
                    includedFlags: [properPairFlag, readPairFlag],
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
                    type: 'command',
                    text: 'Includes reads marked as properly paired.'
                },
                {
                    type: 'command',
                    text: 'Includes reads that are part of a paired template.',
                },
                { 

                    type: 'command', 
                    text: 'Includes only alignments with a minimum mapping quality of 20.',
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
                    text: 'Includes reads marked as properly paired.'
                },
                { 
                    
                    type: 'rule', 
                    text: 'Proper Pair normally applies to reads marked as paired.',
                }
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
                text: "Excludes reads marked as properly paired."
            }
        ]);
    });

    it("returns no messages for an empty command with no matched rules", () => {
        const command = createCommand();

        const messages = explanationEngine.explain(command, []);

        expect(messages).toEqual([]);
    });
});