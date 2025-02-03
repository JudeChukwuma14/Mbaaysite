import React, { useState, useEffect } from "react";

const FlashSaleCountdown: React.FC = () => {
  // Set the target time (e.g., 3 days from now)
  const targetTime = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = targetTime - now;

    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex  items-center gap-10">
      <h2 className="text-2xl font-bold">Flash Sales</h2>
      <div className="flex space-x-4 text-3xl font-semibold">
        <div>
          <p className="text-[10px] md:text-sm">Days</p>
          <span className="text-lg md:text-[1.5rem]">{String(timeLeft.days).padStart(2, "0")}</span>
        </div>
        <span className=" text-orange-600">:</span>
      
        <div>
          <p className="text-[10px] md:text-sm">Hours</p>
          <span className="text-lg md:text-[1.5rem]">{String(timeLeft.hours).padStart(2, "0")}</span>
        </div>
        <span className=" text-orange-600">:</span>
        <div>
          <p className="text-[10px] md:text-sm">Minutes</p>
          <span className="text-lg md:text-[1.5rem]">{String(timeLeft.minutes).padStart(2, "0")}</span>
        </div>
        <span className=" text-orange-600">:</span>
        <div>
          <p className="text-[10px] md:text-sm">Seconds</p>
          <span className="text-lg md:text-[1.5rem]">{String(timeLeft.seconds).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleCountdown;
