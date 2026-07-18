# PlyWise System Architecture

## Document Information

| Field | Value |
| --- | --- |
| Product | PlyWise |
| Product Descriptor | The Interactive Chess Mentor |
| Internal Codename | Project Knight |
| Document Type | System Architecture |
| Version | v1 |
| Status | Draft |
| Last Updated | July 2026 |

---

# 1. Purpose

This document defines the logical architecture of the PlyWise MVP.

Its purpose is to describe how the major product systems collaborate to deliver the approved product experience while maintaining clear responsibility boundaries.

This document intentionally focuses on logical product systems rather than implementation technologies.

Technology choices may evolve over time.

System responsibilities should remain comparatively stable.

---

# 2. Architectural Goals

The PlyWise architecture is designed to achieve the following objectives:

- maintain clear system responsibilities,
- support independent evolution of major product systems,
- minimize unnecessary coupling,
- isolate external dependencies,
- preserve authoritative chess state,
- support contextual coaching,
- enable guided lesson experiences,
- remain maintainable as the product grows,
- and provide a stable engineering foundation for future versions.

---

# 3. Architecture Philosophy

PlyWise follows a responsibility-oriented architecture.

The architecture is organized around business capabilities rather than implementation technologies.

Examples include:

- Match System
- Coach Engine
- Lesson System
- Move Analysis System
- Pattern Observation System

rather than:

- React
- Express
- MongoDB
- Stockfish
- Groq

Technology is treated as implementation detail.

Business responsibility defines architectural structure.

---

# 4. Architectural Principles

## 4.1 Single Responsibility

Every major product system should own one primary responsibility.

A system may collaborate with multiple neighboring systems.

It should not absorb unrelated product responsibilities.

---

## 4.2 Explicit Boundaries

System boundaries should remain intentional.

Responsibilities crossing architectural boundaries should occur only through approved interfaces.

---

## 4.3 Dependency Direction

Higher-level product decisions should not depend directly on implementation-specific technologies.

Examples include:

- Coach Engine should not depend on Stockfish commands.
- Match System should not depend on LLM providers.
- Lesson System should not depend on frontend implementation.

---

## 4.4 Replaceable Infrastructure

Infrastructure components should be replaceable with minimal impact on business systems.

Examples include:

- chess engines,
- AI providers,
- databases,
- storage providers,
- deployment platforms.

---

## 4.5 Evidence Before Interpretation

Systems responsible for interpretation should consume evidence rather than assumptions.

Examples:

Move Analysis produces evidence.

Coach Engine interprets evidence.

Pattern Observation accumulates evidence.

The Coach should not invent unsupported player behavior.

---

## 4.6 Progressive Complexity

The architecture should remain proportional to MVP scope.

Complexity should be introduced when justified by product evolution rather than anticipated future possibilities.

---

# 5. High-Level Architecture

PlyWise consists of cooperating logical systems.

Each system owns a well-defined business responsibility.

No single system should become responsible for the complete product workflow.

Major product systems include:

- Authentication System
- Player System
- Match System
- Chess Rules System
- Chess Engine Adapter
- Bot System
- Move Analysis System
- Coach Engine
- Coach Generation System
- Pattern Observation System
- Lesson System
- Lesson Evaluation System
- Match History System
- Preference System

# 6. Logical System Architecture

The PlyWise MVP is composed of multiple cooperating logical systems.

Each system owns a specific business responsibility.

The architecture intentionally separates responsibilities to improve maintainability, scalability, testing, and future evolution.

The systems collaborate through well-defined boundaries rather than sharing responsibilities.

---

## 6.1 Authentication System

### Primary Responsibility

Manage user identity and authenticated access.

### Responsibilities

- User registration
- User authentication
- Session management
- Protected resource access
- Identity ownership

### Does NOT Own

- Player statistics
- Chess matches
- Coaching
- Lesson progress

---

## 6.2 Player System

### Primary Responsibility

Maintain persistent player information and learning context.

### Responsibilities

- Player profile
- Statistics
- Rating / skill representation
- Play style
- Learning context
- Pattern references

### Does NOT Own

