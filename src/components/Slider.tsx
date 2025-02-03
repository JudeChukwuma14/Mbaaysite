import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import image1 from "@/assets/image/fashion 1.png"; 

const slides = [
  {
    image: image1,
    text: "Discover the latest fashion trends",
    buttonText: "Shop now",
    link: "/",
  },
  {
    image: image1,
    text: "Upgrade your wardrobe today",
    buttonText: "Shop now",
    link: "/",
  },
];

const Slider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );

  const nextSlide = () =>
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);

  return (
    <div className="relative w-full h-48 md:h-56 lg:h-80 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute w-full h-full flex items-center transition-opacity duration-700 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full h-full bg-black/50 flex items-center px-6 md:px-16 lg:px-32">
            <div className="text-left text-white max-w-[450px]">
              <h2 className="text-lg md:text-2xl lg:text-4xl font-semibold mb-4">
                {slide.text}
              </h2>
              <a
                href={slide.link}
                className="bg-orange-500 text-white px-4 md:px-5 py-2 rounded-md text-sm md:text-base font-medium inline-block"
              >
                {slide.buttonText}
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        className="absolute left-2 md:left-5 top-1/2 transform -translate-y-1/2 text-white bg-black/30 p-2 rounded-full"
        onClick={prevSlide}
      >
        <FaChevronLeft className=" hidden md:block" />
      </button>
      <button
        className="absolute right-2 md:right-5 top-1/2 transform -translate-y-1/2 text-white bg-black/30 p-2 rounded-full"
        onClick={nextSlide}
      >
        <FaChevronRight className=" hidden md:block"/>
      </button>
    </div>
  );
};

export default Slider;
