import type {ViewOption} from "./ViewOption";

export interface SelectedViewOption {
    readonly option: ViewOption;
    readonly value?: string | number;
}
