import Game from "../models/game.model.js";
import ApiError from "../utils/ApiError.js";
import { makeMove } from "../utils/chess.js";
import { updateRatings } from "./rating.service.js";
import { updateStatistics } from "./statistics.service.js";
import { generateBotMove } from "./bot.service.js";

export const makeGameMove = async (userId, gameId, from, to, promotion) => {
    const game = await Game.findById(gameId).populate({
        path: "match",
        populate: [
            { path: "player1", select: "user" },
            { path: "player2", select: "user" }
        ]
    });

    if (!game) {
        throw new ApiError(404, "Game not found.");
    }

    if (game.status !== "active") {
        throw new ApiError(400, "Game is not active.");
    }

    const match = game.match;

    const isPlayer1 = match.player1?.user?.toString() === userId.toString();
    const isPlayer2 = match.player2?.user?.toString() === userId.toString();

    if (!isPlayer1 && !isPlayer2) {
        throw new ApiError(403, "You are not a participant in this game.");
    }

    const playerColor = isPlayer1 ? "white" : "black";

    if (game.turn !== playerColor) {
        throw new ApiError(400, "It's not your turn.");
    }

    let result;

    try {
        result = makeMove(game.board, from, to, promotion);
    } catch (error) {
        throw new ApiError(400, error.message);
    }

    const playerMove = result.move;
    let botMove = null;

    game.board = result.fen;
    game.turn = playerColor === "white" ? "black" : "white";

    if (result.isGameOver) {
        game.status = "completed";

        if (result.isCheckmate) {
            game.result = playerColor;
        } else {
            game.result = "draw";
        }
    }

    await game.save();

    if (game.status === "completed" && match.mode === "pvp") {
        match.status = "completed";

        if (game.result === "white") {
            match.result = "player1";
        } else if (game.result === "black") {
            match.result = "player2";
        } else {
            match.result = "draw";
        }

        await match.save();

        await updateRatings(
            match.player1._id,
            match.player2._id,
            match.result
        );

        await updateStatistics(
            match.player1._id,
            match.player2._id,
            match.result
        );
    }

    if (game.status === "active" && match.mode === "pve" && game.turn === "black") {
        botMove = await makeBotMove(game);
        await game.save();
    }

    return {
        gameId: game._id,
        playerMove: {
            from: playerMove.from,
            to: playerMove.to,
            san: playerMove.san
        },
        botMove: botMove ? {
            from: botMove.move.from,
            to: botMove.move.to,
            san: botMove.move.san
        } : null,
        board: game.board,
        turn: game.turn,
        status: game.status,
        result: game.result,
        isCheck: botMove?.isCheck ?? result.isCheck,
        isCheckmate: botMove?.isCheckmate ?? result.isCheckmate,
        isStalemate: botMove?.isStalemate ?? result.isStalemate
    };
};

const makeBotMove = async (game) => {
    const botMove = generateBotMove(
        game.board,
        game.match.botDifficulty
    );

    const result = makeMove(
        game.board,
        botMove.from,
        botMove.to,
        botMove.promotion
    );

    game.board = result.fen;

    if (result.isGameOver) {
        game.status = "completed";

        if (result.isCheckmate) {
            game.result = "black";
        } else {
            game.result = "draw";
        }
        return result;
    } else {
        game.turn = "white";
    }

    return {
        move: result.move,
        isCheck: result.isCheck,
        isCheckmate: result.isCheckmate,
        isStalemate: result.isStalemate
    };
};