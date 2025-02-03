import React from "react";
import { AiOutlineHeart, AiOutlineEye, AiFillStar, AiOutlineStar } from "react-icons/ai";

interface ProductCardProps {
  title: string;
  currentPrice: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  currentPrice,
  originalPrice,
  rating,
  reviews,
  image,
}) => {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image Section */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <button
            className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
            aria-label="Add to wishlist"
          >
            <AiOutlineHeart className="text-gray-600 text-lg" />
          </button>
          <button
            className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
            aria-label="View details"
          >
            <AiOutlineEye className="text-gray-600 text-lg" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center space-x-3 mt-2">
          <span className="text-red-500 font-semibold text-xl">${currentPrice}</span>
          <span className="text-gray-500 line-through">${originalPrice}</span>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) =>
              i < rating ? (
                <AiFillStar key={i} className="text-yellow-400 text-lg" />
              ) : (
                <AiOutlineStar key={i} className="text-gray-300 text-lg" />
              )
            )}
          </div>
          <span className="text-gray-600 ml-2">({reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
