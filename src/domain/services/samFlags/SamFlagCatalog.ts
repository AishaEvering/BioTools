import samFlagDefinitions from "../../../data/samFlags.json";
import type { SamFlag } from "../../sam/SamFlag";

export class SamFlagCatalog {

  private readonly flags: readonly SamFlag[] = samFlagDefinitions;

  getAll(): readonly SamFlag[] {
    return this.flags;
  }

  getFlagById(id: number): SamFlag | undefined {
    return this.flags.find(flag => flag.id === id);
  }
}