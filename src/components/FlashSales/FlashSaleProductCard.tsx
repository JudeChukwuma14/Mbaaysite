import { addItem } from "@/redux/slices/cartSlice";
import { initializeSession } from "@/redux/slices/sessionSlice";
import { addWishlistItem } from "@/redux/slices/wishlistSlice";
import { RootState } from "@/redux/store";
import { addToCart } from "@/utils/cartApi";
import { convertPrice, formatPrice, getCurrencySymbol } from "@/utils/currencyCoverter";
import { useEffect, useState } from "react";
import { FiHeart, FiEye, FiShoppingCart, FiClock } from "react-icons/fi";
import { IoFlash, IoTimeOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface FlashSaleProductCardProps {
  product: {
    _id: string;
    name: string;
    images: string[];
    poster?: string;
    price: number;
    originalPrice?: number;
    flashSalePrice?: number;
    flashSaleStatus?: string;
    inventory?: number;
    rating?: number;
    reviews?: number;
    flashSaleDiscount?: number;
    flashSaleStartDate?: string;
    flashSaleEndDate?: string;
  };
}

const FlashSaleProductCard: React.FC<FlashSaleProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const { currency } = useSelector((state: RootState) => state.settings);
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  const [isLoading, setIsLoading] = useState(false);
  const [convertedPrice, setConvertedPrice] = useState(product.flashSalePrice || product.price);
  const [isHovered, setIsHovered] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const stock = product.inventory ?? 0;
  const isOutOfStock = stock <= 0;
  const isFlashSaleActive = product.flashSaleStatus === "Active";
  const currentPrice = isFlashSaleActive && product.flashSalePrice 
    ? product.flashSalePrice 
    : product.price;
  const discount = product.flashSaleDiscount 
    ? product.flashSaleDiscount 
    : product.originalPrice 
      ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
      : 0;

  // Calculate time left for flash sale
  useEffect(() => {
    if (product.flashSaleEndDate) {
      const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const endTime = new Date(product.flashSaleEndDate!).getTime();
        const difference = endTime - now;

        if (difference <= 0) return "Ended";

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
      };

      setTimeLeft(calculateTimeLeft());
      
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [product.flashSaleEndDate]);

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
        const converted = await convertPrice(currentPrice, "NGN", currency);
        setConvertedPrice(converted);
      } catch (error) {
        console.error("Failed to convert price:", error);
        setConvertedPrice(currentPrice);
      } finally {
        setIsLoading(false);
      }
    };
    convert();
  }, [currentPrice, currency]);

  const handleAddToCartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.warning("This product is out of stock");
      return;
    }

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
          price: currentPrice,
          image: product.images[0] || product.poster || "/placeholder.svg",
          inventory: product.inventory,
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
        price: currentPrice,
        quantity: 1,
        image: product.images[0] || product.poster || "/placeholder.svg",
      })
    );
    toast.success(`${product.name} added to your wishlist!`);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement quick view modal here
    toast.info("Quick view feature coming soon!");
  };

  const currencySymbol = getCurrencySymbol(currency);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
   <Link to={`/flash-sale/${product._id}`} className="flash-sale-product-card">
     <div 
      className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Flash Sale Badge */}
      {isFlashSaleActive && (
        <div className="absolute top-3 left-3 z-20">
          <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full shadow-lg text-xs">
            <IoFlash className="text-xs" />
            <span className="font-bold whitespace-nowrap">FLASH SALE</span>
          </div>
        </div>
      )}

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 right-3 z-20 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          -{discount}%
        </div>
      )}

      {/* Image Section - Fixed height */}
      <div className="relative overflow-hidden bg-gray-50 w-full pt-[100%]"> {/* 1:1 Aspect Ratio */}
        <div className="absolute inset-0">
          <img 
            src={product.images[0] || product.poster || "/placeholder.svg"} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Stock Status Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
              <span className="bg-white/90 text-red-600 font-bold px-4 py-2 rounded-lg text-sm">
                OUT OF STOCK
              </span>
            </div>
          )}

          {/* Hover Overlay with Actions */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''} flex items-end justify-center p-3`}>
            <button
              onClick={handleAddToCartClick}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-md font-semibold transition-all duration-300 ${
                isOutOfStock 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-orange-500 hover:bg-orange-600 transform hover:scale-[1.02] active:scale-[0.98]'
              } text-white shadow-lg text-sm`}
            >
              <FiShoppingCart className="text-sm" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
            <button 
              onClick={handleAddWishlist}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
            >
              <FiHeart className="text-gray-700 text-sm" />
            </button>
            <button 
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
            >
              <FiEye className="text-gray-700 text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info - Fixed height section */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        
        {/* Flash Sale Timer */}
        {timeLeft && product.flashSaleEndDate && (
          <div className="flex items-center gap-1.5 mb-2 text-xs text-red-600 font-medium">
            <IoTimeOutline className="text-sm" />
            <span className="flex items-center gap-1">
              <span>Ends in:</span>
              <span className="font-bold">{timeLeft}</span>
            </span>
          </div>
        )}

        {/* Rating */}
        {(product.rating || product.reviews) && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-amber-400 text-sm">
              {"★".repeat(Math.floor(product.rating || 0))}
              {"☆".repeat(5 - Math.floor(product.rating || 0))}
            </div>
            {product.reviews && (
              <span className="text-xs text-gray-500">
                ({product.reviews})
              </span>
            )}
          </div>
        )}

        {/* Pricing - Now with flex-grow to push dates to bottom */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline">
              {isLoading ? (
                <div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <>
                  <span className="text-base font-bold text-gray-900">
                    {currencySymbol}{formatPrice(convertedPrice)}
                  </span>
                  {product.originalPrice && product.originalPrice > currentPrice && (
                    <span className="ml-2 text-xs text-gray-500 line-through">
                      {currencySymbol}{formatPrice(product.originalPrice)}
                    </span>
                  )}
                </>
              )}
            </div>
            
            {/* Stock Indicator */}
            {!isOutOfStock && stock > 0 && stock < 10 && (
              <span className="text-xs text-orange-600 font-semibold px-1.5 py-0.5 bg-orange-50 rounded">
                {stock} left
              </span>
            )}
          </div>

          {/* Flash Sale Dates */}
          {(product.flashSaleStartDate || product.flashSaleEndDate) && (
            <div className="pt-2 border-t border-gray-100 mt-2">
              <div className="flex flex-col gap-1 text-xs text-gray-500">
                {product.flashSaleStartDate && (
                  <div className="flex items-center gap-1">
                    <FiClock className="text-xs" />
                    <span>Starts: {formatDate(product.flashSaleStartDate)}</span>
                  </div>
                )}
                {product.flashSaleEndDate && (
                  <div className="flex items-center gap-1">
                    <FiClock className="text-xs" />
                    <span>Ends: {formatDate(product.flashSaleEndDate)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
   </Link>
  );
};

export default FlashSaleProductCard;