- Match lifecycle
- Lesson progression
- Coach decisions

---

## 6.3 Match System

### Primary Responsibility

Manage the complete lifecycle of a chess match.

### Responsibilities

- Match creation
- Match state
- Turn management
- Move history
- Result
- Match metadata

The Match System acts as the authoritative owner of chess matches.

### Does NOT Own

- Engine analysis
- Coaching
- Lesson evaluation

---

## 6.4 Chess Rules System

### Primary Responsibility

Validate legal chess gameplay.

### Responsibilities

- Legal moves
- Check
- Checkmate
- Draw
- Castling
- En Passant
- Promotion

### Does NOT Own

- Coaching
- Bot logic
- Match persistence

---

## 6.5 Bot System

### Primary Responsibility

Control the computer opponent.

### Responsibilities

- Detect bot turn
- Request engine move
- Submit bot move
- Handle engine calculation state

### Does NOT Own

- Coaching
- Move analysis
- Pattern observation

---

## 6.6 Chess Engine Adapter

### Primary Responsibility

Provide an abstraction layer between PlyWise and external chess engines.

### Responsibilities

- Position analysis
- Move calculation
- Result normalization
- Engine communication

The adapter isolates Stockfish-specific implementation details.

### Does NOT Own

- Coaching decisions
- Player state
- Match ownership

---

## 6.7 Move Analysis System

### Primary Responsibility

Transform engine analysis into structured chess evidence.

### Responsibilities

- Evaluation
- Classification
- Evaluation delta
- Best move
- Analysis metadata

Move Analysis produces evidence.

It does not produce coaching.

---

## 6.8 Coach Engine

### Primary Responsibility

Determine whether coaching should occur.

### Responsibilities

- Coaching eligibility
- Context construction
- Pattern usage
- Intervention timing

The Coach Engine determines:

> Should the Coach speak?

It does NOT determine:

> What exact sentence should be shown?

---

## 6.9 Coach Generation System

### Primary Responsibility

Convert approved coaching context into understandable player guidance.

### Responsibilities

- Coaching generation
- Tone adaptation
- Response formatting

This system consumes approved context.

It does not invent coaching context.

---

## 6.10 Pattern Observation System

### Primary Responsibility

Identify recurring player behaviors.

### Responsibilities

- Pattern detection
- Pattern update
- Pattern confidence
- Evidence accumulation

Patterns are derived from observed evidence.

Patterns are not assumptions.

---

## 6.11 Lesson System

### Primary Responsibility

Manage guided chess lessons.

### Responsibilities

- Lesson content
- Lesson progression
- Lesson state
- Lesson objectives

### Does NOT Own

- Live coaching
- Match lifecycle

---

## 6.12 Lesson Evaluation System

### Primary Responsibility

Evaluate lesson interactions.

### Responsibilities

- Attempt evaluation
- Lesson feedback
- Progress update

Lesson evaluation is instructional.

It is not match analysis.

---

## 6.13 Match History System

### Primary Responsibility

Provide access to completed matches.

### Responsibilities

- Match retrieval
- Coaching history
- Move history
- Post-game summary

---

## 6.14 Preference System

### Primary Responsibility

Manage player product preferences.

### Responsibilities

- Board themes
- Piece themes
- Product settings

Preferences remain isolated from gameplay logic.

# 7. System Communication

PlyWise systems collaborate through explicit responsibility boundaries.

No system should directly bypass another system's ownership.

Communication should occur through approved interfaces.

---

## 7.1 Player Match Flow

The primary gameplay flow is:

Player
↓
Web Client
↓
API Layer
↓
Match System
↓
Chess Rules System
↓
Board State Update
↓
Move Analysis System
↓
Coach Engine
↓
Coach Generation System (when required)

The Match System remains the authoritative owner of match state throughout the process.

---

## 7.2 Computer Move Flow

Computer move generation follows:

Match System
↓
Bot System
↓
Chess Engine Adapter
↓
Chess Engine
↓
Bot System
↓
Match System

The Match System validates and persists the returned move.

The Bot System never modifies match state directly.

---

## 7.3 Move Analysis Flow

