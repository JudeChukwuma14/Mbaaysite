import React from "react";
import { FaHeart, FaEye, FaShoppingCart, FaStar, FaRegStar } from "react-icons/fa";

// Define the props interface
interface FlashSaleProps {
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  rating: number;
  reviews: number;
}

const FlashSale: React.FC<FlashSaleProps> = ({
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
}) => {
  // Generate star rating
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index}>
      {index < rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
    </span>
  ));

  return (
    <div className="relative border rounded-sm shadow-md p-4  bg-white">
      {/* Discount Badge */}
      <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-md">
        -35%
      </div>

      {/* Icons (Wishlist, View, Add to Cart) */}
      <div className="absolute top-2 right-2 flex flex-col space-y-2">
        <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
          <FaHeart className="text-gray-600" />
        </button>
        <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
          <FaEye className="text-gray-600" />
        </button>
        <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
          <FaShoppingCart className="text-gray-600" />
        </button>
      </div>

      {/* Product Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-32 object-cover rounded-md"
      />

      {/* Product Name */}
      <h3 className="mt-3 text-sm font-semibold text-gray-900">{name}</h3>

      {/* Price Section */}
      <div className="flex items-center space-x-2">
        <span className="text-red-500 font-bold text-lg">{price}</span>
        <span className="text-gray-400 line-through text-sm">{originalPrice}</span>
      </div>

      {/* Star Rating */}
      <div className="flex items-center mt-2">
        {stars}
        <span className="text-gray-500 text-xs ml-1">({reviews})</span>
      </div>
    </div>
  );
};

export default FlashSale;