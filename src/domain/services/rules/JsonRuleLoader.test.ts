import {describe, expect, it} from "vitest";
import { JsonRuleLoader } from "./JsonRuleLoader";
import { SamFlagCatalog } from "../samFlags/SamFlagCatalog";
import { ViewOptionCatalog } from "../viewOptions/ViewOptionCatalog";
import { RULE_CONDITION_TYPES } from "../../rules/RuleCondition";


describe("JsonRuleLoader", () => {
    const flagCatalog = new SamFlagCatalog();
    const viewOptionCatalog = new ViewOptionCatalog();
    const loader = new JsonRuleLoader(flagCatalog, viewOptionCatalog);

    it("loads all rule definitions", () => {
    const rules = loader.load();

    expect(rules).toHaveLength(15);
    });

    it("resolves flag identifiers for a requires-flags condition", () => {
        const rules = loader.load();
        const rule = rules.find(rule => rule.id === 300)!;

        expect(rule.condition.type).toBe(
            RULE_CONDITION_TYPES.REQUIRES_FLAGS
        );

        if (rule.condition.type === RULE_CONDITION_TYPES.REQUIRES_FLAGS) {
            expect(rule.condition.includedFlags[0].id).toBe(101);
            expect(rule.condition.requiredFlags[0].id).toBe(100);
        }
    });

    it("resolves view option identifiers for a requires-option condition", () => {
        const rules = loader.load();
        const rule = rules.find(rule => rule.id === 306)!;

        expect(rule.condition.type).toBe(
            RULE_CONDITION_TYPES.REQUIRES_OPTION
        );

        if (rule.condition.type === RULE_CONDITION_TYPES.REQUIRES_OPTION) {
            expect(rule.condition.selectedOption.id).toBe(203);
            expect(rule.condition.selectedValue).toBe("CRAM");
            expect(rule.condition.requiredOption.id).toBe(205);
        }
    });

    it("resolves flag identifiers for a contradiction condition", () => {
        const rules = loader.load();
        const rule = rules.find(rule => rule.id === 305)!;

        expect(rule.condition.type).toBe(
            RULE_CONDITION_TYPES.CONTRADICTION
        );

        if (rule.condition.type === RULE_CONDITION_TYPES.CONTRADICTION) {
            expect(rule.condition.includedFlags[0].id).toBe(106);
            expect(rule.condition.includedFlags[1].id).toBe(107);
        }
    });

    it("resolves flag identifiers for a include-exclude overlap condition", () => {
        const rules = loader.load();
        const rule = rules.find(rule => rule.id === 307)!;

        expect(rule.condition.type).toBe(
            RULE_CONDITION_TYPES.INCLUDE_EXCLUDE_OVERLAP
        );

        expect(rule.message).toBe("A SAM flag can't be both included and excluded at the same time.");
    });

    it("resolves flag identifiers for a option-value condition", () => {
        const rules = loader.load();
        const rule = rules.find(rule => rule.id === 310)!;

        expect(rule.condition.type).toBe(
            RULE_CONDITION_TYPES.OPTION_VALUE
        );

        expect(rule.message).toBe("A mapping quality of 255 indicates that mapping quality is unavailable; it does not represent the highest mapping quality.");
    });

    it("resolves unexpected input file extension", () => {
        const rules = loader.load();
        const rule = rules.find(rule => rule.id === 311)!;

        expect(rule.condition.type).toBe(
            RULE_CONDITION_TYPES.INPUT_FILE_EXTENSION
        );

        expect(rule.message).toBe("Input file does not have a typical SAM/BAM/CRAM extension.");
    });

    it("resolves zero flags or options selected", () => {
        const rules = loader.load();
        const rule = rules.find(rule => rule.id === 312)!;

        expect(rule.condition.type).toBe(
            RULE_CONDITION_TYPES.EMPTY_COMMAND
        );

        expect(rule.message).toBe("No flags or options selected yet, this command will return every read in the file.");
    });

    it("resolves if fiags are filtering optins are selected", () => {
        const rules = loader.load();
        const rule = rules.find(rule => rule.id === 313)!;

        expect(rule.condition.type).toBe(
            RULE_CONDITION_TYPES.HAS_FILTERING_SELECTION
        );

        expect(rule.message).toBe("Included flags and filtering options are combined with AND, every condition must hold for a read to appear in the output.");
    });

    it("resolves if selected options are output formats", () => {
        const rules = loader.load();
        const rule = rules.find(rule => rule.id === 314)!;

        expect(rule.condition.type).toBe(
            RULE_CONDITION_TYPES.CONTAINS_OPTION
        );

        expect(rule.message).toBe("The output format controls how the resulting alignments are written, not which reads are selected.");
    });

    it("throws when a referenced SAM flag does not exist", () => {
        const badFlagCatalog = {
            getFlagById: () => undefined,
        } as unknown as SamFlagCatalog;

        const loader = new JsonRuleLoader(
            badFlagCatalog,
            viewOptionCatalog
        );

        expect(() => loader.load())
            .toThrow("Unknown SAM flag with ID 101 not found in catalog.");
    });

    it("throws when a referenced View Option does not exist", () => {
        const badViewOptionCatalog = {
            getViewOptionById: () => undefined,
        } as unknown as ViewOptionCatalog;

        const loader = new JsonRuleLoader(
            flagCatalog,
            badViewOptionCatalog
        );

        expect(() => loader.load())
            .toThrow("Unknown view option with ID 203 not found in catalog.");
    });
});