# PlyWise Software Requirements Specification

## Document Information

| Field | Value |
| --- | --- |
| Product | PlyWise |
| Product Descriptor | The Interactive Chess Mentor |
| Internal Codename | Project Knight |
| Document Type | Software Requirements Specification |
| Product Version | v1 |
| Document Version | 1.0 |
| Status | Draft |
| Last Updated | July 2026 |

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification defines the functional and non-functional requirements of the PlyWise Minimum Viable Product.

The document translates the approved Product Vision, MVP Scope, and Primary User Persona into explicit system requirements that can guide:

- architecture design,
- database design,
- API design,
- implementation,
- testing,
- and product acceptance.

Requirements defined in this document describe expected system behavior.

Implementation details are intentionally excluded unless they represent an approved technical constraint.

---

### 1.2 Product Overview

PlyWise is an interactive chess mentoring platform designed to help developing chess players understand their decisions and improve their independent chess thinking.

The system combines:

- playable chess experiences,
- chess-engine-backed analysis,
- move classification,
- contextual coaching,
- player pattern observation,
- guided interactive lessons,
- and post-game mentoring.

PlyWise does not treat engine analysis as the final player experience.

Engine output serves as technical evidence that may be interpreted by PlyWise systems to identify meaningful learning opportunities and provide player-oriented guidance.

The primary product experience is centered around two learning surfaces:

1. **Interactive Game Mentoring**
2. **Guided Lesson Mode**

Interactive Game Mentoring observes decisions made during games and selectively provides contextual coaching.

Guided Lesson Mode provides focused instructional experiences in which players interact with chess positions and receive feedback related to specific learning objectives.

---

### 1.3 Product Objective

The objective of PlyWise v1 is to validate whether contextual and interactive chess mentoring can improve player understanding beyond traditional move classification and raw engine analysis.

The system should help a player understand:

- what happened,
- what they failed to notice,
- why a decision was problematic,
- whether similar behavior has occurred before,
- and what they should consider in comparable future positions.

The system should progressively support the player's ability to make stronger independent decisions.

---

### 1.4 Intended Audience

This document is intended for:

- product owners,
- software developers,
- system architects,
- database designers,
- API designers,
- quality assurance contributors,
- and future PlyWise maintainers.

The document serves as the primary functional reference for the PlyWise v1 implementation.

---

### 1.5 Requirement Language

The following terminology is used throughout this document:

| Term | Meaning |
| --- | --- |
| SHALL | Mandatory MVP requirement |
| SHOULD | Strongly recommended behavior |
| MAY | Optional or implementation-dependent behavior |
| SHALL NOT | Explicitly prohibited behavior |

A requirement containing **SHALL** is required for PlyWise v1 acceptance unless the requirement is formally changed.

---

### 1.6 Requirement Identification

Functional requirements use the following identifier format:

`FR-{DOMAIN}-{NUMBER}`

Examples:

- `FR-AUTH-001`
- `FR-MATCH-004`
- `FR-COACH-012`
- `FR-LESSON-003`

Non-functional requirements use:

`NFR-{CATEGORY}-{NUMBER}`

Examples:

- `NFR-PERF-001`
- `NFR-SEC-002`
- `NFR-MAINT-004`

Requirement identifiers SHALL remain stable after approval.

If an approved requirement is removed, its identifier should not be reused for a different requirement.

---

## 2. Product Scope

### 2.1 In-Scope Product Experience

PlyWise v1 SHALL provide an authenticated player with the ability to:

- maintain a persistent PlyWise account,
- maintain a player chess profile,
- start a game against a computer-controlled opponent,
- play a complete legal chess game,
- receive engine-backed move analysis,
- have relevant moves classified,
- receive selective contextual coaching,
- preserve match-specific coaching context,
- accumulate basic evidence-based player patterns,
- receive contextual post-game mentoring,
- access previous PlyWise games,
- participate in guided interactive chess lessons,
- receive instructional feedback within lessons,
- preserve relevant lesson progress,
- and maintain supported product preferences.

The primary product objective is the delivery of interactive mentoring and guided chess learning.

---

### 2.2 Out-of-Scope Product Experience

PlyWise v1 SHALL NOT require:

- real-time player-versus-player multiplayer,
- tournaments,
- chess clubs,
- social feeds,
- follower systems,
- public chat,
- general-purpose AI chat,
- voice coaching,
- video coaching,
- professional human coach marketplaces,
- large-scale adaptive chess curricula,
- extensive course marketplaces,
- automatically generated long-term study plans,
- large opening preparation systems,
- live spectator infrastructure,
- native mobile applications,
- native desktop applications,
- public developer APIs,
- user-selectable chess engine ecosystems,
- or enterprise chess academy management.

The absence of these capabilities SHALL NOT prevent MVP acceptance.

---

### 2.3 MVP Completion Boundary

PlyWise v1 SHALL be considered functionally complete when the approved mentoring and guided learning experiences can be completed reliably.

The core mentoring experience requires that a player can:

1. authenticate,
2. start a computer match,
3. play legal chess moves,
4. receive engine-backed analysis,
5. receive selective coaching during meaningful learning moments,
6. complete the match,
7. receive contextual post-game mentoring,
8. and access persisted match context.

The guided learning experience requires that a player can:

1. access a supported lesson,
2. enter the lesson experience,
3. interact with a lesson chess position,
4. submit a decision or move,
5. receive instructional evaluation,
6. progress through the lesson,
7. and preserve required lesson progress.

Additional product features SHALL NOT independently define MVP completion.

---

## 3. System Context

### 3.1 System Overview

PlyWise is composed of multiple cooperating product systems.

At a conceptual level, the system includes:

| System | Responsibility |
| --- | --- |
| Web Client | Player-facing product interaction |
| Authentication System | Identity and authenticated access |
| Player System | Persistent chess and learning context |
| Match System | Chess game lifecycle and state |
| Chess Rules System | Legal move and game-state validation |
| Chess Engine Adapter | Engine-independent analysis interface |
| Bot System | Computer opponent decision generation |
| Move Analysis System | Move evaluation and classification |
| Coach Engine | Coaching eligibility and context decisions |
| Coaching Generation System | Player-oriented mentoring messages |
| Pattern Observation System | Evidence-based recurring behavior tracking |
| Post-Game Coaching System | Match-level mentoring summary |
| Lesson System | Guided lesson content and progression |
| Lesson Evaluation System | Lesson decision assessment and feedback |
| Match History System | Persisted game access |
| Preference System | Supported player experience settings |

These systems describe logical responsibilities.

They do not require each responsibility to be implemented as an independent deployable service.

---

### 3.2 Primary System Actors

#### 3.2.1 Player

The Player is the primary human actor.

The Player may:

