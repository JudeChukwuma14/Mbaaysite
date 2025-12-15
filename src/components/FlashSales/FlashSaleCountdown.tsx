import React, { useState, useEffect } from "react";
import { IoFlash } from "react-icons/io5";

interface FlashSaleCountdownProps {
  targetDate?: Date;
  title?: string;
}

const FlashSaleCountdown: React.FC<FlashSaleCountdownProps> = ({ 
  targetDate, 
  title = "Flash Sales" 
}) => {
  // Set target time (24 hours from now by default)
  const targetTime = targetDate 
    ? targetDate.getTime() 
    : new Date().getTime() + 24 * 60 * 60 * 1000;

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
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && 
          newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        setIsEnded(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black rounded-lg p-3 min-w-[60px] shadow-lg">
      <span className="text-2xl md:text-3xl font-bold text-white">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs text-gray-300 mt-1 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-100">
      {/* Title Section */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
          <IoFlash className="text-2xl text-white" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {title}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Limited time offers! Hurry up before they're gone.
          </p>
        </div>
      </div>

      {/* Countdown Section */}
      <div className="flex items-center gap-6">
        {isEnded ? (
          <div className="text-center">
            <p className="text-lg font-semibold text-red-600">Flash Sale Ended!</p>
            <p className="text-sm text-gray-500">Stay tuned for the next one</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Ends in:</p>
              <div className="flex items-center gap-2">
                <TimeUnit value={timeLeft.days} label="Days" />
                <span className="text-2xl font-bold text-orange-500">:</span>
                <TimeUnit value={timeLeft.hours} label="Hours" />
                <span className="text-2xl font-bold text-orange-500">:</span>
                <TimeUnit value={timeLeft.minutes} label="Mins" />
                <span className="text-2xl font-bold text-orange-500">:</span>
                <TimeUnit value={timeLeft.seconds} label="Secs" />
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="hidden md:block w-48">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  style={{ 
                    width: `${((24 - timeLeft.hours) / 24) * 100}%`,
                    transition: 'width 1s ease-in-out'
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {24 - timeLeft.hours} hours passed
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FlashSaleCountdown;