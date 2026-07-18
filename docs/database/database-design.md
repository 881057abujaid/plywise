# PlyWise Database Design

## Document Information

| Field | Value |
| --- | --- |
| Product | PlyWise |
| Product Descriptor | The Interactive Chess Mentor |
| Internal Codename | Project Knight |
| Document Type | Database Design |
| Version | v1 |
| Status | Draft |
| Last Updated | July 2026 |

---

# 1. Purpose

This document defines the logical persistence model and database design principles for the PlyWise MVP.

Its purpose is to establish:

- domain persistence boundaries,
- aggregate ownership,
- entity relationships,
- embedding and referencing decisions,
- document growth considerations,
- consistency expectations,
- indexing direction,
- and future data evolution constraints.

This document does not treat database collections as the starting point of the design.

Persistence decisions are derived from approved product requirements, architectural responsibilities, domain ownership, lifecycle, access patterns, mutation behavior, growth characteristics, and consistency requirements.

---

# 2. Design Philosophy

PlyWise follows a domain-driven, aggregate-oriented persistence design.

The database model SHALL represent product responsibilities rather than mirror application folders, controllers, or API endpoints.

The design process follows:

Business Requirement

↓

Domain Object

↓

Identity and Lifecycle

↓

Ownership

↓

Aggregate Boundary

↓

Access and Mutation Patterns

↓

Growth Characteristics

↓

Persistence Decision

A domain entity does not automatically require an independent collection.

An embedded object does not automatically represent a Value Object.

Domain modeling and physical persistence are related but separate design concerns.

---

# 3. Core Database Principles

## 3.1 Domain Before Collections

Collections SHALL NOT be introduced solely because a business concept has a name.

Every independent persistence model should be justified by domain behavior or operational requirements.

---

## 3.2 Aggregate Ownership

Every aggregate SHALL define an authoritative root.

External systems should interact with aggregate-owned state through the aggregate boundary.

Child state should not be independently mutated when doing so may violate aggregate consistency.

---

## 3.3 Entity Does Not Imply Collection

A domain Entity may be stored as:

- an aggregate root document,
- an embedded child entity,
- or an independently persisted referenced entity.

Identity and persistence location are separate concerns.

---

## 3.4 Ownership Does Not Imply Embedding

A business object may belong to another domain object while remaining independently persisted.

Embedding decisions SHALL consider:

- lifecycle,
- access patterns,
- mutation behavior,
- growth,
- and consistency requirements.

Ownership alone is insufficient justification for physical containment.

---

## 3.5 Evidence and Derived State

Observed evidence SHALL remain distinguishable from derived interpretation.

For example:

- Matches provide behavioral evidence.
- Pattern Observation derives recurring player patterns.
- Patterns belong to the Player learning context.

Evidence source and domain owner are not necessarily the same object.

---

## 3.6 Controlled Document Growth

Potentially unbounded or long-lived growing arrays SHOULD NOT be embedded without explicit justification.

The design SHALL consider long-term document growth even when MVP data volume is initially small.

Future scale SHALL influence boundedness analysis.

It SHALL NOT justify premature distributed-system complexity.

---

## 3.7 Single-Direction References by Default

Bidirectional persistence references SHOULD be avoided unless required by a demonstrated access or consistency requirement.

For example:

Pattern → playerId

is preferred over maintaining both:

Player → patternIds[]
Pattern → playerId

when the reverse relationship can be efficiently queried.

This reduces duplicated relationship state and synchronization risk.

---

## 3.8 Authoritative State

Every persistent responsibility SHALL have one authoritative owner.

Derived, cached, or denormalized data SHALL NOT silently become an alternative source of truth.

---

## 3.9 Persistence Supports Architecture

Database convenience SHALL NOT redefine approved architectural ownership.

For example:

- Match state remains owned by the Match System.
- Pattern state remains owned by the Pattern Observation System.
- Lesson progress remains governed by the Lesson System and Lesson Evaluation System.

A collection boundary does not automatically define a business responsibility boundary.

---

# 4. Domain Classification

The following classification represents the initial PlyWise v1 domain model.

| Domain Object | Classification | Primary Context |
| --- | --- | --- |
| User | Entity | Identity |
| Player | Entity / Aggregate Root | Learning |
| Match | Entity / Aggregate Root | Gameplay |
| Move | Child Entity | Match |
| Coach Message | Child Entity | Match |
| Chess Position | Value Object | Match / Analysis |
| Match Result | Value Object | Match |
| Move Analysis | Value Object | Move |
| Pattern | Entity | Player Learning |
| Pattern Evidence | Value Object | Pattern |
| Lesson | Entity / Aggregate Root | Instruction |
| Lesson Step | Child Entity | Lesson |
| Lesson Progress | Associative Entity | Player–Lesson |
| Player Statistics | Value Object / Derived State | Player |
| Player Preferences | Value Object | Player |

