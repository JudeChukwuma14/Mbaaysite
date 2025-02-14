import { useState, useEffect } from "react";
import { FiShoppingCart, FiHeart } from "react-icons/fi";

interface AuctionCardProps {
  image: string;
  title: string;
  currentBid: number;
  lotNumber: string;
  seller: string;
  sellerImage: string;
  endTime: string;
}

const AuctionCard: React.FC<AuctionCardProps> = ({
  image,
  title,
  currentBid,
  lotNumber,
  seller,
  sellerImage,
  endTime,
}) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(endTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  function getTimeLeft(endTime: string) {
    const diff = new Date(endTime).getTime() - new Date().getTime();
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  return (
    <div className="border p-4 bg-white group relative">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs ">
        🔨
        </span>

        {/* Hover Icons */}
        <div className=" absolute top-2 right-2 flex flex-col justify-center items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      
        <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200">
            <FiHeart className="text-gray-600 text-sm" />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200">
            <FiShoppingCart className="text-gray-600 text-sm" />
          </button>
        
        </div>

        <div className="flex gap-2 px-9 py-2 rounded-full bg-white absolute bottom-4 left-10">
          <p className="text-[10px] font-semibold flex flex-col items-center ">
            {timeLeft.days.toString().padStart(2, "0")}
            <span>Day</span>
          </p>
          :
          <p className="text-[10px] font-semibold flex flex-col items-center ">
            {timeLeft.hours.toString().padStart(2, "0")}
            <span>Hour</span>
          </p>
          :
          <p className="text-[10px] font-semibold flex flex-col items-center ">
            {timeLeft.minutes.toString().padStart(2, "0")}
            <span>Min</span>
          </p>
          :
          <p className="text-[10px] font-semibold flex flex-col items-center ">
            {timeLeft.seconds.toString().padStart(2, "0")}
            <span> Sec</span>
          </p>
        </div>
      </div>

      {/* Countdown Timer */}

      {/* Product Info */}
      <h2 className="text-lg font-bold mt-3">{title}</h2>
      <div className=" flex items-center justify-between mb-2">
        <div>
          <span className="text-gray-500 text-[10px]">Current Bid at:</span>
          <p className="text-sm font-bold">${currentBid.toLocaleString()}</p>
        </div>
        <span className="bg-orange-300 text-orange-800 px-2 py-1 text-xs  ">
          Lot $ {lotNumber}
        </span>
      </div>
      <hr />

      {/* Seller Info & Bid Button */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <img
            src={sellerImage}
            alt={seller}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium">{seller}</span>
        </div>
        <button className="bg-gray-400 text-sm text-white px-3 py-2 hover:bg-orange-500 ">Bid Now</button>
      </div>
    </div>
  );
};

export default AuctionCard;
