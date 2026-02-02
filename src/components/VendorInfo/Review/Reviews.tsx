// Reviews.tsx
import { useState } from "react";
import { 
  Star, 
  Smile, 
  Send, 
  Flag, 
  MessageCircle, 
  ThumbsUp,
  TrendingUp,
  Users,
  Award,
  Reply,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useVendorReviews, useReplyToReview, useSendPrivateReviewMessage } from "@/hook/userVendorQueries";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import axios from "axios";

const REVIEWS_BASE_URL = "https://ilosiwaju-mbaay-2025.com/api/v1/reviews";

const Reviews = () => {
  const [activeReply, setActiveReply] = useState<string | null>(null); // track which review is being replied to
  const [replyType, setReplyType] = useState("Private"); // dropdown value
  // const [like, setLike] = useState(false);
  // const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const token = useSelector((state: RootState) => state.vendor.token);
  const [replyMessage, setReplyMessage] = useState<string>("");
  const [privateMessage, setPrivateMessage] = useState<string>("");
  const [activePrivateReply, setActivePrivateReply] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeMessages, setActiveMessages] = useState<string | null>(null);
  const [messagesData, setMessagesData] = useState<any>({});

  const replyMutation = useReplyToReview();
  const privateMessageMutation = useSendPrivateReviewMessage();

  const {
    data: reviewsResponse,
    isLoading,
    isError,
    error,
  } = useVendorReviews({
    token: token ?? "",
  });
  console.log("Reviews response:", reviewsResponse);

  // Mark review as helpful
  const handleMarkHelpful = async (reviewId: string) => {
    try {
      const response = await axios.patch(
        `${REVIEWS_BASE_URL}/${reviewId}/helpful`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message || "Review marked as helpful");
      // Refresh reviews
      window.location.reload();
    } catch (error: any) {
      console.error("Mark helpful error:", error);
      toast.error(error.response?.data?.message || "Failed to mark review as helpful");
    }
  };

  // Report review
  const handleReportReview = async (reviewId: string) => {
    try {
      const response = await axios.patch(
        `${REVIEWS_BASE_URL}/report/${reviewId}`,
        { reason: "Inappropriate content" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message || "Review reported successfully");
    } catch (error: any) {
      console.error("Report review error:", error);
      toast.error(error.response?.data?.message || "Failed to report review");
    }
  };

  // Send private message
  const handleSendPrivateMessage = (reviewId: string) => {
    if (!privateMessage.trim()) {
      toast.error("Message is required");
      return;
    }

    privateMessageMutation.mutate({
      token,
      body: {
        reviewId,
        message: privateMessage.trim(),
        messageType: "vendor_to_customer",
      },
    });

    // Show success feedback
    setSuccessMessage("Private message sent successfully!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    setPrivateMessage("");
    setActivePrivateReply(null);
  };

  // Fetch review messages
  const handleViewMessages = async (reviewId: string) => {
    try {
      const response = await axios.get(
        `${REVIEWS_BASE_URL}/messages/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessagesData((prev: any) => ({
        ...prev,
        [reviewId]: response.data
      }));
      setActiveMessages(activeMessages === reviewId ? null : reviewId);
    } catch (error: any) {
      console.error("Fetch messages error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    }
  };

  const reviews = reviewsResponse?.data?.reviews || reviewsResponse?.reviews || [];
  const stats = reviewsResponse?.data?.stats || reviewsResponse?.stats || {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h1>
            <p className="text-gray-600">Manage and respond to customer feedback</p>
          </motion.div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-8 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg p-6 animate-pulse"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gray-300 rounded-full opacity-20"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/30 rounded-xl"></div>
                    <div className="w-5 h-5 bg-white/30 rounded-full"></div>
                  </div>
                  <div className="w-24 h-4 bg-white/30 rounded mb-2"></div>
                  <div className="w-32 h-8 bg-white/30 rounded"></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Reviews Skeleton */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="w-32 h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-32 h-4 bg-gray-200 rounded"></div>
                    <div className="w-48 h-3 bg-gray-200 rounded"></div>
                    <div className="w-full h-16 bg-gray-200 rounded"></div>
                    <div className="flex gap-2">
                      <div className="w-20 h-8 bg-gray-200 rounded"></div>
                      <div className="w-20 h-8 bg-gray-200 rounded"></div>
                      <div className="w-20 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-red-100 p-8"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Reviews</h2>
            <p className="text-gray-600 mb-6">
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred while loading reviews."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 transition-all"
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Success Message */}
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 right-4 z-50 px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={20} />
              <span>{successMessage}</span>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h1>
          <p className="text-gray-600">Manage and respond to customer feedback</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-8 lg:grid-cols-3">
          <motion.div
            className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white"
            whileHover={{ scale: 1.02, y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-400 rounded-full opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-100" />
              </div>
              <h3 className="text-blue-100 text-sm font-medium mb-1">Total Reviews</h3>
              <p className="text-2xl sm:text-3xl font-bold">{stats.totalReviews}</p>
              <div className="mt-3 flex items-center text-xs text-blue-100">
                <Award className="w-3 h-3 mr-1" />
                <span>All customer feedback</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white"
            whileHover={{ scale: 1.02, y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-400 rounded-full opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-orange-100" />
              </div>
              <h3 className="text-orange-100 text-sm font-medium mb-1">Average Rating</h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-bold">{stats.averageRating.toFixed(1)}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i < Math.floor(stats.averageRating)
                          ? "fill-yellow-300"
                          : "text-yellow-200"
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-orange-100">
                <Star className="w-3 h-3 mr-1" />
                <span>Customer satisfaction</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white"
            whileHover={{ scale: 1.02, y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-400 rounded-full opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-100" />
              </div>
              <h3 className="text-green-100 text-sm font-medium mb-1">Rating Distribution</h3>
              <div className="space-y-2">
                {Object.entries(stats.ratingDistribution).map(([star, count]) => {
                  const countValue = Number(count) || 0;
                  const maxCount = Math.max(...Object.values(stats.ratingDistribution).map((c) => Number(c) || 0)) || 1;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs w-8">{star}★</span>
                      <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-500"
                          style={{
                            width: `${(countValue / maxCount) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs w-6 text-right">{countValue}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-500" />
              Customer Reviews
              <span className="text-sm font-normal text-gray-500">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                <p className="text-gray-600">Customer reviews will appear here once customers start leaving feedback.</p>
              </div>
            ) : (
              reviews.map((review: any, index:any) => (
                <motion.div
                  key={review._id}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <img
                      src={
                        review.customer?.avatar || "https://i.pravatar.cc/100?img=12"
                      }
                      alt={review.customer?.name || "Customer"}
                      className="object-cover w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    />

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.customer?.name || "Anonymous"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Product: {review.product?.name || "Unknown Product"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={
                                    i < review.rating ? "fill-yellow-400" : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {review.comment}
                      </p>

                      {/* Display vendor reply if exists */}
                      {review.vendorReply && (
                        <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">V</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-orange-800">Vendor Reply</p>
                              <p className="text-sm text-gray-700 mt-1">{review.vendorReply.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(review.vendorReply.repliedAt).toLocaleDateString()}
                                {review.vendorReply.isPublic ? " (Public)" : " (Private)"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <motion.button 
                          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            setActiveReply(
                              activeReply === review._id ? null : review._id
                            )
                          }
                        >
                          <Reply size={14} />
                          Public Reply
                        </motion.button>
                        <motion.button
                          className="px-3 py-1.5 text-sm bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            setActivePrivateReply(
                              activePrivateReply === review._id ? null : review._id
                            )
                          }
                        >
                          <Send size={14} />
                          Direct Message
                        </motion.button>
                        <motion.button
                          className="px-3 py-1.5 text-sm bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewMessages(review._id)}
                        >
                          <MessageCircle size={14} />
                          View Messages
                        </motion.button>
                        <motion.button 
                          className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMarkHelpful(review._id)}
                        >
                          <ThumbsUp size={14} />
                          Helpful
                        </motion.button>
                        <motion.button 
                          className="px-3 py-1.5 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReportReview(review._id)}
                        >
                          <Flag size={14} />
                          Report
                        </motion.button>
                      </div>
                      {/* Public Reply Form */}
                      {activeReply === review._id && (
                        <motion.div 
                          className="flex flex-col gap-3 p-4 mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold">V</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                <p className="text-sm font-medium text-gray-700">
                                  Replying publicly to{" "}
                                  <span className="font-semibold text-blue-600">
                                    {review.customer?.name || "Anonymous"}
                                  </span>
                                </p>
                                <select
                                  value={replyType}
                                  onChange={(e) => setReplyType(e.target.value)}
                                  className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="Public">Public</option>
                                  <option value="Private">Private</option>
                                </select>
                              </div>
                              <textarea
                                placeholder="Write your reply..."
                                rows={3}
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                className="w-full p-3 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              ></textarea>
                              <div className="flex items-center justify-between">
                                <Smile size={18} className="text-blue-500" />
                                <motion.button
                                  onClick={() => {
                                    // validation
                                    if (!replyMessage || !replyMessage.trim()) {
                                      toast.error("Reply message is required");
                                      return;
                                    }

                                    replyMutation.mutate({
                                      reviewId: review._id,
                                      payload: {
                                        message: replyMessage.trim(),
                                        isPublic: replyType === "Public",
                                        reviewId: review._id,
                                      },
                                      token,
                                    });

                                    // Show success feedback
                                    setSuccessMessage(`${replyType === "Public" ? "Public reply" : "Private reply"} sent successfully!`);
                                    setShowSuccess(true);
                                    setTimeout(() => setShowSuccess(false), 3000);

                                    // clear local textarea and close
                                    setReplyMessage("");
                                    setActiveReply(null);
                                  }}
                                  disabled={Boolean((replyMutation as any).isLoading)}
                                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-60 flex items-center gap-2 transition-all"
                                >
                                  {(replyMutation as any).isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <>
                                      <Send size={16} />
                                      Send Reply
                                    </>
                                  )}
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Private Message Form */}
                      {activePrivateReply === review._id && (
                        <motion.div 
                          className="flex flex-col gap-3 p-4 mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold">V</span>
                            </div>
                            <div className="flex-1">
                              <div className="mb-3">
                                <p className="text-sm font-medium text-gray-700">
                                  Sending private message to{" "}
                                  <span className="font-semibold text-green-600">
                                    {review.customer?.name || "Anonymous"}
                                  </span>
                                </p>
                              </div>
                              <textarea
                                placeholder="Write your private message..."
                                rows={3}
                                value={privateMessage}
                                onChange={(e) => setPrivateMessage(e.target.value)}
                                className="w-full p-3 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              ></textarea>
                              <div className="flex items-center justify-between">
                                <Smile size={18} className="text-green-500" />
                                <motion.button
                                  onClick={() => handleSendPrivateMessage(review._id)}
                                  disabled={Boolean((privateMessageMutation as any).isLoading)}
                                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-60 flex items-center gap-2 transition-all"
                                >
                                  {(privateMessageMutation as any).isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <>
                                      <Send size={16} />
                                      Send Message
                                    </>
                                  )}
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Messages Display */}
                      {activeMessages === review._id && messagesData[review._id] && (
                        <motion.div 
                          className="mt-4 p-4 bg-white border border-gray-200 rounded-xl"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Conversation History
                            </h4>
                            <motion.button
                              onClick={() => setActiveMessages(null)}
                              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              ×
                            </motion.button>
                          </div>
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {messagesData[review._id].messages.length > 0 ? (
                              messagesData[review._id].messages.map((msg: any, index: number) => (
                                <motion.div
                                  key={index}
                                  className={`flex ${
                                    msg.messageType === "vendor_to_customer" ? "justify-end" : "justify-start"
                                  }`}
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <div
                                    className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
                                      msg.messageType === "vendor_to_customer"
                                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    <p>{msg.message}</p>
                                    <p className={`text-xs mt-1 ${
                                      msg.messageType === "vendor_to_customer" ? "text-blue-100" : "text-gray-500"
                                    }`}>
                                      {new Date(msg.sentAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </motion.div>
                              ))
                            ) : (
                              <p className="text-center text-gray-500 text-sm py-4">No messages yet</p>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Display reply status */}
                      {review.vendorReply && (
                        <p className="mt-2 text-xs text-gray-500 italic">
                          You replied on {new Date(review.vendorReply.repliedAt).toLocaleDateString()}
                          {review.vendorReply.isPublic ? " (Publicly)" : " (Privately)"}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reviews;
