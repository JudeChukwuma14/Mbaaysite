// Reviews.jsx
import { useState } from "react";
import { Star, Heart, Smile, Send } from "lucide-react";

const Reviews = () => {
  const [activeReply, setActiveReply] = useState<number | null>(null); // track which review is being replied to
  const [replyType, setReplyType] = useState("Private"); // dropdown value
  const [like, setLike] = useState(false);
  const stats = {
    totalReviews: "10.0k",
    growth: "21%",
    averageRating: 4.0,
    ratings: { 5: 2000, 4: 1000, 3: 500, 2: 200, 1: 50 },
  };

  const reviews = [
    {
      id: 1,
      name: "Tolan Fisher",
      purchases: "$300",
      totalReviews: 10,
      rating: 4,
      date: "2024-10-15",
      text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'",
      replyType: "public",
      avatar: "https://i.pravatar.cc/100?img=12",
    },
    {
      id: 2,
      name: "Jeremy Giggs",
      purchases: "$300",
      totalReviews: 10,
      rating: 3,
      date: "2024-10-15",
      text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'",
      replyType: null,
      avatar: "https://i.pravatar.cc/100?img=5",
    },
  ];

  return (
    <div className="min-h-screen p-6 font-sans bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <select className="px-3 py-1 text-sm border rounded-md">
          <option>March 2024 – February 2025</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="p-4 text-center shadow-sm bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-3xl font-bold">{stats.totalReviews}</p>
          <p className="text-xs font-semibold text-orange-500">
            Growth in review this year ↑ {stats.growth}
          </p>
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
          {Object.entries(stats.ratings).map(([star, count]) => (
            <div key={star} className="flex items-center gap-2 mb-1">
              <span className="text-sm">{star}</span>
              <div className="flex-1 h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-green-500 rounded"
                  style={{
                    width: `${(count / 2000) * 100}%`, // scale relative
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex gap-4 p-4 shadow-sm bg-gray-50 rounded-xl"
          >
            {/* Avatar */}
            <img
              src={review.avatar}
              alt={review.name}
              className="object-cover w-16 h-16 rounded-full"
            />

            {/* Content */}
            <div className="flex-1">
              <p className="font-semibold">{review.name}</p>
              <p className="text-sm text-gray-500">
                Total purchases: {review.purchases}
              </p>
              <p className="text-sm text-gray-500">
                Total reviews: {review.totalReviews}
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
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>

              <p className="mt-2 text-sm text-gray-600">{review.text}</p>

              <div className="flex items-center gap-4 mt-3">
                <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100">
                  Public Comment
                </button>
                <button
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                  onClick={() =>
                    setActiveReply(activeReply === review.id ? null : review.id)
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
              {activeReply === review.id && (
                <div className="flex gap-3 p-3 mt-4 bg-gray-100 rounded-lg">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="object-cover w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">
                        Replying to{" "}
                        <span className="font-semibold">{review.name}</span>
                      </p>
                      <select
                        value={replyType}
                        onChange={(e) => setReplyType(e.target.value)}
                        className="px-2 py-1 text-sm bg-white border rounded"
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
