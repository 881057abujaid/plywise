const SUPPORTED_REASONS = {
    MISSED_CHECKMATE: "missed_checkmate",
    MISSED_OPPORTUNITY: "missed_opportunity",
};

const createNoCoachingDecision = () => ({
    shouldCoach: false,
    priority: null,
    reason: null,
    triggerPly: null,
});

const getPriority = (reason, classification) => {
    if (reason === SUPPORTED_REASONS.MISSED_CHECKMATE) {
        return "critical";
    }

    if (reason === SUPPORTED_REASONS.MISSED_OPPORTUNITY) {
        if (classification === "blunder") {
            return "high";
        }

        if (classification === "mistake") {
            return "medium";
        }
    }

    return null;
};

const hasRecentSameReason = (reason, recentCoachMessages = []) =>
    recentCoachMessages.some((message) => message.reason === reason);

export const decideCoaching = ({
    move,
    analysis,
    classification,
    reason,
    context = {},
}) => {
    if (!analysis || !reason) {
        return createNoCoachingDecision();
    }

    if (!Object.values(SUPPORTED_REASONS).includes(reason)) {
        return createNoCoachingDecision();
    }

    const priority = getPriority(reason, classification);

    if (!priority) {
        return createNoCoachingDecision();
    }

    const recentCoachMessages = context.recentCoachMessages ?? [];

    if (
        reason !== SUPPORTED_REASONS.MISSED_CHECKMATE &&
        hasRecentSameReason(reason, recentCoachMessages)
    ) {
        return createNoCoachingDecision();
    }

    return {
        shouldCoach: true,
        priority,
        reason,
        triggerPly: move?.ply ?? null,
    };
};