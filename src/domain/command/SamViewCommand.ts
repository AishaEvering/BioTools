import type {SelectedViewOption} from "../options/SelectedViewOption";
import type {FlagFilter} from "../filtering/FlagFilter";

export interface SamViewCommand {
    readonly flagFilter: FlagFilter;
    readonly options: SelectedViewOption[];
    readonly inputFile?: string;
}