- authenticate,
- manage supported profile information,
- start computer matches,
- make chess moves,
- receive coaching,
- complete games,
- review previous games,
- access lessons,
- interact with lesson positions,
- and maintain supported preferences.

---

#### 3.2.2 Computer Opponent

The Computer Opponent is a system actor responsible for participating in player-versus-computer matches.

The Computer Opponent:

- receives the current game state,
- requests move calculation through the supported engine boundary,
- selects or receives a valid computer move,
- and submits the move to the Match System.

The Computer Opponent SHALL NOT directly control coaching behavior.

---

#### 3.2.3 Chess Engine

The Chess Engine is an external analytical capability accessed through the Chess Engine Adapter.

The engine may provide:

- position evaluation,
- move calculation,
- best-move information,
- analysis metadata,
- and principal variation information where required.

Stockfish is the initial PlyWise v1 engine.

Core PlyWise mentoring logic SHALL NOT directly depend on Stockfish-specific APIs or process behavior.

---

#### 3.2.4 PlyWise Coach

The PlyWise Coach is a logical product actor representing the mentoring experience presented to the Player.

The Coach may:

- establish an initial mentoring presence,
- respond to meaningful learning opportunities,
- explain relevant chess decisions,
- reference supported player patterns,
- and provide post-game mentoring.

The Coach SHALL NOT independently modify chess game state.

The Coach SHALL NOT submit moves on behalf of the Player.

The Coach SHALL NOT be treated as the source of chess-engine truth.

---

### 3.3 High-Level Interaction Context

The primary match interaction follows this conceptual flow:

Player  
→ Match System  
→ Chess Rules Validation  
→ Board State Update  
→ Move Analysis  
→ Coach Engine  
→ Coaching Generation, when eligible

The Computer Opponent interaction follows:

Match System  
→ Bot System  
→ Chess Engine Adapter  
→ Chess Engine  
→ Bot System  
→ Match System

Player move analysis follows:

Analyzed Position  
→ Chess Engine Adapter  
→ Chess Engine  
→ Move Analysis System  
→ Move Classification  
→ Coach Engine

The Lesson Mode interaction follows:

Player  
→ Lesson System  
→ Lesson Position  
→ Player Decision  
→ Lesson Evaluation System  
→ Instructional Feedback  
→ Lesson Progression

These flows represent responsibility boundaries and SHALL NOT be interpreted as final API or deployment diagrams.

---

### 3.4 Match Mentoring Context

Coaching generated during a match SHALL belong to the context of that match.

The Coach Engine MAY use approved persistent player context when evaluating a learning opportunity.

Match-specific coaching SHALL remain distinguishable from:

- post-game coaching,
- lesson feedback,
- and general player pattern data.

PlyWise v1 SHALL NOT provide a global general-purpose Coach chat disconnected from chess learning context.

---

### 3.5 Lesson Context

A lesson SHALL represent a focused guided learning experience.

A lesson may contain:

- a learning objective,
- instructional content,
- one or more chess positions,
- player interaction requirements,
- expected decision information,
- evaluation rules,
- feedback information,
- and progression rules.

Lesson evaluation SHALL occur within the active lesson context.

Lesson feedback SHALL NOT automatically be treated as live match coaching.

Lesson progress SHALL remain distinguishable from match history.

---

### 3.6 Player Learning Context

PlyWise may maintain persistent learning context derived from supported player behavior.

Persistent learning context may include:

- observed chess tendencies,
- recurring mistake patterns,
- aggregated performance information,
- lesson progress,
- and supported skill representation.

Player learning context SHALL be evidence-based.

The system SHALL NOT represent an unsupported assumption about a player's psychology, intent, or personality as an established fact.

---

### 3.7 System Boundary Principles

PlyWise v1 SHALL maintain the following logical boundaries:

1. Chess-engine integration SHALL remain isolated from core mentoring logic.
2. Bot move generation SHALL remain separate from Coach Engine decisions.
3. Move classification SHALL remain distinguishable from coaching eligibility.
4. Coaching eligibility SHALL remain distinguishable from coaching message generation.
5. Match-specific coaching SHALL remain associated with match context.
6. Lesson evaluation SHALL remain distinguishable from live match analysis.
7. Player patterns SHALL be derived from supported evidence.
8. Web client presentation SHALL NOT define core chess or coaching rules.
9. Database persistence models SHALL NOT independently define product behavior.
10. External AI capabilities SHALL NOT be treated as authoritative chess-rule validators.

---

## 4. Product Assumptions

### 4.1 Player Knowledge

The primary PlyWise v1 player is assumed to understand:

- basic chess piece movement,
- basic board interaction,
- and the objective of a chess game.

PlyWise v1 is not required to teach chess from absolute zero.

---

### 4.2 Connectivity

PlyWise v1 is assumed to operate as a network-connected web product.

Core authenticated, mentoring, analysis, and persistence capabilities may require network connectivity.

Offline-first behavior is not required for MVP acceptance.

---

### 4.3 Engine Availability

The system assumes access to a supported chess-engine implementation for engine-backed match analysis and computer move generation.

The architecture SHALL permit the engine integration implementation to evolve without requiring the Coach Engine to directly adopt engine-specific behavior.

---

### 4.4 Coaching Generation

The system may use an external AI capability to generate player-oriented coaching language.

The Coach Engine SHALL determine the approved coaching context and intervention eligibility before coaching generation is requested.

The language-generation capability SHALL NOT independently determine authoritative chess legality or modify match state.

---

### 4.5 Lesson Content

PlyWise v1 assumes that supported lesson content is available in a structured format compatible with the Lesson System.

Automatic generation of a complete chess curriculum is not required.

---

## 5. Dependencies

PlyWise v1 may depend on:

- a supported chess rules implementation,
- a supported chess engine,
- a persistent database,
- an authentication mechanism,
- and an approved coaching language-generation capability.

Specific technologies may be defined in architecture documentation or Architecture Decision Records.

The SRS defines required system behavior and SHALL avoid unnecessary coupling to implementation libraries.

## 6. Functional Requirements

### 6.1 Authentication Requirements

#### FR-AUTH-001 — User Registration

The system SHALL allow a new user to create a PlyWise account using supported registration credentials.

#### FR-AUTH-002 — Registration Validation

The system SHALL validate required registration information before creating a user account.

#### FR-AUTH-003 — Unique Account Identity

The system SHALL prevent multiple accounts from being created with the same unique account identifier where uniqueness is required.

#### FR-AUTH-004 — User Sign-In

The system SHALL allow a registered user to authenticate using valid supported credentials.

#### FR-AUTH-005 — Invalid Authentication

The system SHALL reject authentication attempts containing invalid credentials.

#### FR-AUTH-006 — Authenticated Session

