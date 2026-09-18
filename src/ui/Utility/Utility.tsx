import "./Utility.css";
import Decoder from "../Decoder/Decoder";
import type { DecodeMessage } from "../DecodeMessage";

interface UtilityProps {
  readonly onResetAll: () => void;
  readonly onDecode: (value: string) => void;
  readonly decodeMessage: DecodeMessage;
  readonly onClearDecodeMessage: () => void;
  readonly isDecoderOpen: boolean;
  readonly onToggleDecoder: () => void;
}

export default function Utility({
  onResetAll,
  onDecode,
  decodeMessage,
  onClearDecodeMessage,
  isDecoderOpen,
  onToggleDecoder,
}: UtilityProps) {
  function handleToggleDecoder() {
    if (isDecoderOpen) {
      onClearDecodeMessage();
    }
    onToggleDecoder();
  }

  function handleResetAll() {
    onResetAll();
  }

  return (
    <div className="utility">
      <div className="utility-row">
        <button
          type="button"
          className="utility-btn"
          onClick={handleToggleDecoder}
        >
          ⇄ Decode a command
        </button>

        <button type="button" className="utility-btn" onClick={handleResetAll}>
          ↺ Reset all
        </button>
      </div>

      {isDecoderOpen && (
        <Decoder
          onClose={handleToggleDecoder}
          onDecode={onDecode}
          decodeMessage={decodeMessage}
          onClearDecodeMessage={onClearDecodeMessage}
        />
      )}
    </div>
  );
}
