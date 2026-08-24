import Match from "../models/match.model.js";
import Player from "../models/player.model.js";
import { createGame } from "../utils/createGame.js";
import ApiError from "../utils/ApiError.js";

export const createMatch = async (userId, mode, botDifficulty) => {
    const player = await Player.findOne({ user: userId });

    if (!player) {
        throw new ApiError(404, "Player profile not found.");
    }

    if (!["pvp", "pve"].includes(mode)) {
        throw new ApiError(400, "Invalid match mode.");
    }

    if (mode === "pve") {
        if (!["easy", "medium", "hard"].includes(botDifficulty)) {
            throw new ApiError(400, "Invalid bot difficulty.");
        }

        const existingMatch = await Match.findOne({
            player1: player._id,
            mode: "pve",
            status: {
                $in: ["waiting", "active"]
            }
        });

        if (existingMatch) {
            throw new ApiError(409, "You already have a match in progress or waiting for an opponent.");
        }

        const match = await Match.create({
            player1: player._id,
            mode: "pve",
            botDifficulty,
            status: "active"
        });

        await match.populate([
            { path: "player1", select: "rating displayName avatar" }
        ]);

        await createGame(match._id);

        return match;
    }

    if (mode === "pvp") {
        const existingMatch = await Match.findOne({
            player1: player._id,
            mode: "pvp",
            status: {
                $in: ["waiting", "active"]
            },
            player2: null
        });

        if (existingMatch) {
            throw new ApiError(409, "You already have a match in progress or waiting for an opponent.");
        }

        const opponentMatch = await findOpponent(player._id, player.rating);

        if (opponentMatch) {
            opponentMatch.player2 = player._id;
            opponentMatch.status = "active";

            await opponentMatch.save();

            await opponentMatch.populate([
                { path: "player1", select: "rating displayName avatar" },
                { path: "player2", select: "rating displayName avatar" }
            ]);

            await createGame(opponentMatch._id);

            return opponentMatch;
        }
    }

    const match = await Match.create({
        player1: player._id,
        mode
    });

    return match;
};

export const findOpponent = async (playerId, rating) => {
    const matches = await Match.find({
        mode: "pvp",
        status: "waiting",
        player2: null,
        player1: { $ne: playerId }
    })
        .populate("player1", "rating")
        .sort({ createdAt: -1 });

    const suitableMatches = matches.filter((match) => {
        const ratingDifference = Math.abs(match.player1.rating - rating);

        return ratingDifference <= 200;
    });

    if (suitableMatches.length === 0) {
        return null;
    }

    suitableMatches.sort((a, b) => {
        const differenceA = Math.abs(a.player1.rating - rating);
        const differenceB = Math.abs(b.player1.rating - rating);

        return differenceA - differenceB;
    });

    return suitableMatches[0];
};