import { SamFlagCatalog } from "../../samFlags/SamFlagCatalog";
import { ViewOptionCatalog } from "../../viewOptions/ViewOptionCatalog";
import { SamCommandDecoder } from "./SamCommandDecoder";
import { SamFlagDecoder } from "./SamFlagDecoder";
import { ViewOptionDecoder } from "./ViewOptionDecoder";
import { SamViewInputClassifier } from "./SamViewInputClassifier";
import { DECODE_INPUT_TYPE, type DecodeInputClassifier } from "../../../decode/DecodeInputClassifier";
import type { DecodeSamInputResult } from "../../../decode/DecodeSamInputResult";
import { Tokenizer } from "./Tokenizer";

export class SamInputDecoder {

    private readonly flagDecoder: SamFlagDecoder;
    private readonly viewOptionDecoder: ViewOptionDecoder;
    private readonly commandDecoder: SamCommandDecoder;
    private readonly classifier: DecodeInputClassifier;

    constructor(samFlagCatalog: SamFlagCatalog, viewOptionCatalog: ViewOptionCatalog) {
        this.flagDecoder = new SamFlagDecoder(samFlagCatalog);
        this.viewOptionDecoder = new ViewOptionDecoder(viewOptionCatalog);
        this.commandDecoder = new SamCommandDecoder(this.flagDecoder, this.viewOptionDecoder);
        this.classifier = new SamViewInputClassifier();
    }

    decode(input: string): DecodeSamInputResult {
        const type = this.classifier.classify(input);

        switch(type){
            case DECODE_INPUT_TYPE.SAM_VIEW_FLAG:
                return {
                    type,
                    result: this.flagDecoder.decode(input),
                };

            case DECODE_INPUT_TYPE.SAM_VIEW_OPTION:
            { 
                const [syntax, value] = Tokenizer.tokenize(input);

                return {
                    type,
                    result: this.viewOptionDecoder.decode(syntax, value)
                }
            }
            case DECODE_INPUT_TYPE.SAM_VIEW_COMMAND:
                return{
                    type,
                    result: this.commandDecoder.decode(input)
                }
            default:
                throw new Error(`Unknown input type: ${input}`);
        }
    }
}