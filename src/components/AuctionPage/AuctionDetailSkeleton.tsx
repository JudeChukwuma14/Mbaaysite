import React from "react";

const AuctionDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden animate-pulse" />
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Auction Details Skeleton */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Current Bid Skeleton */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="bg-gray-200 rounded-xl p-4 mb-4 animate-pulse">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 w-4 bg-gray-300 rounded-full" />
                  <div className="h-4 w-24 bg-gray-300 rounded" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-6 w-12 bg-gray-300 rounded" />
                  <div className="h-6 w-12 bg-gray-300 rounded" />
                  <div className="h-6 w-12 bg-gray-300 rounded" />
                  <div className="h-6 w-12 bg-gray-300 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
              </div>
            </div>

            {/* Seller Info Skeleton */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="mt-12">
          <div className="grid w-full grid-cols-3 lg:grid-cols-4 lg:w-auto bg-gray-200 p-1 rounded-md animate-pulse">
            <div className="h-8 w-full rounded-sm" />
            <div className="h-8 w-full rounded-sm" />
            <div className="h-8 w-full rounded-sm" />
            <div className="h-8 w-full rounded-sm hidden lg:block" />
          </div>
          <div className="mt-6 border border-gray-200 rounded-xl p-6">
            <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailSkeleton;
