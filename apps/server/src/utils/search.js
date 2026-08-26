import { Chess } from "chess.js";
import { evaluateBoard } from "./evaluation.js";

const PIECE_VALUES = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0
};

let nodesEvaluated = 0;
const evaluationCache = new Map();

const getPositionHash = (chess) => {
    if (typeof chess.hash === "function") {
        return chess.hash();
    }
    return chess.fen();
};

const orderMoves = (moves) => {
    return moves.sort((a, b) => {
        const aScore =
            (a.captured ? 10 + PIECE_VALUES[a.captured] : 0) +
            (a.promotion ? 8 + PIECE_VALUES[a.promotion] : 0) +
            (a.san?.includes("+") ? 5 : 0) +
            (a.san?.includes("#") ? 100 : 0);

        const bScore =
            (b.captured ? 10 + PIECE_VALUES[b.captured] : 0) +
            (b.promotion ? 8 + PIECE_VALUES[b.promotion] : 0) +
            (b.san?.includes("+") ? 5 : 0) +
            (b.san?.includes("#") ? 100 : 0);

        return bScore - aScore;
    });
};

const minimax = (chess, depth, maximizingPlayer, alpha, beta) => {
    nodesEvaluated++;

    if (depth === 0) {
        const hash = getPositionHash(chess);

        if (evaluationCache.has(hash)) {
            return evaluationCache.get(hash);
        }

        const score = evaluateBoard(chess);
        evaluationCache.set(hash, score);

        return score;
    }

    const hasFastMoves = typeof chess._moves === "function";
    const rawMoves = hasFastMoves
        ? chess._moves({ legal: true })
        : chess.moves({ verbose: true });

    if (rawMoves.length === 0) {
        const hash = getPositionHash(chess);

        if (evaluationCache.has(hash)) {
            return evaluationCache.get(hash);
        }

        const score = evaluateBoard(chess);
        evaluationCache.set(hash, score);

        return score;
    }

    const legalMoves = orderMoves(rawMoves);
    const hasFastMake = typeof chess._makeMove === "function" && typeof chess._undoMove === "function";

    if (maximizingPlayer) {
        let bestScore = -Infinity;

        for (const move of legalMoves) {
            if (hasFastMake) {
                chess._makeMove(move);
            } else {
                chess.move(move);
            }

            const score = minimax(chess, depth - 1, false, alpha, beta);

            if (hasFastMake) {
                chess._undoMove();
            } else {
                chess.undo();
            }

            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, bestScore);
            if (beta <= alpha) {
                break;
            }
        }

        return bestScore;
    }

    let bestScore = Infinity;

    for (const move of legalMoves) {
        if (hasFastMake) {
            chess._makeMove(move);
        } else {
            chess.move(move);
        }

        const score = minimax(chess, depth - 1, true, alpha, beta);

        if (hasFastMake) {
            chess._undoMove();
        } else {
            chess.undo();
        }

        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) {
            break;
        }
    }

    return bestScore;
};

export const findBestMove = (fen, depth = 2) => {
    nodesEvaluated = 0;
    evaluationCache.clear();

    const chess = new Chess(fen);

    const publicMoves = chess.moves({
        verbose: true
    });

    if (publicMoves.length === 0) {
        return null;
    }

    const legalMoves = orderMoves([...publicMoves]);

    let bestMove = null;
    let bestScore = -Infinity;

    const candidates = [];

    for (const move of legalMoves) {
        chess.move(move);

        const score = minimax(chess, depth - 1, false, -Infinity, Infinity);

        chess.undo();

        candidates.push({
            move: move.san,
            from: move.from,
            to: move.to,
            score
        });

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    candidates.sort((a, b) => b.score - a.score);

    // Validate the selected bestMove strictly through public legal moves API
    const verifiedMove = publicMoves.find(
        (m) =>
            m.from === bestMove?.from &&
            m.to === bestMove?.to &&
            (!bestMove?.promotion || m.promotion === bestMove.promotion)
    );

    return {
        move: verifiedMove || bestMove,
        score: bestScore,
        candidates,
        nodesEvaluated
    };
};