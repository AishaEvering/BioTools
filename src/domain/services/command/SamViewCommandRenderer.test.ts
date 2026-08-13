import { describe, expect, it } from "vitest";
import { renderSamViewCommand } from "./SamViewCommandRenderer";
import type { SamViewCommand } from "../../command/SamViewCommand";
import { ViewOptionCatalog } from "../viewOptions/ViewOptionCatalog";

 const catalog = new ViewOptionCatalog();

function createCommand(
  overrides: Partial<SamViewCommand> = {},
): SamViewCommand {
  return {
    flagFilter: {
      includedFlags: [],
      excludedFlags: [],
      calculatedIncludeValue: 0,
      calculatedExcludeValue: 0,
    },
    options: [],
    ...overrides,
  };
}


describe("renderSamViewCommand", () => {
  it("renders the default command with an input placeholder", () => {
    const command = createCommand();

    expect(renderSamViewCommand(command))
      .toBe("samtools view <input.bam>");
  });

  it("renders included flags", () => {
    const command = createCommand({
      flagFilter: {
        includedFlags: [],
        excludedFlags: [],
        calculatedIncludeValue: 2,
        calculatedExcludeValue: 0,
      },
    });

    expect(renderSamViewCommand(command))
      .toBe("samtools view -f 2 <input.bam>");
  });

  it("renders excluded flags", () => {
    const command = createCommand({
      flagFilter: {
        includedFlags: [],
        excludedFlags: [],
        calculatedIncludeValue: 0,
        calculatedExcludeValue: 256,
      },
    });

    expect(renderSamViewCommand(command))
      .toBe("samtools view -F 256 <input.bam>");
  });

  it("renders included and excluded flags", () => {
    const command = createCommand({
      flagFilter: {
        includedFlags: [],
        excludedFlags: [],
        calculatedIncludeValue: 2,
        calculatedExcludeValue: 256,
      },
    });

    expect(renderSamViewCommand(command))
      .toBe("samtools view -f 2 -F 256 <input.bam>");
  });

  it("renders an option without a value", () => {
    const option = catalog.getViewOptionById(200);

    if (!option) {
      throw new Error("Expected ViewOption 200 to exist");
    }

    const command = createCommand({
      options: [
        {
          option: option,
        },
      ],
    });

    expect(renderSamViewCommand(command))
      .toBe("samtools view -h <input.bam>");
  });

  it("renders an option with a value", () => {
    const option = catalog.getViewOptionById(202);

    if (!option) {
      throw new Error("Expected ViewOption 202 to exist");
    }

    const command = createCommand({
      options: [
        {
          option: option,
          value: 20,
        },
      ],
    });

    expect(renderSamViewCommand(command))
      .toBe("samtools view -q 20 <input.bam>");
  });

  it("renders multiple selected options in order", () => {
    const includeHeaderOption = catalog.getViewOptionById(200);

    if (!includeHeaderOption) {
      throw new Error("Expected ViewOption 200 to exist");
    }

    const minimumMappingQualityOption = catalog.getViewOptionById(202);

    if (!minimumMappingQualityOption) {
      throw new Error("Expected ViewOption 202 to exist");
    }

    const command = createCommand({
      options: [
        {
          option: includeHeaderOption,
        },
        {
          option: minimumMappingQualityOption,
          value: 20,
        },
      ],
    });

    expect(renderSamViewCommand(command))
      .toBe("samtools view -h -q 20 <input.bam>");
  });

  it("renders the provided input filename", () => {
    const command = createCommand({
      inputFile: "sample.bam",
    });

    expect(renderSamViewCommand(command))
      .toBe("samtools view sample.bam");
  });

  it("renders the complete command", () => {
      const includeHeaderOption = catalog.getViewOptionById(200);

    if (!includeHeaderOption) {
      throw new Error("Expected ViewOption 200 to exist");
    }

    const minimumMappingQualityOption = catalog.getViewOptionById(202);

    if (!minimumMappingQualityOption) {
      throw new Error("Expected ViewOption 202 to exist");
    }

    const command = createCommand({
      flagFilter: {
        includedFlags: [],
        excludedFlags: [],
        calculatedIncludeValue: 2,
        calculatedExcludeValue: 256,
      },
      options: [
        {
          option: includeHeaderOption,
        },
        {
          option: minimumMappingQualityOption,
          value: 20,
        },
      ],
      inputFile: "sample.bam",
    });

    expect(renderSamViewCommand(command))
      .toBe("samtools view -h -q 20 -f 2 -F 256 sample.bam");
  });

  it("renders undefined when a required option value is missing", () => {
    const minimumMappingQualityOption = catalog.getViewOptionById(202);

    if (!minimumMappingQualityOption) {
      throw new Error("Expected ViewOption 202 to exist");
    }

    const command = createCommand({
      options: [
        {
          option: minimumMappingQualityOption,
        },
      ],
    });

    expect(renderSamViewCommand(command))
      .toBe("samtools view -q undefined <input.bam>");
  });
});