# BioTools Domain Model

## Purpose

This document defines the core concepts used by the SAM Flag Visual Builder.

The domain model is independent of the user interface. React components may display and modify these concepts, 
but the underlying SAM flag logic should remain separate from React.

## Core Concepts

### SAM Flag

A SAM flag represents one bitwise property associated with a sequencing alignment record.

Each flag contains:

* An immutable unique numeric value
* An immutable hexadecimal value
* An immutable name
* An immutable description
* An immutable category

Example:

```text
Name: Read Paired
Value: 1
Hexadecimal: 0x1
Description: The read is part of a paired-end sequencing record.
Category: Template
```

A SAM flag definition is reference data. It does not change based on user interaction.

---

### Flag Filter

A flag filter represents the complete collection of included and excluded flags selected by the user.

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

Calculated include value:
3

Calculated exclude value:
1
```

A flag filter must not store a manually entered total that can become inconsistent with its selected flags. The total should always be derived from the current selections.

---

### Command Definition
Identifies the underlying command line program and subcommand supported by a BioTool.

A command definition may contain:

* Base executable
* Subcommand

Example:

```text
Included flags:
- Base executable: samtools
- Subcommand: view
```

```typescript
A CommandDefinition may be represented as:
interface CommandDefinition{
 readonly executable: string;
 readonly subcommand: string;
}
```

---

### View Option

Supported subcommand argument that are not part of the SAM bitwise flag filter.

Examples may include:
- Include the header
- Count matching records
- Set a minimum mapping quality
- Select an output format

** Only options explicitly supported should be included in the model.

A View Option contains:
* Name
* Command line syntax
* Description

Example:

```text
Name: Count
Syntax: -c
Description: only count them and print the total number
```
---

### Command

A command represents the generated `samtools view` command.

A command may contain:

* CommandDefinition
* FlagFilter
* ViewOptions
* Optional input filename

If no filename has been entered, the interface may display an instructional placeholder, <input.bam>.
Example:

```typescript
interface SamtoolsViewCommand{
  readonly commandDefinition: CommandDefinition;
  readonly flagFilter: FlagFilter;
  readonly options[]: ViewOption;
  inputFile?: string;
}
```

The rendered command is derived from the current filter configuration.

The command should not contain `-f` or `-F` when no corresponding flags are selected.

---

### Rendered Command
Produces the command line produced from the Command object

Example:

```text
samtools view -h -q 20 -f 2 -F 256 sample.bam
```
The rendered command is calculated dynamically whenever the command configuration changes.
It is not stored as independent state because doing so could allow the rendered text
to become inconsistent the current configuration.

---

### Explanation

An explanation provides an interpretation of a selection or generated command.

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

Explanations are derived from flag definitions, filter selections, and applicable rules.

---

### Rule

A rule describes a relationship, constraint, warning, or implication involving one or more domain concepts.

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

### Validation Result

A validation result represents the outcome of evaluating a rule.

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

### Command Combination

A command combination is a predefined configuration representing a common research intention.

Examples may include:

* Properly paired reads
* Primary alignments
* Unmapped reads
* Forward-strand alignments
* Reverse-strand alignments

A command combination contains:

* A name
* A description
* A Command
* An explanation

Command combinations populate the same flag filter used by manual selections. 
They do not use a separate command-generation process.

---

### Inversion

An inversion creates the logical opposite of a supported selection or command combination.

An inversion must be determined by domain rules rather than by simply exchanging every included and excluded flag.

Not every command has a meaningful or safe automatic inversion. Unsupported inversions should be identified clearly.

## Relationships

```text
SAM Flag
   │
   └── used by Flag Selection
             │
             └── grouped into Flag Filter
                       │
                       ├── evaluated by Rules
                       │        │
                       │        └── produce Validation Results
                       │
                       ├── used to generate Explanations
                       │
                       └── used to generate Command

Command Combination
   │
   └── creates a predefined Flag Filter

Inversion
   │
   └── transforms a supported Flag Filter or Command Combination
```

## Domain Rules

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

## Version 1 Scope

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
* Initial Command combinations

The following concepts are planned but are not required for the base Visual Command Builder:

* Advanced conflict detection
* Command combinations
* Command inversion
* Command history
* Exporting command history
* User accounts

## Open Questions

The following decisions should be resolved during architecture design or implementation:

* Which non-flag `samtools view` filters belong in Version 1?
* Should selecting a dependent flag automatically select its related parent flag, or only display a warning?
* Which combinations should be classified as errors versus warnings?
* Should generated commands use decimal flag values only, or optionally display hexadecimal values?
* How should the application represent flags whose meaning depends on whether the record is paired?
