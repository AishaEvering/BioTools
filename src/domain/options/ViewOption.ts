import type {ViewOptionConstraints} from "./ViewOptionConstraints";

export interface ViewOption {
    readonly id: number;
    readonly name: string;
    readonly syntax: string;
    readonly description: string;
    readonly explanation: string;
    readonly requiresValue: boolean;
    readonly constraints?: ViewOptionConstraints;
}