import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import image1 from "@/assets/image/fashion 1.png";
import image2 from "@/assets/image/banner1.jpg";
import image3 from "@/assets/image/banner2.jpg";
import image4 from "@/assets/image/banner3.jpg";
import { motion } from "framer-motion";

const slides = [
  {
    image: image1,
    text: "Well made pieces you can wear every day",
    buttonText: "Shop now",
    link: "/",
  },
  {
    image: image2,
    text: "Jewellery with weight and story",
    buttonText: "Shop now",
    link: "/",
  },
  {
    image: image3,
    text: "Clean skincare made with simple",
    buttonText: "Shop now",
    link: "/",
  },
  {
    image: image4,
    text: "Designed to feel good, not just look good",
    buttonText: "Shop now",
    link: "/",
  },
  {
    image:"https://i.pinimg.com/1200x/79/d2/ef/79d2ef34e6ec39c61a584ec22373014f.jpg",
     text: "Original pieces from working artists",
    buttonText: "Shop now",
    link: "/",
  }
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
    <div className="relative w-full h-48 overflow-hidden md:h-56 lg:h-80">
      {slides.map((slide, index) => (
        <motion.div
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
          <div className="flex items-center w-full h-full px-6 bg-black/50 md:px-16 lg:px-32">
            <div className="text-left text-white max-w-[450px]">
              <h2 className="mb-4 text-lg font-semibold md:text-2xl lg:text-4xl">
                {slide.text}
              </h2>
              <a
                href={slide.link}
                className="inline-block px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md md:px-5 md:text-base"
              >
                {slide.buttonText}
              </a>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Navigation Buttons */}
      <motion.button
        className="absolute p-2 text-white transform -translate-y-1/2 rounded-full left-2 md:left-5 top-1/2 bg-black/30"
        onClick={prevSlide}
      >
        <FaChevronLeft className="hidden md:block" />
      </motion.button>
      <motion.button
        className="absolute p-2 text-white transform -translate-y-1/2 rounded-full right-2 md:right-5 top-1/2 bg-black/30"
        onClick={nextSlide}
      >
        <FaChevronRight className="hidden md:block" />
      </motion.button>
    </div>
  );
};

export default Slider;
