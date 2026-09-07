import { describe, expect, it } from "vitest";
import { decideCoaching } from "../coachEngine.service.js";

describe("decideCoaching", () => {
    it("does not coach when no reason is provided", () => {
        const result = decideCoaching({
            move: { ply: 10 },
            analysis: {},
            classification: null,
            reason: null,
            context: {},
        });

        expect(result).toEqual({
            shouldCoach: false,
            priority: null,
            reason: null,
            triggerPly: null,
        });
    });

    it("coaches missed checkmate with critical priority", () => {
        const result = decideCoaching({
            move: { ply: 17 },
            analysis: {
                missedCheckmate: true,
            },
            classification: "blunder",
            reason: "missed_checkmate",
            context: {},
        });

        expect(result).toEqual({
            shouldCoach: true,
            priority: "critical",
            reason: "missed_checkmate",
            triggerPly: 17,
        });
    });

    it("does not suppress missed checkmate because of a recent same reason", () => {
        const result = decideCoaching({
            move: { ply: 19 },
            analysis: {
                missedCheckmate: true,
            },
            classification: "blunder",
            reason: "missed_checkmate",
            context: {
                recentCoachMessages: [
                    {
                        reason: "missed_checkmate",
                        triggerPly: 17,
                    },
                ],
            },
        });

        expect(result).toEqual({
            shouldCoach: true,
            priority: "critical",
            reason: "missed_checkmate",
            triggerPly: 19,
        });
    });

    it("coaches a missed opportunity mistake with medium priority", () => {
        const result = decideCoaching({
            move: { ply: 11 },
            analysis: {
                evaluationLoss: 2,
            },
            classification: "mistake",
            reason: "missed_opportunity",
            context: {},
        });

        expect(result).toEqual({
            shouldCoach: true,
            priority: "medium",
            reason: "missed_opportunity",
            triggerPly: 11,
        });
    });

    it("coaches a missed opportunity blunder with high priority", () => {
        const result = decideCoaching({
            move: { ply: 15 },
            analysis: {
                evaluationLoss: 4,
            },
            classification: "blunder",
            reason: "missed_opportunity",
            context: {},
        });

        expect(result).toEqual({
            shouldCoach: true,
            priority: "high",
            reason: "missed_opportunity",
            triggerPly: 15,
        });
    });

    it("suppresses a recent missed opportunity for a mistake", () => {
        const result = decideCoaching({
            move: { ply: 13 },
            analysis: {
                evaluationLoss: 2,
            },
            classification: "mistake",
            reason: "missed_opportunity",
            context: {
                recentCoachMessages: [
                    {
                        reason: "missed_opportunity",
                        triggerPly: 11,
                    },
                ],
            },
        });

        expect(result).toEqual({
            shouldCoach: false,
            priority: null,
            reason: null,
            triggerPly: null,
        });
    });

    it("suppresses a recent missed opportunity for a blunder", () => {
        const result = decideCoaching({
            move: { ply: 21 },
            analysis: {
                evaluationLoss: 5,
            },
            classification: "blunder",
            reason: "missed_opportunity",
            context: {
                recentCoachMessages: [
                    {
                        reason: "missed_opportunity",
                        triggerPly: 19,
                    },
                ],
            },
        });

        expect(result).toEqual({
            shouldCoach: false,
            priority: null,
            reason: null,
            triggerPly: null,
        });
    });

    it("does not suppress coaching when the recent reason is different", () => {
        const result = decideCoaching({
            move: { ply: 23 },
            analysis: {
                evaluationLoss: 2,
            },
            classification: "mistake",
            reason: "missed_opportunity",
            context: {
                recentCoachMessages: [
                    {
                        reason: "missed_checkmate",
                        triggerPly: 21,
                    },
                ],
            },
        });

        expect(result).toEqual({
            shouldCoach: true,
            priority: "medium",
            reason: "missed_opportunity",
            triggerPly: 23,
        });
    });

    it("does not coach an unsupported reason", () => {
        const result = decideCoaching({
            move: { ply: 25 },
            analysis: {},
            classification: "blunder",
            reason: "tactical_oversight",
            context: {},
        });

        expect(result).toEqual({
            shouldCoach: false,
            priority: null,
            reason: null,
            triggerPly: null,
        });
    });

    it("uses null triggerPly when the move does not provide a ply", () => {
        const result = decideCoaching({
            move: {},
            analysis: {
                missedCheckmate: true,
            },
            classification: "blunder",
            reason: "missed_checkmate",
            context: {},
        });

        expect(result).toEqual({
            shouldCoach: true,
            priority: "critical",
            reason: "missed_checkmate",
            triggerPly: null,
        });
    });
});