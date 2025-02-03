import React, { useRef, useState } from "react";
import { FaHeart, FaShoppingCart, FaPlay, FaPause } from "react-icons/fa";

interface PlayerCardProps {
  image: string; // URL of the image
  title: string; // Song or content title
  audioSrc: string; // URL of the audio file
  onFavorite: () => void; // Add to favorites
  onAddToCart: () => void; // Add to cart
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  image,
  title,
  audioSrc,
  onFavorite,
  onAddToCart,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((currentTime / duration) * 100 || 0);
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-black text-white rounded-lg shadow-lg p-4">
      {/* Image Section */}
      <div className="relative flex justify-center items-center mb-4">
        <img
          src={image}
          alt={title}
          className="rounded-full w-32 h-32 object-cover border-4 border-gray-700"
        />
      </div>

      {/* Title */}
      <h2 className="text-center text-lg font-bold">{title}</h2>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={onFavorite}
          className="text-gray-400 hover:text-white"
          aria-label="Add to favorites"
        >
          <FaHeart size={20} />
        </button>
        <button
          onClick={handlePlayPause}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
        </button>
        <button
          onClick={onAddToCart}
          className="text-gray-400 hover:text-white"
          aria-label="Add to cart"
        >
          <FaShoppingCart size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm">
          <span>
            {audioRef.current ? formatTime(audioRef.current.currentTime) : "0:00"}
          </span>
          <span>
            {audioRef.current
              ? formatTime(audioRef.current.duration || 0)
              : "0:00"}
          </span>
        </div>
        <div className="w-full h-1 bg-gray-700 rounded-full mt-1">
          <div
            className="h-full bg-orange-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default PlayerCard;
