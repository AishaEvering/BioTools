# BioTools Domain Model

## Purpose

This document defines the core concepts used by the SAM Flag Visual Builder.

The domain model is independent of the user interface. React components may display and modify these concepts,
but the underlying SAM flag logic should remain separate from React.

## Core Concepts

### $${\color{purple}SAM \space Flag}$$

Represents one bitwise property associated with a sequencing alignment record.

A SAM Flag exists in 3 forms within BioTools:

- SAM Flag Definition - the reference data stored in JSON
- SAM Flag Interface - the TypeScript contract defining the required shape of a SAM Flag.
- SAM Flag Object - the runtime representation of a SAM Flag definition and used by the application.

Each flag contains:

- An immutable unique numeric value
- An immutable hexadecimal value
- An immutable name
- An immutable description
- An immutable category
- An immutable inclusion phrase
- An immutable exclusion phrase

Example:

```text
Name: Read Paired
Value: 1
Hexadecimal: 0x1
Description: The read is part of a paired-end sequencing record.
Category: Template
Inclusion phrase: reads that are part of a paired template
Exclusion phrase: reads that are not marked as part of a paired template
```

> [!NOTE]
> SAM Flag definitions are immutable reference data stored in JSON. The SAM Flag Catalog loads
> this data and exposes it to the application as SAM Flags. User interaction may select or reference
> SAM Flags, but does not modify their definitions.

**SAM Flag Catalog**
The SAM Flag Catalog owns the loaded collection of SAM Flag objects and provides access to all flags
or a specific flag by ID.

The catalog does not create or modify SAM Flags.

Example Catalog:

```TypeScript
class SamFlagCatalog {
  getAll(): readonly SamFlag[];
  getFlagById(id: number): SamFlag | undefined;
}
```

---

### $${\color{purple}Flag \space Filter}$$

Represents the complete collection of included and excluded flags selected by the user.

A Flag Filter exists in 2 forms within BioTools:

- Flag Filter Interface - the TypeScript contract defining the required shape of a Flag Filter.
- Flag Filter Object - the runtime object created and updated as the user's flag selections change.

A flag filter contains:

- Included flags
- Excluded flags
- Calculated include value
- Calculated exclude value

The include and exclude values are calculated by combining the numeric values of the selected flags.

Example:

```text
Included flags:
- Read Paired: 1
- Proper Pair: 2

Excluded flags:
- Secondary Alignment: 256

Calculated include value:
3

Calculated exclude value:
256
```

> [!NOTE]
> A flag filter must not store a manually entered total that can become inconsistent with its selected flags. The total should always be derived from the current selections

---

### $${\color{purple}View \space Option}$$

Represents a supported Samtools view argument that is not part of the SAM bitwise flag filter.

A View Option exists in 3 forms within BioTools:

- View Option Definition - the reference data stored in JSON.
- View Option Interface - the TypeScript contract defining the required shape of the View Option.
- View Option Object - the runtime object created from a View Option definition and used by the application.

Options include:

- Include the header - `-h`
- Count matching records - `-c`
- Set a minimum mapping quality - `-q INT`
- Select an output format - `SAM, BAM, or CRAM`
- Specify an output file - `-o FILE`

> [!IMPORTANT]
> Only options explicitly supported by BioTools should be included in the model.

A View Option contains:

- Immutable unique name
- Immutable command-line syntax
- Immutable description
- Immutable explanation
- Immutable indication of whether a value is required
- Optional immutable structured constraints describing the type and allowable values of user input.

Example:

```text
Name: Minimum Mapping Quality
Syntax: -q
Requires Value: true
Description: Filters alignments below the specified mapping quality.
Explanation: Includes only alignments with mapping quality of at least {value}.
Constraints: integer
```

```JSON
{
  "name": "Output Format",
  "syntax": "...",
  "requiresValue": true,
  "constraints": {
    "type": "enum",
    "allowedValues": ["SAM", "BAM", "CRAM"]
  }
}
```

```JSON
{
  "name": "Minimum Mapping Quality",
  "syntax": "-q",
  "requiresValue": true,
  "constraints": {
    "type": "integer",
    "minimum": 0
  }
}
```