Move analysis follows:

Approved Position
↓
Chess Engine Adapter
↓
Chess Engine
↓
Normalized Analysis
↓
Move Analysis System
↓
Classification
↓
Coach Engine

Move Analysis produces evidence.

The Coach Engine decides how that evidence should be used.

---

## 7.4 Coaching Flow

When coaching becomes eligible:

Coach Engine
↓
Context Builder
↓
Coach Generation System
↓
Player-facing Coaching

The Coach Generation System receives approved context only.

It does not request additional chess information independently.

---

## 7.5 Lesson Flow

Lesson interaction follows:

Player
↓
Lesson System
↓
Lesson Position
↓
Player Attempt
↓
Lesson Evaluation
↓
Instructional Feedback
↓
Lesson Progress

Lesson progression remains isolated from normal chess matches.

---

## 7.6 Post-Game Flow

Match Completed
↓
Post-Game Coach
↓
Coach Generation
↓
Player Summary

Post-game coaching may use:

- match result,
- important mistakes,
- observed patterns,
- positive decisions,
- player history.

---

# 8. Dependency Rules

Architectural dependencies SHALL follow these principles.

---

## DR-001

The Match System owns chess matches.

No other system may directly mutate authoritative match state.

---

## DR-002

The Chess Rules System determines legal chess behavior.

No AI provider or coaching system may determine move legality.

---

## DR-003

The Chess Engine Adapter owns engine communication.

Other systems shall not communicate directly with Stockfish.

---

## DR-004

Move Analysis owns evaluation and classification.

Coach Engine consumes analysis.

Coach Engine does not recreate analysis.

---

## DR-005

Coach Engine owns intervention decisions.

Coach Generation owns language generation.

These responsibilities remain separate.

---

## DR-006

Pattern Observation owns recurring behavior detection.

Coach Engine consumes patterns.

Coach Engine does not independently maintain patterns.

---

## DR-007

Lesson evaluation remains independent from match analysis.

Lesson feedback and live coaching are separate product experiences.

---

## DR-008

Frontend components shall not implement chess business rules.

Business rules belong to backend domain systems.

---

## DR-009

Infrastructure implementations remain replaceable.

Business systems should not depend directly upon:

- Stockfish
- AI providers
- MongoDB implementation details

---

## DR-010

Every major responsibility should have one authoritative owner.

Responsibility duplication should be avoided.

---

# 9. System Boundary Rules

The following boundaries define architectural ownership.

| Responsibility | Owner |
|---------------|-------|
| Authentication | Authentication System |
| Player Context | Player System |
| Match State | Match System |
| Chess Rules | Chess Rules System |
| Engine Communication | Chess Engine Adapter |
| Bot Move | Bot System |
| Move Analysis | Move Analysis System |
| Coaching Eligibility | Coach Engine |
| Coaching Language | Coach Generation |
| Pattern Detection | Pattern Observation |
| Lesson Progress | Lesson System |
| Lesson Evaluation | Lesson Evaluation |
| Match History | Match History |
| Preferences | Preference System |

These ownership rules represent architectural contracts.

Violating ownership should require an explicit architectural decision.

---

# 10. Architectural Anti-Patterns

The following practices should be avoided.

### AP-001

The Coach Engine should not become a God Object.

---

### AP-002

Match state should never be modified from multiple independent systems.

---

### AP-003

Frontend components should not duplicate backend chess logic.

---

### AP-004

Stockfish-specific commands should never spread throughout the codebase.

---

### AP-005

Lesson logic should not be mixed with match logic.

---

### AP-006

Move classification should never automatically generate coaching.

---

### AP-007

AI-generated text should never become authoritative chess truth.

---

### AP-008

Pattern Observation should never invent unsupported player behavior.

---

### AP-009

Infrastructure dependencies should not leak into business logic.

---

### AP-010

Temporary implementation shortcuts should not permanently redefine architecture.

# 11. External Dependencies

PlyWise collaborates with several external capabilities.

These capabilities provide specialized functionality but do not define core business behavior.

The architecture intentionally isolates external integrations behind approved boundaries.

---

## 11.1 Chess Engine

