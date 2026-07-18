# PlyWise MVP Scope

## Document Information

| Field | Value |
| --- | --- |
| Product | PlyWise |
| Product Descriptor | The Interactive Chess Mentor |
| Internal Codename | Project Knight |
| Document Type | MVP Scope |
| Product Version | v1 |
| Status | Approved |
| Last Updated | July 2026 |

---

## 1. Purpose

This document defines the functional boundaries of the PlyWise Minimum Viable Product.

The purpose of the MVP is to validate the core product hypothesis:

> Can contextual, selective, and player-oriented coaching make chess decisions easier to understand than traditional engine evaluation alone?

The MVP is not intended to deliver a complete chess learning ecosystem.

Its primary responsibility is to establish and validate the interactive mentoring experience that differentiates PlyWise from traditional chess analysis tools.

---

## 2. MVP Objective

The PlyWise MVP should allow a player to play a chess game against a computer opponent while receiving contextual coaching based on meaningful decisions made during the game.

The system should:

- maintain a playable chess game,
- evaluate player moves,
- identify meaningful move classifications,
- generate selective coaching feedback,
- preserve relevant game and coaching context,
- observe basic player tendencies,
- and provide a contextual post-game mentoring summary.

Alongside the mentoring loop, the MVP also establishes a guided Lesson Mode for focused, interactive chess learning.

The MVP succeeds technically when this complete mentoring loop functions reliably.

The core loop is:

**Play → Analyze → Interpret → Coach → Observe → Summarize**

---

## 3. In-Scope Capabilities

### 3.1 User Authentication

The MVP will support basic user account functionality.

Users should be able to:

- create an account,
- sign in,
- maintain an authenticated session,
- and access their own games and player information.

Authentication exists to support persistent player context and game ownership.

Advanced identity providers are not required for the initial MVP.

---

### 3.2 Player Profile

Each authenticated user will have a player profile.

The profile may maintain:

- chess-related player information,
- current rating or skill representation,
- basic ranking information where applicable,
- observed play-style information,
- aggregated player statistics,
- and recurring learning patterns.

The MVP does not require a complex public social profile.

The primary purpose of the player profile is to provide context to the mentoring system.

---

### 3.3 Play Against Computer

The MVP will support chess games between:

- one authenticated player,
- and one computer-controlled opponent.

The player should be able to start and complete a legal chess game.

The system must maintain:

- board state,
- move history,
- active turn,
- game status,
- game result,
- and relevant match metadata.

Multiplayer games between two human users are outside the MVP scope.

---

### 3.4 Computer Move Generation

The computer opponent will use a chess engine to calculate moves.

Stockfish is the initial engine selected for the MVP.

Engine integration must remain behind an abstraction boundary so that the core game and coaching systems are not directly dependent on Stockfish-specific implementation details.

The computer move calculation may introduce a short processing delay.

The user interface may communicate this state through feedback such as:

- calculating,
- thinking,
- or analysis in progress.

---

### 3.5 Move Analysis

Player moves will be evaluated using engine analysis.

The analysis system should be capable of maintaining relevant evaluation information for a move.

Move analysis may include:

- evaluation before the move,
- evaluation after the move,
- evaluation change,
- move classification,
- engine depth or related analysis metadata,
- and best-move information where required.

The MVP does not require best-move data to be stored for every move.

Best-move information should primarily be preserved for meaningful negative move classifications such as:

- miss,
- inaccuracy,
- mistake,
- and blunder.

The exact classification thresholds should remain configurable and should not be treated as immutable product rules.

---

### 3.6 Move Classification

The system will classify relevant player moves based on analysis results.

Initial classifications may include:

- best,
- good,
- inaccuracy,
- mistake,
- blunder,
- and miss.

Move classification is a technical signal.

A classification does not automatically require a coaching message.

The Coach Engine determines whether a classified move represents a meaningful learning opportunity.

---

### 3.7 Live Coach Presence

The interactive coach should establish a presence when a game begins.

The coach may provide an initial contextual message before meaningful move analysis has occurred.

The purpose of this message is to establish the mentoring experience and communicate that the player is being observed and guided.

The initial message must not falsely claim knowledge that has not yet been derived from the current game.

---

### 3.8 Selective Live Coaching

The Coach Engine will evaluate analyzed player decisions and determine whether coaching should be provided.

