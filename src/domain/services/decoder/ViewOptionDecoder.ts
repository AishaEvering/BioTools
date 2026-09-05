import type { DecodeViewOptionResult } from "../../decode/DecodeViewOptionResult";
import type { ViewOptionCatalog } from "../viewOptions/ViewOptionCatalog";
import type { SelectedViewOption } from "../../options/SelectedViewOption";
import type { ViewOptionConstraints } from "../../options/ViewOptionConstraints";

export class ViewOptionDecoder {

    private readonly viewOptionCatalog: ViewOptionCatalog;

    constructor(viewOptionCatalog: ViewOptionCatalog) {
        this.viewOptionCatalog = viewOptionCatalog;
    }

    decode(syntax: string, value?: string): DecodeViewOptionResult {
        const option = this.viewOptionCatalog.getBySyntax(syntax);

        if (!option) {
            return { 
                isValid: false, 
                error: `BioTools does not recognize or support option: ${syntax}` 
            };
        }

        if (option.requiresValue){
            if (value === undefined || value.trim().length === 0) {
                return { 
                    isValid: false, 
                    requiresValue: option.requiresValue,
                    error: `Option ${syntax} requires a value, but none was provided.` 
                };
            }

            if(option.constraints){
                const error = this.validateConstraints(syntax, value, option.constraints);

                if(error){
                    return {
                        isValid: false,
                        requiresValue: option.requiresValue,
                        error
                    }
                };
            }
        }

        const selectedOption: SelectedViewOption = {
            option,
            value: option.requiresValue ? value : undefined 
        }

        return { option: selectedOption, isValid: true, requiresValue: option.requiresValue };
    }

    private validateConstraints(syntax: string, value: string,
        constraints: ViewOptionConstraints): string | undefined {

        switch (constraints.type) {
            case "integer": {
                const intValue = Number(value);

                if (!Number.isInteger(intValue)) {
                    return `Option ${syntax} requires an integer value, but received: ${value}`;
                }

                if (
                    constraints.minimum !== undefined &&
                    intValue < constraints.minimum
                ) {
                    return `Option ${syntax} requires a value greater than or equal to ${constraints.minimum}, but received: ${value}`;
                }

                if (
                    constraints.maximum !== undefined &&
                    intValue > constraints.maximum
                ) {
                    return `Option ${syntax} requires a value less than or equal to ${constraints.maximum}, but received: ${value}`;
                }

                break;
            }

            case "enum":
                if (!constraints.allowableValues.includes(value)) {
                    return `Option ${syntax} requires a value from the following set: ${constraints.allowableValues.join(", ")}, but received: ${value}`;
                }
                break;

            case "string":
                if (value.trim().length === 0) {
                    return `Option ${syntax} requires a non-empty string value, but received an empty string.`;
                }
                break;
        }

        return undefined;
    }   
}
