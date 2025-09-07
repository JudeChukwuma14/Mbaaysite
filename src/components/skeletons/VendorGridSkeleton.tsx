const VendorGridSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-8 md:gap-6 2xl:gap-8">
    {Array.from({ length: 16 }).map((_, i) => (
      <div
        key={i}
        className="flex flex-col items-center p-4 bg-gray-100 rounded-lg animate-pulse"
      >
        <div className="w-24 h-24 mb-3 rounded-full bg-gray-300" />
        <div className="w-20 h-4 mb-2 rounded bg-gray-300" />
        <div className="w-16 h-3 rounded bg-gray-200" />
      </div>
    ))}
  </div>
)

export default VendorGridSkeleton
