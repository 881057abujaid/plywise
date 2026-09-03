const THRESHOLDS = {
    good: 0.25,
    inaccuracy: 1,
    mistake: 3,
};

export const classifyMove = (analysis) => {
    if (!analysis) {
        return null;
    }

    if (analysis.isBestMove || analysis.isCheckmate) {
        return "best";
    }

    if (analysis.missedCheckmate) {
        return "blunder";
    }

    const { evaluationLoss } = analysis;

    if (evaluationLoss <= THRESHOLDS.good) {
        return "good";
    }

    if (evaluationLoss <= THRESHOLDS.inaccuracy) {
        return "inaccuracy";
    }

    if (evaluationLoss <= THRESHOLDS.mistake) {
        return "mistake";
    }

    return "blunder";
};