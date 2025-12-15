import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { addItem } from "@/redux/slices/cartSlice";
import { addWishlistItem } from "@/redux/slices/wishlistSlice";
import { toast } from "react-toastify";
import { getProductsById } from "@/utils/productApi";
import { startChat, sendMessage } from "@/utils/UserChat";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Star,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  User,
  AlertCircle,
  CheckCircle,
  ThumbsUp,
  Lock,
  Zap,
  Clock,
  TrendingDown,
  Shield,
  Truck,
  RefreshCw,
  Share2,
  AlertTriangle,
  StarHalf,
} from "lucide-react";
import Spinner from "@/components/Common/Spinner";
import {
  convertPrice,
  formatPrice,
  getCurrencySymbol,
} from "@/utils/currencyCoverter";
import { addToCart } from "@/utils/cartApi";
import { initializeSession } from "@/redux/slices/sessionSlice";
import { get_single_vendor } from "@/utils/vendorApi";
import { getProductReviews, Review } from "@/utils/reviewApi";
import { Button } from "@/components/ui/button";

interface Product {
  _id: string;
  name: string;
  poster: {
    _id: string;
    storeName: string;
    avatar?: string;
  } | null;
  description: string;
  price: number;
  originalPrice?: number;
  flashSalePrice?: number;
  flashSaleStatus?: string;
  flashSaleDiscount?: number;
  flashSaleStartDate?: string;
  flashSaleEndDate?: string;
  inventory: number;
  images: string[];
  category: string;
  sub_category: string;
  sub_category2: string;
  product_video: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  upload_type?: string;
  vendorId?: string;
}

interface Vendor {
  _id: string;
  storeName: string;
  avatar?: string;
}

const FlashSaleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "flash-info">("description");
  const [convertedPrice, setConvertedPrice] = useState(0);
  const [convertedOriginalPrice, setConvertedOriginalPrice] = useState(0);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isFlashSaleActive, setIsFlashSaleActive] = useState(false);
  const [soldCount, setSoldCount] = useState(0);
  const [soldPercentage, setSoldPercentage] = useState(0);
  const [reviewSortBy, setReviewSortBy] = useState<
    "newest" | "highest" | "lowest"
  >("newest");
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    verifiedReviewsCount: 0,
  });

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const dispatch = useDispatch();
  const currency = useSelector(
    (state: RootState) => state.settings.currency || "NGN"
  );
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  const vendorState = useSelector((state: RootState) => state.vendor);
  const user = useSelector((state: RootState) => state.user.user);

  // Calculate countdown timer
  useEffect(() => {
    if (!product?.flashSaleEndDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(product.flashSaleEndDate as string).getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        setIsFlashSaleActive(false);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      setIsFlashSaleActive(true);
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    countdownRef.current = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [product?.flashSaleEndDate]);

  // Calculate sold percentage (for progress bar)
  useEffect(() => {
    if (!product?.inventory) return;
    
    // In real app, you would fetch this from API
    const maxStock = product.inventory + 20; // Mock initial stock
    const sold = Math.min(maxStock - product.inventory, maxStock);
    const percentage = Math.min(Math.round((sold / maxStock) * 100), 100);
    
    setSoldCount(sold);
    setSoldPercentage(percentage);
  }, [product?.inventory]);

  // Fetch product reviews
  useEffect(() => {
    if (product?._id) {
      fetchProductReviews();
    }
  }, [product?._id, reviewSortBy]);

  const fetchProductReviews = async () => {
    if (!product?._id) return;

    setReviewsLoading(true);
    setReviewsError(null);
    try {
      const response = await getProductReviews(product._id);

      if (response && response.success !== false) {
        setReviews(response.reviews || []);
        setReviewStats(
          response.stats || {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            verifiedReviewsCount: 0,
          }
        );

        // Sort reviews
        sortReviews(response.reviews || [], reviewSortBy);
      } else {
        throw new Error(response?.message || "Invalid response from server");
      }
    } catch (error: any) {
      console.error("Error fetching reviews:", error);

      if (error.message.includes("Network error")) {
        setReviewsError(
          "Unable to connect to server. Please check your internet connection."
        );
      } else if (error.message.includes("No reviews found")) {
        setReviews([]);
        setReviewStats({
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          verifiedReviewsCount: 0,
        });
      } else {
        setReviewsError(error.message || "Failed to load reviews");
      }
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const sortReviews = (
    reviewsToSort: Review[],
    sortBy: "newest" | "highest" | "lowest"
  ) => {
    let sorted = [...reviewsToSort];

    switch (sortBy) {
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "highest":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        sorted.sort((a, b) => a.rating - b.rating);
        break;
    }

    setReviews(sorted);
  };

  const handleReviewSortChange = (sortBy: "newest" | "highest" | "lowest") => {
    setReviewSortBy(sortBy);
  };

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
  };

  const toggleAllReviewsExpansion = () => {
    if (expandedReviews.length === reviews.length) {
      setExpandedReviews([]);
    } else {
      setExpandedReviews(reviews.map((r) => r._id));
    }
  };

  const getRatingPercentage = (rating: number) => {
    if (reviewStats.totalReviews === 0) return 0;
    const count = reviewStats.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5];
    return Math.round((count / reviewStats.totalReviews) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render star rating
  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`}
          />
        ))}
        {hasHalfStar && (
          <StarHalf className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${sizeClasses[size]} text-gray-300`}
          />
        ))}
      </div>
    );
  };

  // Initialize sessionId if missing
  useEffect(() => {
    if (!sessionId) {
      const initialize = async () => {
        setIsSessionLoading(true);
        try {
          await dispatch(initializeSession());
        } catch (error) {
          console.error("Session initialization failed:", error);
          toast.error("Failed to initialize session. Please try again.");
        } finally {
          setIsSessionLoading(false);
        }
      };
      initialize();
    }
  }, [dispatch, sessionId]);

  // Fetch product and vendor
  useEffect(() => {
    const fetchProductAndVendor = async () => {
      setLoading(true);
      try {
        if (!id) throw new Error("Product ID is undefined");
        const data = await getProductsById(id);
        
        if (!data.product || !data.product._id)
          throw new Error("Product not found");
        setProduct(data.product);
        setSelectedMedia(
          data.product.images[0] || "/placeholder.svg"
        );

        // Set vendor from poster or vendorId
        let vendorData: Vendor | null = null;
        if (
          data.product.poster &&
          data.product.poster._id &&
          data.product.poster.storeName
        ) {
          vendorData = {
            _id: data.product.poster._id,
            storeName: data.product.poster.storeName,
            avatar: data.product.poster.avatar,
          };
        } else if (data.product.vendorId) {
          vendorData =
            vendorState?.vendor?._id === data.product.vendorId
              ? vendorState.vendor
              : await get_single_vendor(data.product.vendorId);
          if (!vendorData || !vendorData._id) {
            throw new Error(
              "Vendor data not found for vendorId: " + data.product.vendorId
            );
          }
        } else {
          setError("Vendor information unavailable for this product.");
        }
        setVendor(vendorData);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(
          err.message || "Failed to load product or vendor. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndVendor();
  }, [id, vendorState]);

  // Convert prices when product or currency changes
  useEffect(() => {
    if (!product) return;
    const convertPrices = async () => {
      setIsPriceLoading(true);
      try {
        // Convert current price (flash sale or regular)
        const currentPrice = product.flashSalePrice || product.price;
        const price = await convertPrice(currentPrice, "NGN", currency);
        setConvertedPrice(price);
        
        // Convert original price if exists
        if (product.originalPrice && product.originalPrice > currentPrice) {
          const original = await convertPrice(product.originalPrice, "NGN", currency);
          setConvertedOriginalPrice(original);
        }
      } catch (error) {
        console.error("Failed to convert price:", error);
        setConvertedPrice(product.flashSalePrice || product.price);
        setConvertedOriginalPrice(product.originalPrice || 0);
      } finally {
        setIsPriceLoading(false);
      }
    };
    convertPrices();
  }, [product, currency]);

  // Handle Start Chat
  const handleStartChat = async () => {
    if (!user?._id) {
      toast.error("Please log in to start a chat.");
      navigate("/login");
      return;
    }
    if (!vendor) {
      toast.error("Vendor information unavailable for this product.");
      return;
    }
    if (!product) {
      toast.error("Product information is missing.");
      return;
    }
    try {
      const newChat = await startChat(vendor._id);
      if (!newChat?.success || !newChat?.chat?._id) {
        throw new Error("Failed to start chat");
      }

      // Send initial message about the product
      const initialMessage = `Hi, I'm interested in ${product.name}`;
      const messageResponse = await sendMessage(
        newChat.chat._id,
        initialMessage
      );
      if (!messageResponse?.success) {
        throw new Error("Failed to send initial message");
      }

      // Navigate to chat interface with chatId and vendorDetails
      navigate("/dashboard/messages", {
        state: {
          chatId: newChat.chat._id,
          vendorDetails: {
            storeName: vendor.storeName,
            avatar: vendor.avatar,
          },
        },
      });
    } catch (error: any) {
      console.error("Start chat error:", error);
      toast.error(error.message || "Failed to start chat. Please try again.");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !isZoomed) return;

    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    if (!product) return 0;
    if (product.flashSaleDiscount) return product.flashSaleDiscount;
    
    if (product.originalPrice && product.flashSalePrice) {
      const discount = ((product.originalPrice - product.flashSalePrice) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    
    if (product.originalPrice && product.price) {
      const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    
    return 0;
  };

  // Share product function
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out this amazing deal on ${product?.name}!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || 'Flash Sale Product',
          text: shareText,
          url: shareUrl,
        });
        toast.success('Shared successfully!');
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success('Link copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy link');
      });
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    if (!sessionId || isSessionLoading) {
      toast.error("Session not initialized. Please try again.");
      return;
    }
    
    try {
      await addToCart(sessionId, product!._id, quantity);
      dispatch(
        addItem({
          id: product!._id,
          name: product!.name,
          price: product!.flashSalePrice || product!.price,
          inventory: product!.inventory,
          image: product!.images[0] || "/placeholder.svg",
        })
      );
      toast.success(`Added ${product!.name} to cart!`);
      
      // Navigate to checkout
      setTimeout(() => {
        navigate('/checkout');
      }, 500);
    } catch (error) {
      toast.error((error as Error)?.message || String(error), {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  if (loading || isSessionLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
        <p className="text-lg text-red-500">{error}</p>
        <Link
          to="/flash-sale"
          className="px-4 py-2 mt-4 transition-colors bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          Back to Flash Sales
        </Link>
      </div>
    );

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 mb-4 text-gray-500" />
        <p className="text-lg text-gray-500">Product not found</p>
        <Link
          to="/flash-sale"
          className="px-4 py-2 mt-4 transition-colors bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          Back to Flash Sales
        </Link>
      </div>
    );

  const handleAddToCart = async () => {
    if (!sessionId || isSessionLoading) {
      toast.error("Session not initialized. Please try again.");
      return;
    }
    try {
      await addToCart(sessionId, product._id, quantity);
      dispatch(
        addItem({
          id: product._id,
          name: product.name,
          price: product.flashSalePrice || product.price,
          inventory: product.inventory,
          image: product.images[0] || "/placeholder.svg",
        })
      );
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error((error as Error)?.message || String(error), {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleAddToWishlist = () => {
    dispatch(
      addWishlistItem({
        id: product._id,
        name: product.name,
        price: product.flashSalePrice || product.price,
        quantity: 1,
        image: product.images[0] || "/placeholder.svg",
      })
    );
    toast.success(`${product.name} added to your wishlist!`);
  };

  const getYouTubeVideoId = (url: string) => {
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const mediaItems = [
    ...product.images,
    ...(product.product_video && getYouTubeVideoId(product.product_video)
      ? [product.product_video]
      : []),
  ];

  // Removed unused handler: handleUpdateQuantity
  // If updating cart quantities from this page is needed later, reintroduce
  // the function and wire it to the relevant cart UI/actions.

  const isVideo = selectedMedia?.includes("youtube.com");
  const isInStock = product.inventory > 0;
  const currencySymbol = getCurrencySymbol(currency);
  const discountPercentage = getDiscountPercentage();
  const isFlashSale = product.flashSaleStatus === "Active" || !!product.flashSalePrice;

  // Format time for countdown
  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center justify-center min-w-[60px]">
      <div className="text-2xl font-bold bg-gradient-to-b from-orange-600 to-red-600 text-white px-3 py-2 rounded-lg shadow-lg">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-xs text-gray-600 mt-1">{label}</span>
    </div>
  );

  // Render reviews list
  const renderReviewsList = () => {
    if (reviewsLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-orange-600 rounded-full animate-spin border-t-transparent" />
          <span className="ml-3 text-gray-600">Loading reviews...</span>
        </div>
      );
    }

    if (reviewsError) {
      return (
        <div className="py-12 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-600">{reviewsError}</p>
          <Button
            onClick={fetchProductReviews}
            className="px-4 py-2 mt-4 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
          >
            Try Again
          </Button>
        </div>
      );
    }

    if (reviews.length === 0) {
      return (
        <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <Star className="w-12 h-12 mx-auto text-gray-300" />
          <h4 className="mt-4 text-lg font-medium text-gray-900">
            No reviews yet
          </h4>
          <p className="mt-2 text-gray-600">
            Be the first verified buyer to review this product
          </p>
          <div className="mt-6 space-y-3">
            <p className="text-sm text-gray-500">
              Purchase this product and mark it as delivered to leave a review
            </p>
            <Button
              onClick={() => navigate("/")}
              className="px-6 py-3 font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-lg hover:from-orange-600 hover:to-red-600"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Expand/Collapse All Button */}
        {reviews.length > 3 && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllReviewsExpansion}
              className="text-sm"
            >
              {expandedReviews.length === reviews.length ? (
                <>
                  <ChevronRight className="w-4 h-4 mr-2 transform rotate-90" />
                  Collapse All Reviews
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4 mr-2 transform -rotate-90" />
                  Expand All Reviews
                </>
              )}
            </Button>
          </div>
        )}

        {reviews.map((review) => {
          const isExpanded =
            expandedReview === review._id ||
            expandedReviews.includes(review._id);
          const shouldShowReadMore = review.comment && review.comment.length > 200;

          return (
            <div
              key={review._id}
              className="p-6 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors"
            >
              {/* Review Header */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {review.reviewerName || "Anonymous"}
                        {review.verified && (
                          <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified Purchase
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating, 'sm')}
                        <span className="text-sm text-gray-500">
                          {review.createdAt ? formatDate(review.createdAt) : "Recently"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Helpful button */}
                <button
                  onClick={() => {
                    toast.info("Thanks for your feedback!");
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful ({review.helpful || 0})</span>
                </button>
              </div>

              {/* Review Title */}
              {review.title && (
                <h5 className="mt-4 text-lg font-medium text-gray-900">
                  {review.title}
                </h5>
              )}

              {/* Review Comment */}
              {review.comment && (
                <div className="mt-3">
                  <p
                    className={`text-gray-700 ${
                      !isExpanded && shouldShowReadMore ? "line-clamp-3" : ""
                    }`}
                  >
                    {review.comment}
                  </p>
                  {shouldShowReadMore && (
                    <button
                      onClick={() => toggleReviewExpansion(review._id)}
                      className="mt-2 text-sm font-medium text-orange-600 hover:text-orange-700"
                    >
                      {isExpanded ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>
              )}

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-3 mt-4">
                  {review.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        console.log("Open image:", image);
                      }}
                      className="flex-shrink-0 w-20 h-20 overflow-hidden border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
                    >
                      <img
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Vendor Reply */}
              {review.vendorReply?.isPublic && review.vendorReply.reply && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {vendor?.avatar ? (
                        <img
                          src={vendor.avatar}
                          alt={vendor.storeName}
                          className="w-8 h-8 rounded-full border border-blue-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full border border-blue-300">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-blue-900">
                          Response from {vendor?.storeName || "Vendor"}
                        </span>
                        {review.vendorReply.repliedAt && (
                          <span className="text-xs text-blue-700">
                            {formatDate(review.vendorReply.repliedAt)}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-blue-800">
                        {review.vendorReply.reply}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* Flash Sale Banner */}
      {isFlashSale && (
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
          <div className="container px-4 py-3 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">FLASH SALE ACTIVE</h2>
                  <p className="text-sm text-white/90">Limited time offer! Hurry before it ends.</p>
                </div>
              </div>
              
              {timeLeft && isFlashSaleActive && (
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Ends in:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TimeUnit value={timeLeft.days} label="Days" />
                    <span className="text-white text-xl font-bold">:</span>
                    <TimeUnit value={timeLeft.hours} label="Hours" />
                    <span className="text-white text-xl font-bold">:</span>
                    <TimeUnit value={timeLeft.minutes} label="Mins" />
                    <span className="text-white text-xl font-bold">:</span>
                    <TimeUnit value={timeLeft.seconds} label="Secs" />
                  </div>
                </div>
              )}
              
              {!isFlashSaleActive && (
                <div className="px-4 py-2 bg-white/20 rounded-full">
                  <span className="text-white font-bold">FLASH SALE ENDED</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Back to Flash Sales */}
        <div className="mb-6">
          <Link
            to="/flash-sale"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Flash Sales
          </Link>
        </div>

        <nav className="flex flex-wrap gap-2 mb-4 text-sm text-gray-500">
          <Link to="/" className="transition-colors hover:text-gray-900">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
          <Link to="/flash-sale" className="transition-colors hover:text-orange-600">
            Flash Sale
          </Link>
          <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
          <span className="font-medium text-gray-900 line-clamp-1">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-y-6 sm:gap-y-8 lg:grid-cols-2 lg:gap-x-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="overflow-hidden border-2 border-orange-200 rounded-xl aspect-square bg-gray-50 relative">
              {isFlashSale && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-lg">
                    <Zap className="text-sm" />
                    <span className="text-sm font-bold">FLASH SALE</span>
                  </div>
                </div>
              )}
              
              {isVideo ? (
                <div className="w-full h-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                      selectedMedia || ""
                    )}`}
                    title={`${product.name} Video`}
                    style={{ border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div
                  ref={imageContainerRef}
                  className="relative w-full h-full cursor-zoom-in lg:cursor-zoom-in"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={selectedMedia || "/placeholder.svg"}
                    alt={product.name}
                    className="object-contain w-full h-full transition-transform duration-200"
                    style={{
                      transform: isZoomed ? "scale(1.5)" : "scale(1)",
                      transformOrigin: isZoomed
                        ? `${mousePosition.x}% ${mousePosition.y}%`
                        : "center center",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
              {mediaItems.map((media, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMedia(media)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedMedia === media
                      ? "border-orange-500 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {media.includes("youtube.com") ? (
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeVideoId(
                        media
                      )}/0.jpg`}
                      alt={`${product.name} video thumbnail`}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <img
                      src={media || "/placeholder.svg"}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Flash Sale Progress Bar */}
            {isFlashSale && product.inventory > 0 && (
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Sold: {soldCount} items</span>
                  <span className="font-bold text-orange-600">{soldPercentage}% Sold</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${soldPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {product.inventory} items left at this price
                </p>
              </div>
            )}

            {/* Flash Sale Guarantee */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-1">Flash Sale Guarantee</h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Lowest price guaranteed during sale period</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span>Fast shipping on flash sale items</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      <span>30-day return policy applies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="flex flex-col min-w-0">
            {/* Vendor Information */}
            {vendor ? (
              <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                <Link
                  to={`/veiws-profile/${vendor._id}`}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    {vendor.avatar ? (
                      <img
                        src={vendor.avatar}
                        alt={`${vendor.storeName} logo`}
                        className="object-cover w-12 h-12 border-2 border-white rounded-full shadow-sm group-hover:scale-110 transition-transform"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white bg-gradient-to-br from-orange-500 to-red-500 border-2 border-white rounded-full shadow-sm">
                        {vendor.storeName.charAt(0).toUpperCase() || "V"}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 group-hover:text-orange-600">
                          {vendor.storeName}
                        </span>
                        {product.verified && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Flash Sale Seller</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                </Link>
              </div>
            ) : (
              <div className="mb-4 text-sm text-gray-500 p-4 bg-gray-50 rounded-xl">
                Vendor information unavailable
              </div>
            )}

            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl line-clamp-2">
                {product.name}
              </h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {renderStars(reviewStats.averageRating, 'md')}
                </div>
                <span className="ml-2 text-sm text-gray-500 sm:text-base">
                  {reviewStats.averageRating.toFixed(1)} (
                  {reviewStats.totalReviews} reviews)
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        {isPriceLoading
                          ? "Loading..."
                          : `${currencySymbol} ${formatPrice(convertedPrice)}`}
                      </p>
                      {discountPercentage > 0 && (
                        <span className="ml-3 px-3 py-1 text-sm font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full">
                          -{discountPercentage}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {convertedOriginalPrice > convertedPrice && (
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-lg text-gray-500 line-through">
                        {currencySymbol} {formatPrice(convertedOriginalPrice)}
                      </p>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Save {currencySymbol} {formatPrice(convertedOriginalPrice - convertedPrice)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Stock Status */}
                <div className="flex flex-col items-end">
                  {isInStock ? (
                    <>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        In Stock ({product.inventory} available)
                      </span>
                      {product.inventory < 10 && (
                        <p className="mt-1 text-xs text-orange-600 font-medium">
                          ⚠️ Low stock - Order soon!
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 sm:text-base line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label
                htmlFor="quantity"
                className="block mb-3 text-lg font-semibold text-gray-900"
              >
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    const newQuantity = Math.max(1, quantity - 1);
                    setQuantity(newQuantity);
                  }}
                  disabled={quantity <= 1 || !isInStock}
                  className={`rounded-l-xl p-3 border border-r-0 border-gray-300 ${
                    quantity <= 1 || !isInStock
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="w-20 py-3 text-center text-xl font-bold text-gray-900 border-gray-300 border-y">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newQuantity = Math.min(product.inventory, quantity + 1);
                    setQuantity(newQuantity);
                  }}
                  disabled={quantity >= product.inventory || !isInStock}
                  className={`rounded-r-xl p-3 border border-l-0 border-gray-300 ${
                    quantity >= product.inventory || !isInStock
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </button>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">
                    Max: {product.inventory} units
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              {/* Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!isInStock || isSessionLoading || isPriceLoading}
                className={`w-full flex items-center justify-center px-6 py-4 rounded-xl text-lg font-bold text-white transition-all duration-200 ${
                  isInStock && !isSessionLoading && !isPriceLoading
                    ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <Zap className="w-5 h-5 mr-3" />
                BUY NOW - FLASH DEAL
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!isInStock || isSessionLoading || isPriceLoading}
                  className={`flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    isInStock && !isSessionLoading && !isPriceLoading
                      ? "bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200"
                      : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={handleAddToWishlist}
                  disabled={isSessionLoading || isPriceLoading}
                  className={`flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    isSessionLoading || isPriceLoading
                      ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Wishlist
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </button>
              </div>

              {/* Start Chat Button */}
              <button
                type="button"
                onClick={handleStartChat}
                disabled={isSessionLoading || !vendor || !user?._id}
                className={`flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isSessionLoading || !vendor || !user?._id
                    ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Ask Seller a Question
              </button>
            </div>

            {/* Flash Sale Info Panel */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex border-b border-gray-200">
                <button
                  className={`pb-3 px-1 mr-6 ${
                    activeTab === "description"
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  } font-medium text-base`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`pb-3 px-1 mr-6 ${
                    activeTab === "flash-info"
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  } font-medium text-base`}
                  onClick={() => setActiveTab("flash-info")}
                >
                  Flash Sale Info
                </button>
                <button
                  className={`pb-3 px-1 ${
                    activeTab === "reviews"
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  } font-medium text-base`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews ({reviewStats.totalReviews})
                </button>
              </div>

              <div className="py-6">
                {activeTab === "description" ? (
                  <div className="prose max-w-none">
                    <div className="text-gray-600 whitespace-pre-line">
                      {product.description}
                    </div>
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Product Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <span className="font-medium text-gray-900">Category:</span>
                            <span className="ml-2 text-gray-600">{product.category}</span>
                          </div>
                          {product.sub_category && (
                            <div>
                              <span className="font-medium text-gray-900">Sub-category:</span>
                              <span className="ml-2 text-gray-600">{product.sub_category}</span>
                            </div>
                          )}
                          {product.sub_category2 && (
                            <div>
                              <span className="font-medium text-gray-900">Type:</span>
                              <span className="ml-2 text-gray-600">{product.sub_category2}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="font-medium text-gray-900">Listed:</span>
                            <span className="ml-2 text-gray-600">
                              {new Date(product.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Condition:</span>
                            <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              New
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : activeTab === "flash-info" ? (
                  <div className="space-y-6">
                    {/* Flash Sale Details */}
                    <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-orange-500" />
                        Flash Sale Details
                      </h3>
                      
                      <div className="space-y-4">
                        {product.flashSaleStartDate && (
                          <div className="flex items-center justify-between py-3 border-b border-orange-100">
                            <span className="font-medium text-gray-700">Sale Started:</span>
                            <span className="font-semibold text-gray-900">{formatDate(product.flashSaleStartDate)}</span>
                          </div>
                        )}
                        
                        {product.flashSaleEndDate && (
                          <div className="flex items-center justify-between py-3 border-b border-orange-100">
                            <span className="font-medium text-gray-700">Sale Ends:</span>
                            <span className="font-semibold text-orange-600">{formatDate(product.flashSaleEndDate)}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between py-3 border-b border-orange-100">
                          <span className="font-medium text-gray-700">Original Price:</span>
                          <span className="text-lg font-bold text-gray-500 line-through">
                            {currencySymbol} {formatPrice(convertedOriginalPrice || product.price)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b border-orange-100">
                          <span className="font-medium text-gray-700">Flash Sale Price:</span>
                          <span className="text-2xl font-bold text-red-600">
                            {currencySymbol} {formatPrice(convertedPrice)}
                          </span>
                        </div>
                        
                        {discountPercentage > 0 && (
                          <div className="flex items-center justify-between py-3">
                            <span className="font-medium text-gray-700">You Save:</span>
                            <span className="text-xl font-bold text-green-600">
                              {currencySymbol} {formatPrice((convertedOriginalPrice || product.price) - convertedPrice)}
                              <span className="ml-2 text-sm font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full">
                                -{discountPercentage}%
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Flash Sale Terms */}
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Flash Sale Terms & Conditions</h4>
                      <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                          <span>Flash sale prices are valid only during the specified sale period</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                          <span>Limited quantities available. Once sold out, regular pricing applies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                          <span>All flash sale items are covered by our standard return policy</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                          <span>Prices may vary based on your location and currency</span>
                        </li>
                      </ul>
                    </div>

                    {/* Stock Alert */}
                    {product.inventory < 20 && (
                      <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-red-800 mb-1">Low Stock Alert!</h4>
                            <p className="text-red-700">
                              Only {product.inventory} item{product.inventory !== 1 ? 's' : ''} left at this price.
                              This flash sale item is selling fast!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Reviews Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Overall Rating */}
                      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-gray-900">
                            {reviewStats.averageRating.toFixed(1)}
                          </div>
                          <div className="flex items-center justify-center mt-2">
                            {renderStars(reviewStats.averageRating, 'lg')}
                          </div>
                          <p className="mt-2 text-sm text-gray-600">
                            Based on {reviewStats.totalReviews} review
                            {reviewStats.totalReviews !== 1 ? "s" : ""}
                          </p>
                          {reviewStats.verifiedReviewsCount > 0 && (
                            <div className="flex items-center justify-center gap-1 mt-3 text-sm text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>
                                {reviewStats.verifiedReviewsCount} verified purchase
                                {reviewStats.verifiedReviewsCount !== 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Rating Distribution */}
                      <div className="p-6 bg-white rounded-xl border border-gray-200 md:col-span-2">
                        <h3 className="font-semibold text-gray-900 mb-4">
                          Rating Breakdown
                        </h3>
                        <div className="space-y-3">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center">
                              <div className="flex items-center w-16">
                                <span className="text-sm font-medium text-gray-900 w-6">
                                  {rating}
                                </span>
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 ml-1" />
                              </div>
                              <div className="flex-1 mx-4">
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-yellow-500 rounded-full"
                                    style={{ width: `${getRatingPercentage(rating)}%` }}
                                  />
                                </div>
                              </div>
                              <div className="w-10 text-right">
                                <span className="text-sm text-gray-600">
                                  {getRatingPercentage(rating)}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Reviews Header with Info Message */}
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Customer Reviews ({reviewStats.totalReviews})
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Read what other customers are saying
                        </p>
                      </div>

                      <div className="flex gap-3">
                        {/* Sort Dropdown */}
                        <div className="relative">
                          <select
                            value={reviewSortBy}
                            onChange={(e) =>
                              handleReviewSortChange(
                                e.target.value as "newest" | "highest" | "lowest"
                              )
                            }
                            className="appearance-none pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          >
                            <option value="newest">Newest First</option>
                            <option value="highest">Highest Rated</option>
                            <option value="lowest">Lowest Rated</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-gray-400 transform rotate-90" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Review Policy Notice */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-2">
                            Review Policy
                          </h4>
                          <ul className="space-y-2 text-sm text-blue-700">
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                              <span>
                                <strong>Only verified buyers</strong> can leave reviews
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                              <span>
                                Reviews are available after order is marked as "Delivered"
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                              <span>You can review products from your order history</span>
                            </li>
                          </ul>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 text-blue-700 border-blue-300 hover:bg-blue-100"
                            onClick={() => navigate("/dashboard/orderlist")}
                          >
                            Go to Orders
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Reviews List */}
                    {renderReviewsList()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Flash Sales */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">More Flash Deals</h2>
            <Link
              to="/flash-sale"
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              View All Flash Sales
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
            <p className="text-center text-gray-600">
              Explore more exciting flash sale products in our dedicated section!
            </p>
            <div className="flex justify-center mt-4">
              <Link
                to="/flash-sale"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Browse All Flash Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleDetailPage;