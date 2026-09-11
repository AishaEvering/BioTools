import type { DecodeSamCommandResult } from "./DecodeSamCommandResult";
import type { DecodeSamFlagResult } from "./DecodeSamFlagResult";
import type { DecodeViewOptionResult } from "./DecodeViewOptionResult";
import type { DECODE_INPUT_TYPE} from "./DecodeInputClassifier"

export type DecodeSamInputResult =
  | {
      type: typeof DECODE_INPUT_TYPE.SAM_VIEW_FLAG,
      result: DecodeSamFlagResult,
    }
  | {
      type: typeof DECODE_INPUT_TYPE.SAM_VIEW_OPTION,
      result: DecodeViewOptionResult,
    }
  | {
      type: typeof DECODE_INPUT_TYPE.SAM_VIEW_COMMAND,
      result: DecodeSamCommandResult,
    };