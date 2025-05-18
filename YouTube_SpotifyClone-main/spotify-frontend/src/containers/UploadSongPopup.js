import React, { useState } from "react";

const UploadSongPopup = ({ onClose }) => {
    const [musicImage, setMusicImage] = useState(null);
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [language, setLanguage] = useState("");
    const [genre, setGenre] = useState("pop");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("musicImage", musicImage);
        formData.append("title", title);
        formData.append("artist", artist);
        formData.append("audioFile", audioFile);
        formData.append("language", language);
        formData.append("genre", genre);

        try {
            const response = await fetch("http://localhost:5000/api/songs/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            console.log("Upload success:", result);
            alert("Song uploaded successfully");
            onClose();
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload song");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-96 text-white">
                <h2 className="text-xl font-bold mb-4">Upload New Song On Spotify</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Music Image */}
                    <div className="w-full">
                        <label className="block text-sm font-medium mb-1">Upload Music Image</label>
                        <div className="bg-gray-800 p-2 rounded">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setMusicImage(e.target.files[0])}
                                className="w-full text-sm text-white"
                                
                            />
                        </div>
                    </div>

                    {/* Song Title */}
                    <input
                        type="text"
                        placeholder="Song Title"
                        className="w-full bg-gray-800 p-2 rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    {/* Artist Name */}
                    <input
                        type="text"
                        placeholder="Artist Name"
                        className="w-full bg-gray-800 p-2 rounded"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        required
                    />

                    {/* Audio File */}
                    <div className="w-full">
                        <label className="block text-sm font-medium mb-1">Upload Music</label>
                        <div className="bg-gray-800 p-2 rounded">
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => setAudioFile(e.target.files[0])}
                                className="w-full text-sm text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Language */}
                    <input
                        type="text"
                        placeholder="Language"
                        className="w-full bg-gray-800 p-2 rounded"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        required
                    />

                    {/* Genre */}
                   <select
    className="w-full bg-gray-800 p-2 rounded"
    value={genre}
    onChange={(e) => setGenre(e.target.value)}
    required
>
    <option value="">Select Genre</option>
    <option value="pop">Pop</option>
    <option value="rock">Rock</option>
    <option value="hiphop">Hip-Hop</option>
    <option value="rnb">R&B / Soul</option>
    <option value="edm">EDM / Electronic</option>
    <option value="lofi">Lo-fi</option>
    <option value="trap">Trap</option>
    <option value="classical">Classical</option>
    <option value="instrumental">Instrumental</option>
    <option value="jazz">Jazz</option>
    <option value="reggae">Reggae</option>
    <option value="devotion">Devotion</option>
    <option value="dance">Dance</option>
    <option value="bhojpuri">Bhojpuri</option>
    <option value="romantic">Romantic</option>
    <option value="bollywood">Bollywood</option>
    <option value="indian_classical">Indian Classical</option>
    <option value="latin">Latin</option>
    <option value="kpop">K-Pop</option>
</select>


                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-300 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadSongPopup;