This classification is an initial persistence model and may be refined through approved database design decisions.

---

# 5. Primary Aggregates

PlyWise v1 defines three primary domain aggregates.

## 5.1 Match Aggregate

The Match Aggregate is the primary gameplay consistency boundary.

Aggregate Root:

Match

Initial owned objects include:

- Moves
- Move Analysis
- Coach Messages
- Chess Position
- Match Result
- Match Metadata

The Match Aggregate SHALL preserve consistency between:

- move history,
- authoritative position,
- active turn,
- match status,
- and match result.

Child Match state SHALL NOT be independently mutated when such mutation could violate Match invariants.

---

## 5.2 Player Aggregate

The Player Aggregate represents persistent player identity within the learning domain.

Aggregate Root:

Player

Initial owned state includes:

- player profile,
- skill representation,
- learning context,
- statistics,
- and player-level state.

Player Patterns are business-owned by the Player learning context.

Patterns are not initially considered physically embedded members of the Player document due to independent mutation, access, and growth characteristics.

---

## 5.3 Lesson Aggregate

The Lesson Aggregate represents reusable instructional content.

Aggregate Root:

Lesson

Initial owned objects include:

- lesson metadata,
- lesson objectives,
- instructional steps,
- lesson positions,
- and lesson progression rules.

Player-specific progress SHALL NOT be embedded inside the Lesson Aggregate.

Lesson content and player learning state have separate lifecycles.

---

# 6. Relationship-Owned State

Some PlyWise state belongs to a relationship rather than one entity independently.

The primary v1 example is Lesson Progress.

Lesson Progress represents:

Player
+
Lesson
+
Player-specific instructional state

Lesson Progress may contain:

- status,
- current step,
- attempt information,
- start timestamp,
- completion timestamp,
- and progress metadata.

Because this relationship has its own state, lifecycle, mutation behavior, and consistency requirements, Lesson Progress is modeled as an Associative Entity.

A Player SHALL have at most one canonical Lesson Progress record for a specific Lesson.

The Player and Lesson relationship SHALL therefore be uniquely identifiable by:

(playerId, lessonId)

The physical persistence model SHALL enforce this uniqueness.

# 7. Match Aggregate Design

The Match Aggregate is the authoritative gameplay consistency boundary of PlyWise.

The Match Aggregate owns the persistent state required to represent the lifecycle, history, and current authoritative state of a chess match.

The Match Aggregate SHALL preserve consistency between:

- move history,
- current board position,
- active color,
- match status,
- and match result.

State owned by the Match Aggregate SHALL NOT be independently mutated when such mutation may violate Match invariants.

---

## 7.1 Match Aggregate Root

`Match` is the Aggregate Root of the gameplay domain.

External systems SHALL interact with Match-owned state through approved Match operations.

Conceptually:

Match

│

├── Moves[]

│   └── Move Analysis

│

├── Coach Messages[]

│

├── Current Position

├── Match Result

└── Match Metadata

Moves and Coach Messages are Match-owned child Entities.

Move Analysis is initially modeled as a Move-owned Value Object.

Current Position, Match Result, and Match Metadata are modeled as Match-owned state.

---

## 7.2 Move Persistence Decision

### Decision

Moves SHALL be embedded within the Match Aggregate.

### Rationale

A Move:

- does not have a meaningful lifecycle outside a Match,
- is normally accessed in Match context,
- is controlled by Match state transitions,
- has practically bounded growth within a chess match,
- and is strongly coupled to Match consistency.

Although Move is a domain Entity with distinguishable identity, Entity classification does not require independent persistence.

A Move is therefore modeled as an embedded child Entity.

### Conceptual Structure

Match

└── Moves[]

    ├── Move

    ├── Move

    └── Move

### Mutation Rule

Moves SHALL NOT be independently mutated through persistence operations when such mutation may invalidate Match state.

For example, directly modifying a historical move may cause inconsistency between:

- move history,
- current position,
- active color,
- and result.

Move state transitions SHALL remain governed by the Match Aggregate.

---

## 7.3 Move Analysis Persistence Decision

### Decision

Move Analysis SHALL be embedded within the Move it evaluates.

### Rationale

Move Analysis answers a contextual domain question:

> What analysis belongs to this Move?

Move Analysis does not initially require independent business identity.

Its meaning is derived from the Move being evaluated.

Storing Move Analysis in a parallel Match-level array would introduce unnecessary positional or identity synchronization between Moves and Analysis records.

### Conceptual Structure

Move

├── Move Identity

├── Chess Notation

├── Move Metadata

