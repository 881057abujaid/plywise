const OPPORTUNITY_THRESHOLD = 1;

export const detectCoachingReason = ({ analysis, classification }) => {
    if (!analysis) return null;

    if (analysis.missedCheckmate === true) {
        return "missed_checkmate";
    }

    const isMeaningfulClassification =
        classification === "mistake" ||
        classification === "blunder";

    if (
        isMeaningfulClassification &&
        analysis.evaluationLoss > OPPORTUNITY_THRESHOLD
    ) {
        return "missed_opportunity";
    }

    return null;
};