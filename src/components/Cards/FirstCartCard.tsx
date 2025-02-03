import React from "react";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/slices/cartSlice";
import { toast } from "react-toastify";
import { IoCartOutline } from "react-icons/io5";
import { AiFillStar, AiOutlineHeart, AiOutlineStar } from "react-icons/ai";
import { addWishlistItem } from "@/redux/slices/wishlistSlice";

interface Product {
  id: number;
  title: string;
  currentPrice: string;
  originalPrice: string;
  image: string;
  rating: number;
  reviews: number;
}

interface FirstCartCardProps {
  product: Product;
}

const FirstCartCard: React.FC<FirstCartCardProps> = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCartClick = (product: Product) => {
    dispatch(
      addItem({
        id: product.id,
        name: product.title,
        price: parseFloat(product.currentPrice.replace("$", "")),
        quantity: 1,
        image: product.image,
      })
    );
    toast.success(`${product.title} added to cart!`);
  };

  const handleAddWishlist = (product: Product) => {
    dispatch(
      addWishlistItem({
        id: product.id,
        name: product.title,
        price: parseFloat(product.currentPrice.replace("$", "")),
        quantity: 1,
        image: product.image,
      })
    );
    toast.success(`${product.title} added to your wishlist!`);
  };

  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <button
            className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
            aria-label="Add to wishlist"
            onClick={() => handleAddWishlist(product)}
          >
            <AiOutlineHeart className="text-gray-600 text-lg" />
          </button>
          <button
            className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
            aria-label="View details"
            onClick={() => handleAddToCartClick(product)}
          >
            <IoCartOutline className="text-gray-600 text-lg" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
        <div className="flex items-center space-x-3 mt-2">
          <span className="text-red-500 font-semibold text-xl">
            ${product.currentPrice}
          </span>
          <span className="text-gray-500 line-through">
            ${product.originalPrice}
          </span>
        </div>
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) =>
              i < product.rating ? (
                <AiFillStar key={i} className="text-yellow-400 text-lg" />
              ) : (
                <AiOutlineStar key={i} className="text-gray-300 text-lg" />
              )
            )}
          </div>
          <span className="text-gray-600 ml-2">({product.reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default FirstCartCard;