└── Analysis

    ├── Evaluation Before

    ├── Evaluation After

    ├── Evaluation Delta

    ├── Classification

    ├── Best Move

    └── Analysis Metadata

### Future Evolution

If PlyWise later preserves multiple analysis executions for the same Move, such as:

- multiple engine depths,
- multiple chess engines,
- historical re-analysis,
- or independently auditable analysis runs,

an `AnalysisRun` Entity may be introduced.

The v1 model does not require this complexity.

---

## 7.4 Coach Message Persistence Decision

### Decision

Live and post-game Match coaching messages SHALL be embedded within the Match Aggregate.

### Rationale

Match coaching messages:

- are generated within Match context,
- remain associated with the Match in which they were generated,
- are normally retrieved with Match history,
- have low independent mutation requirements,
- and have practically bounded growth due to selective coaching.

Coach Messages are therefore modeled as Match-owned child Entities.

### Ownership and Trigger

Coach Message ownership and coaching trigger SHALL remain separate concepts.

A Coach Message belongs to a Match.

A Coach Message may optionally be triggered by a specific Move.

Conceptually:

Match

├── Moves[]

└── Coach Messages[]

    └── Trigger → Move

The triggering Move does not own the Coach Message.

This distinction allows Match-level coaching that is not associated with one specific Move.

Examples include:

- recurring behavior observations,
- broader Match guidance,
- and post-game summaries.

### Future Evolution

Future capabilities such as:

- global coach conversations,
- cross-match coaching memory,
- persistent coach chat,
- or voice coaching sessions

may require an independent Conversation or Message Aggregate.

The v1 Match coaching model SHALL NOT introduce this complexity prematurely.

---

## 7.5 Current Position Persistence

### Decision

The Match Aggregate SHALL persist both:

- complete Move history,
- and the current board position as FEN.

The current position SHALL be represented by `currentFen`.

### Rationale

Move history preserves historical gameplay evidence.

`currentFen` provides efficient access to the current board position.

Persisting the current FEN supports:

- Match resumption,
- board reconstruction,
- bot turn processing,
- chess engine input,
- and current-state retrieval

without requiring mandatory replay of the complete Move history.

### Authoritative State

`currentFen` represents the authoritative current-position snapshot of the Match.

Move history remains the authoritative historical record of gameplay.

These responsibilities are complementary.

### Consistency Requirement

The Match Aggregate SHALL preserve consistency between:

- `moves[]`,
- `currentFen`,
- active color,
- Match status,
- and Match result.

A Move SHALL NOT be persisted as an independent state transition from its resulting Match state.

Conceptually:

Legal Move

↓

Match State Transition

├── Append Move

├── Update Current FEN

├── Update Active Color

├── Update Match Status

└── Update Match Result when applicable

↓

Persist Valid Aggregate State

The implementation SHALL avoid persistence flows where Move history and current Match state are independently saved as unrelated operations.

---

## 7.6 Historical Position Snapshots

### Decision

Each persisted Move SHALL store the resulting board position as `fenAfter`.

### Rationale

Move-level position snapshots support:

- post-game replay,
- historical move navigation,
- coaching context,
- debugging,
- and position reconstruction.

Without historical position snapshots, navigation to a previous position would require replaying Move history from the initial Match position.

### Position Responsibility

`Match.currentFen` and `Move.fenAfter` serve different responsibilities.

`Match.currentFen`:

- represents the authoritative current Match position.

`Move.fenAfter`:

- represents a historical position snapshot after a specific Move.

A historical Move FEN SHALL NOT independently redefine the authoritative current Match position.

---

## 7.7 Replay and Match Mutation

Historical position navigation and authoritative Match mutation SHALL remain separate behaviors.

### Replay Navigation

Replay navigation allows a player to:

- view a previous Move,
- view the position after a previous Move,
- move forward through Match history,
- and inspect completed Match positions.

Replay navigation does not mutate Match state.

Conceptually:

Authoritative Position → `Match.currentFen`

Viewed Historical Position → `Move.fenAfter`

Changing the viewed position SHALL NOT change the authoritative Match position.

### Move Takeback

Move Takeback or Undo is not included in the PlyWise v1 Match model.

A Takeback is not equivalent to replay navigation.

Removing an accepted Move may affect:

- Move history,
- current FEN,
- active color,
- Move Analysis,
- Coach Messages,
- Pattern Evidence,
- bot calculations,
- Match status,
- and Match result.

Future Takeback support SHALL require an explicit Match domain operation and an approved evidence invalidation policy.

Direct removal of a Move from `moves[]` SHALL NOT be treated as valid Takeback behavior.

---

## 7.8 Match State Transition Boundary

The Match Aggregate SHALL expose controlled gameplay state transitions.

Conceptually, an accepted Move should be processed as one Match-level domain transition.

