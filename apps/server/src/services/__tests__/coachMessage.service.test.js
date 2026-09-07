import { beforeEach, describe, expect, it, vi } from "vitest";
import Match from "../../models/match.model.js";
import { appendCoachMessage } from "../coachMessage.service.js";

vi.mock("../../models/match.model.js", () => ({
    default: {
        updateOne: vi.fn(),
    },
}));

describe("appendCoachMessage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("appends a valid coach message to the match", async () => {
        Match.updateOne.mockResolvedValue({
            matchedCount: 1,
            modifiedCount: 1,
        });

        const message = {
            role: "coach",
            content: "You missed a chance to finish the game.",
            reason: "missed_checkmate",
            priority: "critical",
            triggerPly: 17,
        };

        await appendCoachMessage("match-123", message);

        expect(Match.updateOne).toHaveBeenCalledWith(
            { _id: "match-123" },
            {
                $push: {
                    coachMessages: message,
                },
            }
        );
    });

    it("allows a null triggerPly", async () => {
        Match.updateOne.mockResolvedValue({
            matchedCount: 1,
            modifiedCount: 1,
        });

        const message = {
            role: "coach",
            content: "Keep looking for forcing moves.",
            reason: "missed_opportunity",
            priority: "medium",
            triggerPly: null,
        };

        await appendCoachMessage("match-123", message);

        expect(Match.updateOne).toHaveBeenCalledWith(
            { _id: "match-123" },
            {
                $push: {
                    coachMessages: message,
                },
            }
        );
    });

    it("throws when the match does not exist", async () => {
        Match.updateOne.mockResolvedValue({
            matchedCount: 0,
            modifiedCount: 0,
        });

        const message = {
            role: "coach",
            content: "You missed a chance to finish the game.",
            reason: "missed_checkmate",
            priority: "critical",
            triggerPly: 17,
        };

        await expect(
            appendCoachMessage("missing-match", message)
        ).rejects.toThrow("Match not found.");
    });

    it("propagates database errors", async () => {
        const databaseError = new Error("Database update failed.");

        Match.updateOne.mockRejectedValue(databaseError);

        const message = {
            role: "coach",
            content: "You missed a chance to finish the game.",
            reason: "missed_checkmate",
            priority: "critical",
            triggerPly: 17,
        };

        await expect(
            appendCoachMessage("match-123", message)
        ).rejects.toThrow("Database update failed.");
    });

    it("uses the provided match id when updating the match", async () => {
        Match.updateOne.mockResolvedValue({
            matchedCount: 1,
            modifiedCount: 1,
        });

        const message = {
            role: "coach",
            content: "Look for forcing moves.",
            reason: "missed_opportunity",
            priority: "high",
            triggerPly: 21,
        };

        await appendCoachMessage("specific-match-id", message);

        expect(Match.updateOne).toHaveBeenCalledTimes(1);
        expect(Match.updateOne.mock.calls[0][0]).toEqual({
            _id: "specific-match-id",
        });
    });
});