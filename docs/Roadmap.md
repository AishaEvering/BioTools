# BioTools Roadmap
BioTools is developed incrementally. Each milestone delivers a complete, usable improvement while preserving a simple and intuitive user experience.

No work outside the current milestone should begin until
the milestone goals are complete.

## 🎯 Milestone 1 - Foundation
Goal: Define what BioTools is before writing significant code.

### Completed
- ✅ GitHub repository created
- ✅ README
- ✅ Vision document
- ✅ Roadmap
- ✅ Philosophy
- ✅ Domain Model

### Next
- Architecture

## 🎯 Milestone 2 - Visual Command Builder
Goal: Build a usable base version of the SAM Flag Visual Builder, including a small curated set of Command Combinations.

### Core Logic
- Flag Library
- Include and exclude flag calculations
- Command Generator
- Explanation Engine
- Base validation rules
- Command Combinations (small curated set, e.g. properly paired reads, primary alignments, unmapped reads, forward strand, reverse strand, duplicates removed)
  
### User Interface
- UI Skeleton
- Flag selection controls
- Base filters
- Live command preview
- Readable Explanations
- Copy command
- Loading a combination into the same Flag Filter used by manual selection
  

## 🎯 Milestone 3 - Smart Builder
Goal: Add intelligent guidance and advanced interactions.

### Core Logic
- Conflict Detection
- Inversions

### User Interface
- Conflict feedback
- Ability to invert commands

## 🎯 Milestone 4 - Version 1.0
Goal: SAM Flag Version 1 Release
- Polish
- Testing
- Portfolio integration

## 🚀 Future BioTools
Goal: Future SAM Builder Enhancements
- Track Command history
- Export command history
- Expand the Command Combination library
  
Goal: Move beyond flags.
- CIGAR Explorer
- Coverage Explorer
- Read Group Visualizer
- BEDTools Support

## 🤝 Community
Goal: Get and prioritize feedback.
- Professor feedback
- Community feedback
- Contributing Guide
- Community contributions

## 💡Guiding Principles

Every feature should satisfy these questions:
1. Does it reduce cognitive load?
2. Does it teach the underlying bioinformatics concept?
3. Can a researcher accomplish the task in seconds?
4. Is the interface intuitive and/or explained clearly?

## 🏆 What does success look like?
- A beginner builds a valid command in under 10 seconds
- An experienced researcher prefers BioTools over looking up flag values.
- A professor is comfortable recommending it to a class.
- Every release removes confusion rather than adding features.