Purpose:

- Position evaluation
- Best move calculation
- Computer move generation

Initial Implementation:

- Stockfish

Architectural Rule:

The Chess Engine SHALL only be accessed through the Chess Engine Adapter.

No other business system should communicate directly with the engine.

---

## 11.2 AI Language Generation

Purpose:

- Generate player-oriented coaching language
- Generate instructional explanations
- Generate post-game mentoring summaries

Architectural Rule:

The language model SHALL receive only approved coaching context.

It SHALL NOT determine:

- chess legality,
- match ownership,
- move classification,
- player identity,
- or authoritative game state.

---

## 11.3 Database

Purpose:

Persist durable product state.

Examples include:

- users,
- matches,
- moves,
- coaching,
- patterns,
- lessons,
- lesson progress,
- preferences.

Business systems remain independent of physical persistence implementation.

---

## 11.4 Authentication Mechanism

Purpose:

Provide authenticated player identity.

Business systems consume authenticated identity.

Business systems should not own authentication implementation.

---

# 12. Future Architectural Evolution

The architecture is intentionally designed for progressive evolution.

Future product versions may introduce additional systems without requiring major restructuring of existing responsibilities.

Possible future systems include:

- Multiplayer System
- Tournament System
- Puzzle System
- Opening Trainer
- Opening Explorer
- Opening Repertoire
- Endgame Trainer
- Opening Recommendation Engine
- Study Planner
- Achievement System
- Notification System
- Search System
- Analytics System
- Recommendation Engine
- Coach Memory
- Voice Coach
- Spectator System
- Moderation System
- Plugin System
- Mobile API Layer

Future systems should integrate through existing architectural boundaries where practical.

The introduction of a new feature SHALL NOT justify violating existing ownership rules without an approved architectural decision.

---

# 13. Architecture Validation Checklist

The following questions should be answered before introducing a major architectural change.

## Responsibility

Does this system own exactly one primary business responsibility?

---

## Boundary

Does this responsibility already belong to another system?

---

## Coupling

Will this change increase unnecessary coupling?

---

## Replaceability

Can infrastructure still be replaced independently?

---

## Testability

Can this responsibility be tested independently?

---

## Maintainability

Will future developers understand where this responsibility belongs?

---

## MVP Scope

Does this change support the approved MVP?

---

## Evolution

Will this decision make future evolution easier or harder?

---

# 14. Related Documents

This architecture should be interpreted together with:

- Product Vision
- MVP Scope
- User Persona
- Software Requirements Specification

Future companion documents include:

- Backend Architecture
- Frontend Architecture
- Database Design
- API Design
- Deployment Architecture

---

# 15. Related Architecture Decision Records

This document is supported by Architecture Decision Records (ADRs).

Expected ADRs include:

- ADR-001 — Monorepo Workspace Structure
- ADR-002 — Responsibility-Oriented Architecture
- ADR-003 — Engine Abstraction
- ADR-004 — Versioned API Strategy
- ADR-005 — Frontend Separation of Concerns
- ADR-006 — MongoDB Data Model
- ADR-007 — Coach Engine Architecture
- ADR-008 — Lesson System Design

Future ADRs should refine this architecture without contradicting approved architectural principles.

---

# 16. Architecture Approval

This architecture is considered approved when:

- system responsibilities are clearly defined,
- ownership boundaries remain explicit,
- dependency rules are respected,
- architectural anti-patterns are avoided,
- approved SRS requirements remain satisfiable,
- and implementation can proceed without major architectural ambiguity.

Implementation SHALL follow this document unless a newer approved architectural decision supersedes the affected section.

---

# 17. Conclusion

The PlyWise System Architecture establishes the logical engineering foundation of the MVP.

The architecture is intentionally organized around business responsibilities rather than implementation technologies.

This approach supports maintainability, independent system evolution, replaceable infrastructure, and clear ownership across the product.

The long-term success of PlyWise depends not only on stronger chess analysis,

but on preserving clean architectural boundaries that allow the mentoring experience to evolve without destabilizing the rest of the system.

Good architecture should make future development easier,

not merely make the current implementation possible.