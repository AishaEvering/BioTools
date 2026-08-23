import "./Explanations.css";
import {
  EXPLANATION_TYPE,
  EXPLANATION_GROUP,
  type ExplanationMessage,
} from "../../domain/explanation/ExplanationMessage";
import { RULE_SEVERITY } from "../../domain/rules/Rule";

interface ExplanationsProps {
  explanations: readonly ExplanationMessage[];
}

export default function Explanations({ explanations }: ExplanationsProps) {
  const commandMessages = explanations.filter(
    (message) =>
      message.type === EXPLANATION_TYPE.COMMAND &&
      (message.group === EXPLANATION_GROUP.INCLUDE || EXPLANATION_GROUP.OPTION),
  );

  const excludeMessage = explanations.filter(
    (message) =>
      message.type === EXPLANATION_TYPE.COMMAND &&
      message.group === EXPLANATION_GROUP.EXCLUDE,
  );

  const errors = explanations.filter(
    (message) =>
      message.type === EXPLANATION_TYPE.RULE &&
      message.severity === RULE_SEVERITY.ERROR,
  );

  const warnings = explanations.filter(
    (message) =>
      message.type === EXPLANATION_TYPE.RULE &&
      message.severity === RULE_SEVERITY.WARNING,
  );

  const info = explanations.filter(
    (message) =>
      message.type === EXPLANATION_TYPE.RULE &&
      message.severity === RULE_SEVERITY.INFO,
  );

  return (
    <div className="explain">
      {errors.length > 0 && (
        <div className="explain-block error">
          <h3>✕ Error</h3>
          <ul>
            {errors.map((message, index) => (
              <li key={index}>{message.text}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="explain-block warn">
          <h3>⚠ Warning</h3>
          <ul>
            {warnings.map((message, index) => (
              <li key={index}>{message.text}</li>
            ))}
          </ul>
        </div>
      )}

      {commandMessages.length > 0 && (
        <div className="explain-block include">
          <h3>Command</h3>
          <ul>
            {commandMessages.map((message, index) => (
              <li key={index}>{message.text}</li>
            ))}
          </ul>
        </div>
      )}

      {excludeMessage.length > 0 && (
        <div className="explain-block exclude">
          <h3>Exclude</h3>
          <ul>
            {excludeMessage.map((message, index) => (
              <li key={index}>{message.text}</li>
            ))}
          </ul>
        </div>
      )}

      {info.length > 0 && (
        <div className="explain-block info">
          <h3>ℹ Info</h3>
          <ul>
            {info.map((message, index) => (
              <li key={index}>{message.text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