The system SHALL establish an authenticated session or equivalent authenticated access state after successful sign-in.

#### FR-AUTH-007 — Protected Access

The system SHALL restrict protected PlyWise resources to authenticated users.

#### FR-AUTH-008 — User Sign-Out

The system SHALL allow an authenticated user to terminate their active authenticated access state.

#### FR-AUTH-009 — Credential Protection

The system SHALL NOT persist user passwords as plain-text credentials.

#### FR-AUTH-010 — Authentication Ownership

The system SHALL associate authenticated requests with the corresponding PlyWise user identity.

---

### 6.2 Player Requirements

#### FR-PLAYER-001 — Player Profile Creation

The system SHALL maintain a player profile for each PlyWise user requiring persistent chess learning context.

#### FR-PLAYER-002 — Profile Ownership

A player profile SHALL belong to one PlyWise user.

#### FR-PLAYER-003 — Player Chess Information

The system SHALL support persistence of approved chess-related player information.

#### FR-PLAYER-004 — Skill Representation

The system MAY maintain a supported player rating, skill estimate, or equivalent skill representation.

#### FR-PLAYER-005 — Player Statistics

The system SHALL maintain approved aggregated player statistics derived from PlyWise activity.

#### FR-PLAYER-006 — Learning Context

The system SHALL support persistent player learning context required by approved mentoring capabilities.

#### FR-PLAYER-007 — Observed Play Style

The system MAY maintain evidence-based play-style information derived from supported chess behavior.

#### FR-PLAYER-008 — Profile Retrieval

The system SHALL allow an authenticated player to access supported information from their own player profile.

#### FR-PLAYER-009 — Profile Isolation

The system SHALL prevent a player from modifying another player's private profile or learning context through normal product access.

#### FR-PLAYER-010 — Unsupported Player Assumptions

The system SHALL NOT persist unsupported psychological or personality assumptions as established player facts.

---

### 6.3 Match Requirements

#### FR-MATCH-001 — Match Creation

The system SHALL allow an authenticated player to create a supported player-versus-computer chess match.

#### FR-MATCH-002 — Match Ownership

Each MVP match SHALL belong to the authenticated player who created the match.

#### FR-MATCH-003 — Initial Chess State

A newly created standard match SHALL begin from the approved initial chess position unless a supported match type explicitly defines another position.

#### FR-MATCH-004 — Match State

The system SHALL maintain the authoritative state of an active match.

#### FR-MATCH-005 — Active Turn

The system SHALL maintain which chess color has the active turn.

#### FR-MATCH-006 — Player Color

The system SHALL maintain the chess color assigned to the player.

#### FR-MATCH-007 — Computer Color

The system SHALL maintain the chess color assigned to the computer opponent.

#### FR-MATCH-008 — Move History

The system SHALL preserve the ordered move history of a match.

#### FR-MATCH-009 — Match Status

The system SHALL maintain the current match status.

#### FR-MATCH-010 — Match Result

The system SHALL preserve the result of a completed match.

#### FR-MATCH-011 — Match Metadata

The system SHALL preserve approved metadata required to identify and interpret a match.

#### FR-MATCH-012 — Active Match Retrieval

The system SHALL allow an authenticated player to retrieve a supported active match that belongs to them.

#### FR-MATCH-013 — Completed Match Persistence

The system SHALL preserve required match information after match completion.

#### FR-MATCH-014 — Unauthorized Match Access

The system SHALL prevent a player from modifying another player's match through normal product access.

#### FR-MATCH-015 — Completed Match Mutation

The system SHALL reject normal gameplay moves submitted to a completed match.

---

### 6.4 Chess Rules Requirements

#### FR-RULES-001 — Move Legality Validation

The system SHALL validate a submitted player move against the authoritative current chess position.

#### FR-RULES-002 — Illegal Move Rejection

The system SHALL reject a move that is illegal in the current chess position.

#### FR-RULES-003 — Turn Validation

The system SHALL reject a player move when it is not the player's active turn.

#### FR-RULES-004 — Board State Transition

The system SHALL update authoritative match state only after a move has passed required chess-rule validation.

#### FR-RULES-005 — Chess Position Representation

The system SHALL maintain sufficient chess position information to validate subsequent moves and reconstruct required game context.

#### FR-RULES-006 — Special Chess Moves

The system SHALL correctly support legal castling, en passant, and pawn promotion.

#### FR-RULES-007 — Check State

The system SHALL correctly recognize check where required for legal game-state processing.

#### FR-RULES-008 — Checkmate Detection

The system SHALL identify checkmate.

#### FR-RULES-009 — Draw Detection

The system SHALL identify supported rule-based draw conditions required by the MVP chess experience.

#### FR-RULES-010 — Game Termination

The system SHALL update match status and result when a supported terminal chess state is reached.

#### FR-RULES-011 — Rules Authority

External coaching language-generation capabilities SHALL NOT serve as the authoritative validator of chess move legality.

---

### 6.5 Bot Requirements

#### FR-BOT-001 — Computer Participation

The system SHALL provide a computer-controlled opponent for supported MVP matches.

#### FR-BOT-002 — Bot Turn Detection

The system SHALL determine when the computer opponent is required to move.

#### FR-BOT-003 — Bot Move Request

The Bot System SHALL request move calculation using the approved chess-engine boundary.

#### FR-BOT-004 — Current Position Input

The Bot System SHALL provide sufficient current chess position context for computer move calculation.

#### FR-BOT-005 — Bot Move Submission

A calculated computer move SHALL be submitted to the Match System for required processing.

#### FR-BOT-006 — Bot Move Legality

The system SHALL NOT intentionally persist an illegal computer move as an authoritative match move.

#### FR-BOT-007 — Bot and Coach Separation

The Bot System SHALL NOT determine whether the player receives coaching.

#### FR-BOT-008 — Calculation State

The system SHOULD expose sufficient processing state for the player experience to communicate when the computer opponent is calculating a move.

#### FR-BOT-009 — Bot Failure Handling

The system SHALL handle computer move calculation failure without falsely persisting a successful computer move.

---

### 6.6 Chess Engine Requirements

#### FR-ENGINE-001 — Engine Adapter

The system SHALL access chess-engine capabilities through an approved engine abstraction boundary.

#### FR-ENGINE-002 — Initial Engine

PlyWise v1 SHALL support Stockfish as the initial chess engine implementation.

#### FR-ENGINE-003 — Engine Independence

Core Match and Coach Engine behavior SHALL NOT directly depend on Stockfish-specific process commands or response formats.

#### FR-ENGINE-004 — Position Analysis

The engine integration SHALL support analysis of a valid supported chess position.

#### FR-ENGINE-005 — Move Calculation

