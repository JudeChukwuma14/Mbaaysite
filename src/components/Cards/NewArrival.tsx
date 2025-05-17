"use client";

import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { addItem } from "@/redux/slices/cartSlice";
import { addWishlistItem } from "@/redux/slices/wishlistSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { convertPrice } from "@/utils/currencyCoverter";


interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  poster: string;
}

interface NewArrivalProps {
  product: Product;
}

const NewArrival: React.FC<NewArrivalProps> = ({ product }) => {
  const dispatch = useDispatch();
  const { currency, language } = useSelector((state: RootState) => state.settings);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  const handleAddWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  const convertedPrice = convertPrice(product.price, "USD", currency);

  return (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-lg hover:shadow-md">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.images[0] || product.poster || "/placeholder.svg"}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute flex flex-col gap-2 transition-all duration-300 transform translate-x-2 opacity-0 top-3 right-3 group-hover:opacity-100 group-hover:translate-x-0">
            <button
              className="flex items-center justify-center text-gray-700 bg-white rounded-full shadow-md w-9 h-9 hover:bg-gray-100"
              onClick={handleAddWishlist}
              aria-label="Add to wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="mb-1 text-base font-medium text-gray-800 line-clamp-1">{product.name}</h3>
          <div className="flex items-center">
            <span className="text-lg font-semibold text-gray-900">
              {convertedPrice.toLocaleString(language, {
                style: "currency",
                currency: currency,
              })}
            </span>
          </div>
        </div>

        <div className="p-4 pt-0">
          <button
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600"
            onClick={handleAddToCartClick}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default NewArrival;