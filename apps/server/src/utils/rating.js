const K_FACTOR = 32;

const calculateExpectedScore = (playerRating, opponentRating) => {
    return 1 / (1 + 10 ** ((opponentRating - playerRating) / 400));
};

export const calculateNewRating = (playerRating, opponentRating, actualScore) => {
    const expectedScore = calculateExpectedScore(playerRating, opponentRating);

    return Math.round(playerRating + K_FACTOR * (actualScore - expectedScore));
};