import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { addItem } from "@/redux/slices/cartSlice";
import { addWishlistItem } from "@/redux/slices/wishlistSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { convertPrice, getCurrencySymbol } from "@/utils/currencyCoverter";
import { addToCart } from "@/utils/cartApi";
import { initializeSession } from "@/redux/slices/sessionSlice";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  images: string[];
  poster: string;
}

interface BestSellingCardProps {
  product: Product;
}

const BestSellingCard: React.FC<BestSellingCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const { currency } = useSelector((state: RootState) => state.settings);
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  const [isLoading, setIsLoading] = useState(false);
  const [convertedPrice, setConvertedPrice] = useState(product.price);

  // Ensure sessionId is initialized
  useEffect(() => {
    if (!sessionId) {
      dispatch(initializeSession());
    }
  }, [dispatch, sessionId]);

  // Convert price when currency changes
  useEffect(() => {
    const convert = async () => {
      setIsLoading(true);
      try {
        const price = await convertPrice(product.price, "NGN", currency);
        setConvertedPrice(price);
      } catch (error) {
        console.error("Failed to convert price:", error);
        setConvertedPrice(product.price); // Fallback to base price
      } finally {
        setIsLoading(false);
      }
    };
    convert();
  }, [product.price, currency]);

  const handleAddToCartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!sessionId) {
      toast.error("Session not initialized. Please try again.");
      return;
    }

    try {
      await addToCart(sessionId, product._id, 1);
      dispatch(
        addItem({
          id: product._id,
          name: product.name,
          price: product.price, // Store base price (NGN) in cart
          quantity: 1,
          image: product.images[0] || product.poster || "/placeholder.svg",
        })
      );
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error((error as Error)?.message || "Failed to add item to cart", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleAddWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addWishlistItem({
        id: product._id,
        name: product.name,
        price: product.price, // Store base price (NGN) in wishlist
        quantity: 1,
        image: product.images[0] || product.poster,
      })
    );
    toast.success(`${product.name} added to your wishlist!`);
  };

  const currencySymbol = getCurrencySymbol(currency);

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
            {isLoading ? (
              <span className="text-sm font-semibold text-gray-900">Loading...</span>
            ) : (
              <span className="text-sm font-semibold text-gray-900">
                {currencySymbol}{convertedPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 pt-0">
          <button
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-all duration-300 bg-orange-500 border border-orange-300 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600"
            onClick={handleAddToCartClick}
            disabled={isLoading || !sessionId}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default BestSellingCard;