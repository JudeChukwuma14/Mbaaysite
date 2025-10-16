"use client";

import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { removeWishlistItem } from "@/redux/slices/wishlistSlice";
import { addItem } from "@/redux/slices/cartSlice";
import { FaTrash, FaShoppingCart, FaHeart, FaRegSadTear } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { addToCart } from "@/utils/cartApi";
import { useEffect, useState } from "react";
import {
  convertPrice,
  formatPrice,
  getCurrencySymbol,
} from "@/utils/currencyCoverter";
import { initializeSession } from "@/redux/slices/sessionSlice";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

const Wishlist: React.FC = () => {
  const dispatch = useDispatch();
  const { currency } = useSelector((state: RootState) => state.settings);
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [convertedPrices, setConvertedPrices] = useState<{ [key: string]: number }>({});

  // Ensure sessionId is initialized
  useEffect(() => {
    if (!sessionId) {
      dispatch(initializeSession());
    }
  }, [dispatch, sessionId]);

  // Convert prices when currency changes
  useEffect(() => {
    const convertAllPrices = async () => {
      const newPrices: { [key: string]: number } = {};
      
      for (const item of wishlistItems) {
        setIsLoading(prev => ({ ...prev, [item.id]: true }));
        try {
          const price = await convertPrice(item.price, "NGN", currency);
          newPrices[item.id] = price;
        } catch (error) {
          console.error(`Failed to convert price for ${item.name}:`, error);
          newPrices[item.id] = item.price; // Fallback to base price
        } finally {
          setIsLoading(prev => ({ ...prev, [item.id]: false }));
        }
      }
      
      setConvertedPrices(newPrices);
    };

    if (wishlistItems.length > 0) {
      convertAllPrices();
    }
  }, [wishlistItems, currency]);

  const handleAddToCartClick = async (e: React.MouseEvent, item: WishlistItem) => {
    e.preventDefault();
    e.stopPropagation();

    if (!sessionId) {
      toast.error("Session not initialized. Please try again.");
      return;
    }

    try {
      await addToCart(sessionId, item.id, 1);
      dispatch(
        addItem({
          id: item.id,
          name: item.name,
          price: item.price, // Store base price (NGN) in cart
          quantity: 1,
          image: item.image || "/placeholder.svg",
        })
      );
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      toast.error((error as Error)?.message || "Failed to add item to cart", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleRemoveFromWishlist = (id: string, name: string) => {
    dispatch(removeWishlistItem(id));
    toast.info(`${name} removed from wishlist`);
  };


  

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto">
      <div className="p-6 bg-white shadow-md rounded-xl md:p-8">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b">
          <FaHeart className="text-2xl text-red-500" />
          <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
          <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "item" : "items"}
          </span>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FaRegSadTear className="mb-4 text-5xl text-gray-300" />
            <h2 className="mb-2 text-2xl font-semibold text-gray-400">
              Your wishlist is empty
            </h2>
            <p className="max-w-md mb-6 text-gray-500">
              Items added to your wishlist will appear here. Start browsing and
              add your favorite products!
            </p>
            <a
              href="/random-product"
              className="flex items-center gap-2 px-6 py-2 font-medium text-white transition duration-300 bg-orange-500 rounded-lg hover:bg-orange-600"
            >
              <FaShoppingCart />
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col items-start gap-6 p-4 transition-shadow duration-300 border border-gray-100 rounded-lg sm:flex-row sm:items-center hover:shadow-md"
              >
                <div className="relative flex-shrink-0 w-32 h-32 overflow-hidden rounded-md group bg-gray-50">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="flex-grow">
                  <h2 className="mb-1 text-lg font-semibold text-gray-800 line-clamp-2">
                    {item.name}
                  </h2>
                  <div className="flex items-center gap-2 mb-2">
                    {isLoading[item.id] ? (
                      <span className="text-sm font-semibold text-gray-900">
                        Loading...
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-gray-900">
                        {currencySymbol} {formatPrice(convertedPrices[item.id] || item.price)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={(e) => handleAddToCartClick(e, item)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition duration-300 bg-orange-500 rounded-md hover:bg-orange-600"
                    >
                      <FaShoppingCart size={14} />
                      Add To Cart
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 transition duration-300 border border-red-200 rounded-md hover:bg-red-50"
                    >
                      <FaTrash size={14} />
                      Remove
                    </button>
                  </div>
                </div>

                {item.quantity && item.quantity > 1 && (
                  <div className="self-start px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full sm:self-center">
                    Qty: {item.quantity}
                  </div>
                )}
              </motion.div>
            ))}

            <div className="flex items-center justify-between pt-6 mt-8 border-t">
              <a
                href="/random-product"
                className="flex items-center gap-2 font-medium text-orange-500 transition duration-300 hover:text-orange-600"
              >
                <FaShoppingCart size={14} />
                Continue Shopping
              </a>
             
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;