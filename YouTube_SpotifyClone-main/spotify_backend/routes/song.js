const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Song = require("../models/Song");

const router = express.Router();

// File storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post(
    "/upload",
    upload.fields([
        { name: "musicImage", maxCount: 1 },
        { name: "audioFile", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const { title, artist, language, genre } = req.body;

            const musicImagePath = req.files["musicImage"]?.[0]?.filename;
            const audioFilePath = req.files["audioFile"]?.[0]?.filename;

            const newSong = new Song({
                title,
                artist,
                language,
                genre,
                musicImage: musicImagePath,
                audioFile: audioFilePath,
            });

            await newSong.save();

            res.status(201).json({ message: "Song uploaded successfully", song: newSong });
            console.log("Song uploaded successfully")
        } catch (error) {
            console.error("Error uploading song:", error);
            res.status(500).json({ error: "Failed to upload song" });
        }
    }
);
router.get("/songs", async (req, res) => {
    try {
        const songs = await Song.find();
        console.log(songs);
        res.json(songs);
        console.log("Songs fetched successfully")
    } 
   
     catch (error) {
        res.status(500).json({ error: "Failed to fetch songs" });
    }
   
});


module.exports = router;
