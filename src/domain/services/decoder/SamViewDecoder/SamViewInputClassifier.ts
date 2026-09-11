import { DECODE_INPUT_TYPE, type DecodeInputType, type DecodeInputClassifier } from "../../../decode/DecodeInputClassifier";

export class SamViewInputClassifier implements DecodeInputClassifier {
    classify(input: string): DecodeInputType | "unknown" {
        const value = input.trim();

        if (/^\d+$/.test(value))
            return DECODE_INPUT_TYPE.SAM_VIEW_FLAG;
        
        if (value.startsWith("-"))
            return DECODE_INPUT_TYPE.SAM_VIEW_OPTION;
        
        return DECODE_INPUT_TYPE.SAM_VIEW_COMMAND;
    }
}