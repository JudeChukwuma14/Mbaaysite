
import { useState, useEffect } from "react";
import { Heart, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  colors?: string[];
}

interface CategoryFilter {
  id: string;
  name: string;
}

export default function FashionJewelry() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>(["Outerwear"]);
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const categoryFilters: CategoryFilter[] = [
    { id: "outerwear", name: "Outerwear" },
    { id: "dresses", name: "Dresses" },
    { id: "skirts", name: "Skirts" },
    { id: "pants", name: "Pants & Leggings" },
    { id: "sweaters", name: "Sweaters" },
    { id: "lounge", name: "Lounge" },
  ];

  // Mock products data (unchanged for brevity)
  const mockProducts: Product[] = [
    { id: "1", name: "Belted Blazer", price: 248, image: "/placeholder.svg?height=400&width=300", colors: ["#D2C0B0", "#000000"] },
    { id: "2", name: "Alpaca Wool Cropped Cardigan", price: 245, image: "/placeholder.svg?height=400&width=300", colors: ["#D2B48C"] },
    { id: "3", name: "Silk Wide Leg Pant", price: 175, image: "/placeholder.svg?height=400&width=300", colors: ["#000000"] },
    { id: "4", name: "Classic Pant", price: 158, image: "/placeholder.svg?height=400&width=300", colors: ["#000000", "#FFFFFF"] },
    { id: "5", name: "Maxi Skirt", price: 128, image: "/placeholder.svg?height=400&width=300", colors: ["#000000"] },
    { id: "6", name: "Single Origin Cashmere Cropped Sweater", price: 198, image: "/placeholder.svg?height=400&width=300", colors: ["#A0522D"] },
    { id: "7", name: "Poplin Oversized Shirt", price: 104, image: "/placeholder.svg?height=400&width=300", colors: ["#FFFFFF"] },
    { id: "8", name: "Cashmere Funnel Neck Sweater", price: 178, image: "/placeholder.svg?height=400&width=300", colors: ["#F5F5DC"] },
    { id: "9", name: "Cashmere Cardigan", price: 248, image: "/placeholder.svg?height=400&width=300", colors: ["#F5F5DC"] },
    { id: "10", name: "Slim Mock Turtleneck Tee", price: 110, image: "/placeholder.svg?height=400&width=300", colors: ["#3A181A"] },
    { id: "11", name: "Silk Pleated Skirt", price: 248, image: "/placeholder.svg?height=400&width=300", colors: ["#F5F5DC"] },
    { id: "12", name: "Charmeusse Shorts", price: 78, image: "/placeholder.svg?height=400&width=300", colors: ["#F5F5DC"] },
  ];

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 800);
  }, []);

  const toggleWishlist = (id: string) =>
    setWishlist(wishlist.includes(id) ? wishlist.filter((wid) => wid !== id) : [...wishlist, id]);

  const toggleFilter = (id: string) =>
    setActiveFilters(activeFilters.includes(id) ? activeFilters.filter((fid) => fid !== id) : [...activeFilters, id]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(b.name);
    return parseInt(b.id) - parseInt(a.id); // newest
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="text-3xl font-light text-gray-900">Women's Collection</h1>
        <p className="mt-2 text-gray-500">Timeless essentials designed to elevate your everyday</p>

        <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map(({ id, name }) => (
              <button
                key={id}
                onClick={() => toggleFilter(name)}
                className={`px-4 py-2 text-sm rounded-full border ${activeFilters.includes(name)
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-800 border-gray-300 hover:border-gray-900"
                  }`}
              >
                {name}
              </button>
            ))}
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 text-sm border border-gray-300 rounded"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] mb-4"></div>
                <div className="w-3/4 h-4 mb-2 bg-gray-200 rounded"></div>
                <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {currentProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute flex items-center justify-center w-8 h-8 rounded-full top-3 right-3 bg-white/80 hover:bg-white"
                  >
                    <Heart
                      className={`w-4 h-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                    />
                  </button>
                  <button className="absolute flex items-center justify-center w-8 h-8 rounded-full opacity-0 bottom-3 right-3 bg-white/80 group-hover:opacity-100 hover:bg-white">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm text-gray-700">{product.name}</h3>
                  <p className="mt-1 text-sm font-medium text-gray-900">${product.price}</p>
                  {product.colors && (
                    <div className="flex gap-1 mt-2">
                      {product.colors.map((color) => (
                        <div key={color} className="w-4 h-4 border border-gray-300 rounded-full" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && !loading && (
          <nav className="flex justify-center gap-1 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-md ${currentPage === page ? "bg-gray-900 text-white" : "hover:bg-gray-50"}`}
                >
                  {page}
                </button>
              );
            })}
            {totalPages > 5 && <span>...</span>}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}