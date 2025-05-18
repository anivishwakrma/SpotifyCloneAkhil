const mongoose = require("mongoose");
// How to create a model
// Step 1 :require mongoose
// Step 2 :Create a mongoose schema (structure of a user)
// Step 3 : Create a model

const User = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        private: true,
    },
    lastName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"], // You can add more roles as needed
        default: "user",
    },
   likedSongs: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Song",
}],

    likedPlaylists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist", // assuming you have Playlist model
    }],
    subscribedArtists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist", // assuming you have Artist model
    }],
});

const UserModel = mongoose.model("User", User);

module.exports = UserModel;
