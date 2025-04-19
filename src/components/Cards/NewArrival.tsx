import React from "react";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/slices/cartSlice";
import { toast } from "react-toastify";
import { IoCartOutline } from "react-icons/io5";
import { AiOutlineHeart } from "react-icons/ai";
import { addWishlistItem } from "@/redux/slices/wishlistSlice";
import { Link } from "react-router-dom";

interface Product {
    id?: string;
  _id: string;
  name: string;
  price: number;
  images: string[];
  poster: string; // Added for fallback
}

interface NewArrivalProps {
  product: Product;
}

const NewArrival: React.FC<NewArrivalProps> = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCartClick = (product: Product) => {
    dispatch(
      addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0] || product.poster,
      })
    );
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddWishlist = (product: Product) => {
    dispatch(
      addWishlistItem({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0] || product.poster,
      })
    );
    toast.success(`${product.name} added to your wishlist!`);
  };

  return (
    <div className="max-w-sm overflow-hidden bg-white shadow-md">
      <div className="relative">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.images[0] || product.poster}
          alt={product.name}
          className="object-cover w-full h-56"
        />
      </Link>
        <div className="absolute flex flex-col space-y-2 top-3 right-3">
          <button
            className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow"
            aria-label="Add to wishlist"
            onClick={() => handleAddWishlist(product)}
          >
            <AiOutlineHeart className="text-lg text-gray-600" />
          </button>
          <button
            className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow"
            aria-label="Add to cart"
            onClick={() => handleAddToCartClick(product)}
          >
            <IoCartOutline className="text-lg text-gray-600" />
          </button>
        </div>
      </div>
      <Link to={`/product/${product._id}`}>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <div className="flex items-center mt-2 space-x-3">
            <span className="text-xl font-semibold text-red-500">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NewArrival;