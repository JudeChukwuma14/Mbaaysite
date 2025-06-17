import Art from "@/assets/image/ArtWomen.jpg";
import { useRef, useState, useEffect } from "react";
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";

export default function NewCard() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const songs = ["https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"]; // Store audio in public/music/

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songs[currentTrack];
      if (isPlaying) audioRef.current.play();
    }
  }, [currentTrack, isPlaying, songs]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % songs.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + songs.length) % songs.length);
  };

  return (
    <div className="grid items-center justify-center grid-cols-1 gap-3 md:grid-cols-2">
      {/* Large Main Card */}
      <div className="relative h-[410px] bg-cover bg-center" style={{ backgroundImage: `url(${Art})` }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="absolute left-0 p-4 text-white bottom-2">
          <h5>African Woman Art</h5>
          <p className="text-sm">Black and White version of the PS5 coming out on sale.</p>
          <a href="#" className="text-sm text-orange-500 cursor-pointer">Show Now</a>
        </div>
      </div>

      {/* Two Smaller Cards */}
      <div className="flex flex-col gap-2">
        {/* Music Card */}
        <div className="relative h-[200px] bg-cover bg-center" style={{ backgroundImage: `url(${Art})` }}>
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="absolute left-0 p-4 text-white bottom-2">
            <h5>Home</h5>
            <p className="text-sm">Lorem ipsum dolor sit amet consectetur.</p>
            <a href="#" className="text-sm text-orange-500 cursor-pointer">Show Now</a>

            {/* Audio Player */}
            <div className="flex items-center gap-4 mt-3">
              <button onClick={prevTrack} className="p-2 bg-gray-800 rounded-full">
                <FaStepBackward className="text-white" />
              </button>

              <button onClick={togglePlay} className="p-2 bg-gray-800 rounded-full">
                {isPlaying ? <FaPause className="text-white" /> : <FaPlay className="text-white" />}
              </button>

              <button onClick={nextTrack} className="p-2 bg-gray-800 rounded-full">
                <FaStepForward className="text-white" />
              </button>
            </div>
          </div>

          {/* Hidden Audio Element */}
          <audio ref={audioRef} onEnded={nextTrack} />
        </div>

        {/* Video Card */}
        <div className="relative h-[200px]">
          <video
            className="object-cover w-full h-full "
            controls
            autoPlay
            loop
            muted
          >
            <source src="/videos/clip.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
