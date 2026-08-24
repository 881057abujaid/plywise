import Player from "../models/player.model.js";
import ApiError from "../utils/ApiError.js";

export const updateStatistics = async (player1Id, player2Id, result) => {
    if (!["player1", "player2", "draw"].includes(result)) {
        throw new ApiError(400, "Invalid game result.");
    }

    const [player1, player2] = await Promise.all([
        Player.findById(player1Id),
        Player.findById(player2Id)
    ]);

    if (!player1 || !player2) {
        throw new ApiError(404, "Player not found.");
    }

    player1.statistics.gamesPlayed += 1;
    player2.statistics.gamesPlayed += 1;

    if (result === "player1") {
        player1.statistics.wins += 1;
        player2.statistics.losses += 1;
    } else if (result === "player2") {
        player1.statistics.losses += 1;
        player2.statistics.wins += 1;
    } else {
        player1.statistics.draws += 1;
        player2.statistics.draws += 1;
    }

    await Promise.all([
        player1.save(),
        player2.save()
    ]);

    return {
        player1: player1.statistics,
        player2: player2.statistics
    };
};