export interface DecodeInputClassifier {
    classify(input: string): DecodeInputType | "unknown";
}

export const DECODE_INPUT_TYPE = {
    SAM_VIEW_FLAG: "sam_view_flag",
    SAM_VIEW_OPTION: "sam_view_option",
    SAM_VIEW_COMMAND: "sam_view_command"
} as const;

export type DecodeInputType = 
    typeof DECODE_INPUT_TYPE[keyof typeof DECODE_INPUT_TYPE];