The coach should not comment after every move.

Live coaching should prioritize meaningful events such as:

- inaccuracies,
- mistakes,
- blunders,
- missed opportunities,
- repeated problematic behavior,
- or other decisions with meaningful learning value.

A technically weak move does not always require interruption.

The coaching system should balance instructional value with gameplay continuity.

---

### 3.9 Contextual Coaching Messages

When coaching is triggered, the generated message should be based on available context.

Relevant context may include:

- the current move,
- move classification,
- engine analysis,
- best-move information where available,
- recent game context,
- previously observed player tendencies,
- and relevant recurring mistake patterns.

The Coach Engine should translate technical analysis into player-oriented guidance.

Raw engine output should not be presented as the mentoring experience.

---

### 3.10 Asynchronous Analysis Experience

A valid player move should update the game experience without unnecessarily waiting for complete coaching generation.

Analysis and coaching may continue after the board state has been updated.

The intended interaction model is:

1. The player makes a valid move.
2. The board reflects the move.
3. Required game processing continues.
4. Engine analysis is performed.
5. Coaching logic evaluates the result.
6. A coaching message appears if intervention is justified.

The exact implementation may evolve, but non-essential analysis should not create avoidable board interaction delays.

---

### 3.11 Match-Specific Coach Chat

Coaching conversation belongs to the context of a specific match.

Coach messages should therefore be associated with the match in which they were generated.

The MVP may preserve match-specific coaching history.

A global cross-product chat system is outside the MVP scope.

The coach experience is a chess mentoring interaction, not a general-purpose AI chatbot.

---

### 3.12 Player Pattern Observation

The MVP should establish an initial mechanism for observing player tendencies across analyzed games.

Examples may include recurring:

- tactical oversights,
- missed threats,
- premature attacks,
- unnecessary queen movement,
- king-safety issues,
- material loss patterns,
- or other identifiable chess behaviors.

The MVP does not require a complete psychological or deeply personalized player model.

Pattern observation should remain evidence-based and derived from analyzed chess behavior.

---

### 3.13 Post-Game Coaching

When a game ends, the Coach Engine should generate a contextual post-game message.

The summary should consider:

- the game result,
- meaningful positive decisions,
- important mistakes,
- recurring patterns observed during the game,
- and existing player tendencies where relevant.

The coach may congratulate the player in a manner appropriate to their performance and observed play style.

The post-game response should also identify practical improvement areas.

The intended result is a mentoring summary rather than a generic statistical report.

---

### 3.14 Lesson Mode

The MVP will include a focused Lesson Mode designed to help players practice and understand specific chess concepts through guided learning interactions.

Lesson Mode is distinct from the live coaching experience used during a normal game against the computer.

In a normal match, coaching is reactive and contextual. The player makes independent decisions, the system analyzes those decisions, and the Coach Engine selectively intervenes when a meaningful learning opportunity is identified.

Lesson Mode is intentionally instructional.

The system may introduce a specific chess concept, position, tactical idea, or decision scenario and guide the player through the learning experience.

Lesson Mode should support:

- focused chess learning topics,
- guided instructional explanations,
- interactive chess positions,
- player move input within a lesson context,
- evaluation of the player's decision,
- contextual feedback based on the attempted move,
- and progression through the active lesson.

The purpose of Lesson Mode is not to provide a large static library of chess articles.

Lessons should use interaction wherever the learning objective benefits from player decision-making.

A lesson may present a position and ask the player to identify or play an appropriate move. The system should evaluate the player's attempt and provide guidance relevant to the lesson objective.

Lesson Mode may use chess-engine analysis where technically appropriate, but engine output alone does not define lesson correctness or instructional flow.

The lesson system should preserve a separation between:

- lesson content,
- lesson progression,
- chess position interaction,
- move evaluation,
- and instructional feedback.

The MVP requires the foundational Lesson Mode experience.

A large adaptive curriculum, extensive course marketplace, automatically generated long-term study plans, and complete chess academy system are outside the MVP scope.

### 3.15 Match History

Users should be able to access their previously completed PlyWise games.

Match history should preserve enough information to reconstruct relevant game and mentoring context.

The MVP may expose basic match information such as:

- opponent,
- result,
- date,
- move history,
- and coaching history.

Advanced game search and filtering are not required for the MVP.