---

### Selected View Option

Represents a View Option that has been selected by the user, together with its configured value when the option requires one.

A Selected View Option exists in 2 forms within BioTools:

- Selected View Option Interface - the TypeScript contract defining the required shape of the Selected View Option.
- Selected View Option Object - the runtime object created by the application when a user selects or configures a View Option.

A Selected View Option contains:

- Immutable option: `ViewOption`
- Optional value: `string | number`

Example:

Boolean option like Include Header:

```text
option: Include Header
value: none
```

Minimum mapping quality:

```text
option: Minimum Mapping Quality
value: 20
```

Output format:

```text
option: Output Format
value: BAM
```

Output file:

```text
option: Output File
value: filtered.bam
```

---

### $${\color{purple}Sam \space View \space Command}$$

Represents the current configuration used to generate a `samtools view` command.

A Sam View Command exists in 2 forms within BioTools:

- Sam View Command Interface - the TypeScript contract defining the required shape of a command configuration.
- Sam View Command Object - the runtime object containing the current flag filter, selected view options, and optional input filename.

A Sam View Command contains:

- Flag Filter: `FlagFilter`
- Selected View Options: `SelectedViewOption[]`
- Optional Input Filename: `string`

> [!NOTE]
> If no filename has been entered, the interface may display an instructional placeholder, `<input.bam>`.
> The placeholder is presentation-only and is not stored as the actual filename.

Example:

```typescript
interface SamViewCommand {
  readonly flagFilter: FlagFilter;
  readonly options: SelectedViewOption[];
  readonly inputFile?: string;
}
```

The actual runtime object might conceptually look like:

```text
SamViewCommand Object
-----------------------------
Flag Filter:
  Include: Proper Pair
  Exclude: Secondary Alignment

Selected View Options:
  Include Header
  Minimum Mapping Quality = 20

Input File:
  sample.bam
```

The rendered command is derived from the object:

```TypeScript
function renderSamViewCommand(
   command: SamViewCommand,
): string;
```

> [!NOTE]
> The rendered command is derived from the Sam View Command Object by the command renderer.
> It is not stored as independent state because doing so could allow the rendered text
> to become inconsistent with the current configuration.

> The command should not contain `-f` or `-F` when no corresponding flags are selected.

Example:

```text
samtools view -h -q 20 -f 2 -F 256 sample.bam
```

---

### $${\color{purple}Rule \space Condition}$$

Represents the machine evaluable condition that determines whether a Rule applies
to the current application state.

A Rule exists in 2 forms within BioTools:

- Rule Condition Interface - the TypeScript contract defining that required shape of a Rule Condition.
- Rule Condition Object - the runtime object used by the Rule Engine when evaluating a Rule.

> [!NOTE]
> A Rule Condition is defined as part of a Rule Definition in JSON. It is not stored as independent
> reference data and therefore does not have its own JSON definition or catalog.

A Rule Condition contains:

- Immutable condition type
- Immutable condition specific values, when required

Supported condition types for version 1:
`requires-flags`
Determines whether a selected SAM Flag requires another SAM Flag to also be selected.
`contradiction`
Determines whether a selected SAM Flags are mutually exclusive.
`requires-option`
Determines whether a selected SAM Flags require another SAM Flag.

Contains:

- Selected Flags: `SamFlag[]`
- Required Flags: `SamFlag[]`

Example:

```text
Type: requires-flags
Selected Flags: [Proper Pair]
Required Flags: [Read Paired]

Type: contradiction
Selected Flags: [First in Pair, Second in Pair]
```

This condition is satisfied when `Proper Pair` is selected but `Read Paired` is not selected.

```TypeScript
type RuleCondition =
{
  readonly type: "requires-flags";
  readonly includedFlags: SamFlag[];
  readonly requiredFlags: SamFlag[];
}
{
  readonly type: "contradiction";
  readonly includedFlags: SamFlag[];
}
```

In Rule Definition stored in JSON, SAM Flags are referenced by their identifiers:

