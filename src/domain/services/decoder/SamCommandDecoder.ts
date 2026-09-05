import type { DecodeSamCommandResult } from "../../decode/DecodeSamCommandResult";
import type { SamFlagDecoder } from "./SamFlagDecoder";
import type { ViewOptionDecoder } from "./ViewOptionDecoder";
import { Tokenizer } from "./Tokenizer";
import { createFlagFilter } from "../filtering/CreateFlagFilter";
import type { SamFlag } from "../../sam/SamFlag";
import type { SelectedViewOption } from "../../options/SelectedViewOption";

export class SamCommandDecoder {

    private readonly flagDecoder: SamFlagDecoder;
    private readonly viewOptionDecoder: ViewOptionDecoder;

  constructor(flagDecoder: SamFlagDecoder, viewOptionDecoder: ViewOptionDecoder) {
    this.flagDecoder = flagDecoder;
    this.viewOptionDecoder = viewOptionDecoder;
  }

  decode(input: string): DecodeSamCommandResult {
    const errors: string[] = [];
    const skippedTokens: string[] = [];
    let unknownIncludedBits: number[] = [];
    let unknownExcludedBits: number[] = [];
    let includedFlags: SamFlag[] = [];
    let excludedFlags: SamFlag[] = [];
    const options: SelectedViewOption[] = [];
    let inputFile: string | undefined = undefined;
    

    // tokenize the input
    const tokens = Tokenizer.tokenizeSamCommand(input);

    // validate samtools view prefix
    if (tokens.length < 2 || tokens[0] !== "samtools" || tokens[1] !== "view") {
      errors.push("Invalid command. Command must start with 'samtools view'.");
      return {
        command: { 
            flagFilter: createFlagFilter([], []), 
            options: [],
            inputFile: undefined,
        },
        isValid: false,
        skippedTokens,
        unknownIncludedBits,
        unknownExcludedBits,
        errors,
      };
    }

    for (let i = 2; i < tokens.length; i++) {
      const token = tokens[i];
      const nextToken = tokens[i + 1];
      const isNegativeInteger = /^-\d+(\.\d+)?$/.test(nextToken ?? "");
  
        
      if (token === "-f" || token === "-F") {
        // check that a value exists and the next token is not another option
        if(nextToken === undefined || nextToken.startsWith("-") && !isNegativeInteger) {
            errors.push(`Expected a value after ${token}, but got ${nextToken ?? "nothing"}.`);
            skippedTokens.push(token);
            continue;   
        }

        // decode flag filter
        const flagResult = this.flagDecoder.decode(nextToken);

        if (!flagResult.isValid) {
          // handle invalid flag decoding
          skippedTokens.push(flagResult.value);
          errors.push(flagResult.error ?? "Unknown error decoding flags.");
        } else {
          if (token === "-f") {
            includedFlags = [...flagResult.matched];
            unknownIncludedBits = [...flagResult.unknownBits];
          } else {
            excludedFlags = [...flagResult.matched];
            unknownExcludedBits = [...flagResult.unknownBits];
          }
        }
        i++; // skip the next token as it has been processed
      } else if (token.startsWith("-")) {

        const candidateValue = 
            nextToken !== undefined && 
            (!nextToken.startsWith("-") || isNegativeInteger)
                ? nextToken : undefined;

        const optionResult = this.viewOptionDecoder.decode(token, candidateValue);

        if (!optionResult.isValid) {
            skippedTokens.push(token);
            errors.push(optionResult.error ?? "Unknown error decoding view option.");
        } else if (optionResult.option) {
          const selectedOption = optionResult.option;

          const existingIndex = options.findIndex(
            selected => selected.option.syntax === selectedOption.option.syntax
          );

          if (existingIndex >= 0) {
            options[existingIndex] = selectedOption;
          } else {
            options.push(optionResult.option);
          }
        }

        if(optionResult.requiresValue && candidateValue !== undefined){
            i++; // skip the next token as it has been processed
        }
      } else {
        // assume it's the input file
       if (i === tokens.length - 1) {
            // last token, treat as input file
            inputFile = token;
        } else {
            skippedTokens.push(token);
            errors.push(`Unexpected token: ${token}`);
        }
      }
    }

    return {
      command: { 
        flagFilter: createFlagFilter(includedFlags, excludedFlags), 
        options: options, 
        inputFile: inputFile, 
      },
      isValid: errors.length === 0,
      skippedTokens,
      unknownIncludedBits,
      unknownExcludedBits,
      errors,
    };
   }
}   