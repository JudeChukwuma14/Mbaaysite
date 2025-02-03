import React from "react";
import Slider from "react-slick";
import FlashSale from "./FlashSales";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Adjust the import path as needed

// Define the product interface
interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  rating: number;
  reviews: number;
}

// Define the props interface
interface ProductSliderProps {
  products: Product[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products }) => {
  // Slider settings
  const settings = {
    dots: true, // Show dot indicators
    infinite: true, // Infinite looping
    speed: 2000, // Transition speed
    slidesToShow: 4, // Number of slides to show at once
    slidesToScroll: 2, // Number of slides to scroll
    responsive: [
      {
        breakpoint: 1024, // Adjust for large screens
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 835, // Adjust for tablets
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // Adjust for mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="p-4">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="px-2">
            <FlashSale
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              rating={product.rating}
              reviews={product.reviews}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;