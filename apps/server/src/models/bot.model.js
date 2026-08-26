import mongoose from "mongoose";

const botSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0
    }
},
    {
        timestamps: true
    }
);

const Bot = mongoose.model("Bot", botSchema);

export default Bot;