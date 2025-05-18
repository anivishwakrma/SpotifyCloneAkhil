import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import spotify_logo from "../assets/images/spotify_logo_white.svg";
import IconText from "../components/shared/IconText";
import TextWithHover from "../components/shared/TextWithHover";

const BASE_URL = "http://localhost:5000/uploads/";

const LoginPopup = ({ onClose, onLogin }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-xl p-6 w-96 text-center shadow-2xl">
                <h2 className="text-xl font-bold mb-4">Login Required</h2>
                <p className="mb-6">Please login to play songs.</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onLogin}
                        className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600"
                    >
                        Login
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 px-4 py-2 rounded-full font-semibold hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const Card = ({ title, description, imgUrl, onClick }) => (
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

const PlaylistView = ({ titleText, cardsData, onCardClick }) => (
    <div className="text-white mt-8 px-8">
        <div className="text-2xl font-semibold mb-5">{titleText}</div>
        <div className="flex flex-col gap-4">
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

const Home = () => {
    const [songs, setSongs] = useState([]);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const fetchSongs = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/songs/songs");
            setSongs(res.data);
        } catch (err) {
            console.error("Error fetching songs:", err);
        }
    };

    useEffect(() => {
        fetchSongs();
    }, []);

    const groupedSongs = songs.reduce((acc, song) => {
        acc[song.genre] = acc[song.genre] || [];
        acc[song.genre].push(song);
        return acc;
    }, {});

    const handleCardClick = () => {
        setShowLoginPopup(true);
    };

    const LoginBtn = () => {
        window.location.href = "/login";
    };
    const SignBtn = () => {
        window.location.href = "/signup";
    };

    return (
        <div className="h-full w-full flex">
            {/* Left Panel */}
            <div className="h-full w-1/5 bg-black flex flex-col justify-between pb-10">
                <div>
                    <div className="logoDiv p-6">
                        <img src={spotify_logo} alt="spotify logo" width={125} />
                    </div>
                    <div className="py-5">
                        <IconText iconName={"material-symbols:home"} displayText={"Home"} active />
                        <IconText iconName={"material-symbols:search-rounded"} displayText={"Search"} />
                        <IconText iconName={"icomoon-free:books"} displayText={"Library"} />
                    </div>
                    <div className="pt-5">
                        <IconText iconName={"material-symbols:add-box"} displayText={"Create Playlist"} />
                        <IconText iconName={"mdi:cards-heart"} displayText={"Liked Songs"} />
                    </div>
                </div>
                <div className="px-5">
                    <div className="border border-gray-100 text-white w-2/5 flex px-2 py-1 rounded-full items-center justify-center hover:border-white cursor-pointer">
                        <Icon icon="carbon:earth-europe-africa" />
                        <div className="ml-2 text-sm font-semibold">English</div>
                    </div>
                </div>
            </div>

            {/* Right Content Area */}
            <div className="h-full w-4/5 bg-app-black overflow-auto">
                {/* Navbar */}
                <div className="navbar w-full h-1/10 bg-black bg-opacity-30 flex items-center justify-end">
                    <div className="w-1/2 flex h-full">
                        <div className="w-3/5 flex justify-around items-center">
                            <TextWithHover displayText={"Premium"} />
                            <TextWithHover displayText={"Support"} />
                            <TextWithHover displayText={"Download"} />
                            <div className="h-1/2 border-r border-white"></div>
                        </div>
                        <div className="w-2/5 flex justify-around h-full items-center">
                             <div
                                className=" text-white w-full font-semibold cursor-pointer"
                                onClick={SignBtn}
                            >
                                Sign-Up
                            </div>
                            <div
                                className=" text-white w-full font-semibold cursor-pointer"
                                onClick={LoginBtn}
                            >
                                Log-in
                            </div>
                        </div>
                    </div>
                </div>

                {/* Songs Display */}
                <div className="px-4 pb-10">
                    {Object.entries(groupedSongs).map(([genre, songList]) => (
                        <PlaylistView
                            key={genre}
                            titleText={genre.charAt(0).toUpperCase() + genre.slice(1)}
                            cardsData={songList}
                            onCardClick={handleCardClick}
                        />
                    ))}
                </div>
            </div>

            {/* Login Popup */}
            {showLoginPopup && (
                <LoginPopup
                    onClose={() => setShowLoginPopup(false)}
                    onLogin={LoginBtn}
                />
            )}
        </div>
    );
};

export default Home;
