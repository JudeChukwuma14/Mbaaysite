import React from "react";

const AuctionCardSkeleton: React.FC = () => {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card shadow-card-auction h-[450px]">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <div className="h-full w-full bg-gray-200 animate-pulse" />
        {/* Status Badge Placeholder */}
        <div className="absolute top-3 left-3 h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
        {/* Countdown Timer Placeholder */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-xl bg-gray-200 px-4 py-2 animate-pulse">
          <div className="h-3 w-3 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-1">
            <div className="h-4 w-8 bg-gray-300 rounded" />
            <div className="h-4 w-8 bg-gray-300 rounded" />
            <div className="h-4 w-8 bg-gray-300 rounded" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
        </div>

        <hr className="mb-4 border-gray-200" />

        {/* Seller Info & Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse" />
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default AuctionCardSkeleton;