The engine integration SHALL support calculation of a computer move for a supported position.

#### FR-ENGINE-006 — Evaluation Data

The engine integration SHALL provide approved evaluation data required by the Move Analysis System.

#### FR-ENGINE-007 — Best-Move Data

The engine integration SHALL support retrieval of best-move information where required.

#### FR-ENGINE-008 — Analysis Metadata

The engine integration MAY expose approved analysis metadata such as depth or principal variation.

#### FR-ENGINE-009 — Engine Failure

The engine boundary SHALL communicate analysis or move-calculation failure to the requesting PlyWise system.

#### FR-ENGINE-010 — Engine Result Normalization

Engine-specific output SHALL be normalized into approved PlyWise analysis representations before being consumed by core mentoring logic.

---

### 6.7 Move Analysis Requirements

#### FR-ANALYSIS-001 — Player Move Analysis

The system SHALL support engine-backed analysis of approved player moves.

#### FR-ANALYSIS-002 — Pre-Move Evaluation

The Move Analysis System SHALL support an evaluation representing the relevant position before the analyzed player move.

#### FR-ANALYSIS-003 — Post-Move Evaluation

The Move Analysis System SHALL support an evaluation representing the relevant position after the analyzed player move.

#### FR-ANALYSIS-004 — Evaluation Change

The system SHALL support derivation of an approved evaluation change for move classification.

#### FR-ANALYSIS-005 — Move Classification

The system SHALL assign an approved classification to an analyzed player move.

#### FR-ANALYSIS-006 — Supported Classifications

The initial classification model SHALL support:

- best,
- good,
- inaccuracy,
- mistake,
- blunder,
- and miss.

#### FR-ANALYSIS-007 — Configurable Classification Rules

Move-classification thresholds or decision rules SHALL remain configurable.

#### FR-ANALYSIS-008 — Analysis Persistence

The system SHALL preserve analysis information required for approved coaching, pattern observation, and match review capabilities.

#### FR-ANALYSIS-009 — Selective Best-Move Persistence

The system SHALL support preservation of best-move information for meaningful negative move classifications.

#### FR-ANALYSIS-010 — Negative Classification Coverage

The initial selective best-move persistence policy SHALL support:

- miss,
- inaccuracy,
- mistake,
- and blunder.

#### FR-ANALYSIS-011 — Best-Move Storage Boundary

The system SHALL NOT require best-move information to be persisted for every analyzed move.

#### FR-ANALYSIS-012 — Analysis Metadata

The system MAY preserve approved engine-analysis metadata where required for debugging, evaluation, or future interpretation.

#### FR-ANALYSIS-013 — Classification and Coaching Separation

Move classification SHALL NOT automatically require a coaching message.

#### FR-ANALYSIS-014 — Analysis Failure State

The system SHALL distinguish analysis failure from a successful move classification.

---

### 6.8 Live Coach Requirements

#### FR-COACH-001 — Match Coach Context

The system SHALL maintain coaching context associated with a supported match.

#### FR-COACH-002 — Initial Coach Presence

The system SHALL support an initial Coach message when a supported match begins.

#### FR-COACH-003 — Initial Message Evidence Boundary

The initial Coach message SHALL NOT falsely reference current-match behavior that has not yet occurred.

#### FR-COACH-004 — Coaching Eligibility Evaluation

The Coach Engine SHALL evaluate approved analyzed player decisions for coaching eligibility.

#### FR-COACH-005 — Selective Intervention

The Coach Engine SHALL NOT require a coaching intervention after every player move.

#### FR-COACH-006 — Meaningful Learning Opportunity

The Coach Engine SHALL support identification of meaningful learning opportunities.

#### FR-COACH-007 — Classification Context

The Coach Engine MAY consider move classification when determining coaching eligibility.

#### FR-COACH-008 — Evaluation Context

The Coach Engine MAY consider approved engine-analysis information when determining coaching eligibility.

#### FR-COACH-009 — Recent Match Context

The Coach Engine SHALL support use of approved recent match context where relevant.

#### FR-COACH-010 — Player Pattern Context

The Coach Engine MAY use approved persistent player patterns where relevant.

#### FR-COACH-011 — Repeated Behavior

The Coach Engine SHALL support recognition of approved repeated problematic behavior as a potential coaching signal.

#### FR-COACH-012 — Intervention Independence

A blunder, mistake, inaccuracy, or miss SHALL NOT independently guarantee a coaching message.

#### FR-COACH-013 — Coaching Context Construction

The system SHALL construct an approved coaching context before requesting coaching language generation.

#### FR-COACH-014 — Coaching Generation Boundary

The coaching language-generation capability SHALL receive only approved context required for the coaching request.

#### FR-COACH-015 — Player-Oriented Guidance

Generated coaching SHOULD prioritize understandable chess guidance over raw engine terminology.

#### FR-COACH-016 — Raw Engine Output

The system SHALL NOT use raw chess-engine output as the complete player-facing coaching experience.

#### FR-COACH-017 — Match Association

A live coaching message SHALL remain associated with the match in which it was generated.

#### FR-COACH-018 — Coaching History

The system SHALL support persistence of approved match-specific coaching history.

#### FR-COACH-019 — Coach Game-State Authority

The Coach SHALL NOT directly modify authoritative match state.

#### FR-COACH-020 — Coach Move Authority

The Coach SHALL NOT submit a move on behalf of the player.

#### FR-COACH-021 — Unsupported Claims

The Coach SHOULD avoid presenting unsupported player interpretations as established facts.

#### FR-COACH-022 — Coaching Failure

Failure to generate a non-essential live coaching message SHALL NOT falsely invalidate an otherwise legal persisted chess move.

#### FR-COACH-023 — Gameplay Continuity

Non-essential coaching generation SHALL NOT unnecessarily block normal board interaction.

---

### 6.9 Player Pattern Requirements

#### FR-PATTERN-001 — Pattern Observation

The system SHALL support observation of approved recurring player chess behaviors.

#### FR-PATTERN-002 — Evidence Source

A persisted player pattern SHALL be based on approved analyzed chess evidence.

#### FR-PATTERN-003 — Pattern Occurrence

The system SHALL support tracking repeated occurrences relevant to an observed pattern.

#### FR-PATTERN-004 — Pattern Context

The system MAY preserve approved context describing where or how a pattern was observed.

#### FR-PATTERN-005 — Pattern Update

The system SHALL support updating an existing player pattern when new relevant evidence is identified.

#### FR-PATTERN-006 — Pattern Separation

Distinct approved chess behavior patterns SHALL remain distinguishable.

#### FR-PATTERN-007 — Coaching Availability

Approved player patterns MAY be made available to the Coach Engine as coaching context.

#### FR-PATTERN-008 — Post-Game Availability

