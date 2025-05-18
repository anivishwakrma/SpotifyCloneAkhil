const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    language: { type: String, required: true },
    genre: { type: String, required: true },
    musicImage: { type: String },
    audioFile: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Song", songSchema);
