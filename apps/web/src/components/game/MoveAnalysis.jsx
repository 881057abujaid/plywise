const CLASSIFICATION_CONFIG = {
    best: {
        label: "Best Move",
        className: "text-success",
    },
    good: {
        label: "Good Move",
        className: "text-success",
    },
    inaccuracy: {
        label: "Inaccuracy",
        className: "text-gold-primary",
    },
    mistake: {
        label: "Mistake",
        className: "text-gold-primary",
    },
    blunder: {
        label: "Blunder",
        className: "text-danger",
    },
};

const formatEvaluation = (value) => {
    if (value === null || value === undefined) {
        return "—";
    }

    if (Math.abs(value) >= 10000) {
        return "—";
    }

    if (value === 0) {
        return "0.0";
    }

    return value > 0 ? `+${value}` : `${value}`;
};

const MoveAnalysis = ({ move = null }) => {
    if (!move?.analysis) {
        return (
            <div className="rounded-lg border border-border bg-surface p-4">
                <h2 className="mb-2 font-display text-lg text-text-primary">
                    Move Analysis
                </h2>

                <p className="text-sm text-text-muted">
                    Select a move to view its analysis.
                </p>
            </div>
        );
    }

    const { analysis } = move;

    const tacticalMessage = analysis.isCheckmate
        ? "Checkmate!"
        : analysis.missedCheckmate
            ? "Missed Checkmate"
            : null;

    const classification =
        CLASSIFICATION_CONFIG[analysis.classification];

    return (
        <div className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-4 font-display text-lg text-text-primary">
                Move Analysis
            </h2>

            {tacticalMessage && (
                <div className="mb-4 rounded-md border border-border bg-surface-elevated px-3 py-2">
                    <p
                        className={`text-sm font-semibold ${analysis.isCheckmate
                            ? "text-success"
                            : "text-danger"
                            }`}
                    >
                        {tacticalMessage}
                    </p>

                    {analysis.missedCheckmate && analysis.bestMove?.san && (
                        <p className="mt-1 text-sm text-text-secondary">
                            Best move:{" "}
                            <span className="font-medium text-text-primary">
                                {analysis.bestMove.san}
                            </span>
                        </p>
                    )}
                </div>
            )}

            <div className="mb-5">
                <p
                    className={`text-sm font-semibold uppercase tracking-wide ${classification?.className ?? "text-text-primary"
                        }`}
                >
                    {classification?.label ?? analysis.classification}
                </p>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-text-muted">
                        Played Move
                    </span>

                    <span className="font-medium text-text-primary">
                        {analysis.playedMove?.san ?? move.san}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-text-muted">
                        Best Move
                    </span>

                    <span className="font-medium text-text-primary">
                        {analysis.bestMove?.san ?? "—"}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-text-muted">
                        Evaluation Before
                    </span>

                    <span className="font-mono text-sm text-text-primary">
                        {formatEvaluation(analysis.evaluationBefore)}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-text-muted">
                        Evaluation After
                    </span>

                    <span className="font-mono text-sm text-text-primary">
                        {formatEvaluation(analysis.evaluationAfter)}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-text-muted">
                        Evaluation Loss
                    </span>

                    <span className="font-mono text-sm text-text-primary">
                        {formatEvaluation(analysis.evaluationLoss)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MoveAnalysis;