Approved player patterns MAY be made available to post-game coaching.

#### FR-PATTERN-009 — Unsupported Psychology

The Pattern Observation System SHALL NOT classify unsupported psychological traits as chess behavior patterns.

#### FR-PATTERN-010 — Evidence Traceability

The system SHOULD preserve sufficient evidence references to support interpretation of an observed pattern.

---

### 6.10 Post-Game Coaching Requirements

#### FR-POSTGAME-001 — Game-End Evaluation

The system SHALL support post-game coaching after a supported match reaches a completed state.

#### FR-POSTGAME-002 — Match Result Context

Post-game coaching SHALL support use of the match result.

#### FR-POSTGAME-003 — Meaningful Decision Context

Post-game coaching SHALL support use of meaningful analyzed player decisions.

#### FR-POSTGAME-004 — Positive Decision Context

Post-game coaching MAY consider meaningful positive player decisions.

#### FR-POSTGAME-005 — Mistake Context

Post-game coaching SHALL support use of important player mistakes.

#### FR-POSTGAME-006 — Match Pattern Context

Post-game coaching SHALL support patterns observed during the completed match.

#### FR-POSTGAME-007 — Persistent Pattern Context

Post-game coaching MAY use approved persistent player patterns where relevant.

#### FR-POSTGAME-008 — Contextual Congratulation

The system MAY provide congratulatory feedback appropriate to the player's result and observed performance.

#### FR-POSTGAME-009 — Play-Style Relevance

Post-game coaching MAY reference approved evidence-based play-style information where relevant.

#### FR-POSTGAME-010 — Improvement Guidance

Post-game coaching SHALL provide at least one practical improvement focus when sufficient relevant evidence is available.

#### FR-POSTGAME-011 — Generic Summary Avoidance

Post-game coaching SHOULD prioritize match-specific mentoring over generic game-result commentary.

#### FR-POSTGAME-012 — Post-Game Persistence

The system SHALL support persistence of the approved post-game coaching result.

#### FR-POSTGAME-013 — Post-Game Association

A post-game coaching result SHALL remain associated with the completed match.

#### FR-POSTGAME-014 — Post-Game Failure State

The system SHALL distinguish post-game coaching generation failure from match completion failure.

---

### 6.11 Lesson Mode Requirements

#### FR-LESSON-001 — Lesson Availability

The system SHALL provide supported guided chess lessons.

#### FR-LESSON-002 — Lesson Identity

Each lesson SHALL maintain a unique system identity.

#### FR-LESSON-003 — Learning Objective

Each supported lesson SHALL define an approved learning objective.

#### FR-LESSON-004 — Lesson Content

A lesson SHALL support structured instructional content.

#### FR-LESSON-005 — Interactive Position

A lesson SHALL support one or more interactive chess positions where required by the lesson design.

#### FR-LESSON-006 — Position State

The Lesson System SHALL maintain sufficient chess position state for supported lesson interaction.

#### FR-LESSON-007 — Player Attempt

The system SHALL allow the player to submit a supported move or decision within an active interactive lesson step.

#### FR-LESSON-008 — Lesson Attempt Validation

The system SHALL validate that a submitted lesson interaction belongs to the active lesson context.

#### FR-LESSON-009 — Chess Move Legality

Where a lesson requires a legal chess move, the system SHALL validate move legality.

#### FR-LESSON-010 — Lesson Evaluation

The Lesson Evaluation System SHALL evaluate the player's submitted lesson decision against approved lesson evaluation rules.

#### FR-LESSON-011 — Correct Decision Feedback

The system SHALL support instructional feedback for an approved correct lesson decision.

#### FR-LESSON-012 — Incorrect Decision Feedback

The system SHALL support instructional feedback for an incorrect or suboptimal lesson decision.

#### FR-LESSON-013 — Attempt-Specific Feedback

Lesson feedback SHOULD reflect the player's attempted decision where sufficient evaluation context is available.

#### FR-LESSON-014 — Instructional Objective Alignment

Lesson feedback SHALL remain relevant to the active lesson's learning objective.

#### FR-LESSON-015 — Engine Assistance

The Lesson Evaluation System MAY use chess-engine analysis where appropriate.

#### FR-LESSON-016 — Engine Independence

Chess-engine output SHALL NOT independently define the complete instructional flow of a lesson.

#### FR-LESSON-017 — Lesson Progression

The system SHALL support progression through the ordered steps or stages of an active lesson.

#### FR-LESSON-018 — Progression Rules

Lesson progression SHALL follow approved lesson progression rules.

#### FR-LESSON-019 — Lesson Completion

The system SHALL identify when a player has completed a supported lesson.

#### FR-LESSON-020 — Player Lesson Progress

The system SHALL preserve required lesson progress for an authenticated player.

#### FR-LESSON-021 — Lesson Resume

The system MAY allow a player to resume an incomplete supported lesson.

#### FR-LESSON-022 — Match Separation

Lesson interaction SHALL remain distinguishable from normal match gameplay.

#### FR-LESSON-023 — Coaching Separation

Lesson instructional feedback SHALL remain distinguishable from match-specific live coaching.

#### FR-LESSON-024 — Lesson History Context

The system MAY preserve approved lesson-attempt information required to understand player learning progress.

#### FR-LESSON-025 — Static Content Boundary

The Lesson System SHALL NOT require every lesson to be implemented as passive static reading content.

#### FR-LESSON-026 — General Chat Boundary

Lesson Mode SHALL NOT require a general-purpose AI chat experience.

## 7. Non-Functional Requirements

### 7.1 Performance Requirements

#### NFR-PERF-001 — Board Interaction Responsiveness

The player-facing chess board SHOULD reflect a valid local player interaction without perceptible delay caused by non-essential coaching generation.

#### NFR-PERF-002 — Non-Blocking Coaching

Non-essential live coaching generation SHALL NOT block normal board interaction while coaching processing is in progress.

#### NFR-PERF-003 — Computer Move Processing State

When computer move calculation requires visible processing time, the player experience SHOULD communicate an appropriate calculation state.

#### NFR-PERF-004 — Analysis Processing State

The system SHOULD expose sufficient processing state to communicate when relevant move analysis or coaching processing is in progress.

#### NFR-PERF-005 — API Responsiveness

Normal API operations that do not depend on chess-engine analysis or external language generation SHOULD complete within a reasonable interactive response time under expected MVP operating conditions.

#### NFR-PERF-006 — Expensive Operation Isolation

Chess-engine analysis and external language-generation operations SHOULD remain distinguishable from normal low-latency application operations.

#### NFR-PERF-007 — Duplicate Expensive Processing

The system SHOULD avoid unnecessary duplicate chess-engine analysis or coaching-generation requests for the same approved processing context.

