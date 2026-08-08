# BioTools Domain Model

## Purpose

This document defines the core concepts used by the SAM Flag Visual Builder.

The domain model is independent of the user interface. React components may display and modify these concepts, 
but the underlying SAM flag logic should remain separate from React.

## Core Concepts

### $${\color{blue}SAM \space Flag}$$

Represents one bitwise property associated with a sequencing alignment record.

Each flag contains:

* An immutable unique numeric value
* An immutable hexadecimal value
* An immutable name
* An immutable description
* An immutable category
* An immutable inclusion phrase
* An immutable exclusion phrase

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

A SAM flag definition is reference data. It does not change based on user interaction.

---

### $${\color{blue}Flag \space Filter}$$

Represents the complete collection of included and excluded flags selected by the user.

A flag filter contains:

* Included flags
* Excluded flags
* Calculated include value
* Calculated exclude value

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

A flag filter must not store a manually entered total that can become inconsistent with its selected flags. The total should always be derived from the current selections.

---

### $${\color{blue}View \space Option}$$

Represents a supported samtools view argument that is not part of the SAM bitwise flag filter.

Examples may include:
- Include the header
- Count matching records
- Set a minimum mapping quality
- Select an output format

**Only options explicitly supported by BioTools should be included in the model.**

A View Option contains:
* Name
* Command line syntax
* Optional value
* Description
* Explanation Phrase

Example:

```text
Name: Minimum Mapping Quality
Syntax: -q
Value: 20
Description: Only include alignments with mapping quality at least 20.
ExplanationPhrase: Includes only alignments with mapping quality of at least 20.
```
---

### $${\color{blue}Samtools \space View \space Command}$$

Represents the current configuration used to generate a samtools view command.

A command may contain:

* Flag Filter
* View Options
* Optional Filename

If no filename has been entered, the interface may display an instructional placeholder, <input.bam>.
Example:

```typescript
interface SamtoolsViewCommand{
  readonly flagFilter: FlagFilter;
  readonly options: ViewOption[];
  inputFile?: string;
}

function renderSamtoolsViewCommand(
   command: SamtoolsViewCommand,
): string;
```

The rendered command is calculated dynamically whenever the command configuration changes.
It is not stored as independent state because doing so could allow the rendered text
to become inconsistent with the current configuration.

The command should not contain `-f` or `-F` when no corresponding flags are selected.

Example:

```text
samtools view -h -q 20 -f 2 -F 256 sample.bam
```
---

### $${\color{blue}Explanation \space Engine}$$

Generates explanation messages from the current command, active command combination, and validation results.

It receives:
- A SAMtools View Command
- Command Combination
- Validation Results

It produces:
- Zero or more explanation messages

The Explanation Engine does not modify the command, flag filter, or validation results.

```typescript
interface ExplanationEngine {
  explain(
    command: SamtoolsViewCommand,
    validationResults: ValidationResult[],
    activeCombination?: CommandCombination,
  ): string[];
}
```

An explanation may describe:
* What an individual flag means
* What included flags require
* What excluded flags remove
* What the complete command will return
* Why a selection is invalid or potentially confusing

Example:

```text
This command returns alignments marked as properly paired while excluding secondary alignments.
```

---

### $${\color{blue}Rule}$$

Describes a relationship, constraint, warning, or implication involving one or more domain concepts.

A rule contains:

* A unique identifier
* A condition
* A result
* A severity
* A message

Possible severity levels:

* Information
* Warning
* Error

Examples:

* Selecting `Proper Pair` without `Read Paired` may require guidance.
* Including and excluding the same flag is invalid.
* Certain flag combinations may be logically contradictory.
* Selecting a child flag may imply that a parent flag should also be selected.

Rules evaluate the current filter configuration. They should not depend on React components.

---

### $${\color{blue}Validation \space Result}$$

Represents the outcome of evaluating a rule.

A validation result contains:

* The rule that produced it
* Its severity
* Its message
* The flags or filters involved
* Whether the user may continue

Errors prevent generation of a valid command.

