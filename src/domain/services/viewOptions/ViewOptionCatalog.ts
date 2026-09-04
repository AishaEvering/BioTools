import viewOptionDefinitions from "../../../data/viewOptions.json";
import type { ViewOption } from "../../options/ViewOption";

export class ViewOptionCatalog {
  private readonly options = 
    viewOptionDefinitions as readonly ViewOption[];

  getAll(): readonly ViewOption[] {
    return this.options;
  }

  getViewOptionById(id: number): ViewOption | undefined {
    return this.options.find(option => option.id === id);
  }

  getBySyntax(syntax: string): ViewOption | undefined {
    return this.options.find(option => option.syntax === syntax );
  } 
}