#### NFR-PERF-008 — Payload Efficiency

Application interfaces SHOULD avoid transferring unnecessary engine, coaching, or match data when the consuming operation does not require it.

#### NFR-PERF-009 — MVP Performance Measurement

Performance-sensitive operations SHOULD be measurable before production performance thresholds are finalized.

#### NFR-PERF-010 — Performance Threshold Evolution

Specific latency targets MAY be refined using observed MVP performance data without changing the functional purpose of the affected system.

---

### 7.2 Reliability Requirements

#### NFR-REL-001 — Authoritative State Protection

Failure of a secondary or optional system SHALL NOT corrupt authoritative chess match state.

#### NFR-REL-002 — Legal Move Persistence

A successfully accepted legal move SHALL NOT be represented as rejected solely because non-essential coaching generation failed.

#### NFR-REL-003 — Match State Consistency

Persisted match state SHALL remain internally consistent with the authoritative ordered move history.

#### NFR-REL-004 — Duplicate Move Protection

The system SHALL protect authoritative match processing from unintended duplicate move persistence caused by repeated equivalent requests.

#### NFR-REL-005 — Engine Failure Isolation

Chess-engine failure SHALL be distinguishable from chess-rule validation failure.

#### NFR-REL-006 — Coaching Failure Isolation

Coaching-generation failure SHALL be distinguishable from match-processing failure.

#### NFR-REL-007 — Post-Game Failure Isolation

Post-game coaching failure SHALL NOT falsely revert a successfully completed chess match to an active state.

#### NFR-REL-008 — Lesson State Consistency

Persisted lesson progress SHALL remain consistent with approved lesson progression rules.

#### NFR-REL-009 — Failure Communication

The system SHALL communicate actionable internal failure information through approved application error handling.

#### NFR-REL-010 — Graceful Failure

Where possible, failure of a non-authoritative external capability SHOULD degrade the affected experience without corrupting unrelated product state.

#### NFR-REL-011 — Process Failure Handling

The backend application SHALL handle startup-critical failures in a controlled manner.

#### NFR-REL-012 — Database Dependency

The backend SHALL NOT report successful application readiness when required database initialization has failed.

---

### 7.3 Security Requirements

#### NFR-SEC-001 — Password Storage

User passwords SHALL NOT be stored in plain text.

#### NFR-SEC-002 — Credential Hashing

Locally managed user passwords SHALL be protected using an approved password-hashing mechanism before persistence.

#### NFR-SEC-003 — Authentication Validation

Protected operations SHALL validate authenticated access using the approved authentication mechanism.

#### NFR-SEC-004 — Resource Ownership

Player-owned protected resources SHALL enforce ownership or approved authorization rules.

#### NFR-SEC-005 — Match Authorization

A player SHALL NOT be permitted to mutate another player's private match through normal application access.

#### NFR-SEC-006 — Lesson Progress Authorization

A player SHALL NOT be permitted to mutate another player's private lesson progress through normal application access.

#### NFR-SEC-007 — Profile Authorization

A player SHALL NOT be permitted to modify another player's private player profile through normal application access.

#### NFR-SEC-008 — Secret Management

Application secrets SHALL NOT be intentionally committed to source control.

#### NFR-SEC-009 — Environment Configuration

Sensitive environment-specific configuration SHALL be supplied through approved runtime configuration mechanisms.

#### NFR-SEC-010 — Input Validation

Externally supplied application input SHALL be validated before being trusted by domain processing.

#### NFR-SEC-011 — Controlled Values

Inputs representing controlled application values SHOULD be validated against approved values.

#### NFR-SEC-012 — Error Exposure

Production-facing errors SHALL NOT intentionally expose sensitive secrets, credentials, or unnecessary internal implementation details.

#### NFR-SEC-013 — External AI Context Minimization

The system SHOULD provide an external coaching language-generation capability only the approved context required for the generation task.

#### NFR-SEC-014 — AI Authority Restriction

External language-generation output SHALL NOT directly authorize protected operations or modify authoritative chess state.

#### NFR-SEC-015 — Dependency Review

Security-relevant dependency vulnerabilities SHOULD be reviewed and addressed according to their applicability and risk to PlyWise.

---

### 7.4 Maintainability Requirements

#### NFR-MAINT-001 — Separation of Concerns

The implementation SHOULD maintain clear responsibility boundaries between major product domains.

#### NFR-MAINT-002 — Module Responsibility

Modules SHOULD have a focused and identifiable primary responsibility.

#### NFR-MAINT-003 — Engine Abstraction

Chess-engine-specific integration details SHALL remain isolated behind the approved engine boundary.

#### NFR-MAINT-004 — Bot Separation

Computer opponent move generation SHALL remain logically separate from coaching decisions.

#### NFR-MAINT-005 — Classification Separation

Move classification SHALL remain logically distinguishable from coaching eligibility.

#### NFR-MAINT-006 — Generation Separation

Coaching context decisions SHOULD remain distinguishable from player-facing language generation.

#### NFR-MAINT-007 — Lesson Separation

Lesson progression and evaluation SHOULD remain distinguishable from normal match processing.

#### NFR-MAINT-008 — Client Separation of Concerns

The web client SHOULD separate presentation, reusable stateful behavior, client state management, service communication, and API transport responsibilities where appropriate.

#### NFR-MAINT-009 — Frontend Dependency Flow

The web client SHOULD preserve approved responsibility flow between hooks, stores, services, and API communication modules.

#### NFR-MAINT-010 — Centralized Environment Access

Backend runtime environment configuration SHOULD be accessed through an approved centralized configuration boundary.

#### NFR-MAINT-011 — Configurable Product Rules

Product rules expected to evolve, including move-classification thresholds, SHOULD remain configurable where practical.

#### NFR-MAINT-012 — Stable Requirement References

Approved SRS requirement identifiers SHALL remain stable for traceability.

#### NFR-MAINT-013 — Code Formatting

Repository source files covered by the approved formatting policy SHALL conform to the configured formatting standard.

#### NFR-MAINT-014 — Static Analysis

Supported application source code SHALL pass approved linting rules before an accepted development unit is considered complete.

#### NFR-MAINT-015 — Documentation Alignment

Material product or architecture changes SHOULD be reflected in the corresponding approved documentation.

#### NFR-MAINT-016 — Avoid Premature Abstraction

Shared internal abstractions SHOULD be introduced when justified by repeated responsibilities or a defined architecture boundary.

---

### 7.5 Scalability Requirements

#### NFR-SCALE-001 — Stateless API Preference

Application API processing SHOULD avoid unnecessary in-memory user-specific state that prevents horizontal backend scaling.

#### NFR-SCALE-002 — Persistent State

