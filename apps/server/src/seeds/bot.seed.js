import Bot from "../models/bot.model.js";

const bots = [
    {
        name: "PlyBot Easy",
        rating: 800
    },
    {
        name: "PlyBot Medium",
        rating: 1200
    },
    {
        name: "PlyBot Hard",
        rating: 1600
    }
];

const seedBots = async () => {
    for (const bot of bots) {
        await Bot.updateOne(
            { name: bot.name },
            { $set: bot },
            { upsert: true }
        );
    }

    console.log("Bot data seeded successfully.");
};

export default seedBots;