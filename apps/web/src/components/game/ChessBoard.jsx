import { useState } from "react";
import { Chess } from "chess.js";

const PIECE_SYMBOLS = {
    w: {
        p: "♙",
        n: "♘",
        b: "♗",
        r: "♖",
        q: "♕",
        k: "♔",
    },
    b: {
        p: "♟",
        n: "♞",
        b: "♝",
        r: "♜",
        q: "♛",
        k: "♚",
    },
};

const ChessBoard = ({ fen, onMove, disabled = false }) => {
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [legalMoves, setLegalMoves] = useState([]);

    const chess = new Chess(fen);
    const board = chess.board();

    const handleSquareClick = (squareName, square) => {
        if (disabled) {
            return;
        }

        if (!selectedSquare) {
            if (!square) {
                return;
            }

            const moves = chess.moves({
                square: squareName,
                verbose: true,
            });

            setSelectedSquare(squareName);
            setLegalMoves(moves);

            return;
        }

        if (selectedSquare === squareName) {
            setSelectedSquare(null);
            setLegalMoves([]);
            return;
        }

        const selectedMove = legalMoves.find(
            (move) => move.to === squareName
        );

        if (!selectedMove) {
            return;
        }

        onMove(
            selectedSquare,
            squareName,
            selectedMove.promotion ?? null,
        );

        setSelectedSquare(null);
        setLegalMoves([]);
    };

    return (
        <div className="grid aspect-square w-full max-w-[640px] grid-cols-8 overflow-hidden rounded-lg border border-border">
            {board.map((row, rowIndex) =>
                row.map((square, columnIndex) => {
                    const files = "abcdefgh";
                    const squareName = `${files[columnIndex]}${8 - rowIndex}`;

                    const isSelected = selectedSquare === squareName;

                    const isLegalMove = legalMoves.some(
                        (move) => move.to === squareName
                    );

                    const isLightSquare =
                        (rowIndex + columnIndex) % 2 === 0;

                    return (
                        <button
                            key={`${rowIndex}-${columnIndex}`}
                            type="button"
                            disabled={disabled}
                            onClick={() =>
                                handleSquareClick(squareName, square)
                            }
                            className={`
                    relative flex aspect-square
                    items-center justify-center
                    border-0 p-0
                    ${isLightSquare
                                    ? "bg-board-light"
                                    : "bg-board-dark"
                                }
                    ${isSelected
                                    ? "ring-4 ring-inset ring-gold-primary"
                                    : ""
                                }
                `}
                        >
                            {square && (
                                <span
                                    className={`
                                        text-[clamp(1.75rem,6vw,4rem)]
                                        leading-none
                                        ${square.color === "w"
                                            ? "text-text-primary"
                                            : "text-bg"
                                        }
                                    `}
                                >
                                    {PIECE_SYMBOLS[square.color][square.type]}
                                </span>
                            )}

                            {isLegalMove && (
                                <span
                                    aria-hidden="true"
                                    className="absolute h-3 w-3 rounded-full bg-gold-primary/70"
                                />
                            )}
                        </button>
                    );
                })
            )}
        </div>
    );
};

export default ChessBoard;