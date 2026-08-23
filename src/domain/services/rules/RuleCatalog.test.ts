import {describe, expect, it} from "vitest";
import { RuleCatalog } from "./RuleCatalog";
import { SamFlagCatalog } from "../samFlags/SamFlagCatalog";
import { ViewOptionCatalog } from "../viewOptions/ViewOptionCatalog";
import { RULE_CONDITION_TYPES } from "../../rules/RuleCondition";

describe("RuleCatalog", () => {
    const flagCatalog = new SamFlagCatalog();
    const viewOptionCatalog = new ViewOptionCatalog();
    const catalog = new RuleCatalog(flagCatalog, viewOptionCatalog);

    describe("getAll", () => {
        it("returns all rules", () => {
            const rules = catalog.getAll();
            expect(rules).toHaveLength(15);
        });

        it("contains unique rule IDs", () => {
            const rules = catalog.getAll();
            const ids = rules.map(rule => rule.id);

            expect(new Set(ids).size).toBe(ids.length);
        });
    });

    describe("getById", () => {
        it("returns the rule with the requested ID", () => {
            const rule = catalog.getById(300);
            expect(rule?.id).toBe(300);
            expect(rule?.condition.type).toBe(RULE_CONDITION_TYPES.REQUIRES_FLAGS);
        });

        it("returns undefined when the id does not exist", () => {
            const rule = catalog.getById(999);
            expect(rule).toBeUndefined();
        });
    });
});