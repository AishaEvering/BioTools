import type { Rule } from "./Rule";

export interface RuleLoader {
    load(): Rule[];
}