const CategoriesSectionSkeleton = () => (
  <section className="container px-4 mx-auto mb-16 md:px-8">
    <div className="flex items-center mb-3">
      <div className="w-1 h-6 mr-3 bg-gray-300 rounded-full animate-pulse"></div>
      <span className="h-4 w-24 bg-gray-300 rounded animate-pulse"></span>
    </div>
    <div className="flex items-center justify-between mb-8">
      <div className="h-6 w-48 bg-gray-300 rounded animate-pulse"></div>
      <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
    </div>
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-28 w-28 bg-gray-200 rounded-lg animate-pulse"
        />
      ))}
    </div>
  </section>
);

export default CategoriesSectionSkeleton;
