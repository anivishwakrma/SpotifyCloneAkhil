import { useEffect, useRef, useState } from "react";
import axios from "axios";
import LoggedInContainer from "../containers/LoggedInContainer";

const BASE_URL = "http://localhost:5000/uploads/";

const Home = ({ song, isLiked, onLikeToggle }) => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:5000/api/songs/songs")
            .then(res => setSongs(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            isPlaying ? audioRef.current.play() : audioRef.current.pause();
        }
    }, [isPlaying]);

    const playSong = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
        setIsPopupVisible(true);
    };

    const getCurrentGenreSongs = () => {
        return currentSong ? songs.filter(s => s.genre === currentSong.genre) : [];
    };

    const getCurrentIndex = () => {
        const genreSongs = getCurrentGenreSongs();
        return genreSongs.findIndex(s => s._id === currentSong._id);
    };

    const playNext = () => {
        const genreSongs = getCurrentGenreSongs();
        const currentIndex = getCurrentIndex();
        if (currentIndex + 1 < genreSongs.length) {
            playSong(genreSongs[currentIndex + 1]);
        }
    };

    const playPrevious = () => {
        const genreSongs = getCurrentGenreSongs();
        const currentIndex = getCurrentIndex();
        if (currentIndex > 0) {
            playSong(genreSongs[currentIndex - 1]);
        }
    };

    const groupedSongs = songs.reduce((acc, song) => {
        acc[song.genre] = acc[song.genre] || [];
        acc[song.genre].push(song);
        return acc;
    }, {});

    const relatedSongs = currentSong
        ? songs.filter(s => s.genre === currentSong.genre && s._id !== currentSong._id)
        : [];

const MusicPlayingAnimation = () => {
  return (
    <div className="flex space-x-1 items-end w-72 h-72 rounded-lg shadow-2xl place-center tems-center justify-center">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-yellow-500 w-5 rounded animate-equalizer"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
      <style jsx>{`
        @keyframes equalizer {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
        .animate-equalizer {
          animation: equalizer 1.2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}
const toggleLike = async (songId, liked) => {
  try {
    if (liked) {
      await axios.post(`/api/user/unlike/${songId}`);
    } else {
      await axios.post(`/api/user/like/${songId}`);
    }
    // update UI accordingly
  } catch (error) {
    console.error("Failed to toggle like", error);
  }
};

    return (
        <LoggedInContainer curActiveScreen="home">
            {Object.entries(groupedSongs).map(([genre, songs]) => (
                <PlaylistView
                    key={genre}
                    titleText={genre.charAt(0).toUpperCase() + genre.slice(1)}
                    cardsData={songs}
                    onCardClick={playSong}
                />
            ))}

            {currentSong && (
               <audio
  src={BASE_URL + currentSong.audioFile}
  ref={audioRef}
  onEnded={() => setIsPlaying(false)}
  autoPlay
  onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
  onLoadedMetadata={(e) => setDuration(e.target.duration)}
/>

            )}

            {isPopupVisible && currentSong && (
                <div className="fixed inset-0 bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 text-white z-50 p-6 overflow-y-auto">
                    <div className="flex justify-between items-start">
                        {/* Left: Image */}
                        <div className="flex gap-6">
                            {currentSong.musicImage ? (
  <img
    src={BASE_URL + currentSong.musicImage}
    alt="cover"
    className="w-72 h-72 object-cover rounded-lg shadow-2xl"
  />
) : (
  <MusicPlayingAnimation />
)}


                            {/* Right: Info */}
                            <div className="mt-4">
                                <h1 className="text-5xl font-bold">{currentSong.title}</h1>
                                <p className="text-xl mt-2 text-gray-200">{currentSong.artist}</p>

                                {/* Buttons */}
                                <div className="flex gap-4 mt-6">
                                    <button onClick={playPrevious} className="bg-black/30 px-4 py-2 rounded">⏮ Prev</button>
                                    <button onClick={() => setIsPlaying(!isPlaying)} className="bg-black/30 px-4 py-2 rounded">
                                        {isPlaying ? "⏸ Pause" : "▶ Play"}
                                    </button>
                                    <button onClick={playNext} className="bg-black/30 px-4 py-2 rounded">⏭ Next</button>
                                </div>
                                {/* Time & Progress bar */}
<div className="mt-4 w-full max-w-xl">
  <div className="flex justify-between text-sm text-gray-300">
    <span>{formatTime(currentTime)}</span>
    <span>{formatTime(duration)}</span>
  </div>

  <input
    type="range"
    min={0}
    max={duration}
    value={currentTime}
    onChange={(e) => {
      const newTime = Number(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }}
    className="w-full h-1 rounded-lg accent-pink-500 cursor-pointer"
  />
</div>

                            </div>
                        </div>

                        {/* Cut button */}
                        <button
                            onClick={() => {
                                setIsPopupVisible(false);
                                setIsPlaying(false);
                                setCurrentSong(null);
                            }}
                            className="text-3xl font-bold text-white hover:text-red-300"
                        >
                            ✕
                        </button>
                        <div>
      <h3>{currentSong.title}</h3>
      <button  onClick={() => toggleLike(currentSong._id)}>
        {isLiked ? "❤️ Liked" : "🤍 Like"}
      </button>
    </div>
                    </div>

                    {/* Related Songs */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-semibold mb-4">Related Songs</h2>
                        <div className="flex flex-col gap-4">
                            {relatedSongs.map((song) => (
                                <Card
                                    key={song._id}
                                    title={song.title}
                                    description={song.artist}
                                    imgUrl={BASE_URL + song.musicImage}
                                    onClick={() => playSong(song)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </LoggedInContainer>
    );
};

const PlaylistView = ({ titleText, cardsData, onCardClick }) => {
    return (
        <div className="text-white mt-8 px-4">
            <div className="text-2xl font-semibold mb-5">{titleText}</div>
            <div className="flex flex-col space-y-4">
                {cardsData.map((item) => (
                    <Card
                        key={item._id}
                        title={item.title}
                        description={item.artist}
                        imgUrl={BASE_URL + item.musicImage}
                        onClick={() => onCardClick(item)}
                    />
                ))}
            </div>
        </div>
    );
};

const Card = ({ title, description, imgUrl, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="flex items-center bg-[#181818] hover:bg-[#282828] transition rounded-lg p-4 cursor-pointer"
        >
           <img
  src={imgUrl || "spotify-logo-png-7079.png"}
  alt="cover"
  className="w-16 h-16 rounded object-cover mr-4"
  onError={(e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = "spotify-logo-png-7079.png";
  }}
/>

            
            <div>
                <div className="text-white text-lg font-medium">{title}</div>
                <div className="text-gray-400 text-sm">{description}</div>
            </div>
        </div>
    );
};

export default Home;