Example conceptual operation:

`Match.applyMove(move)`

The operation is responsible for preserving Match invariants.

The exact implementation API is not prescribed by this document.

The architectural requirement is that Match-owned state transitions remain coordinated through the Match consistency boundary.

---

## 7.9 Match Invariants

The following invariants SHALL remain valid for every persisted Match.

### MI-001 — Position Consistency

`currentFen` SHALL represent the authoritative board position after the latest accepted Move.

---

### MI-002 — Historical Position Consistency

For every persisted Move containing `fenAfter`, the snapshot SHALL represent the board position immediately after that Move.

---

### MI-003 — Move Order

Persisted Moves SHALL maintain valid chronological gameplay order.

---

### MI-004 — Active Color Consistency

The active color SHALL correspond to the authoritative current board position.

---

### MI-005 — Match Status Consistency

A completed Match SHALL NOT remain in an active gameplay status.

---

### MI-006 — Result Consistency

A completed Match requiring a result SHALL contain a valid Match Result.

---

### MI-007 — Coaching Ownership

Every embedded Match Coach Message SHALL belong to the containing Match.

---

### MI-008 — Coaching Trigger Integrity

When a Coach Message references a triggering Move, the referenced Move SHALL belong to the same Match.

---

### MI-009 — Analysis Ownership

Embedded Move Analysis SHALL describe the Move under which it is stored.

---

### MI-010 — Aggregate-Controlled Mutation

Match-owned gameplay state SHALL NOT be independently mutated in a manner that bypasses Match consistency rules.

---

## 7.10 Initial Match Persistence Direction

The initial Match persistence model is conceptually represented as:

Match

├── Identity

├── Player Reference

├── Opponent

├── Status

├── Active Color

├── Current FEN

│

├── Moves[]

│   ├── Move Identity

│   ├── Ply

│   ├── SAN

│   ├── UCI

│   ├── Color

│   ├── FEN After

│   ├── Played At

│   └── Analysis

│       ├── Evaluation Before

│       ├── Evaluation After

│       ├── Evaluation Delta

│       ├── Classification

│       ├── Best Move

│       └── Analysis Metadata

│

├── Coach Messages[]

│   ├── Coach Message Identity

│   ├── Message Type

│   ├── Message Content

│   ├── Trigger

│   └── Created At

│

├── Match Result

├── Match Metadata

├── Started At

├── Completed At

└── Persistence Timestamps

This structure represents a logical persistence direction.

Exact field names, BSON types, validation rules, and indexes SHALL be defined during detailed entity and schema design.

# 8. Player Aggregate Design

The Player Aggregate represents the persistent chess identity and learning context of a PlyWise user.

Unlike the User Entity, which represents platform identity, authentication, and account ownership, the Player Aggregate represents chess-specific state throughout the player's learning journey.

The Player Aggregate owns all persistent player-specific learning state.

---

## 8.1 Player Aggregate Root

### Decision

`Player` SHALL be the Aggregate Root of the player learning domain.

### Responsibilities

The Player Aggregate owns:

- player profile,
- learning context,
- statistics,
- preferences,
- player-specific progression,
- and references to long-lived learning artifacts.

The Player Aggregate SHALL NOT own gameplay history.

Completed Matches remain independently owned by the Match Aggregate.

---

## 8.2 User and Player Separation

### Decision

`User` and `Player` SHALL be modeled as independent persisted Entities.

### Rationale

Although every Player belongs to a User account, the two represent different business responsibilities.

The User Entity represents platform identity.

Examples include:

- authentication,
- account ownership,
- account status,
- and platform-level identity.

The Player Aggregate represents chess-domain identity.

Examples include:

- learning progress,
- skill representation,
- player statistics,
- preferences,
- and long-term learning state.

Separating these responsibilities improves domain isolation and prevents platform identity concerns from becoming coupled to gameplay and learning behavior.

### Reference Direction

The Player Entity SHALL reference its owning User.

Conceptually:

Player
→ userId

The reverse reference is not initially required.

Single-direction references are preferred unless a demonstrated domain requirement justifies bidirectional persistence.

---

## 8.3 Player Statistics

### Decision

Player Statistics SHALL be persisted as embedded derived state.

### Rationale

Player statistics are frequently read during normal product usage.

Examples include:

- matches played,
- wins,
- losses,
- draws,
- and other player performance summaries.

Calculating these values by traversing complete Match history for every request would unnecessarily increase read cost.

Persisted statistics provide efficient read access.

### Source of Truth

Player Statistics are not the authoritative gameplay history.

Completed Match history remains the source of truth.

Player Statistics are a derived, read-optimized representation.

### Update Policy

Player Statistics SHALL normally be updated when a Match is successfully completed.

Typical updates include:

- incrementing completed matches,
- updating wins,
- updating losses,
- updating draws,
- and other derived counters.

### Recovery

If Player Statistics become inconsistent with Match history, they SHALL be rebuildable from completed Matches.

This document treats Player Statistics as recoverable derived state rather than authoritative historical evidence.

---

## 8.4 Player Preferences

### Decision

Player Preferences SHALL be embedded within the Player Aggregate.

### Rationale

Preferences:

- have no meaningful lifecycle outside the Player,
- are normally accessed together with Player information,
- have bounded growth,
- and require simple localized updates.

Preferences therefore do not justify independent persistence.

### Initial Preference Direction

Examples include:

- board theme,
- piece theme,
- coach preferences,
- sound preferences,
- and accessibility settings.

These values are modeled as embedded Player-owned Value Objects.

---

## 8.5 Player Learning Context

### Decision

Player Learning Context SHALL be embedded structured state.

### Rationale

The learning context represents the current understanding of a player's chess development.

This context supports:

- adaptive coaching,
- lesson recommendations,
- skill estimation,
- and personalized learning behavior.

The learning context belongs exclusively to the Player.

### Structure

The learning context SHOULD remain structured rather than free-form.

Examples include:

- estimated skill level,
- estimated rating,
- preferred play style,
- strengths,
- focus areas,
- and other controlled learning indicators.

The database SHALL prefer structured domain values over unrestricted textual interpretation.

Long-form coaching explanations belong to coaching output rather than persistent player state.

---

## 8.6 Pattern Persistence

### Decision

Patterns SHALL be persisted independently from the Player document.

### Ownership

Patterns belong to the Player learning domain.

Ownership does not require physical embedding.

### Rationale

Patterns:

- evolve independently,
- have their own lifecycle,
- may accumulate historical evidence,
- require independent access,
- and may continue growing throughout the Player's learning journey.

Embedding Patterns directly within the Player document would unnecessarily couple long-lived observational data to the Player document.

Patterns are therefore modeled as independently persisted Player-owned Entities.

### Reference Direction

Pattern
→ playerId

The Player document SHALL NOT maintain a persistent collection of Pattern identifiers during the MVP.

Relationship traversal should occur through the Pattern reference.

---

## 8.7 Player Aggregate Responsibilities

The Player Aggregate is responsible for maintaining consistency between:

- player profile,
- learning context,
- preferences,
- and persisted statistics.

Gameplay history remains outside the Player Aggregate.

Pattern ownership belongs to the Player learning domain but Pattern persistence remains independent.

---

## 8.8 Player Invariants

### PI-001 — Identity

Every Player SHALL reference one valid User.

---

### PI-002 — Statistics Integrity

Persisted Player Statistics SHALL remain logically consistent.

When inconsistency is detected, statistics SHALL be rebuildable from completed Match history.

---

### PI-003 — Preference Ownership

Player Preferences SHALL belong exclusively to the owning Player.

---

### PI-004 — Learning Context Ownership

Learning Context SHALL remain Player-owned state.

---

### PI-005 — Pattern Ownership

Every Pattern SHALL reference exactly one owning Player.

---

### PI-006 — Aggregate Responsibility

The Player Aggregate SHALL NOT become the authoritative owner of Match history.

Historical gameplay evidence belongs to the Match Aggregate.

---

## 8.9 Initial Player Persistence Direction

The initial Player persistence model is conceptually represented as:

Player

├── Identity

├── User Reference

├── Display Profile

│

├── Statistics

│   ├── Matches Played

│   ├── Wins

│   ├── Losses

│   ├── Draws

│   └── Other Derived Metrics

│

├── Learning Context

│   ├── Estimated Skill Level

│   ├── Estimated Rating

│   ├── Play Style

│   ├── Strengths

│   └── Focus Areas

│

├── Preferences

│   ├── Board Theme

│   ├── Piece Theme

│   ├── Coach Settings

│   └── Accessibility Settings

│

└── Persistence Timestamps

Pattern

├── Identity

├── Player Reference

├── Pattern Type

├── Status

├── Confidence

├── Occurrences

├── Evidence

└── Observation Metadata

This represents the logical persistence direction for the Player learning domain.

Exact schema definitions, indexes, validation rules, and BSON field names SHALL be defined during detailed schema design.

# 9. Lesson Aggregate Design

The Lesson Aggregate represents reusable instructional content within PlyWise.

A Lesson defines structured educational material that guides players through specific chess concepts and learning objectives.

The Lesson Aggregate owns instructional content.

Player-specific learning progress remains outside the Lesson Aggregate.

---

## 9.1 Lesson Aggregate Root

### Decision

`Lesson` SHALL be the Aggregate Root of the instructional domain.

### Responsibilities

The Lesson Aggregate owns:

