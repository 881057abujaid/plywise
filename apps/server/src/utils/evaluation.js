import { Chess } from "chess.js";

const PIECE_VALUES = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0
};

const SAFETY_WEIGHT = 0.5;

const evaluateMaterial = (chess) => {
    let score = 0;
    const board = chess._board;

    if (board) {
        for (let i = 0; i <= 119; i++) {
            if (i & 0x88) {
                i += 7;
                continue;
            }

            const piece = board[i];

            if (!piece) {
                continue;
            }

            const value = PIECE_VALUES[piece.type];

            if (piece.color === "b") {
                score += value;
            } else {
                score -= value;
            }
        }
    } else {
        for (const row of chess.board()) {
            for (const piece of row) {
                if (!piece) {
                    continue;
                }

                const value = PIECE_VALUES[piece.type];

                if (piece.color === "b") {
                    score += value;
                } else {
                    score -= value;
                }
            }
        }
    }

    return score;
};

const evaluateMobility = (chess) => {
    const currentTurn = chess.turn();

    if (typeof chess._moves === "function") {
        const currentMoves = chess._moves().length;
        const opponentTurn = currentTurn === "w" ? "b" : "w";

        chess._turn = opponentTurn;
        const opponentMoves = chess._moves().length;
        chess._turn = currentTurn;

        return currentTurn === "b"
            ? (currentMoves - opponentMoves) * 0.1
            : (opponentMoves - currentMoves) * 0.1;
    }

    const currentMoves = chess.moves().length;
    const fenParts = chess.fen().split(" ");

    fenParts[1] = currentTurn === "w" ? "b" : "w";
    fenParts[3] = "-";

    const opponentChess = new Chess(fenParts.join(" "));
    const opponentMoves = opponentChess.moves().length;

    return currentTurn === "b"
        ? (currentMoves - opponentMoves) * 0.1
        : (opponentMoves - currentMoves) * 0.1;
};

const evaluateCheck = (chess) => {
    if (!chess.isCheck()) {
        return 0;
    }

    return chess.turn() === "b" ? -0.5 : 0.5;
};

const evaluatePieceSafety = (chess) => {
    let score = 0;
    const board = chess._board;

    if (board && typeof chess._attacked === "function") {
        for (let i = 0; i <= 119; i++) {
            if (i & 0x88) {
                i += 7;
                continue;
            }

            const piece = board[i];

            if (!piece || piece.type === "k") {
                continue;
            }

            const attackerColor = piece.color === "b" ? "w" : "b";

            if (chess._attacked(attackerColor, i)) {
                const value = PIECE_VALUES[piece.type];

                if (piece.color === "b") {
                    score -= value * SAFETY_WEIGHT;
                } else {
                    score += value * SAFETY_WEIGHT;
                }
            }
        }
    } else {
        const fullBoard = chess.board();

        for (let rank = 0; rank < fullBoard.length; rank++) {
            for (let file = 0; file < fullBoard[rank].length; file++) {
                const piece = fullBoard[rank][file];

                if (!piece || piece.type === "k") {
                    continue;
                }

                const square = String.fromCharCode(97 + file) + (8 - rank);
                const attackerColor = piece.color === "b" ? "w" : "b";
                const isAttacked = chess.isAttacked(square, attackerColor);

                if (!isAttacked) {
                    continue;
                }

                const value = PIECE_VALUES[piece.type];

                if (piece.color === "b") {
                    score -= value * SAFETY_WEIGHT;
                } else {
                    score += value * SAFETY_WEIGHT;
                }
            }
        }
    }

    return score;
};

export const evaluatePieceSafetyForTest = (fen) => {
    const chess = new Chess(fen);

    return evaluatePieceSafety(chess);
};

export const evaluateBoard = (chess) => {
    // Terminal Position evaluation
    if (chess.isCheckmate()) {
        return chess.turn() === "b" ? -10000 : 10000;
    }

    if (chess.isDraw()) {
        return 0;
    }

    let materialScore = 0;
    let safetyScore = 0;
    const board = chess._board;

    if (board && typeof chess._attacked === "function") {
        for (let i = 0; i <= 119; i++) {
            if (i & 0x88) {
                i += 7;
                continue;
            }

            const piece = board[i];

            if (!piece) {
                continue;
            }

            const value = PIECE_VALUES[piece.type];

            if (piece.color === "b") {
                materialScore += value;
            } else {
                materialScore -= value;
            }

            if (piece.type === "k") {
                continue;
            }

            const attackerColor = piece.color === "b" ? "w" : "b";

            if (chess._attacked(attackerColor, i)) {
                if (piece.color === "b") {
                    safetyScore -= value * SAFETY_WEIGHT;
                } else {
                    safetyScore += value * SAFETY_WEIGHT;
                }
            }
        }
    } else {
        materialScore = evaluateMaterial(chess);
        safetyScore = evaluatePieceSafety(chess);
    }

    const checkScore = evaluateCheck(chess);
    const mobilityScore = evaluateMobility(chess);

    return materialScore + mobilityScore + checkScore + safetyScore;
};