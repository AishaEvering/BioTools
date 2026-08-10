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
- ✅ Architecture

## 🎯 Milestone 2 - Visual Command Builder
Goal: Build a usable base version of the SAM Flag Visual Builder.

### Core Logic
- SAM Flag Library data and loading
- Flag Filter include and exclude calculations
- SAMtools View Command
- View Options
- Command Renderer
- Rule Engine
- Base Rules
- Validation Results
- Explanation Engine
- Explanation Messages
  
### User Interface
- UI Skeleton
- Flag selection controls
- View Option controls
- Live command preview
- Readable Explanations
- Validation feedback
- Copy command
  

## 🎯 Milestone 3 - Smart Builder
Goal: Add intelligent guidance and advanced interactions.

### Core Logic
- Filter Presets
- Filter Preset matching
- Advanced Rules and conflict detection
- Filter Inversion

### User Interface
- Filter Preset selection
- Preset match/divergence feedback
- Advanced conflict feedback
- Ability to invert supported filters

## 🎯 Milestone 4 - Version 1.0
Goal: SAM Flag Version 1 Release
- Release Polish
- Final test coverage review
- Accessibility/usability review
- Portfolio integration
- Version 1.0 release

## 🧪 Development Standards
These requirements apply throughout development:
- Unit tests are added alongside domain and application logic.
- Existing tests must remain passing as features are added.
- GitHub CI runs the test suite automatically.
- Changes must not be merged when required tests fail.

## 🚀 Future BioTools
Goal: Future SAM Builder Enhancements
- Track Command history
- Export command history
- Expand the Filter Preset library
  
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
