
  export interface DecodeMessage{
    level: DecodeMessageLevel;
    message: string;
    details?: string[];
  }

  export const DECODE_MESSAGE_LEVEL = {
    ERROR: "error",
    WARN: "warn",
    INFO: "info"
} as const;

export type DecodeMessageLevel = 
    typeof DECODE_MESSAGE_LEVEL[keyof typeof DECODE_MESSAGE_LEVEL];