Required durable player, match, coaching, pattern, and lesson state SHALL be stored using approved persistent mechanisms.

#### NFR-SCALE-003 — Engine Processing Boundary

The architecture SHOULD permit chess-engine processing to evolve independently from general API request processing.

#### NFR-SCALE-004 — Coaching Processing Boundary

The architecture SHOULD permit coaching-generation processing to evolve independently from authoritative match-state processing.

#### NFR-SCALE-005 — Worker Evolution

The architecture MAY support future extraction of expensive analysis or coaching workloads into dedicated processing workers.

#### NFR-SCALE-006 — Application Workspace Growth

The repository structure SHOULD permit additional deployable applications or workers without requiring existing applications to be reclassified by frontend/backend naming conventions.

#### NFR-SCALE-007 — MVP Proportionality

Scalability-oriented architecture SHALL NOT require premature distributed-system complexity for MVP acceptance.

#### NFR-SCALE-008 — Measurement Before Distribution

A workload SHOULD be measured and identified as an operational bottleneck before being separated solely for scalability reasons.

---

### 7.6 Observability Requirements

#### NFR-OBS-001 — Application Logging

The backend SHALL support structured or consistently interpretable application logging.

#### NFR-OBS-002 — Startup Logging

The backend SHALL log successful startup and startup-critical failure states.

#### NFR-OBS-003 — Database Connection State

The backend SHALL expose sufficient operational logging to identify database initialization success or failure.

#### NFR-OBS-004 — Engine Failure Logging

Chess-engine analysis and move-calculation failures SHALL be observable through approved application logging.

#### NFR-OBS-005 — Coaching Failure Logging

Coaching-generation failures SHALL be observable without requiring the failure to invalidate unrelated match state.

#### NFR-OBS-006 — Error Context

Operational errors SHOULD include sufficient non-sensitive context to identify the affected subsystem or operation.

#### NFR-OBS-007 — Sensitive Log Protection

Application logs SHALL NOT intentionally contain passwords, authentication secrets, or complete private credentials.

#### NFR-OBS-008 — Request Traceability

The backend SHOULD support sufficient request or operation correlation to investigate multi-step match, analysis, and coaching flows.

#### NFR-OBS-009 — Expensive Operation Measurement

The system SHOULD support measurement of engine-analysis and coaching-generation duration.

#### NFR-OBS-010 — Coaching Decision Observation

The system SHOULD support investigation of whether a coaching opportunity was accepted or skipped by the Coach Engine.

#### NFR-OBS-011 — Pattern Observation Traceability

The system SHOULD support investigation of the approved evidence used to create or update a player pattern.

#### NFR-OBS-012 — Production Debugging Boundary

Production observability SHOULD provide actionable operational information without requiring sensitive player information to be unnecessarily exposed.

---

### 7.7 Usability Requirements

#### NFR-USE-001 — Board Priority

The chess board SHALL remain the primary interaction surface during an active match.

#### NFR-USE-002 — Coaching Interruption Control

The player experience SHOULD avoid unnecessary coaching interruptions.

#### NFR-USE-003 — Processing Feedback

Visible processing that materially affects the immediate player experience SHOULD be communicated through understandable interface feedback.

#### NFR-USE-004 — Coaching Clarity

Player-facing coaching SHOULD prioritize understandable chess language appropriate to the target persona.

#### NFR-USE-005 — Technical Detail Control

Raw centipawn values, deep engine variations, and engine-specific technical details SHALL NOT be required for the primary mentoring experience.

#### NFR-USE-006 — Feedback Relevance

Coaching and lesson feedback SHOULD remain focused on the relevant learning opportunity.

#### NFR-USE-007 — Lesson Objective Clarity

A lesson SHOULD communicate its learning objective in an understandable manner.

#### NFR-USE-008 — Interactive Learning

Lesson experiences SHOULD allow active player decision-making where interaction supports the learning objective.

#### NFR-USE-009 — Incorrect Attempt Experience

An incorrect lesson attempt SHOULD provide useful instructional guidance rather than only reporting failure.

#### NFR-USE-010 — Independent Thinking

The product SHOULD avoid unnecessarily revealing the best move before the player has had an appropriate opportunity to think.

#### NFR-USE-011 — Coach Identity

The Coach experience SHOULD remain consistent with the role of an interactive chess mentor.

#### NFR-USE-012 — General Chat Avoidance

The product SHALL NOT present the PlyWise Coach as a general-purpose AI assistant.

#### NFR-USE-013 — Responsive Web Experience

The MVP web experience SHOULD remain usable across approved modern desktop viewport sizes.

#### NFR-USE-014 — Accessibility Consideration

Core player interactions SHOULD consider keyboard accessibility, readable interface text, and sufficient semantic structure where practical.

---

### 7.8 Data Integrity Requirements

#### NFR-DATA-001 — Match Move Ordering

Persisted match moves SHALL preserve authoritative move order.

#### NFR-DATA-002 — Match Association

Persisted move and match-specific coaching information SHALL remain associated with the correct match.

#### NFR-DATA-003 — Player Association

Persisted player learning context SHALL remain associated with the correct player.

#### NFR-DATA-004 — Lesson Progress Association

Persisted lesson progress SHALL remain associated with the correct player and lesson.

#### NFR-DATA-005 — Analysis Distinction

The system SHALL distinguish successful move analysis from failed or unavailable analysis.

#### NFR-DATA-006 — Coaching Distinction

The system SHALL distinguish generated coaching from coaching-generation failure or intentionally skipped intervention.

#### NFR-DATA-007 — Pattern Evidence

Persisted player patterns SHOULD maintain sufficient approved evidence linkage to support pattern interpretation.

#### NFR-DATA-008 — Completed Match State

A completed match SHALL preserve its terminal status and approved result information.

#### NFR-DATA-009 — Controlled Classification Values

Persisted move classifications SHALL use approved classification values.

#### NFR-DATA-010 — Schema Evolution

Persistent data design SHOULD permit controlled schema evolution as PlyWise versions develop.

---

### 7.9 Compatibility and Portability Requirements

#### NFR-COMPAT-001 — Web Delivery

PlyWise v1 SHALL be deliverable as a web application.

#### NFR-COMPAT-002 — Modern Browser Support

The web client SHOULD support approved modern browser environments.

#### NFR-COMPAT-003 — API Versioning

Publicly consumed PlyWise application API routes SHALL use an approved API versioning strategy.

#### NFR-COMPAT-004 — MVP API Version

PlyWise v1 application APIs SHALL use the `v1` API namespace where the approved API design requires versioned routes.

#### NFR-COMPAT-005 — Engine Replacement

The architecture SHOULD permit replacement or addition of a supported chess-engine implementation without requiring core Coach Engine logic to consume engine-specific response formats.

