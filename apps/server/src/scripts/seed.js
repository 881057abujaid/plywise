import connectDatabase from "../config/database.js";
import seedBots from "../seeds/bot.seed.js";
import env from "../config/env.js";

const runSeed = async () => {
    try {
        await connectDatabase(env.mongoUri);
        await seedBots();

        console.log("Database seeding completed.");
        process.exit(0);

    } catch (error) {
        console.log("Database seeding failed:", error);
        process.exit(1);
    }
};

runSeed();