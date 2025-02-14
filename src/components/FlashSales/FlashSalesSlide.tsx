import FlashSale from "./FlashSales";
import Slider from "react-slick";
import React, { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Adjust the import path as needed

// Define the product interface
interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  performance: string;
}

// Define the props interface
interface ProductSliderProps {
  products: Product[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products }) => {
  const sliderRef = React.useRef<Slider | null>(null);

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <div className="relative p-4">
      <Slider ref={sliderRef} {...settings}>
        {products.map((product) => (
          <div key={product.id} className="px-2">
            <FlashSale
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              rating={product.rating}
              reviews={product.reviews}
              performance={product.performance}
            />
          </div>
        ))}
      </Slider>
      {/* Custom Navigation Buttons */}
      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
        onClick={() => sliderRef.current?.slickPrev()}
      >
        <FaChevronLeft />
      </button>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
        onClick={() => sliderRef.current?.slickNext()}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default ProductSlider;
