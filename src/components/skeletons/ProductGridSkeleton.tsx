const ProductGridSkeleton = () => (
  <section className="container px-4 mx-auto mb-16 md:px-8">
    <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
      Products
    </h2>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  </section>
)

export default ProductGridSkeleton
