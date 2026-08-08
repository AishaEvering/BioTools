# BioTools Architecture

## Architectural Principles

- Single source of truth.
- Derived data is never stored independently.
- Reference data is immutable.
- Engines are stateless whenever possible.
- Explanations are separated from rule evaluation.
- Shared functionality should be reusable across applications when it naturally belongs in the platform core.
  
## Philosophy

BioTools is designed as a platform of educational bioinformatics applications.
Rather than replacing existing command line tools, BioTools helps researchers
understand, construct, and validate them.

---

## Platform Architecture

![Platform Architecture](imgs/platform.png)

This diagram shows the shared services used across every BioTools application.

---

## User Journey

![User Journey](imgs/user-journey.png)

This illustrates how a researcher interacts with the platform from making
selections to generating a validated command.

---

## Core Data Model

![Core Data Model](imgs/core-data-model.png)

The application maintains a single mutable Filter State.
Commands are always derived from that state and are never stored independently.

---

## Rule & Validation Pipeline

![Core Data Model](imgs/rule-validation-pipeline.png)

The Rule Engine evaluates the Filter State against immutable rule definitions.
Results are transformed into user-friendly explanations.

---

## Command Combination Pipeline

![Core Data Model](imgs/command-combination-pipeline.png)

Preset command combinations and manual selections both produce the same
Filter State, ensuring a single command generation path.
