import type {ViewOptionConstraints} from "./ViewOptionConstraints";

export interface ViewOption {
    readonly id: number;
    readonly name: string;
    readonly syntax: string;
    readonly description: string;
    readonly explanation: string;
    readonly placeholder?: string;
    readonly requiresValue: boolean;
    readonly constraints?: ViewOptionConstraints;
    readonly category: ViewOptionCategory;
}

export const VIEW_OPTION_CATEGORY = {
    FILTER: "filter",
    OUTPUT: "output",
} as const;

export type ViewOptionCategory = typeof VIEW_OPTION_CATEGORY[keyof typeof VIEW_OPTION_CATEGORY];