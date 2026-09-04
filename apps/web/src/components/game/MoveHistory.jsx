const CLASSIFICATION_DOT = {
    best: "bg-success",
    good: "bg-success",
    inaccuracy: "bg-gold-primary",
    mistake: "bg-gold-primary",
    blunder: "bg-danger",
};

const MoveHistory = ({
    moves = [],
    selectedMoveId,
    onMoveSelect,
}) => {
    const movePairs = [];

    for (let i = 0; i < moves.length; i += 2) {
        movePairs.push({
            moveNumber: moves[i].moveNumber,
            white: moves[i],
            black: moves[i + 1] ?? null,
        });
    }

    return (
        <div className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-4 font-display text-lg text-text-primary">
                Move History
            </h2>

            {movePairs.length === 0 ? (
                <p className="text-sm text-text-muted">
                    No moves played yet.
                </p>
            ) : (
                <div className="space-y-1">
                    {movePairs.map((move) => (
                        <div
                            key={move.moveNumber}
                            className="grid grid-cols-[40px_1fr_1fr] gap-2"
                        >
                            <span className="px-2 py-1.5 text-sm text-text-muted">
                                {move.moveNumber}.
                            </span>

                            <button
                                type="button"
                                onClick={() => onMoveSelect(move.white)}
                                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition ${selectedMoveId === move.white._id
                                    ? "bg-surface-elevated text-text-primary"
                                    : "text-text-primary hover:bg-surface-elevated"
                                    }`}
                            >
                                <span>{move.white.san}</span>

                                {move.white.analysis?.classification && (
                                    <span
                                        aria-label={move.white.analysis.classification}
                                        title={move.white.analysis.classification}
                                        className={`h-2 w-2 shrink-0 rounded-full ${CLASSIFICATION_DOT[move.white.analysis.classification]
                                            }`}
                                    />
                                )}
                            </button>

                            <button
                                type="button"
                                disabled={!move.black}
                                onClick={() =>
                                    move.black && onMoveSelect(move.black)
                                }
                                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition ${selectedMoveId === move.black?._id
                                        ? "bg-surface-elevated text-text-primary"
                                        : "text-text-primary hover:bg-surface-elevated"
                                    }`}
                            >
                                <span>{move.black?.san ?? "—"}</span>

                                {move.black?.analysis?.classification && (
                                    <span
                                        aria-label={move.black.analysis.classification}
                                        title={move.black.analysis.classification}
                                        className={`h-2 w-2 shrink-0 rounded-full ${CLASSIFICATION_DOT[move.black.analysis.classification]
                                            }`}
                                    />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MoveHistory;