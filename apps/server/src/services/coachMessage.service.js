import Match from "../models/match.model.js";

export const appendCoachMessage = async (matchId, message) => {
    const result = await Match.updateOne(
        { _id: matchId },
        {
            $push: {
                coachMessages: message,
            },
        }
    );

    if (result.matchedCount === 0) {
        throw new Error("Match not found.");
    }

    return result;
};