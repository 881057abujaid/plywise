import { describe, expect, it } from "vitest";
import { detectCoachingReason } from "../coachingReason.service.js";

describe("detectCoachingReason", () => {
    it("detects missed checkmate", () => {
        const result = detectCoachingReason({
            analysis: {
                missedCheckmate: true,
                evaluationLoss: 4,
            },
            classification: "blunder",
        });

        expect(result).toBe("missed_checkmate");
    });

    it("detects missed opportunity for a mistake", () => {
        const result = detectCoachingReason({
            analysis: {
                missedCheckmate: false,
                evaluationLoss: 2,
            },
            classification: "mistake",
        });

        expect(result).toBe("missed_opportunity");
    });

    it("detects missed opportunity for a blunder", () => {
        const result = detectCoachingReason({
            analysis: {
                missedCheckmate: false,
                evaluationLoss: 4,
            },
            classification: "blunder",
        });

        expect(result).toBe("missed_opportunity");
    });

    it("does not coach a good move", () => {
        const result = detectCoachingReason({
            analysis: {
                missedCheckmate: false,
                evaluationLoss: 0.2,
            },
            classification: "good",
        });

        expect(result).toBeNull();
    });

    it("does not coach an inaccuracy", () => {
        const result = detectCoachingReason({
            analysis: {
                missedCheckmate: false,
                evaluationLoss: 0.8,
            },
            classification: "inaccuracy",
        });

        expect(result).toBeNull();
    });

    it("does not detect an opportunity when evaluation loss is at the threshold", () => {
        const result = detectCoachingReason({
            analysis: {
                missedCheckmate: false,
                evaluationLoss: 1,
            },
            classification: "mistake",
        });

        expect(result).toBeNull();
    });

    it("returns null when analysis is missing", () => {
        const result = detectCoachingReason({
            analysis: null,
            classification: "blunder",
        });

        expect(result).toBeNull();
    });

    it("prioritizes missed checkmate over generic missed opportunity", () => {
        const result = detectCoachingReason({
            analysis: {
                missedCheckmate: true,
                evaluationLoss: 5,
            },
            classification: "blunder",
        });

        expect(result).toBe("missed_checkmate");
    });
});