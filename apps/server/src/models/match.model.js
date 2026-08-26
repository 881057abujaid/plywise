import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
    player1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true,
    },
    player2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: false,
    },
    bot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bot",
        required: false,
    },
    botDifficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "easy",
    },
    mode: {
        type: String,
        enum: ["pvp", "pve"],
        required: true,
    },
    status: {
        type: String,
        enum: ["waiting", "active", "completed", "abandoned"],
        default: "waiting",
    },
    result: {
        type: String,
        enum: ["player1", "player2", "draw"],
        default: null,
    },
},
    {
        timestamps: true,
    }
);

const Match = mongoose.model("Match", matchSchema);

export default Match;