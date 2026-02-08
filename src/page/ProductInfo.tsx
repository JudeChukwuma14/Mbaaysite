"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { addItem, updateQuantity } from "@/redux/slices/cartSlice";
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
  // Share2,
  MessageCircle,
  User,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  SortAsc,
  ThumbsUp,
  Lock,
} from "lucide-react";
import Spinner from "@/components/Common/Spinner";
import {
  convertPrice,
  formatPrice,
  getCurrencySymbol,
} from "@/utils/currencyCoverter";
import { addToCart, updateCartQuantity } from "@/utils/cartApi";
import { initializeSession } from "@/redux/slices/sessionSlice";
import { get_single_vendor } from "@/utils/vendorApi";
import { getProductReviews, Review } from "@/utils/reviewApi";
import { follow_vendor, unfollow_vendor } from "@/utils/communityApi";
import { getAuthToken } from "@/utils/UserChat";
import { Button } from "@/components/ui/button";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";

interface Product {
  _id: string;
  name: string;
  poster: {
    _id: string;
    storeName: string;
    avatar?: string;
  } | null; // Updated to reflect poster structure
  description: string;
  price: number;
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
  followers?: string[];
}

const ProductDetails: React.FC = () => {
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
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description",
  );
  const [convertedPrice, setConvertedPrice] = useState(0);
  const [isPriceLoading, setIsPriceLoading] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    verifiedReviewsCount: 0,
  });
  const [reviewSortBy, setReviewSortBy] = useState<
    "newest" | "highest" | "lowest"
  >("newest");
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  const [followLoading, setFollowLoading] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const currency = useSelector(
    (state: RootState) => state.settings.currency || "NGN",
  );
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  const vendorState = useSelector((state: RootState) => state.vendor);
  const user = useSelector((state: RootState) => state.user.user);

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

      // Check if response is valid
      if (response && response.success !== false) {
        setReviews(response.reviews || []);
        setReviewStats(
          response.stats || {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            verifiedReviewsCount: 0,
          },
        );

        // Sort reviews
        sortReviews(response.reviews || [], reviewSortBy);
      } else {
        throw new Error(response?.message || "Invalid response from server");
      }
    } catch (error: any) {
      console.error("Error fetching reviews:", error);

      // Handle specific error messages
      if (error.message.includes("Network error")) {
        setReviewsError(
          "Unable to connect to server. Please check your internet connection.",
        );
      } else if (error.message.includes("No reviews found")) {
        // This is not an error - just no reviews
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
    sortBy: "newest" | "highest" | "lowest",
  ) => {
    let sorted = [...reviewsToSort];

    switch (sortBy) {
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
    });
  };

  // Initialize sessionId if missing
  useEffect(() => {
    if (!sessionId) {
      const initialize = async () => {
        setIsSessionLoading(true);
        try {
          await dispatch(initializeSession());
        } catch (error) {
          console.error("DEBUG: Session initialization failed:", error);
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
          data.product.images[0] || data.product.poster || "/placeholder.svg",
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
              "Vendor data not found for vendorId: " + data.product.vendorId,
            );
          }
        } else {
          setError("Vendor information unavailable for this product.");
        }
        setVendor(vendorData);
      } catch (err: any) {
        console.error("DEBUG: Fetch error:", err);
        setError(
          err.message || "Failed to load product or vendor. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndVendor();
  }, [id, vendorState]);

  // Convert price when product or currency changes
  useEffect(() => {
    if (!product) return;
    const convert = async () => {
      setIsPriceLoading(true);
      try {
        const price = await convertPrice(product.price, "NGN", currency);
        setConvertedPrice(price);
      } catch (error) {
        console.error("DEBUG: Failed to convert price:", error);
        setConvertedPrice(product.price); // Fallback to base price
      } finally {
        setIsPriceLoading(false);
      }
    };
    convert();
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
        initialMessage,
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
      // toast.success(`Started chat with ${vendor.storeName} about ${product.name}`);
    } catch (error: any) {
      console.error("DEBUG: Start chat error:", error);
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
    if (window.innerWidth >= 1024) setIsZoomed(true); // Disable zoom on mobile
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
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
        <p className="text-lg text-red-500">{error}</p>
        <Link
          to="/"
          className="px-4 py-2 mt-4 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Return to Home
        </Link>
      </div>
    );

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg text-gray-500">Product not found</p>
        <Link
          to="/"
          className="px-4 py-2 mt-4 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Return to Home
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
          price: product.price,
          inventory: product.inventory,
          image:
            product.images[0] || product.poster?.avatar || "/placeholder.svg",
        }),
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
        price: product.price,
        quantity: 1,
        image:
          product.images[0] || product.poster?.avatar || "/placeholder.svg",
      }),
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

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (!sessionId || isSessionLoading) {
      toast.error("Session not initialized. Please try again.");
      return;
    }
    if (isNaN(newQuantity) || newQuantity < 1) {
      toast.error("Please enter a valid quantity (1 or more).");
      return;
    }
    if (newQuantity > product.inventory) {
      toast.error(`Cannot exceed available stock (${product.inventory}).`);
      return;
    }

    try {
      await updateCartQuantity(sessionId, itemId, newQuantity);
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
      setQuantity(newQuantity);
    } catch (error) {
      toast.error("Failed to update quantity. Please try again.");
    }
  };

  const isFollowing =
    user && vendor ? vendor.followers?.includes(user._id) : false;

  const handleFollowToggle = async () => {
    if (!user?._id || !vendor) {
      toast.error("Please log in to follow vendors");
      return;
    }

    setFollowLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      console.log(
        "Attempting to",
        isFollowing ? "unfollow" : "follow",
        "vendor:",
        vendor._id,
      );

      if (isFollowing) {
        await unfollow_vendor(token, vendor._id);
        // Update local state - remove from followers
        setVendor((prev) =>
          prev
            ? {
                ...prev,
                followers:
                  prev.followers?.filter((id) => id !== user._id) || [],
              }
            : null,
        );
        // toast.success(`Unfollowed ${vendor.storeName}`);
      } else {
        await follow_vendor(token, vendor._id);
        // Update local state - add to followers
        setVendor((prev) =>
          prev
            ? {
                ...prev,
                followers: [...(prev.followers || []), user._id],
              }
            : null,
        );
        // toast.success(`Following ${vendor.storeName}`);
      }
    } catch (error: any) {
      console.error("Error toggling follow:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update follow status",
      );
    } finally {
      setFollowLoading(false);
    }
  };

  const isVideo = selectedMedia?.includes("youtube.com");
  const isInStock = product.inventory > 0;
  const currencySymbol = getCurrencySymbol(currency);

  const renderReviewsContent = () => {
    if (activeTab !== "reviews") return null;

    return (
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
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(reviewStats.averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : i < reviewStats.averageRating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 fill-gray-100"
                    }`}
                  />
                ))}
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
                    e.target.value as "newest" | "highest" | "lowest",
                  )
                }
                className="appearance-none pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <SortAsc className="w-4 h-4 text-gray-400" />
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
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt=1.5 flex-shrink-0" />
                  <span>
                    Reviews are available after order is marked as "Delivered"
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt=1.5 flex-shrink-0" />
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
        {reviewsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-orange-600 rounded-full animate-spin border-t-transparent" />
            <span className="ml-3 text-gray-600">Loading reviews...</span>
          </div>
        ) : reviewsError ? (
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
        ) : reviews.length === 0 ? (
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
        ) : (
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
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Collapse All Reviews
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
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
              const shouldShowReadMore = review.comment.length > 200;

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
                            {review.reviewerName}
                            {review.verified && (
                              <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified Purchase
                              </span>
                            )}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300 fill-gray-100"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Helpful button */}
                    <button
                      onClick={() => {
                        // Handle helpful action
                        toast.info("Thanks for your feedback!");
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                  </div>

                  {/* Review Title */}
                  {review.title && (
                    <h5 className="mt-4 text-lg font-medium text-gray-900">
                      {review.title}
                    </h5>
                  )}

                  {/* Review Comment */}
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

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-3 mt-4">
                      {review.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            // Open image in lightbox or modal
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
        )}
      </div>
    );
  };

  return (
    <div className="bg-white">
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <nav className="flex flex-wrap gap-2 mb-4 text-sm text-gray-500">
          <Link to="/" className="transition-colors hover:text-gray-900">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
          <span className="text-gray-700">{product.category}</span>
          {product.sub_category && (
            <>
              <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
              <span className="text-gray-700">{product.sub_category}</span>
            </>
          )}
          <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
          <span className="font-medium text-gray-900 line-clamp-1">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-y-6 sm:gap-y-8 lg:grid-cols-2 lg:gap-x-8">
          <div className="space-y-4">
            <div className="overflow-hidden border border-gray-200 rounded-lg aspect-square bg-gray-50">
              {isVideo ? (
                <div className="w-full h-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                      selectedMedia || "",
                    )}`}
                    title={`${product.name} Video`}
                    frameBorder="0"
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

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
              {mediaItems.map((media, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMedia(media)}
                  className={`aspect-square overflow-hidden rounded-md border ${
                    selectedMedia === media
                      ? "border-2 border-orange-600"
                      : "border-gray-200 hover:border-gray-300"
                  } transition-all`}
                >
                  {media.includes("youtube.com") ? (
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeVideoId(
                        media,
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
          </div>

          <div className="flex flex-col min-w-0">
            {/* Vendor Information */}
            {vendor && (
              <div className="mb-4">
                <div className="flex items-center justify-between gap-4">
                  <Link
                    to={
                      vendor._id === "admin"
                        ? "/about"
                        : `/veiws-profile/${vendor._id}`
                    }
                    className="flex items-center gap-2 group flex-1"
                    aria-label={`View ${vendor.storeName}'s profile`}
                  >
                    {vendor.avatar ? (
                      <img
                        src={vendor.avatar}
                        alt={`${vendor.storeName} logo`}
                        className="object-cover w-8 h-8 transition-transform border border-gray-300 rounded-full group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-orange-500 border border-gray-300 rounded-full">
                        {vendor.storeName.charAt(0).toUpperCase() || "V"}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 line-clamp-1">
                      Sold by {vendor.storeName}
                    </span>
                  </Link>

                  {vendor._id !== "admin" &&
                    user &&
                    user._id !== vendor._id && (
                      <button
                        onClick={handleFollowToggle}
                        disabled={followLoading}
                        className={`flex items-center gap-2 px-3 py-2 font-medium text-white rounded-lg transition duration-300 ${
                          isFollowing
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-orange-500 hover:bg-orange-600"
                        } ${followLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {followLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : isFollowing ? (
                          <FaUserMinus />
                        ) : (
                          <FaUserPlus />
                        )}
                        {isFollowing ? "Unfollow" : "Follow"}
                      </button>
                    )}
                  {vendor._id !== "admin" && !user && (
                    <Link
                      to="/signin"
                      className="flex items-center gap-2 px-3 py-2 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                      <FaUserPlus />
                      Follow
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl line-clamp-2">
                {product.name}
              </h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        i < Math.floor(reviewStats.averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : i < reviewStats.averageRating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-xs text-gray-500 sm:text-sm">
                  {reviewStats.averageRating.toFixed(1)} (
                  {reviewStats.totalReviews} reviews)
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {isPriceLoading
                    ? "Loading..."
                    : `${currencySymbol} ${formatPrice(convertedPrice)}`}
                </p>
                {isInStock ? (
                  <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    In Stock
                  </span>
                ) : (
                  <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                )}
              </div>
              {isInStock && (
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  {product.inventory < 10
                    ? `Only ${product.inventory} left in stock`
                    : ""}
                </p>
              )}
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 sm:text-base line-clamp-3">
                {product.description}
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="quantity"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <div className="flex items-center w-32">
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateQuantity(product._id, quantity - 1)
                  }
                  disabled={quantity <= 1 || isSessionLoading}
                  className={`rounded-l-md p-1.5 sm:p-2 border border-r-0 border-gray-300 ${
                    quantity <= 1 || isSessionLoading
                      ? "bg-gray-100 text-gray-400"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <input
                  type="text"
                  id="quantity"
                  value={quantity}
                  readOnly
                  className="w-12 sm:w-16 py-1.5 sm:py-2 text-center text-gray-900 border-gray-300 border-y focus:outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateQuantity(product._id, quantity + 1)
                  }
                  disabled={quantity >= product.inventory || isSessionLoading}
                  className={`rounded-r-md p-1.5 sm:p-2 border border-l-0 border-gray-300 ${
                    quantity >= product.inventory || isSessionLoading
                      ? "bg-gray-100 text-gray-400"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isInStock || isSessionLoading || isPriceLoading}
                className={`flex-1 flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 rounded-md text-sm sm:text-base font-medium text-white transition-colors duration-200 ${
                  isInStock && !isSessionLoading && !isPriceLoading
                    ? "bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                aria-label="Add to cart"
                aria-disabled={!isInStock || isSessionLoading || isPriceLoading}
              >
                <ShoppingCart className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                Add to Cart
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleAddToWishlist}
                disabled={isSessionLoading || isPriceLoading}
                className={`flex flex-1 items-center justify-center px-4 py-2 sm:px-6 sm:py-3 rounded-md text-sm sm:text-base font-medium text-gray-700 bg-white border border-gray-300 transition-colors duration-200 ${
                  isSessionLoading || isPriceLoading
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                }`}
                aria-label="Add to wishlist"
                aria-disabled={isSessionLoading || isPriceLoading}
              >
                <Heart className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                Wishlist
              </button>

              {/* Start Chat Button */}
              <button
                type="button"
                onClick={handleStartChat}
                disabled={isSessionLoading || !vendor || !user?._id}
                className={`flex flex-1 items-center justify-center px-4 py-2 sm:px-6 sm:py-3 rounded-md text-sm sm:text-base font-medium text-gray-700 bg-white border border-gray-300 transition-colors duration-200 ${
                  isSessionLoading || !vendor || !user?._id
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                }`}
                aria-label="Start chat with vendor"
                aria-disabled={isSessionLoading || !vendor || !user?._id}
              >
                <MessageCircle className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                Start Chat
              </button>
            </div>

            <div className="pt-4 mt-6 border-t border-gray-200">
              <div className="flex border-b border-gray-200">
                <button
                  className={`pb-3 px-1 ${
                    activeTab === "description"
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  } font-medium text-sm sm:text-base`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`ml-4 sm:ml-8 pb-3 px-1 ${
                    activeTab === "reviews"
                      ? "border-b-2 border-orange-600 text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  } font-medium text-sm sm:text-base`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews ({reviewStats.totalReviews})
                </button>
              </div>

              <div className="py-4 sm:py-6">
                {activeTab === "description" ? (
                  <div className="prose-sm prose text-gray-500 max-w-none">
                    <p className="text-sm whitespace-pre-line sm:text-base">
                      {product.description}
                    </p>
                    <div className="mt-4 sm:mt-6">
                      <h3 className="text-sm font-medium text-gray-900">
                        Categories
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2 space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                          {product.category}
                        </span>
                        {product.sub_category && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                            {product.sub_category}
                          </span>
                        )}
                        {product.sub_category2 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                            {product.sub_category2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  renderReviewsContent()
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
