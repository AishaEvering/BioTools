export type ViewOptionConstraints =
  | {
      readonly type: "integer";
      readonly minimum?: number;
      readonly maximum?: number;
    }
  | {
      readonly type: "enum";
      readonly allowableValues: string[];
    }
  | {
      readonly type: "string";
    };