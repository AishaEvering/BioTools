export interface ViewOptionConstraints {
    readonly type: "integer" | "enum" | "string";
    readonly minimum?: number;
    readonly allowableValues?: readonly string[];
}