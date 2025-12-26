// Reviews.tsx
import { useState } from "react";
import { Star, Heart, Smile, Send } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useVendorReviews } from "@/hook/userVendorQueries";

const Reviews = () => {
  const [activeReply, setActiveReply] = useState<string | null>(null); // track which review is being replied to
  const [replyType, setReplyType] = useState("Private"); // dropdown value
  const [like, setLike] = useState(false);
  const user = useSelector((state: RootState) => state.vendor);
  const rowsPerPage = 20;

  const {
    data: reviewsResponse,
    isLoading,
    isError,
    error,
  } = useVendorReviews({
    token: user.token ?? "",
    page: 1,
    limit: rowsPerPage,
    status: "",
  });
  console.log("Reviews response:", reviewsResponse);

  const reviews = reviewsResponse?.reviews || [];
  const stats = reviewsResponse?.stats || {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  if (isLoading) {
    return (
      <div className="max-w-full min-h-screen p-6 overflow-x-hidden font-sans bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <div className="w-full h-8 bg-gray-200 rounded animate-pulse sm:w-40"></div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 shadow-sm bg-gray-50 rounded-xl">
              <div className="h-4 mb-2 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 mb-1 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 shadow-sm bg-gray-50 rounded-xl"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center max-w-full min-h-screen p-6 overflow-x-hidden font-sans bg-white">
        <div className="mb-4 text-red-500">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold">Failed to load reviews</h3>
        <p className="mb-4 text-gray-600">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-full min-h-screen p-6 overflow-x-hidden font-sans bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <select className="w-full px-3 py-1 text-sm border rounded-md sm:w-auto">
          <option>March 2024 – February 2025</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 text-center shadow-sm bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-3xl font-bold">{stats.totalReviews}</p>
        </div>
        <div className="p-4 text-center shadow-sm bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">Average Rating</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold">{stats.averageRating}</span>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i < stats.averageRating
                      ? "fill-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500">Average rating on this year</p>
        </div>
        <div className="p-4 text-left shadow-sm bg-gray-50 rounded-xl">
          {Object.entries(stats.ratingDistribution).map(([star, count]) => {
            const countValue = Number(count) || 0;
            const maxCount =
              Math.max(
                ...Object.values(stats.ratingDistribution).map(
                  (c) => Number(c) || 0
                )
              ) || 1;
            return (
              <div key={star} className="flex items-center gap-2 mb-1">
                <span className="text-sm">{star} star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-green-500 rounded"
                    style={{
                      width: `${(countValue / maxCount) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{countValue}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-6">
        {reviews.map((review: any) => (
          <div
            key={review._id}
            className="flex flex-col gap-4 p-4 shadow-sm sm:flex-row bg-gray-50 rounded-xl"
          >
            {/* Avatar */}
            <img
              src={
                review.customer?.avatar || "https://i.pravatar.cc/100?img=12"
              }
              alt={review.customer?.name || "Customer"}
              className="object-cover w-16 h-16 rounded-full"
            />

            {/* Content */}
            <div className="flex-1">
              <p className="font-semibold break-words">
                {review.customer?.name || "Anonymous"}
              </p>
              <p className="text-sm text-gray-500">
                Product: {review.product?.name || "Unknown Product"}
              </p>

              <div className="flex items-center gap-2 mt-1">
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

              <p className="mt-2 text-sm text-gray-600 break-words">
                {review.comment}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3">
                <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100">
                  Public Comment
                </button>
                <button
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                  onClick={() =>
                    setActiveReply(
                      activeReply === review._id ? null : review._id
                    )
                  }
                >
                  Direct Message
                </button>
                <button>
                  <Heart
                    size={18}
                    onClick={() => setLike(!like)}
                    className={
                      like ? "fill-red-500 text-red-500" : "text-gray-400"
                    }
                  />
                </button>
              </div>
              {activeReply === review._id && (
                <div className="flex flex-col gap-3 p-3 mt-4 bg-gray-100 rounded-lg sm:flex-row">
                  <img
                    src={
                      review.customer?.avatar ||
                      "https://i.pravatar.cc/100?img=12"
                    }
                    alt={review.customer?.name || "Customer"}
                    className="object-cover w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <p className="text-sm">
                        Replying to{" "}
                        <span className="font-semibold">
                          {review.customer?.name || "Anonymous"}
                        </span>
                      </p>
                      <select
                        value={replyType}
                        onChange={(e) => setReplyType(e.target.value)}
                        className="w-full px-2 py-1 text-sm bg-white border rounded sm:w-auto"
                      >
                        <option>Private</option>
                        <option>Public</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Write your reply..."
                      rows={2}
                      className="w-full p-2 text-sm border rounded resize-none"
                    ></textarea>
                    <div className="flex items-center justify-end gap-2 mt-2">
                      <Smile size={18} className="text-orange-500" />
                      <button className="p-2 text-white bg-orange-500 rounded-full">
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {review.replyType && (
                <p className="mt-1 text-xs text-gray-500">
                  You replied via {review.replyType}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
