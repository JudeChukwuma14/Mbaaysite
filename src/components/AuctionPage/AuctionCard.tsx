import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { addItem } from "@/redux/slices/cartSlice";
import { addWishlistItem } from "@/redux/slices/wishlistSlice";
import { initializeSession } from "@/redux/slices/sessionSlice";
import { Heart, ShoppingCart, Gavel, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "@/utils/cartApi";
import {
  convertPrice,
  formatPrice,
  getCurrencySymbol,
} from "@/utils/currencyCoverter";

interface AuctionCardProps {
  id: string;
  image: string;
  title: string;
  currentBid: number;
  lotNumber: string;
  seller: string;
  sellerImage: string;
  endTime: string;
  category?: string;
  isWatched?: boolean;
  isPremium?: boolean;
}

const AuctionCard: React.FC<AuctionCardProps> = ({
  id,
  image,
  title,
  currentBid,
  lotNumber,
  seller,
  sellerImage,
  endTime,
  category = "Art",
  isWatched = false,
  isPremium = false,
}) => {
  const dispatch = useDispatch();
  const { currency } = useSelector((state: RootState) => state.settings);
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endTime));
  const [watched, setWatched] = useState(isWatched);
  const [isLoading, setIsLoading] = useState(false);
  const [convertedPrice, setConvertedPrice] = useState(currentBid);

  // Ensure sessionId is initialized
  useEffect(() => {
    if (!sessionId) {
      dispatch(initializeSession());
    }
  }, [dispatch, sessionId]);

  // Convert price when currency or currentBid changes
  useEffect(() => {
    const convert = async () => {
      setIsLoading(true);
      try {
        const price = await convertPrice(currentBid, "NGN", currency);
        setConvertedPrice(price);
      } catch (error) {
        console.error("Failed to convert price:", error);
        setConvertedPrice(currentBid); // Fallback to base price
      } finally {
        setIsLoading(false);
      }
    };
    convert();
  }, [currentBid, currency]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(endTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  function getTimeLeft(endTime: string) {
    const diff = new Date(endTime).getTime() - new Date().getTime();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  const isEnded =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  // Truncate category name if longer than 15 characters
  const truncatedCategory =
    category.length > 15 ? `${category.slice(0, 12)}...` : category;

  const handleAddToCartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!sessionId) {
      toast.error("Session not initialized. Please try again.");
      return;
    }

    try {
      await addToCart(sessionId, id, 1);
      dispatch(
        addItem({
          id,
          name: title,
          price: currentBid, // Store base price (NGN) in cart
          quantity: 1,
          image: image || "/placeholder.svg",
        })
      );
      toast.success(`${title} added to cart!`);
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

    setWatched(!watched);
    if (!watched) {
      dispatch(
        addWishlistItem({
          id,
          name: title,
          price: currentBid, // Store base price (NGN) in wishlist
          quantity: 1,
          image: image || "/placeholder.svg",
        })
      );
      toast.success(`${title} added to your wishlist!`);
    }
  };

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <Link to={`/auction/${id}`}>
      <div
        className={`group relative overflow-hidden rounded-xl border bg-card shadow-card-auction transition-all duration-300 hover:shadow-auction hover:scale-[1.02] ${
          isPremium ? "ring-2 ring-auction-premium shadow-premium" : ""
        }`}
      >
        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute top-0 left-0 z-10 bg-gradient-gold px-3 py-1 text-xs font-semibold text-primary rounded-br-xl">
            PREMIUM
          </div>
        )}

        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Status Badge */}
          <Badge
            variant={isEnded ? "destructive" : "default"}
            className={`absolute top-3 ${isPremium ? "left-20" : "left-3"} ${
              isEnded
                ? "bg-auction-ended border-auction-ended text-white"
                : "bg-auction-live border-auction-live text-white"
            }`}
          >
            <Gavel className="mr-1 h-3 w-3" />
            {isEnded ? "Ended" : "Live"}
          </Badge>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
            <Button
              size="sm"
              variant="secondary"
              className="h-9 w-9 rounded-full p-0 bg-white/95 hover:bg-white backdrop-blur-sm shadow-md hover:shadow-lg"
              onClick={handleAddWishlist}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  watched
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground hover:text-red-500"
                }`}
              />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-9 w-9 rounded-full p-0 bg-white/95 hover:bg-white backdrop-blur-sm shadow-md hover:shadow-lg"
              onClick={handleAddToCartClick}
            >
              <ShoppingCart className="h-4 w-4 text-muted-foreground hover:text-primary" />
            </Button>
          </div>

          {/* Countdown Timer */}
          {!isEnded && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-xl bg-white/95 px-4 py-2 text-xs font-medium backdrop-blur-sm shadow-md">
              <Clock className="h-3 w-3 text-muted-foreground mr-1" />
              <div className="flex items-center gap-1">
                <div className="text-center">
                  <div className="font-bold text-sm">
                    {timeLeft.days.toString().padStart(2, "0")}
                  </div>
                  <div className="text-[10px] text-muted-foreground -mt-1">
                    d
                  </div>
                </div>
                <span className="mx-1 text-muted-foreground">:</span>
                <div className="text-center">
                  <div className="font-bold text-sm">
                    {timeLeft.hours.toString().padStart(2, "0")}
                  </div>
                  <div className="text-[10px] text-muted-foreground -mt-1">
                    h
                  </div>
                </div>
                <span className="mx-1 text-muted-foreground">:</span>
                <div className="text-center">
                  <div className="font-bold text-sm">
                    {timeLeft.minutes.toString().padStart(2, "0")}
                  </div>
                  <div className="text-[10px] text-muted-foreground -mt-1">
                    m
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          <div className="mb-3 flex items-start justify-between">
            <h3 className="font-semibold leading-tight text-card-foreground line-clamp-2 text-lg">
              {title}
            </h3>
            <Badge
              variant="outline"
              className="ml-3 shrink-0 text-xs font-medium"
            >
              #{lotNumber}
            </Badge>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Current Bid</p>
              {isLoading ? (
                <span className="text-2xl font-bold">Loading...</span>
              ) : (
                <p className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {currencySymbol} {formatPrice(convertedPrice)}
                </p>
              )}
            </div>
            <Badge
              variant="secondary"
              className="bg-accent text-accent-foreground font-medium"
            >
              {truncatedCategory}
            </Badge>
          </div>

          <hr className="mb-4 border-border" />

          {/* Seller Info & Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 ring-2 ring-border">
                <AvatarImage
                  src={sellerImage || "/placeholder.svg"}
                  alt={seller}
                />
                <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                  {seller.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="text-sm font-medium text-card-foreground block">
                  {seller}
                </span>
                <span className="text-xs text-muted-foreground">Seller</span>
              </div>
            </div>

            <Button
              className={`${
                isPremium
                  ? "bg-gradient-gold hover:opacity-90 text-primary font-semibold shadow-md"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              } transition-all duration-200`}
              disabled={isEnded}
            >
              {isEnded ? "View Results" : "Place Bid"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;