```JSON
{
  "type": "requires-flags",
  "includedFlags": [100],
  "requiredFlags": [101]
}
```

```JSON
{
  "type": "contradiction",
  "includedFlags": [102, 103]
}
```

```JSON
{
  "type": "requires-option",
  "selectedOptions": [203],
  "selectedValue": "CRAM",
  "requiredOptions": [205]
}
```

The runtime Rule Condition Object contains references to the corresponding `SAMFlag` objects after those
identifiers have been resolved by the application.

```text
JSON Rule Condition
-------------------
type: requires-flags
includedFlags: [100]
requiredFlags: [101]

          ↓ resolve identifiers

RuleCondition Object
--------------------
type: requires-flags
includedFlags:
  - SamFlag Object → Proper Pair

requiredFlags:
  - SamFlag Object → Read Paired
```

> [!NOTE]
> Rule Conditions contain only the information necessary to determine whether a condition is satisfied.
> They do not contain a Rule's name, severity, message, or evaluation result.

---

### $${\color{purple}Rule}$$

Describes a relationship, warning, or implication involving one or more domain concepts.

A Rule exists in 3 forms within BioTools:

- Rule Definition - the reference data stored in JSON.
- Rule Interface - the TypeScript contract defining that required shape of a Rule.
- Rule Object - the runtime object created from a Rule definition and used by the application.

Rule Definitions are converted into Rule Objects by a Rule Loader. Loaded Rule Objects
are maintained by the Rule Catalog, which provides access to the application's
supported rules.

A rule contains:

- Immutable unique identifier
- Immutable `Rule Condition`
- Immutable severity
- Immutable message

Possible severity levels:

- Info
- Warning
- Error

**Version 1 Rules**

1. `PROPER_PAIR (0x2)`applies to reads that are part of a paired template and therefore requires `PAIRED (0x1)`
   ```
   id: 1
   condition type: requires-flags
   included flags: [Proper Pair]
   required flags: [Read Paired]
   severity: Warning
   message: Proper Pair normally applies to reads marked as paired.
   ```
2. Mate Unmapped selected without Read Paired
   ```
   id: 2
   condition type: requires-flags
   included flags: [Mate Unmapped]
   required flags: [Read Paired]
   severity: Warning
   message: Mate Unmapped applies to reads that are part of a paired template.
   ```
3. Mate Reverse selected without Read Paired
   ```
   id: 3
   condition type: requires-flags
   included flags: [Mate Reverse]
   required flags: [Read Paired]
   severity: Warning
   message: Mate Reverse applies to reads that are part of a paired template.
   ```
4. First in Pair selected without Read Paired
   ```
   id: 4
   condition type: requires-flags
   included flags: [First in Pair]
   required flags: [Read Paired]
   severity: Warning
   message: First in Pair applies to reads that are part of a paired template.
   ```
5. Second in Pair selected without Read Paired
   ```
   id: 5
   condition type: requires-flags
   included flags: [Second in Pair]
   required flags: [Read Paired]
   severity: Warning
   message: Second in Pair applies to reads that are part of a paired template.
   ```
6. First in pair and Second in pair are mutually exclusive
   ```
   id: 6
   condition type: contradiction
   included flags: [First in Pair, Second in Pair]
   severity: Error
   message: A read can't be both first and second in a pair.
   ```
7. CRAM output selected without a Reference File
   ```
   id: 7
   condition type: requires-option
   selected option: Output Format
   selected value: "CRAM"
   required option: Reference File
   severity: Warning
   message: CRAM output may require access to a reference FASTA.  Specify a reference file with -T when the reference can't otherwise be resolved.
   ```

The Rule Interface defines the runtime shape of a Rule:

```TypeScript
interface Rule {
  readonly id: number;
  readonly condition: RuleCondition;
  readonly severity: RuleSeverity;
  readonly message: string;
}

type RuleSeverity = "info" | "warning" | "error";
```

A Rule Definition stored in JSON references SAM Flags by their identifiers:

```JSON
{
  "id": 1,
  "condition": {
    "type": "requires-flags",
    "includedFlags": [101],
    "requiredFlags": [100]
  },
  "severity": "warning",
  "message": "Proper Pair normally applies to reads marked as paired"
}
```

