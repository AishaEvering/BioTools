import type {ViewOption} from "./ViewOption";

export interface SelectedViewOption {
    readonly option: ViewOption;
    readonly value?: string | number;
}

export function isSelectedOptionRenderable(selectedOption: SelectedViewOption): boolean{
    const {option, value} = selectedOption;

    // does not require a value, valid
    if(!option.requiresValue)
        return true;

    // requires a value and does not have one, invalid
    if(!hasSelectedOptionValue(value))
        return false;

    // requires a value, has a value with no constraints, valid
    if(!option.constraints)
        return true;

    switch(option.constraints.type){
        case "integer": {
            const {minimum, maximum} = option.constraints;

            return(
                typeof value === "number" &&
                Number.isInteger(value) &&
                (minimum === undefined || value >= minimum) &&
                (maximum === undefined || value <= maximum)
            );
        }
        case "enum": 
            return(
                typeof value === "string" &&
                option.constraints.allowableValues.includes(value)
            );
        case "string":
            return typeof value === "string" && value.trim().length > 0;
    }


}

export function hasSelectedOptionValue(value: string | number | undefined): boolean{
      if(value === undefined || Number.isNaN(value))
          return false;

      if(typeof value === "string")
          return value.trim().length > 0;

      return true;
  }
