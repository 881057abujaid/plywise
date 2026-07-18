# PlyWise Product Vision

## Document Information

| Field | Value |
| --- | --- |
| Product | PlyWise |
| Product Descriptor | The Interactive Chess Mentor |
| Internal Codename | Project Knight |
| Document Type | Product Vision |
| Status | Approved |
| Product Stage | MVP |
| Last Updated | July 2026 |

---

## 1. Vision Statement

PlyWise aims to become an interactive chess mentor that helps players understand their decisions while the learning context is still fresh.

Instead of limiting chess improvement to post-game analysis, PlyWise brings contextual coaching into the playing experience. The system observes player decisions, evaluates moves, identifies meaningful mistakes and recurring patterns, and provides guidance designed around the player's developing play style.

The long-term vision of PlyWise is not simply to tell players which move was best.

It is to help players understand why their decisions worked, why they failed, and how they can think better in similar positions.

> **Wiser with every ply.**

---

## 2. Problem Statement

Modern chess platforms provide powerful engines and detailed post-game analysis. These tools can identify inaccuracies, mistakes, blunders, missed opportunities, and better moves with high technical accuracy.

However, engine evaluation alone does not always translate into meaningful learning.

A player may be told that a move was a blunder or shown a better engine line without fully understanding:

- what was wrong with their original thought process,
- what positional or tactical signal they missed,
- whether the mistake is part of a recurring pattern,
- and how they should approach similar positions in future games.

Most analysis happens after the game has already ended, when the player's original decision context may no longer be fresh.

This creates a gap between **move evaluation** and **player understanding**.

PlyWise is designed to address this gap.

---

## 3. Product Philosophy

PlyWise is built around a simple principle:

> **Chess improvement should focus on understanding decisions, not merely correcting moves.**

A chess engine can calculate stronger moves.

A mentor must help the player understand the reasoning behind them.

PlyWise therefore treats engine analysis as technical evidence rather than the final coaching experience.

The system combines move evaluation, player context, recurring behavioral patterns, and coaching logic to provide guidance that is relevant to the player.

The product should behave less like an evaluation dashboard and more like a mentor observing a student's game.

---

## 4. Product Vision

PlyWise envisions a chess learning experience where coaching is naturally integrated into gameplay.

When a game begins, the mentor establishes an initial coaching presence.

As the player makes moves, the system analyzes relevant decisions asynchronously without blocking the board interaction.

Meaningful events such as inaccuracies, mistakes, blunders, or missed opportunities may trigger contextual coaching.

The mentor does not need to comment on every move.

Instead, it should prioritize moments where guidance can provide meaningful learning value.

Over time, PlyWise should develop an understanding of the player's tendencies, recurring mistakes, strengths, and play style.

At the end of a game, the mentor should be able to provide feedback that reflects the player's actual performance rather than generating a generic game summary.

The intended experience is:

**Play → Think → Receive Context → Understand → Improve**

---

## 5. Target Users

PlyWise is primarily designed for chess players who understand the basic rules of chess but struggle to consistently improve their decision-making.

The initial target users include:

- beginner and improving chess players,
- casual players seeking structured improvement,
- players who repeatedly make similar tactical or positional mistakes,
- players who find traditional engine analysis difficult to interpret,
- and self-learners who do not have continuous access to a human chess coach.

PlyWise is not initially designed to replace professional coaching for advanced or titled chess players.

The MVP focuses on making chess improvement more understandable, contextual, and accessible for developing players.

---

## 6. Core Product Principles

### 6.1 Understanding Before Evaluation

Move classifications such as *inaccuracy*, *mistake*, and *blunder* are useful signals, but classification alone is not coaching.

PlyWise should explain the meaningful reason behind a decision whenever coaching is provided.

### 6.2 Contextual Coaching

Feedback should consider the current game, previous moves, relevant player tendencies, and the significance of the mistake.

### 6.3 Selective Intervention

The mentor should not interrupt the player after every move.

Coaching should be triggered when the system identifies a meaningful learning opportunity.

### 6.4 Non-Blocking Gameplay

Engine analysis and coaching generation should not unnecessarily block board interaction.

The chess board should respond immediately to valid player actions while analysis continues asynchronously where appropriate.

### 6.5 Player-Oriented Feedback

The same technical mistake may require different explanations for different players.

PlyWise should progressively adapt coaching to the player's observed play style and recurring patterns.

### 6.6 Engine Independence

PlyWise should not be architecturally dependent on a single chess engine.

Stockfish may serve as the initial analysis engine, but engine integration should remain abstracted from the core coaching system.

### 6.7 Progressive Product Evolution

PlyWise will evolve version by version.

The MVP should establish the core mentoring experience without attempting to implement every possible chess-learning feature.

New coaching capabilities should be introduced based on product learning and real player behavior.

---

## 7. Product Differentiation

PlyWise is not intended to compete solely on engine strength.

Modern chess engines already provide exceptional calculation capabilities.

The primary differentiation of PlyWise is the layer between engine analysis and the player.

This layer focuses on:

- interpreting meaningful analysis,
- identifying learning opportunities,
- recognizing recurring player patterns,
- maintaining coaching context,
- and translating technical chess information into understandable guidance.

The engine answers:

> **What happened on the board?**

PlyWise aims to answer:

> **What should this player understand from what happened?**

---

## 8. Long-Term Direction

The long-term direction of PlyWise is to develop a persistent chess mentoring system capable of understanding a player's learning journey across games.

Future versions may expand the mentor's ability to:

- recognize long-term behavioral patterns,
- identify recurring tactical and positional weaknesses,
- adapt explanations to player experience,
- track improvement areas,
- recommend focused learning activities,
- and build a progressively richer player chess profile.

These capabilities are part of the broader product direction and are not automatically included in the MVP scope.

MVP boundaries are defined separately in the MVP Scope document.

---

## 9. Success Vision

PlyWise succeeds when a player finishes a game with more than an engine score or a list of mistakes.

The player should leave with a clearer understanding of:

- what they were trying to do,
- where their reasoning failed,
- what signals they missed,
- and what they should think about differently in future games.

The desired outcome is not dependency on the mentor.

The desired outcome is better independent chess thinking.

---

## 10. Brand Identity

**Product Name:** PlyWise

**Product Descriptor:** The Interactive Chess Mentor

**Brand Philosophy:** Wiser with every ply.

The name *PlyWise* combines the chess concept of a **ply**, representing a single player's move, with the idea of developing better judgment and understanding.

The brand reflects the product's central belief that chess improvement happens progressively through better decisions, one move at a time.