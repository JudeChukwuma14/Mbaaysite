import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { addItem } from "@/redux/slices/cartSlice";
import { addWishlistItem } from "@/redux/slices/wishlistSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { convertPrice, formatPrice, getCurrencySymbol } from "@/utils/currencyCoverter";
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
  inventory: number; // Add inventory field
}

interface NewArrivalProps {
  product: Product;
}

const NewArrival: React.FC<NewArrivalProps> = ({ product }) => {
  const dispatch = useDispatch();
  const { currency } = useSelector((state: RootState) => state.settings);
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  const [isLoading, setIsLoading] = useState(false);
  const [convertedPrice, setConvertedPrice] = useState(product.price);

  // Calculate available quantity (inventory - what's already in cart)
  const cartQuantity = cartItems.find(item => item.id === product._id)?.quantity || 0;
  const availableQuantity = Math.max(0, product.inventory - cartQuantity);
  const isOutOfStock = availableQuantity === 0;

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
        setConvertedPrice(product.price);
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

    if (isOutOfStock) {
      toast.error("This product is out of stock!");
      return;
    }

    // Additional check to prevent adding more than available
    if (cartQuantity >= product.inventory) {
      toast.error(`Only ${product.inventory} items available!`);
      return;
    }

    try {
      await addToCart(sessionId, product._id, 1);
      dispatch(
        addItem({
          id: product._id,
          name: product.name,
          price: product.price,
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
        price: product.price,
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
          {/* Show out of stock badge */}
          {isOutOfStock && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              Out of Stock
            </div>
          )}
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
          <div className="flex items-center justify-between">
            {isLoading ? (
              <span className="text-sm font-semibold text-gray-900">Loading...</span>
            ) : (
              <span className="text-sm font-semibold text-gray-900">
                {currencySymbol} {formatPrice(convertedPrice)}
              </span>
            )}
            {/* Show remaining quantity if low stock */}
            {/* {product.inventory > 0 && availableQuantity < 10 && (
              <span className={`text-xs ${availableQuantity < 3 ? 'text-red-500' : 'text-orange-500'}`}>
                {availableQuantity} left
              </span>
            )} */}
          </div>
        </div>

        <div className="p-4 pt-0">
          <button
            className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600 ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            onClick={handleAddToCartClick}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default NewArrival;