- lesson metadata,
- learning objectives,
- instructional steps,
- chess positions,
- hints,
- completion rules,
- and lesson configuration.

The Lesson Aggregate SHALL NOT own player-specific progress.

---

## 9.2 Lesson Structure

A Lesson represents reusable instructional content.

A Lesson may contain one or more instructional Steps.

Conceptually:

Lesson

│

├── Metadata

├── Objectives

├── Steps[]

├── Completion Rules

└── Configuration

Each Lesson is reusable across multiple Players.

Player participation SHALL NOT modify Lesson content.

---

## 9.3 Lesson Step Persistence

### Decision

Lesson Steps SHALL be embedded within the Lesson Aggregate.

### Rationale

A Lesson Step:

- has no meaningful lifecycle outside its Lesson,
- is accessed in Lesson context,
- has bounded growth,
- and remains strongly coupled to Lesson structure.

Although a Lesson Step possesses distinguishable identity within a Lesson, it does not require independent persistence.

Lesson Steps are therefore modeled as embedded child Entities.

### Conceptual Structure

Lesson

└── Steps[]

    ├── Step

    ├── Step

    └── Step

---

## 9.4 Chess Position

### Decision

Chess Positions SHALL be modeled as embedded Value Objects.

### Rationale

A chess position represents board state for instructional purposes.

Its meaning is derived from the Lesson Step in which it appears.

Chess Positions do not require independent business identity.

Typical information includes:

- FEN,
- side to move,
- orientation,
- and other board presentation data.

---

## 9.5 Lesson Hints

### Decision

Hints SHALL be embedded Value Objects within Lesson Steps.

### Rationale

Hints exist solely to support instructional guidance for a specific Lesson Step.

Hints:

- have no independent lifecycle,
- are accessed only through the Lesson,
- and remain tightly coupled to instructional content.

---

## 9.6 Completion Rules

### Decision

Completion Rules SHALL be embedded Value Objects.

### Rationale

Completion Rules define how a Lesson is successfully completed.

Examples include:

- required score,
- sequential completion,
- attempt limits,
- or lesson-specific validation rules.

Completion Rules belong exclusively to the Lesson.

---

## 9.7 Lesson Progress Relationship

Player-specific Lesson Progress SHALL NOT be embedded within the Lesson Aggregate.

Lesson Progress represents the learning state of an individual Player within a specific Lesson.

Because Lesson Progress:

- has its own lifecycle,
- changes independently,
- represents a Player–Lesson relationship,
- and grows with product usage,

it is modeled as an independent Associative Entity.

The Lesson Aggregate therefore remains reusable regardless of the number of participating Players.

---

## 9.8 Lesson Aggregate Responsibilities

The Lesson Aggregate is responsible for maintaining consistency between:

- lesson metadata,
- instructional steps,
- chess positions,
- hints,
- and completion rules.

Player-specific learning state remains outside the Lesson Aggregate.

---

## 9.9 Lesson Invariants

### LI-001 — Step Ownership

Every Lesson Step SHALL belong to exactly one Lesson.

---

### LI-002 — Position Ownership

Every Chess Position SHALL belong to the Lesson Step in which it is defined.

---

### LI-003 — Hint Ownership

Every Hint SHALL belong to its containing Lesson Step.

---

### LI-004 — Completion Rule Ownership

Completion Rules SHALL belong exclusively to the owning Lesson.

---

### LI-005 — Lesson Reusability

Lesson content SHALL remain independent of Player-specific progress.

Player activity SHALL NOT directly mutate Lesson instructional content.

---

## 9.10 Initial Lesson Persistence Direction

The initial Lesson persistence model is conceptually represented as:

Lesson

│

├── Identity

├── Metadata

├── Objectives

├── Steps[]

│   ├── Step Identity

│   ├── Title

│   ├── Description

│   ├── Chess Position

│   ├── Hint

│   └── Step Validation

│

├── Completion Rules

├── Configuration

└── Persistence Timestamps

This represents the logical persistence direction for the Lesson domain.

Detailed schema definitions, indexes, validation rules, and BSON field names SHALL be specified during detailed schema design.

# 10. Pattern Entity Design

The Pattern Entity represents long-term observable player behavior within the PlyWise learning system.

Unlike individual gameplay events, a Pattern represents recurring behavioral tendencies identified through repeated observations across multiple Matches.

Patterns form the knowledge base used by the Coach to provide personalized guidance.

---

## 10.1 Purpose

The purpose of the Pattern Entity is to persist recurring player behaviors rather than isolated gameplay mistakes.

A single mistake does not constitute a Pattern.

A Pattern emerges only after sufficient supporting observations.

Patterns therefore represent long-term learning behavior.

---

## 10.2 Pattern Identity

### Decision

A Pattern SHALL have an independent identity.

### Rationale

Patterns:

- evolve throughout the player's learning journey,
- maintain their own lifecycle,
- accumulate supporting evidence,
- and are independently queried by the Coach.

Patterns are therefore modeled as independent Entities.

---

## 10.3 Ownership

### Decision

Every Pattern SHALL belong to exactly one Player.

### Reference Direction

Pattern
→ playerId

The Player Aggregate owns the Pattern domain.

Physical persistence remains independent.

---

## 10.4 Pattern Structure

A Pattern conceptually contains:

- identity,
- player reference,
- pattern type,
- status,
- confidence,
- occurrence count,
- supporting evidence,
- and persistence timestamps.

The Pattern Entity represents the current understanding of one recurring behavioral tendency.

---

## 10.5 Pattern Confidence

### Decision

Pattern Confidence SHALL be persisted as derived state.

### Rationale

Confidence represents the Coach's current confidence that the observed behavior is genuinely recurring.

Confidence is derived from observed evidence.

Persisting confidence allows efficient Coach access without recalculating the value for every request.

Supporting evidence remains the authoritative source.

Confidence is a derived representation.

---

## 10.6 Pattern Evidence

### Decision

Pattern Evidence SHALL be modeled as embedded Value Objects.

### Rationale

Evidence does not possess independent business identity.

Its purpose is to identify where a Pattern was observed.

Each Evidence record references the gameplay event from which the observation originated.

Typical Evidence information includes:

- Match reference,
- Move reference,
- observation timestamp.

Evidence belongs exclusively to its Pattern.

---

## 10.7 Pattern Lifecycle

Patterns evolve throughout the player's learning journey.

The initial Pattern lifecycle consists of:

Detected
↓

Confirmed
↓

Resolved

A resolved Pattern remains part of the player's historical learning record.

Resolved Patterns SHALL NOT be deleted solely because the player improved.

Historical learning behavior remains valuable coaching information.

---

## 10.8 Pattern Evolution

Repeated observation of the same behavioral tendency SHALL update the existing Pattern.

Repeated occurrences SHALL NOT create new Pattern Entities for the same behavioral concept.

Typical updates include:

- occurrence count,
- confidence,
- latest supporting evidence,
- last observed timestamp,
- and lifecycle status.

Pattern identity remains stable while Pattern understanding evolves.

---

## 10.9 Pattern Growth Strategy

Supporting Evidence has potentially unbounded growth.

To maintain controlled document size, the Pattern Entity SHALL retain only a bounded set of recent supporting Evidence.

The total occurrence count SHALL remain independently persisted.

This approach preserves useful coaching context while preventing unlimited document growth.

---

## 10.10 Pattern Responsibilities

The Pattern Entity is responsible for maintaining consistency between:

- pattern identity,
- confidence,
- occurrence count,
- lifecycle status,
- supporting evidence,
- and observation timestamps.

Pattern interpretation belongs to the Coach.

Pattern persistence represents observable player behavior.

---

## 10.11 Pattern Invariants

### PAT-001 — Player Ownership

Every Pattern SHALL reference exactly one Player.

---

### PAT-002 — Stable Identity

Repeated observations of the same behavioral tendency SHALL update the existing Pattern.

A new Pattern SHALL NOT be created for every repeated occurrence.

---

### PAT-003 — Evidence Ownership

Every Evidence record SHALL belong exclusively to the containing Pattern.

---

### PAT-004 — Confidence Consistency

Persisted Confidence SHALL represent derived state supported by observed Evidence.

Evidence remains the authoritative source.

---

### PAT-005 — Historical Preservation

Resolved Patterns SHALL remain historically available.

Player improvement SHALL NOT require Pattern deletion.

---

### PAT-006 — Controlled Growth

Supporting Evidence SHALL remain bounded to prevent uncontrolled document growth.

Occurrence count SHALL remain independent from the retained Evidence history.

---

## 10.12 Initial Pattern Persistence Direction

The initial Pattern persistence model is conceptually represented as:

Pattern

├── Identity

├── Player Reference

├── Pattern Type

├── Status

├── Confidence

├── Occurrences

├── Last Observed At

├── Evidence[]

│   ├── Match Reference

│   ├── Move Reference

│   └── Observed At

│

├── Created At

├── Updated At

└── Resolved At

This structure represents the logical persistence direction for the Pattern learning domain.

Detailed BSON structure, validation rules, indexes, and persistence implementation SHALL be defined during detailed schema design.

# 11. LessonProgress Entity Design

The LessonProgress Entity represents the persistent learning relationship between a Player and a Lesson.

Unlike Lesson content, which is reusable for all Players, LessonProgress represents one Player's individual learning state within one Lesson.

LessonProgress is modeled as an Associative Entity.

---

## 11.1 Purpose

The purpose of LessonProgress is to persist the canonical learning state between a Player and a Lesson.

LessonProgress answers questions such as:

- Has this Player started the Lesson?
- Is the Lesson completed?
- Which step has the Player reached?
- How many attempts has the Player made?
- What is the Player's best achieved score?

LessonProgress does not represent temporary runtime practice sessions.

---

## 11.2 Entity Identity

### Decision

LessonProgress SHALL have an independent identity.

Business uniqueness SHALL be defined by:

(Player, Lesson)

A Player SHALL have at most one canonical LessonProgress record for a specific Lesson.

---

## 11.3 Ownership

LessonProgress belongs to the Player–Lesson relationship.

It is not owned exclusively by either the Player Aggregate or the Lesson Aggregate.

LessonProgress therefore represents an Associative Entity connecting both domains.

Conceptually:

Player

    │
    ▼

LessonProgress
    
    ▲
    │
    
Lesson

---

## 11.4 References

LessonProgress SHALL contain references to:

- Player
- Lesson

Conceptually:

LessonProgress

├── playerId

└── lessonId

These references uniquely identify the learning relationship.

---

## 11.5 Learning State

LessonProgress maintains the player's canonical learning state.

Initial persisted state includes:

- status,
- current step,
- attempt count,
- best score,
- started timestamp,
- completion timestamp,
- and persistence timestamps.

LessonProgress represents long-term learning progress rather than temporary runtime activity.

---

## 11.6 Status Lifecycle

The initial LessonProgress lifecycle consists of:

Not Started
↓

In Progress
↓

Completed

Completed represents successful completion of the Lesson.

Completed status remains historically valid unless explicitly reset by future product requirements.

---

## 11.7 Attempts

### Decision

Attempt count SHALL be persisted.

### Rationale

Attempts provide useful learning information for:

- coaching,
- lesson analytics,
- player improvement,
- and instructional evaluation.

Attempt count is part of the player's long-term learning history.

---

## 11.8 Best Score

### Decision

Best achieved score SHALL be persisted.

### Rationale

The highest successfully achieved Lesson score represents meaningful long-term learning information.

Temporary replay sessions SHALL NOT overwrite the canonical best score.

---

## 11.9 Current Step

### Decision

Current Step SHALL be persisted while a Lesson is actively in progress.

### Rationale

Persisting the current instructional step supports:

- Lesson resumption,
- interrupted learning,
- and consistent player experience.

Current Step represents canonical Lesson progression.

---

## 11.10 Replay and Practice

A completed Lesson may be replayed for practice.

Practice sessions SHALL NOT overwrite the canonical LessonProgress.

LessonProgress represents permanent learning progress.

Practice represents temporary runtime activity.

If a Player exits a replay session before completion, the previously completed LessonProgress SHALL remain unchanged.

This behavior preserves the Player's historical learning achievements.

---

## 11.11 LessonProgress Responsibilities

LessonProgress is responsible for maintaining consistency between:

- Player,
- Lesson,
- learning status,
- current progression,
- attempts,
- best score,
- and completion timestamps.

Temporary practice behavior remains outside the responsibility of LessonProgress.

---

## 11.12 LessonProgress Invariants

### LP-001 — Relationship Uniqueness

A Player SHALL have at most one LessonProgress record for a specific Lesson.

Business uniqueness is defined by:

(Player, Lesson)

---

### LP-002 — Player Reference

Every LessonProgress SHALL reference exactly one Player.

---

### LP-003 — Lesson Reference

Every LessonProgress SHALL reference exactly one Lesson.

---

### LP-004 — Completion Integrity

Completed LessonProgress SHALL contain a valid completion timestamp.

---

### LP-005 — Best Score Integrity

Best Score SHALL represent the highest successfully achieved Lesson score.

Temporary replay sessions SHALL NOT overwrite this value.

---

### LP-006 — Practice Isolation

Replay and practice sessions SHALL NOT modify completed LessonProgress.

LessonProgress represents canonical learning history.

---

### LP-007 — Canonical Learning Record

LessonProgress SHALL remain the authoritative representation of the Player's learning progress for a Lesson.

Temporary runtime activity SHALL NOT replace canonical learning state.

---

## 11.13 Initial LessonProgress Persistence Direction

The initial LessonProgress persistence model is conceptually represented as:

LessonProgress

├── Identity

├── Player Reference

├── Lesson Reference

├── Status

├── Current Step

├── Attempts

├── Best Score

├── Started At

├── Completed At

├── Created At

└── Updated At

This structure represents the logical persistence direction for LessonProgress.

Detailed BSON fields, indexes, validation rules, and persistence implementation SHALL be defined during detailed schema design.