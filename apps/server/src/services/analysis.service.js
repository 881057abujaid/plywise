import { Chess } from "chess.js";
import { evaluateBoard } from "../utils/evaluation.js";
import { findBestMove } from "../utils/search.js";

const normalizeEvaluation = (score, color) => {
    const normalized = color === "b" ? score : -score;

    return Object.is(normalized, -0) ? 0 : normalized;
};

export const analyzeMove = (
    fen,
    from,
    to,
    promotion = undefined,
    depth = 2
) => {
    const chess = new Chess(fen);
    const color = chess.turn();

    const evaluationBefore = normalizeEvaluation(
        evaluateBoard(chess),
        color
    );

    const bestMoveResult = findBestMove(fen, depth);

    if (!bestMoveResult?.move) {
        return null;
    }

    const playedCandidate = bestMoveResult.candidates.find(
        (candidate) =>
            candidate.from === from &&
            candidate.to === to &&
            candidate.promotion === (promotion ?? undefined)
    );

    if (!playedCandidate) {
        return null;
    }

    const playedMove = chess.move({
        from,
        to,
        promotion,
    });

    if (!playedMove) {
        return null;
    }

    const evaluationAfter = normalizeEvaluation(
        evaluateBoard(chess),
        color
    );

    const playedEvaluation = normalizeEvaluation(
        playedCandidate.score,
        color
    );

    const bestEvaluation = normalizeEvaluation(
        bestMoveResult.score,
        color
    );

    const evaluationLoss = Math.max(
        0,
        bestEvaluation - playedEvaluation
    );

    const isBestMove =
        from === bestMoveResult.move.from &&
        to === bestMoveResult.move.to &&
        (promotion ?? null) === (bestMoveResult.move.promotion ?? null);

    const isCheckmate = chess.isCheckmate();

    const missedCheckmate =
        !isCheckmate &&
        bestMoveResult.move.san.includes("#");

    return {
        playedMove: {
            from: playedMove.from,
            to: playedMove.to,
            san: playedMove.san,
            promotion: playedMove.promotion ?? null,
        },
        bestMove: {
            from: bestMoveResult.move.from,
            to: bestMoveResult.move.to,
            san: bestMoveResult.move.san,
            promotion: bestMoveResult.move.promotion ?? null,
        },
        evaluationBefore,
        evaluationAfter,
        playedEvaluation,
        bestEvaluation,
        evaluationLoss,
        isBestMove,
        isCheckmate,
        missedCheckmate,
    };
};