Warnings allow command generation but alert the user to a potentially unintended selection.

Informational results teach or clarify without indicating a problem.

---

### $${\color{blue}Rule \space Engine}$$

Evaluates the current FlagFilter against all defined rules.  It produces zero or more ValidationResult objects.
The Rule Engine never modifies the user's selections.  It only evaluates them.

It contains:
- Rules

It receives:
- A Flag Filter

It produces:
- Validation Results

Each call to evaluate produces a new set of validation results based on the current FlagFilter

```typescript
 interface RuleEngine{
  readonly rules: Rule[];

  evaluate(flagFilter: FlagFilter): ValidationResult[];
}
```

---

### $${\color{blue}Filter \space Preset}$$

Contains a predefined Flag Filter configuration and a researcher facing explanation.

Examples may include:

* Properly paired reads
* Primary alignments
* Unmapped reads
* Forward strand alignments
* Reverse strand alignments
* Duplicates removed

A command combination contains:

* A name
* A description
* A Flag Filter
* An explanation

Command combinations populate the same flag filter used by manual selections. 
They do not use a separate command generation process.

Once loaded, a combination's flag remain part of the ordinary Flag Filter and may
be further edited through normal manual selection.  The interface should indicate
that a selection originated from a combination and whether it has since diverged
from that combination's original configuration.

```typescript
interface FilterPreset {
  readonly name: string;
  readonly description: string;
  readonly filter: FlagFilter;
  readonly explanation: string;
}
```
---

### $${\color{blue}Inversion}$$

An inversion creates the logical opposite of a supported selection or command combination.

An inversion must be determined by domain rules rather than by simply exchanging every included and excluded flag.

Not every command has a meaningful or safe automatic inversion. Unsupported inversions should be identified clearly.

---

### $${\color{green}Relationships}$$

```text
SAM Flag
   │
   └── included in or excluded from Flag Filter
             │
             ├── used by SAMtools View Command
             │         │
             │         ├── configured by View Options
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
                       │
                       └── produces Validation Results
                                  │
                                  └── used by Explanation Engine
Rule
   │
   └── evaluated by Rule Engine

Validation Result
   │
   └── used by Explanation Engine

Command Combination
   │
   ├── creates a predefined Flag Filter
   │
   ├── may provide predefined View Options
   │
   └── may provide a researcher facing explanation

Inversion
   │
   └── transforms a supported Flag Filter
       or Command Combination
```

### $${\color{green}Domain \space Rules}$$

The following rules apply across the application:

1. A SAM flag may not be both included and excluded at the same time.
2. Include and exclude totals are always calculated from selected flags.
3. Command text is always generated from the current filter configuration.
4. React components do not perform bitwise flag calculations.
5. Rules and explanations do not depend on the visual interface.
6. A predefined command combination uses the same domain model as a manually built command.
7. Invalid selections must be identified before the command is presented as valid.
8. Warnings must explain the concern without silently changing the user’s selections.
9. The domain model must preserve the terminology used by SAM and `samtools` or whatever executable being used.
10. Explanations may simplify terminology but must not change its technical meaning.

### $${\color{green}Version \space 1 \space Scope}$$

The initial domain model must support:

* The standard SAM flag library
* Include selections
* Exclude selections
* Include value calculation
* Exclude value calculation
* Base command generation
* Explanations
* Base validation rules
* Copyable command output
* A small curated set of Command Combinations, populating the same Flag Filter used by manual selections.

The following concepts are planned but are not required for the base Visual Command Builder:

* Advanced conflict detection
* Command inversion
* Command history
* Exporting command history
* User accounts

### $${\color{green}Open \space Questions}$$

The following decisions should be resolved during architecture design or implementation:

* Which non-flag `samtools view` filters belong in Version 1?
* Should selecting a dependent flag automatically select its related parent flag, or only display a warning?
* Which combinations should be classified as errors versus warnings?
* Should generated commands use decimal flag values only, or optionally display hexadecimal values?
* How should the application represent flags whose meaning depends on whether the record is paired?
