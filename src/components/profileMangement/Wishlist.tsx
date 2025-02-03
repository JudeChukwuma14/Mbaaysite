import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { removeWishlistItem } from "@/redux/slices/wishlistSlice";
import { FaTrash } from "react-icons/fa";

const Wishlist: React.FC = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  return (
    <div className="max-w-4xl p-10 my-6">
      <h1 className="text-2xl font-bold mb-4">Wishlist ({wishlistItems.length})</h1>
      
      {wishlistItems.length === 0 ? (
        <p className="text-gray-500 text-3xl">Your wishlist is empty.</p>
      ) : (
        <div className="space-y-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-28 h-28 object-cover" />
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-500">
                    ${item.price}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="bg-orange-500 text-white py-2 px-4 hover:bg-orange-400 transition duration-300">
                  Add To Cart
                </button>
                <button onClick={() => dispatch(removeWishlistItem(item.id))} className="text-red-500 hover:text-red-700">
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