When the Rule Definition is loaded, the flag identifiers within its `RuleCondition` are
resolved to the corresponding `SAMFlag` objects.

Conceptually:

```text
Rule Definition
-----------------------------
id: 1
condition:
  type: requires-flags
  includedFlags: [101]
  requiredFlags: [100]
severity: warning
message: ...

            ↓ load and resolve

Rule Object
-----------------------------
id: 1
condition:
  type: requires-flags
  includedFlags:
    - Proper Pair → SamFlag Object
  requiredFlags:
    - Read Paired → SamFlag Object
severity: warning
message: ...
```

Example Rule Loader:

```TypeScript
interface RuleLoader {
  load(): Rule[];
}
```

> [!NOTE]
> Rule Definitions are immutable reference data. They describe how a configuration should be evaluated
> but do not contain evaluation state or evaluation results.

> [!IMPORTANT]
> Rules operate on domain/application state and must not depend on React components or other
> presentation layer concerns.

The Rule Catalog maintains the collection of loaded Rule Objects and provides
access to the rules used by the application.

The Rule Catalog receives Rules from a Rule Loader rather than reading JSON
directly.

```text
Conceptually:

Rule Definitions
       ↓
   Rule Loader
       ↓
    Rule[]
       ↓
  Rule Catalog
       ↓
Rule Engine / Application
```

---

### $${\color{purple}Validation \space Result}$$

> [!NOTE]
> Validation Result was removed from the version 1 domain model.
>
> Validation was originally modeled as a separate runtime result containing
> the Rule whose condition was satisfied. As the Rule model evolved, validation
> conditions were incorporated into the general Rule system.
>
> Because a Validation Result contained only a reference to a Rule, it did not
> add additional domain information. The Rule Engine therefore returns the
> Rules whose conditions are satisfied directly.
>
> A separate evaluation result object may be introduced in the future if
> evaluation produces runtime-specific information that is not contained
> within the Rule itself.

~~Represents the result of a Rule whose condition was satisfied while evaluating the current application state.~~

~~A Validation Result contains:~~

~~- The rule that produced the result~~

~~> [!NOTE]~~
~~> The Rule provides the severity, message, and `Rule Condition` associated with the result.~~

~~Validation Results are created by the Rule Engine during evaluation. They represent runtime~~
~~evaluation state and are not stored as reference data.~~

~~```TypeScript~~

~~interface ValidationResult{~~
~~readonly rule: Rule;~~
~~}~~
~~```~~

Examples of Rules include:

```text
Rule
----------------------
id: 7
condition:
  type: include-exclude-overlap
severity: error
message: A SAM Flag can't be both included and excluded.

id: 8
condition:
  type: contradiction
included flags: [Proper Pair, Read Unmapped]
severity: error
message: A read marked as properly paired cannot also be marked as unmapped.

id: 9
condition:
  type: contradiction
included flags: [Proper Pair, Mate Unmapped]
severity: error
message: A properly paired read cannot have an unmapped mate.
```

~~Given the following `FlagFilter`:~~

~~```text~~
~~FlagFilter~~
~~-------------------~~
~~includedFlags:~~
~~- Proper Pair~~

~~excludedFlags:~~
~~- Proper Pair~~
~~```~~

~~the Rule Engine determines that the Rule Condition is satisfied and produces:~~

~~```text~~
~~ValidationResult~~
~~---------------------~~
~~rule: Rule 7~~
~~```~~

~~The Validation Result provides access to the Rule's evaluation information:~~

~~```text~~
~~result.rule.severity → error~~
~~result.rule.message → "A SAM Flag cannot be both included and excluded."~~
~~result.rule.condition → include-exclude-overlap~~
~~```~~

~~- An `error` indicates that the current configuration is invalid and should not be treated as a valid command.~~
~~- A `warning` indicates that command generation may continue, but the selection may be unintended or confusing.~~
~~- An `information` result provides clarification without indicating a problem.~~

