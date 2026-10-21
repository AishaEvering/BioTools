import TopBar from "./ui/layout/TopBar/TopBar";
import "./styles/global.css";
import BuilderPanel from "./ui/layout/BuilderPanel/BuilderPanel";
import OutputPanel from "./ui/layout/OutputPanel/OutputPanel";
import { createFlagFilter } from "./domain/services/filtering/CreateFlagFilter";
import { useMemo, useState } from "react";
import type { FlagFilter } from "./domain/filtering/FlagFilter";
import BottomBar from "./ui/layout/BottomBar/BottomBar";
import type { SelectedViewOption } from "./domain/options/SelectedViewOption";
import type { SamFlag } from "./domain/sam/SamFlag";
import { DECODE_MESSAGE_LEVEL, type DecodeMessage } from "./ui/DecodeMessage";
import { SamFlagCatalog } from "./domain/services/samFlags/SamFlagCatalog";
import { ViewOptionCatalog } from "./domain/services/viewOptions/ViewOptionCatalog";
import { SamInputDecoder } from "./domain/services/decoder/SamViewDecoder/SamInputDecoder";
import { DECODE_INPUT_TYPE } from "./domain/decode/DecodeInputClassifier";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  const samFlagCatalog = useMemo(() => new SamFlagCatalog(), []);
  const viewOptionCatalog = useMemo(() => new ViewOptionCatalog(), []);
  const samInputDecoder = useMemo(
    () => new SamInputDecoder(samFlagCatalog, viewOptionCatalog),
    [samFlagCatalog, viewOptionCatalog],
  );

  const [decodeMessage, setDecodeMessage] = useState<DecodeMessage>({
    level: DECODE_MESSAGE_LEVEL.INFO,
    message: "",
    details: [],
  });
  const [flagFilter, setFlagFilter] = useState<FlagFilter>(
    createFlagFilter([], []),
  );
  const [selectedOptions, setSelectedOptions] = useState<SelectedViewOption[]>(
    [],
  );
  const [highlightedKeys, setHighlightedKeys] = useState<string[]>([]);
  const [hiddenFlags, setHiddenFlags] = useState<SamFlag[]>([]);
  const [inputFile, setInputFile] = useState("");

  const handleResetAll = () => {
    setFlagFilter(createFlagFilter([], []));
    setSelectedOptions([]);
    setInputFile("");

    setDecodeMessage({
      level: DECODE_MESSAGE_LEVEL.INFO,
      message: "",
      details: [],
    });
  };

  const handleDecode = (value: string) => {
    const result = samInputDecoder.decode(value);

    switch (result.type) {
      case DECODE_INPUT_TYPE.SAM_VIEW_FLAG: {
        const flagsResult = result.result;

        // Reset form and apply decoded flags
        setSelectedOptions([]);
        setInputFile("");
        setFlagFilter(createFlagFilter(flagsResult.matched, []));

        if (flagsResult.isValid) {
          const flags = flagsResult.matched.map((flag) => flag.name).join(", ");

          const details: string[] = [];

          if (flagsResult.unknownBits.length > 0) {
            details.push(
              `Unknown bits: ${flagsResult.unknownBits.join(", ")}.`,
            );
          }

          setDecodeMessage({
            level:
              details.length > 0
                ? DECODE_MESSAGE_LEVEL.WARN
                : DECODE_MESSAGE_LEVEL.INFO,
            message:
              flagsResult.matched.length === 0
                ? "Decoded 0 flags."
                : `Decoded flag${flagsResult.matched.length !== 1 ? "s" : ""} ` +
                  `${flags}.`,
            details,
          });
        } else {
          setDecodeMessage({
            level: DECODE_MESSAGE_LEVEL.ERROR,
            message: "Decoded 0 flags.",
            details: flagsResult.error ? [flagsResult.error] : [],
          });
        }

        break;
      }

      case DECODE_INPUT_TYPE.SAM_VIEW_OPTION: {
        const optionResult = result.result;

        // Reset form and apply decoded option
        setFlagFilter(createFlagFilter([], []));
        setInputFile("");
        setSelectedOptions(
          optionResult.isValid && optionResult.option
            ? [optionResult.option]
            : [],
        );

        if (optionResult.isValid && optionResult.option) {
          setDecodeMessage({
            level: DECODE_MESSAGE_LEVEL.INFO,
            message: `Decoded ${optionResult.option.option.name} option.`,
            details: [],
          });
        } else {
          setDecodeMessage({
            level: DECODE_MESSAGE_LEVEL.ERROR,
            message: "Decoded 0 options.",
            details: optionResult.error ? [optionResult.error] : [],
          });
        }

        break;
      }

      case DECODE_INPUT_TYPE.SAM_VIEW_COMMAND: {
        const commandResult = result.result;

        // Reset form and apply everything that decoded successfully
        setFlagFilter(commandResult.command.flagFilter);
        setSelectedOptions(commandResult.command.options);
        setInputFile(commandResult.command.inputFile ?? "");

        const flagCount =
          commandResult.command.flagFilter.includedFlags.length +
          commandResult.command.flagFilter.excludedFlags.length;

        const optionCount = commandResult.command.options.length;

        const details = [...commandResult.errors];

        if (commandResult.unknownIncludedBits.length > 0) {
          details.push(
            `Unknown included bits: ${commandResult.unknownIncludedBits.join(", ")}.`,
          );
        }

        if (commandResult.unknownExcludedBits.length > 0) {
          details.push(
            `Unknown excluded bits: ${commandResult.unknownExcludedBits.join(", ")}.`,
          );
        }

        const summary =
          `Decoded ${flagCount} flag${flagCount !== 1 ? "s" : ""} ` +
          `and ${optionCount} option${optionCount !== 1 ? "s" : ""}` +
          (commandResult.command.inputFile
            ? `, input file "${commandResult.command.inputFile}".`
            : ".");

        const decodedSomething =
          flagCount > 0 ||
          optionCount > 0 ||
          commandResult.command.inputFile !== undefined;

        setDecodeMessage({
          level:
            details.length === 0
              ? DECODE_MESSAGE_LEVEL.INFO
              : decodedSomething
                ? DECODE_MESSAGE_LEVEL.WARN
                : DECODE_MESSAGE_LEVEL.ERROR,
          message: decodedSomething ? summary : "Unable to decode the command.",
          details,
        });

        break;
      }
    }
  };

  const handleClearDecodeMessage = () => {
    setDecodeMessage({
      level: DECODE_MESSAGE_LEVEL.INFO,
      message: "",
      details: [],
    });
  };

  return (
    <>
      <TopBar />

      <main className="workspace">
        <BuilderPanel
          flagFilter={flagFilter}
          setFlagFilter={setFlagFilter}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          setHighlightedKeys={setHighlightedKeys}
          hiddenFlags={hiddenFlags}
          setHiddenFlags={setHiddenFlags}
          onResetAll={handleResetAll}
          onDecode={handleDecode}
          decodeMessage={decodeMessage}
          samFlagCatalog={samFlagCatalog}
          viewOptionCatalog={viewOptionCatalog}
          onClearDecodeMessage={handleClearDecodeMessage}
        />
        <OutputPanel
          flagFilter={flagFilter}
          selectedOptions={selectedOptions}
          setHighlightedKeys={setHighlightedKeys}
          highlightedKeys={highlightedKeys}
          hiddenFlags={hiddenFlags}
          inputFile={inputFile}
          setInputFile={setInputFile}
        />
        <Analytics />
        <SpeedInsights />
      </main>

      <BottomBar />
    </>
  );
}

export default App;
