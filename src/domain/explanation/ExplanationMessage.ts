export interface ExplanationMessage{
    readonly text: string;
    readonly type: ExplanationType;
}

export const EXPLANATION_TYPE = {
    COMMAND: "command",
    RULE: "rule",
} as const;


export type ExplanationType = typeof EXPLANATION_TYPE[keyof typeof EXPLANATION_TYPE];