~~> [!NOTE]~~
~~> A Validation Result does not duplicate the Rule's severity, message, or condition. These remain properties~~
~~> of the Rule that produced the result.~~

---

### $${\color{purple}Filter \space Preset}$$

Contains a predefined Flag Filter configuration and a researcher facing explanation.

A Filter Preset exists in 5 forms within BioTools:

- Filter Preset Definition - the reference data stored in JSON.
- Filter Preset Interface - the TypeScript contract defining that required shape of a FilterPreset.
- Filter Preset Object - created after its referenced SAM Flag identifiers are resolved.
- Filter Preset Catalog - owns the loaded collection and provides lookup/access
- Filter Preset Loader - loads the collection of JSON objects to a list of concrete object.

Examples may include:

- Properly paired reads
- Primary alignments
- Unmapped reads
- Forward strand alignments
- Reverse strand alignments
- Duplicates removed

A filter preset contains:

- Immutable unique identifier
- Immutable name
- Immutable description
- Immutable Flag Filter
- Immutable explanation

Filter Presets populate the same flag filter used by manual selections.
They do not use a separate command generation process.

Once loaded, a preset's flags remain part of the ordinary Flag Filter and may
be further edited through normal manual selection.

```JSON
{
  "id": 1,
  "name": "Primary Alignments",
  "description": "Select primary alignments only.",
  "filter": {
    "includedFlags": [],
    "excludedFlags": [102, 103]
  },
  "explanation": "Returns primary alignments by excluding secondary and supplementary alignments."
}
```

```typescript
interface FilterPreset {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly filter: FlagFilter;
  readonly explanation: string;
}
```

```text
Filter Preset Definition
-------------------------
id: 1
filter:
  includedFlags: []
  excludedFlags: [102, 103]

          ↓ resolve identifiers

FilterPreset Object
-------------------
id: 1
filter:
  includedFlags: []
  excludedFlags:
    - Secondary → SamFlag Object
    - Supplementary → SamFlag Object
```

Filter Preset Catalog Example:

```TypeScript
class FilterPresetCatalog {
  getAll(): readonly FilterPreset[];
  findMatching(filter: FlagFilter): FilterPreset | undefined;
}
```

Filter Preset Loader Example:

```TypeScript
interface FilterPresetLoader {
  load(flagCatalog: SamFlagCatalog): FilterPreset[];
}
```

---

### $${\color{purple}Filter \space Inversion}$$

An inversion creates the logical opposite of a supported selection Flag Filter or filter Preset.

An inversion must be determined by domain rules rather than by simply exchanging every included and excluded flag.

Not every command has a meaningful or safe automatic inversion. Unsupported inversions should be identified clearly.

---

## Domain Services

### $${\color{blue}Explanation \space Engine}$$

Generates explanation messages from the current `SamViewCommand` and the Rules whose conditions are
satisfied by the current application state.

It receives:

- A SamViewCommand
- matched rules
  It produces:

- Zero or more explanation messages

The Explanation Engine does not modify the command, flag filter, or validation results.

```typescript
class ExplanationEngine {
  constructor(
    private readonly presetCatalog: FilterPresetCatalog
  ) {}

  explain(
    command: SamViewCommand,
    matchedRules:readonly Rule[],
  ): ExplanationMessage[] {
    // generate flag explanations
    // generate option explanations
    // incorporate matched rule explanations
    // consolidate messages
  }

  export interface ExplanationMessage{
   readonly text: string;
   readonly type: ExplanationType;
  }

  export type ExplanationType = "command" | "rule";
}
```

An explanation may describe:

- What an individual flag means
- What relationships or requirements are relevant to the selected flags
- What excluded flags remove
- What the complete command will return
- Why a selection is invalid or potentially confusing

> [!NOTE]
> Rule related explanations are derived from Rules already matched by the Rule Engine. The Explanation
> Engine does not independently evaluate Rules.

```text
Rule Engine
    ↓
determines WHICH rules apply

Explanation Engine
    ↓
determines HOW to explain the current command and those rules
```

Example:

```text
This command returns alignments marked as properly paired while excluding secondary alignments.
```

---

### $${\color{blue}Rule \space Engine}$$

