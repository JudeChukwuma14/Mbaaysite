import NewArrival from "@/components/Cards/NewArrival";
import Spinner from "@/components/Common/Spinner";
import { getAllProduct } from "@/utils/productApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string; // Added category field for filtering
}

const RandomProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [itemsPerPage] = useState(80); // Number of items per page
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Selected category for filtering

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getAllProduct();
        const productsData = Array.isArray(result) ? result : result.products || [];
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique categories from products for the dropdown
  const categories = [...new Set(products.map((product) => product.category))];
  categories.unshift(""); // Add empty option for "All"

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section>
      <div className="flex items-center justify-between w-full px-8 py-8">
        <div>
          <Link to="/" className="font-semibold text-orange-600">
            Home
          </Link>{" "}
          / <span>Product</span>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border-2 rounded-full outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category || "Uncategorized"}
            </option>
          ))}
        </select>
      </div>

      <div className="px-8 mb-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {currentProducts.map((product) => (
            <NewArrival
              key={product._id}
              product={{
                ...product,
                id: product._id,
                poster: product.images[0] || "",
              }}
            />
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 mx-1 ${currentPage === number ? "bg-orange-500 text-white" : "bg-gray-300"} rounded`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default RandomProductPage;