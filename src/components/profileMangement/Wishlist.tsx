"use client";

import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { removeWishlistItem } from "@/redux/slices/wishlistSlice";
import { addItem } from "@/redux/slices/cartSlice";
import { FaTrash, FaShoppingCart, FaHeart, FaRegSadTear } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Wishlist: React.FC = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const handleAddToCart = (item: any) => {
    dispatch(addItem(item));
    toast.success(`${item.name} added to cart!`);
  };

  const handleRemoveFromWishlist = (id: string, name: string) => {
    dispatch(removeWishlistItem(id));
    toast.info(`${name} removed from wishlist`);
  };

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
              href="/shop"
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
                    src={item.image || "/placeholder.svg?height=128&width=128"}
                    alt={item.name}
                    className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="flex-grow">
                  <h2 className="mb-1 text-lg font-semibold text-gray-800 line-clamp-2">
                    {item.name}
                  </h2>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-orange-500">
                      ${item.price.toLocaleString()}
                    </span>

                  </div>
             
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition duration-300 bg-orange-500 rounded-md hover:bg-orange-600"
                    >
                      <FaShoppingCart size={14} />
                      Add To Cart
                    </button>
                    <button
                      onClick={() =>
                        handleRemoveFromWishlist(item.id, item.name)
                      }
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 transition duration-300 border border-red-200 rounded-md hover:bg-red-50"
                    >
                      <FaTrash size={14} />
                      Remove
                    </button>
                  </div>
                </div>

                {item.quantity > 1 && (
                  <div className="self-start px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full sm:self-center">
                    Qty: {item.quantity}
                  </div>
                )}
              </motion.div>
            ))}

            <div className="flex items-center justify-between pt-6 mt-8 border-t">
              <a
                href="/shop"
                className="flex items-center gap-2 font-medium text-orange-500 transition duration-300 hover:text-orange-600"
              >
                <FaShoppingCart size={14} />
                Continue Shopping
              </a>
              <button
                onClick={() => {
                  wishlistItems.forEach((item) =>
                    dispatch(removeWishlistItem(item.id))
                  );
                  toast.info("All items removed from wishlist");
                }}
                className="flex items-center gap-2 font-medium text-gray-500 transition duration-300 hover:text-red-500"
              >
                <FaTrash size={14} />
                Clear Wishlist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