Evaluates the current `SamViewCommand` against all applicable Rules and returns zero
or more matching `Rule` objects.

> [!NOTE]
> The Rule Engine never modifies the user's selections. It only evaluates them.

It contains:

- A Rule Catalog

It receives:

- SamViewCommand

It produces:

- Zero or more Matched Rules

Each call to `evaluate` produces a new set of matched `Rules[]` based on the current `SamViewCommand`.

> [!NOTE]
> The Rule Engine determines whether Rule Conditions are satisfied. It does not generate user facing explanations
> beyond the information contained in the resulting `Rules`.

```TypeScript
 export class RuleEngine {
  private readonly ruleCatalog: RuleCatalog;

  constructor(
    this.ruleCatalog = ruleCatalog;
  ) {}

  evaluate(command: SamViewCommand): readonly Rule[] {
    // evaluate each rule
    // return rules whose conditions are satisfied
  }

  private isConditionSatisfied(
    condition: RuleCondition,
    command: SamViewCommand
  ): boolean {
    //evaluate condition
  }
}
```

---

## Relationships

```text
SAM Flag
   │
   └── included in or excluded from Flag Filter
             │
             ├── used by SAMtools View Command
             │         │
             │         ├── contains Selected View Options
             │         │         │
             │         │         └── references View Options
             │         │
             │         ├── used by Explanation Engine
             │         │
             │         └── passed to Command Renderer
             │                   │
             │                   └── produces Rendered Command
             │
             └── evaluated by Rule Engine
                       │
                       ├── evaluates Rules
                       │         │
                       │         └── contains Rule Condition
                       │
                       └── produces Validation Results
                                  │
                                  └── references triggered Rule


Filter Preset
   │
   ├── contains predefined Flag Filter
   │
   ├── loaded through Filter Preset Catalog
   │
   └── may be recognized by Explanation Engine


Rule
   │
   ├── contains Rule Condition
   │
   ├── loaded through Rule Catalog
   │
   └── evaluated by Rule Engine
             │
             └── produces Validation Result when satisfied


Validation Result
   │
   ├── references Rule that produced it
   │
   └── used by Explanation Engine


Explanation Engine
   │
   ├── receives SAMtools View Command
   ├── uses Filter Preset Catalog
   ├── receives Validation Results
   │
   └── produces Explanation Messages


Explanation Message
   │
   ├── contains explanation type
   └── contains researcher-facing message


Inversion
   │
   └── transforms a supported Flag Filter
       or Filter Preset using domain-defined behavior
```

## Domain Rules

The following rules apply across the application:

1. A SAM flag may not be both included and excluded at the same time.
2. Include and exclude totals are always calculated from selected flags.
3. Command text is always generated from the current filter configuration.
4. React components do not perform bitwise flag calculations.
5. Rules and explanations do not depend on the visual interface.
6. A predefined filter preset uses the same domain model as a manually built command.
7. Invalid selections must be identified before the command is presented as valid.
8. Warnings must explain the concern without silently changing the user’s selections.
9. The domain model must preserve the terminology used by SAM and `samtools` or whatever executable being used.
10. Explanations may simplify terminology but must not change its technical meaning.

## $${\color{yellow}Version \space 1 \space Scope}$$

The initial domain model must support:

- The standard SAM flag library
- Include selections
- Exclude selections
- Include value calculation
- Exclude value calculation
- Base command generation
- Explanations
- Base validation rules
- Copyable command output

The following concepts are planned but are not required for the base Visual Command Builder:

- A small curated set of Filter Presets, populating the same Flag Filter used by manual selections.
- Advanced conflict detection
- Command inversion
- Command history
- Exporting command history
- User accounts

## Open Questions

The following decisions should be resolved during architecture design or implementation:

- Which non-flag `samtools view` filters belong in Version 1?
- Should selecting a dependent flag automatically select its related parent flag, or only display a warning?
- Which combinations should be classified as errors versus warnings?
- Should generated commands use decimal flag values only, or optionally display hexadecimal values?
- How should the application represent flags whose meaning depends on whether the record is paired?
