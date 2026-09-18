import { useState } from "react";
import "./Decoder.css";
import type { DecodeMessage } from "../DecodeMessage";

interface DecoderProps {
  onClose: () => void;
  onDecode: (value: string) => void;
  readonly decodeMessage: DecodeMessage;
  readonly onClearDecodeMessage: () => void;
}

export default function Decoder({
  onClose,
  onDecode,
  decodeMessage,
  onClearDecodeMessage,
}: DecoderProps) {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleDecode = () => {
    if (!input.trim()) {
      onClearDecodeMessage();
      setError(
        "Paste a flag number (e.g. 163), a samtools view option (e.g. -q 20), or a full samtools view command.",
      );
      return;
    }
    setError(null);
    onDecode(input.trim());
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleDecode();
  };

  const hasDecodeResult =
    decodeMessage.message.trim().length > 0 ||
    (decodeMessage.details?.length ?? 0) > 0;

  return (
    <form onSubmit={handleSubmit}>
      <div className="decode-panel">
        <p className="decode-hint">
          Paste a raw SAM flag integer (e.g. <code>163</code>), a{" "}
          <code>samtools view</code> option (e.g. <code>-q 20</code>), or a full{" "}
          <code>samtools view</code> command to decode it and rebuild it in the
          tool below.
        </p>
        <div className="decode-input-row">
          <input
            type="text"
            id="decodeInput"
            value={input}
            placeholder="163 or -q 20 or samtools view -f 2 -F 260 -q 20 sample.bam"
            onChange={(event) => {
              setInput(event.target.value);
              setError(null);
            }}
          />
        </div>

        {error && <div className="decode-result error">✕ {error}</div>}
        {!error && hasDecodeResult && (
          <div className={`decode-result ${decodeMessage.level}`}>
            <div>
              {decodeMessage.level === "error"
                ? "✕"
                : decodeMessage.level === "warn"
                  ? "⚠"
                  : "✓"}{" "}
              {decodeMessage.message}
            </div>

            {decodeMessage.details && decodeMessage.details.length > 0 && (
              <ul>
                {decodeMessage.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="decode-actions">
          <button type="submit" className="btn-decode">
            Decode
          </button>
          <button type="button" className="btn-decode-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </form>
  );
}
