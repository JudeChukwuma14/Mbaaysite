import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import NewArrival from "@/components/Cards/NewArrival";
import { getAllProduct } from "@/utils/productApi";

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

interface ProductApiResponse {
  products: Product[];
}

// interface NewArrivalProps {
//   product: {
//     id: string;
//     name: string;
//     price: number;
//     poster: string;
//     category: string;
//   };
// }

// Skeleton card for loading state
const ProductSkeleton = () => (
  <div className="p-4 bg-white border rounded-lg shadow-sm animate-pulse">
    <div className="w-full h-40 mb-4 bg-gray-200 rounded-md"></div>
    <div className="h-4 mb-2 bg-gray-200 rounded"></div>
    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
  </div>
);

const RandomProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [retryLoading, setRetryLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(30);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "priceAsc" | "priceDesc">(
    "name"
  );
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const fetchProducts = async () => {
    setLoading(true);
    setRetryLoading(true);
    try {
      const result: ProductApiResponse | Product[] = await getAllProduct();
      const productsData = Array.isArray(result)
        ? result
        : result.products || [];
      setProducts(productsData);
      setError("");
    } catch (err: unknown) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
      setRetryLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))].filter(Boolean).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory === "" || p.category === selectedCategory)
    );

    return result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "priceAsc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  }, [products, searchQuery, selectedCategory, sortBy]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPaginationNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3)
        endPage = Math.min(maxVisiblePages - 1, totalPages - 1);
      if (currentPage >= totalPages - 2)
        startPage = Math.max(2, totalPages - maxVisiblePages + 2);

      if (startPage > 2) pageNumbers.push("ellipsis1");
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
      if (endPage < totalPages - 1) pageNumbers.push("ellipsis2");
      if (totalPages > 1) pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="mb-4 text-center text-red-500">{error}</p>
        <button
          onClick={() => fetchProducts()}
          className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 flex items-center justify-center"
          disabled={retryLoading}
        >
          {retryLoading ? (
            <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
            </svg>
          ) : null}
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="flex items-center mb-3 text-sm text-gray-500">
              <Link to="/" className="hover:text-orange-500">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">Products</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
            <p className="mt-2 text-gray-600">
              Browse our wide selection of artisan products.
            </p>
          </div>

          {/* Filter Bar */}
          <div
            className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-sm sm:flex-row sm:items-center sm:gap-3"
            role="search"
          >
            <input
              type="text"
              placeholder="Search products by name..."
              className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              aria-label="Search products by name"
            />
            <div className="relative flex-1">
              <select
                value={selectedCategory}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedCategory(e.target.value)
                }
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSortBy(e.target.value as "name" | "priceAsc" | "priceDesc")
              }
              className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
              aria-label="Sort products"
            >
              <option value="name">Sort by Name</option>
              <option value="priceAsc">Sort by Price: Low to High</option>
              <option value="priceDesc">Sort by Price: High to Low</option>
            </select>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
                setSortBy("name");
              }}
              className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 sm:w-auto"
              aria-label="Clear all filters and sort"
            >
              Clear
            </button>
          </div>

          {/* Mobile Filter Drawer */}
          <div className="sm:hidden mt-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-md"
              aria-label="Toggle filters and sort"
            >
              <Filter size={16} />
              <span>Filter & Sort</span>
            </button>
            {showFilters && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:hidden">
                <div className="w-full max-w-7xl bg-white rounded-t-lg p-4 animate-slide-up">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Filter & Sort</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Close filter drawer"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Search products by name..."
                      className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500"
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchQuery(e.target.value)
                      }
                      aria-label="Search products by name"
                    />
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setSelectedCategory(e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500"
                        aria-label="Filter by category"
                      >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 pointer-events-none">
                        <ChevronDown />
                      </div>
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setSortBy(
                          e.target.value as "name" | "priceAsc" | "priceDesc"
                        )
                      }
                      className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500"
                      aria-label="Sort products"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="priceAsc">
                        Sort by Price: Low to High
                      </option>
                      <option value="priceDesc">
                        Sort by Price: High to Low
                      </option>
                    </select>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("");
                        setSortBy("name");
                        setShowFilters(false);
                      }}
                      className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
                      aria-label="Clear all filters and sort"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product list */}
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : currentProducts.length > 0 ? (
          <div
            className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 sm:gap-6"
            role="grid"
          >
            {currentProducts.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="transition-transform duration-200 hover:scale-105"
                role="gridcell"
                aria-label={`View ${product.name} details`}
              >
                <NewArrival
                  product={{
                    ...product,
                    id: product._id,
                    poster: product.images[0] || "",
                  }}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-200 rounded-full">
              <Filter size={24} className="text-gray-400" />
            </div>
            <h3 className="mb-1 text-lg font-medium text-gray-900">
              {searchQuery || selectedCategory
                ? "No products match your search or filter."
                : "No products found."}
            </h3>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                  setSortBy("name");
                }}
                className="px-4 py-2 mt-4 text-white bg-orange-500 rounded-md hover:bg-orange-600"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 mb-12">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
              <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
            </button>

            <div className="flex gap-2">
              {getPaginationNumbers().map((number, index) =>
                number.toString().includes("ellipsis") ? (
                  <span key={index} className="px-3 py-2 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={number}
                    onClick={() => paginate(number as number)}
                    className={`px-3 py-2 rounded-md min-w-[40px] ${
                      currentPage === number
                        ? "bg-orange-500 text-white"
                        : "bg-white border hover:bg-gray-50"
                    }`}
                    aria-label={`Go to page ${number}`}
                    aria-current={currentPage === number ? "page" : undefined}
                  >
                    {number}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              aria-label="Next page"
            >
              <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RandomProductPage;

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
