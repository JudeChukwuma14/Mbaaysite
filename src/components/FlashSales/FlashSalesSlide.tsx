import Slider from "react-slick";
import React, { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FlashSaleProductCard from "./FlashSaleProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  flashSalePrice?: number;
  flashSaleStatus?: string;
  flashSaleDiscount?: number;
  flashSaleStartDate?: string;
  flashSaleEndDate?: string;
  images: string[];
  poster?: string;
  inventory?: number;
  rating?: number;
  reviews?: number;
  productType?: string;
}

interface ProductSliderProps {
  products: Product[];
  title?: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ 
  products, 
  title = "Flash Sale Products" 
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = React.useRef<Slider | null>(null);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    dots: false,
    afterChange: (current: number) => setActiveSlide(current),
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3, slidesToScroll: 1 }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1 }
      }
    ]
  };

  // Filter flash sale products
  const flashSaleProducts = products.filter(product => 
    product.flashSaleStatus === "Active" || 
    product.productType === "flash sale"
  );

  if (flashSaleProducts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl">
        <h3 className="text-2xl font-bold text-gray-700 mb-4">{title}</h3>
        <p className="text-gray-500">No flash sale products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="relative px-4 py-4">
      {/* Custom Navigation Buttons */}
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 bg-white shadow-lg text-gray-800 p-2.5 rounded-full z-10 hover:bg-gray-50 transition-colors duration-200"
        onClick={() => sliderRef.current?.slickPrev()}
        aria-label="Previous slide"
      >
        <FaChevronLeft className="text-lg" />
      </button>
      
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 bg-white shadow-lg text-gray-800 p-2.5 rounded-full z-10 hover:bg-gray-50 transition-colors duration-200"
        onClick={() => sliderRef.current?.slickNext()}
        aria-label="Next slide"
      >
        <FaChevronRight className="text-lg" />
      </button>

      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {flashSaleProducts.map((product) => (
          <div key={product._id} className="px-2">
            {/* Wrapper div to ensure consistent height */}
            <div className="h-full">
              <FlashSaleProductCard product={product} />
            </div>
          </div>
        ))}
      </Slider>

      {/* Slide Indicators */}
      <div className="flex justify-center mt-6">
        <div className="flex space-x-2">
          {Array.from({ length: Math.min(Math.ceil(flashSaleProducts.length / 4), 5) }).map((_, index) => (
            <button
              key={index}
              onClick={() => sliderRef.current?.slickGoTo(index * 4)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                Math.floor(activeSlide / 4) === index 
                  ? 'w-6 bg-orange-500' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;