---

### 3.16 Board and Piece Theme Preference

The MVP may support a limited set of board and chess-piece themes.

Theme preference belongs to the player's product experience.

The initial implementation should remain intentionally limited.

A theme marketplace or extensive customization system is outside the MVP scope.

---

## 4. Core MVP Systems

The MVP consists of the following major product systems:

| System | Primary Responsibility |
| --- | --- |
| Authentication | User identity and session access |
| Player Profile | Persistent chess and learning context |
| Match System | Chess game lifecycle and state |
| Chess Engine Adapter | Engine-independent analysis interface |
| Bot System | Computer opponent move generation |
| Move Analysis | Evaluation and classification of player moves |
| Coach Engine | Coaching intervention and context decisions |
| Pattern Observation | Basic recurring behavior identification |
| Post-Game Coach | Contextual game-end mentoring |
| Lesson System | Guided interactive chess learning and lesson progression |
| Match History | Access to previous games and coaching context |
| Theme Preferences | Limited board and piece customization |

These systems may contain multiple internal modules.

This table describes product responsibilities rather than final source-code boundaries.

---

## 5. Explicitly Out of Scope for MVP

The following capabilities are not required for PlyWise v1:

- real-time player-versus-player multiplayer,
- tournaments,
- clubs or teams,
- social feeds,
- friends or follower systems,
- public chat,
- global AI chat,
- voice coaching,
- video coaching,
- human coach marketplace,
- large-scale adaptive chess curriculum,
- extensive course and lesson marketplace,
- automatically generated long-term study plans,
- puzzle generation system,
- large opening course library,
- extensive opening preparation tools,
- live spectator mode,
- native mobile applications,
- desktop applications,
- theme marketplace,
- plugin ecosystem,
- public developer API,
- multiple chess engine selection by users,
- advanced titled-player training systems,
- enterprise chess academy management,
- and complete long-term adaptive learning automation.

These features may be reconsidered in future product versions.

Their exclusion from the MVP is intentional.

---

## 6. MVP Constraints

### 6.1 Scope Discipline

Features should not be added to the MVP solely because they are common on existing chess platforms.

Every major feature should support the primary mentoring hypothesis.

### 6.2 Coaching Reliability

The Coach Engine should avoid presenting unsupported player assumptions as established facts.

Coaching should be derived from available game and player evidence.

### 6.3 Engine Boundary

Stockfish-specific behavior should remain isolated behind the engine integration boundary.

### 6.4 Performance

Board interaction should remain responsive.

Analysis and coaching latency should be communicated appropriately where processing is visible to the player.

### 6.5 Explainability

Coaching messages should prioritize understandable chess reasoning over raw numerical evaluation.

### 6.6 MVP Complexity

The architecture may support future growth, but implementation complexity should remain proportional to MVP requirements.

---

## 7. MVP Validation Questions

The MVP should help the product team answer the following questions:

1. Do players find contextual coaching more understandable than raw engine analysis?
2. Does selective intervention feel helpful rather than disruptive?
3. Can the system identify meaningful recurring player patterns?
4. Do post-game mentoring summaries provide actionable learning value?
5. Does the live coaching experience encourage better independent thinking?
6. Which coaching events provide the highest perceived learning value?
7. Where does engine analysis fail to provide enough context for useful coaching?

The answers to these questions should influence future PlyWise versions.

---

## 8. MVP Completion Definition

The PlyWise MVP is considered functionally complete when an authenticated player can:

1. start a game against a computer opponent,
2. play a complete legal chess game,
3. receive engine-backed move analysis,
4. receive selective contextual coaching during meaningful moments,
5. complete the game without analysis unnecessarily blocking normal board interaction,
6. receive a contextual post-game mentoring summary,
7. access and complete a guided interactive chess lesson,
8. receive instructional feedback based on decisions made within the lesson,
9. have relevant game, coaching, and lesson progress information persisted,
10. and access completed games through match history.

The existence of additional features does not define MVP completion.

The mentoring and guided learning experiences define MVP completion.

---

## 9. Scope Change Rule

Any proposed feature that materially expands the MVP must answer:

> **Does this feature directly improve or validate the core interactive mentoring experience?**

If the answer is no, the feature should normally be deferred to a future version.

Scope changes that affect major product or architecture decisions should be documented through the appropriate decision record.