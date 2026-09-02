import Match from "../models/match.model.js";
import Player from "../models/player.model.js";
import Bot from "../models/bot.model.js";
import Game from "../models/game.model.js";
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

        const bot = await Bot.findOne({
            name: `PlyBot ${botDifficulty.charAt(0).toUpperCase()}${botDifficulty.slice(1)}`
        });

        if (!bot) {
            throw new ApiError(404, "Bot not found.");
        }

        const existingMatch = await Match.findOne({
            player1: player._id,
            bot: bot._id,
            botDifficulty,
            mode: "pve",
            status: "active"
        });

        if (existingMatch) {
            throw new ApiError(409, "You already have a match in progress or waiting for an opponent.");
        }

        const match = await Match.create({
            player1: player._id,
            bot: bot._id,
            mode: "pve",
            botDifficulty,
            status: "active"
        });

        await match.populate([
            { path: "player1", select: "rating displayName avatar" }
        ]);

        const game = await createGame(match._id);

        return {
            match,
            gameId: game._id
        };
    }

    if (mode === "pvp") {
        const existingMatch = await Match.findOne({
            player1: player._id,
            mode: "pvp",
            status: {
                $in: ["waiting", "active"]
            },
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

            const game = await createGame(opponentMatch._id);

            return {
                match: opponentMatch,
                gameId: game._id
            };
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

export const getMyMatchHistory = async (userId) => {
    const player = await Player.findOne({ user: userId });

    if (!player) {
        throw new ApiError(404, "Player profile not found.");
    }

    const matches = await Match.find({
        $or: [
            { player1: player._id },
            { player2: player._id },
        ],
    })
        .populate("player1", "displayName avatar rating")
        .populate("player2", "displayName avatar rating")
        .populate("bot", "name difficulty")
        .sort({ createdAt: -1 });

    const matchIds = matches.map((match) => match._id);

    const games = await Game.find({
        match: { $in: matchIds },
    }).select("match moves");

    const gameMap = new Map(
        games.map((game) => [
            game.match.toString(),
            game,
        ])
    );

    return matches.map((match) => {
        const game = gameMap.get(match._id.toString());

        return {
            id: match._id,
            gameId: game?._id ?? null,
            mode: match.mode,
            status: match.status,
            result: match.result,
            botDifficulty: match.botDifficulty,
            player1: match.player1,
            player2: match.player2,
            bot: match.bot,
            moveCount: game?.moves.length ?? 0,
            createdAt: match.createdAt,
            updatedAt: match.updatedAt,
        };
    });
};