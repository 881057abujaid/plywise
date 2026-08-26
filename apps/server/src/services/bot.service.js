import { Chess } from "chess.js";
import ApiError from "../utils/ApiError.js";
import { findBestMove } from "../utils/search.js";

const VALID_DIFFICULTIES = ["easy", "medium", "hard"];

const PIECE_VALUE = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 100
};

const selectMediumMove = (chess, legalMoves) => {
    // 1. Prefer checkmate
    for (const move of legalMoves) {
        chess.move(move);

        const isCheckmate = chess.isCheckmate();

        chess.undo();

        if (isCheckmate) {
            return move;
        }
    }

    // 2. Prefer the most valuable capture
    const captureMoves = legalMoves.filter((move) => move.captured);

    if (captureMoves.length > 0) {
        captureMoves.sort((a, b) => PIECE_VALUE[b.captured] - PIECE_VALUE[a.captured]);

        return captureMoves[0];
    }

    // 3. Otherwise choose a random legal move
    const randomIndex = Math.floor(Math.random() * legalMoves.length);

    return legalMoves[randomIndex];
};

export const generateBotMove = (fen, difficulty = "easy") => {
    if (!VALID_DIFFICULTIES.includes(difficulty)) {
        throw new ApiError(400, "Invalid bot difficulty.");
    }

    const chess = new Chess(fen);

    const legalMoves = chess.moves({
        verbose: true
    });

    if (legalMoves.length === 0) {
        throw new ApiError(400, "No legal moves available.");
    }

    let selectedMove;

    if (difficulty === "easy") {
        // Easy strategy for now
        const randomIndex = Math.floor(Math.random() * legalMoves.length);

        selectedMove = legalMoves[randomIndex];
    } else if (difficulty === "medium") {
        selectedMove = selectMediumMove(chess, legalMoves);
    } else if (difficulty === "hard") {

        const startTime = performance.now();

        const result = findBestMove(fen, 3);

        const elapsedTime = performance.now() - startTime;

        console.log("HARD BOT SEARCH:", {
            timeMs: Math.round(elapsedTime),
            nodes: result?.nodesEvaluated,
            move: result?.move?.san
        });

        if (!result?.move) {
            throw new ApiError(400, "No legal bot move available.");
        }

        selectedMove = result.move;
    } else {
        const randomIndex = Math.floor(Math.random() * legalMoves.length);

        selectedMove = legalMoves[randomIndex];
    }

    return {
        from: selectedMove.from,
        to: selectedMove.to,
        promotion: selectedMove.promotion
    };
};