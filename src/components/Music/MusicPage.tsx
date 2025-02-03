import React from "react";
import PlayerCard from "./PlayerCard";

const MusicPage: React.FC = () => {
  const handleFavorite = () => {
    alert("Added to favorites!");
  };

  const handleAddToCart = () => {
    alert("Added to cart!");
  };

  const cardsData = [
    {
      image: "https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150597431.jpg?t=st=1737751232~exp=1737754832~hmac=25225ae040d767bb5334059ef816afecc899ed859f142ee74117dd87482cbe30&w=740",
      title: "Upbeating 1",
      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      image: "https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150597431.jpg?t=st=1737751232~exp=1737754832~hmac=25225ae040d767bb5334059ef816afecc899ed859f142ee74117dd87482cbe30&w=740",
      title: "Upbeating 2",
      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      image: "https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150597431.jpg?t=st=1737751232~exp=1737754832~hmac=25225ae040d767bb5334059ef816afecc899ed859f142ee74117dd87482cbe30&w=740",
      title: "Upbeating 3",
      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
    // Add more items as needed
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {cardsData.map((card, index) => (
          <PlayerCard
            key={index}
            image={card.image}
            title={card.title}
            audioSrc={card.audioSrc}
            onFavorite={handleFavorite}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default MusicPage;