#### NFR-COMPAT-006 — Environment Portability

Environment-specific values SHOULD remain external to committed application source code where appropriate.

---

### 7.10 Quality Verification Requirements

#### NFR-QUAL-001 — Formatting Verification

The repository SHALL provide an approved mechanism to verify source formatting compliance.

#### NFR-QUAL-002 — Lint Verification

The repository SHALL provide an approved mechanism to execute supported application lint checks.

#### NFR-QUAL-003 — Root Quality Orchestration

The repository SHOULD provide root-level commands for orchestrating supported workspace quality checks.

#### NFR-QUAL-004 — Functional Testability

Core domain behavior SHOULD be structured so that important business rules can be tested without requiring the complete player interface.

#### NFR-QUAL-005 — Engine Boundary Testability

Core systems consuming normalized engine results SHOULD be testable independently of a live Stockfish process where practical.

#### NFR-QUAL-006 — Coach Decision Testability

Coach eligibility decisions SHOULD be testable independently of final coaching language generation where practical.

#### NFR-QUAL-007 — Lesson Evaluation Testability

Lesson evaluation rules SHOULD be testable independently of visual lesson presentation where practical.

#### NFR-QUAL-008 — Regression Protection

Critical chess-state, authentication, ownership, analysis, and coaching-decision behavior SHOULD receive automated regression coverage as the MVP implementation develops.

#### NFR-QUAL-009 — Verification Before Integration

A development unit SHOULD pass applicable approved quality checks before being integrated into the primary development branch.

---

## 8. Technical and Product Constraints

### 8.1 Web Product Constraint

PlyWise v1 is implemented as a web-based product.

Native mobile and desktop applications are outside MVP acceptance requirements.

### 8.2 Versioned API Constraint

PlyWise application APIs SHALL follow the approved versioned API design.

The initial API version is `v1`.

### 8.3 Engine Boundary Constraint

Stockfish is the initial chess-engine implementation.

Core mentoring behavior SHALL consume approved PlyWise analysis representations rather than Stockfish-specific output formats.

### 8.4 Persistent Database Constraint

PlyWise SHALL use an approved persistent database for durable MVP state.

### 8.5 Evidence-Based Mentoring Constraint

Persistent player patterns and player-specific coaching claims SHALL be based on approved available evidence.

### 8.6 MVP Scope Constraint

Implementation SHALL remain proportional to the approved MVP Scope.

Future-oriented architecture MAY be considered.

Future-version product features SHALL NOT become implicit MVP requirements without an approved scope change.

---

## 9. Quality Attribute Priorities

For PlyWise v1, the following quality attributes are prioritized:

| Priority | Quality Attribute | Rationale |
| --- | --- | --- |
| 1 | Correctness | Chess state and learning context must remain trustworthy |
| 2 | Maintainability | Coach, engine, match, and lesson systems will evolve |
| 3 | Reliability | Secondary AI failures must not corrupt authoritative state |
| 4 | Usability | Mentoring must remain understandable and non-disruptive |
| 5 | Observability | Multi-step analysis and coaching flows require investigation |
| 6 | Security | Player-owned data and authenticated operations require protection |
| 7 | Performance | Board interaction and visible processing must remain responsive |
| 8 | Scalability | Architecture should permit growth without premature distribution |

The priority order does not make lower-ranked attributes optional.

The order indicates the primary engineering trade-off direction for the MVP.

When a design decision creates a direct conflict between quality attributes, the product and architecture team SHOULD evaluate the decision using this priority context and document material trade-offs where required.

## 10. Acceptance Criteria

### 10.1 Functional Acceptance

PlyWise v1 SHALL satisfy all approved mandatory functional requirements defined in this SRS unless superseded by an approved Architecture Decision Record (ADR) or product scope change.

Acceptance SHALL verify that:

- required product systems are operational,
- required ownership rules are enforced,
- chess gameplay behaves correctly,
- coaching behaves according to approved product boundaries,
- lesson functionality satisfies approved instructional requirements,
- persistent player context behaves correctly,
- and supported history and preference systems function correctly.

---

### 10.2 Non-Functional Acceptance

The MVP SHALL demonstrate that the approved quality objectives are satisfied to an acceptable level for the intended MVP release.

Verification SHOULD include:

- formatting compliance,
- lint compliance,
- functional testing,
- integration testing where appropriate,
- manual exploratory testing,
- and documented validation of major mentoring flows.

---

### 10.3 Mentoring Acceptance

The mentoring experience SHALL be considered acceptable when:

- coaching is contextual,
- coaching is selective,
- coaching reflects available evidence,
- coaching avoids unsupported assumptions,
- coaching remains understandable,
- and coaching supports independent chess thinking.

---

### 10.4 Lesson Acceptance

Lesson Mode SHALL be considered acceptable when:

- lesson objectives are understandable,
- lesson interaction functions correctly,
- instructional feedback reflects player decisions,
- lesson progression follows approved rules,
- and lesson progress is correctly persisted.

---

## 11. Requirement Traceability

Every approved requirement SHOULD remain traceable throughout development.

Requirements SHOULD be traceable to:

- Product Vision,
- MVP Scope,
- User Persona,
- Architecture,
- API Design,
- Database Design,
- implementation,
- testing,
- and future maintenance.

Requirement identifiers SHALL remain stable.

---

### Example Traceability

| Requirement | Related Documents |
| ------------| ----------------- |
| FR-COACH-004 | MVP Scope, Product Vision |
| FR-LESSON-010 | MVP Scope, User Persona |
| FR-MATCH-003 | Architecture, Database Design |
| NFR-MAINT-003 | Architecture Decision Records |
| NFR-QUAL-005 | Testing Strategy |

---

## 12. Change Management

Changes affecting approved requirements SHALL be documented before implementation.

Major product changes SHOULD update:

- Product Vision,
- MVP Scope,
- User Persona,
- Architecture,
- and this SRS where applicable.

Implementation SHALL NOT become the source of truth.

Approved documentation remains the primary source of product intent.

---

## 13. Document Approval

| Role | Status |
| ---- | ------ |
| Product Vision | Approved |
| MVP Scope | Approved |
| User Persona | Approved |
| Software Requirements Specification | Approved |

---

## 14. Conclusion

This Software Requirements Specification defines the expected functional behavior, quality attributes, system boundaries, and product constraints for PlyWise v1.

The document establishes a common engineering language for product planning, architecture, implementation, testing, and future maintenance.

The objective of this document is not to prescribe implementation technologies.

Its purpose is to define **what the system must achieve** while allowing the architecture to evolve responsibly.

PlyWise is considered successful not when it simply analyzes chess games,

but when it consistently helps players develop stronger independent chess thinking.