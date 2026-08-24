import Player from "../models/player.model.js";
import ApiError from "../utils/ApiError.js";
import { calculateNewRating } from "../utils/rating.js";

export const updateRatings = async (player1Id, player2Id, result) => {
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

    let player1Score;
    let player2Score;
    const player1OldRating = player1.rating;
    const player2OldRating = player2.rating;

    if (result === "player1") {
        player1Score = 1;
        player2Score = 0;
    } else if (result === "player2") {
        player1Score = 0;
        player2Score = 1;
    } else {
        player1Score = 0.5;
        player2Score = 0.5;
    }

    const player1NewRating = calculateNewRating(
        player1.rating,
        player2.rating,
        player1Score
    );

    const player2NewRating = calculateNewRating(
        player2.rating,
        player1.rating,
        player2Score
    );

    player1.rating = player1NewRating;
    player2.rating = player2NewRating;

    await Promise.all([
        player1.save(),
        player2.save()
    ]);

    return {
        player1: {
            id: player1._id,
            oldRating: player1OldRating,
            newRating: player1NewRating
        },
        player2: {
            id: player2._id,
            oldRating: player2OldRating,
            newRating: player2NewRating
        }
    };
};