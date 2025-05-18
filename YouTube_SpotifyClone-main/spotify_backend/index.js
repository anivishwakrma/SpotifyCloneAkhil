const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const playlistRoutes = require("./routes/playlist");
const path = require("path")
require("dotenv").config();
const cors = require("cors");
require('dotenv').config();


mongoose.set('strictQuery', false);
const app = express();
const port = 5000;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());

// connect mongodb to our node app.
// mongoose.connect() takes 2 arguments : 1. Which db to connect to (db url), 2. 2. Connection options
mongoose
    .connect(
        process.env.MONGODB_URI,
        
    )
    .then((x) => {
        const dbName = mongoose.connection.name;
        console.log(`🎉Connected to MongoDB🎉 and Database Name: ${dbName}`);
    })
    .catch((err) => {
        console.log("Error while connecting to Mongo");
    });

// setup passport-jwt
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "thisKeyIsSupposedToBeSecret";
passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
        User.findOne({_id: jwt_payload.identifier}, function (err, user) {
            // done(error, doesTheUserExist)
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    })
);

// API : GET type : / : return text "Hello world"
app.get("/", (req, res) => {
    // req contains all data for the request
    // res contains all data for the response
    res.send("Hello World");
});
app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // static serve

// Routes
app.use("/api/songs", songRoutes);

//PLay Song Endpint
app.get("/songs", async (req, res) => {
    try {
        const songs = await Song.find(); // Fetch all songs
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch songs" });
    }
});

//Logout
// Example using Express.js
app.post('/api/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,       // only if you're using HTTPS
        sameSite: 'Lax',    // or 'None' if cross-site
    });
    return res.status(200).json({ message: 'Logged out successfully' });
});




app.listen(port, () => {
    console.log("App is running on port " + port);
});
