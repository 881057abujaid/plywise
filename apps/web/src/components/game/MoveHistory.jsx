const MoveHistory = ({ moves = [] }) => {
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
                            className="grid grid-cols-[40px_1fr_1fr] gap-2 rounded-md px-2 py-1.5 text-sm"
                        >
                            <span className="text-text-muted">
                                {move.moveNumber}.
                            </span>

                            <span className="text-text-primary">
                                {move.white.san}
                            </span>

                            <span className="text-text-primary">
                                {move.black?.san ?? "—"}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MoveHistory;