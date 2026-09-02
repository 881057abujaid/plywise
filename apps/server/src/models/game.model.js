import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match",
        required: true,
        unique: true,
    },
    board: {
        type: String,
        required: true,
        default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    },
    turn: {
        type: String,
        enum: ["white", "black"],
        default: "white",
    },
    status: {
        type: String,
        enum: ["active", "completed", "abandoned"],
        default: "active",
    },
    result: {
        type: String,
        enum: ["white", "black", "draw"],
        default: null,
    },
    moves: [
        {
            moveNumber: {
                type: Number,
                required: true,
                min: 1,
            },
            color: {
                type: String,
                enum: ["white", "black"],
                required: true,
            },
            from: {
                type: String,
                required: true,
                trim: true,
            },
            to: {
                type: String,
                required: true,
                trim: true,
            },
            san: {
                type: String,
                required: true,
                trim: true,
            },
            promotion: {
                type: String,
                default: null,
                trim: true,
            },
        },
    ],
},
    {
        timestamps: true,
    }
);

const Game = mongoose.model("Game", gameSchema);

export default Game;