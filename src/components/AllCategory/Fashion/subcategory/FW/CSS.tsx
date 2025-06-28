import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getAllProduct } from "@/utils/productApi";
import {
  FaChevronRight,
  FaHome,
  FaRegSadTear,
  FaShoppingCart,
} from "react-icons/fa";
import { motion, Variants } from "framer-motion";
import NewArrival from "@/components/Cards/NewArrival";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  createdAt?: string;
  category: string;
  sub_category?: string;
  sub_category2?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <motion.div
    variants={childVariants}
    className="flex flex-col items-center justify-center py-16 text-center"
    role="alert"
  >
    <FaRegSadTear className="mb-4 text-5xl text-gray-300" aria-hidden="true" />
    <h2 className="mb-2 text-2xl font-semibold text-gray-400">Error</h2>
    <p className="max-w-md mb-6 text-gray-500">{message}</p>
    <Link
      to="/shop"
      className="flex items-center gap-2 px-6 py-2 font-medium text-white transition duration-300 bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
      aria-label="Continue shopping"
    >
      <FaShoppingCart aria-hidden="true" />
      Continue Shopping
    </Link>
  </motion.div>
);

const EmptyState: React.FC = () => (
  <motion.div
    variants={childVariants}
    className="flex flex-col items-center justify-center py-16 text-center"
    role="region"
    aria-label="No products found"
  >
    <FaRegSadTear className="mb-4 text-5xl text-gray-300" aria-hidden="true" />
    <h2 className="mb-2 text-2xl font-semibold text-gray-400">
      No Custom Shoes & Sandals Products Found
    </h2>
    <p className="max-w-md mb-6 text-gray-500">
      No products are available in this category. Browse our shop to find other great products!
    </p>
    <Link
      to="/shop"
      className="flex items-center gap-2 px-6 py-2 font-medium text-white transition duration-300 bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
      aria-label="Continue shopping"
    >
      <FaShoppingCart aria-hidden="true" />
      Continue Shopping
    </Link>
  </motion.div>
);

const CSS: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const result = await getAllProduct();
        const allProducts = Array.isArray(result) ? result : result.products || [];

        console.log("API Response:", result);
        const uniqueSub2 = [
          ...new Set(allProducts.map((p:any) => p.sub_category2?.trim())),
        ];
        console.log("Unique sub_category2 values:", uniqueSub2);

        const filtered = allProducts.filter((product: Product) => {
          const category = product.category?.toLowerCase() || "";
          const sub1 = product.sub_category?.trim().toLowerCase() || "";
          const sub2 = product.sub_category2?.trim().toLowerCase() || "";
          return (
            category === "fashion clothing and fabrics" &&
            sub1 === "footwear & shoes" &&
            sub2 ===
              "custom shoes & sandals (e.g., ethnic-inspired footwear, made-to-order traditional sandals)"
          );
        });
        console.log("Filtered products:", filtered);
        setProducts(filtered);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        const errorMessage = err.message.includes("Network")
          ? "Network error. Please check your connection and try again."
          : err.response?.status === 404
          ? "No products found for Custom Shoes & Sandals. Try again later."
          : "Failed to fetch Custom Shoes & Sandals products. Please try again.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const sortedProducts = useMemo(
    () =>
      products
        .sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        )
        .slice(0, 10),
    [products]
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-8 py-6"
    >
      <motion.nav
        variants={containerVariants}
        className="flex items-center gap-2 mb-8 text-sm text-gray-600"
        aria-label="Breadcrumb"
      >
        <Link
          to="/"
          className="flex items-center gap-1 transition-colors rounded hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
          aria-label="Home"
        >
          <FaHome aria-hidden="true" />
          Home
        </Link>
        <FaChevronRight className="text-xs" aria-hidden="true" />
        <Link
          to="/fashion"
          className="transition-colors rounded hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          Fashion Clothing and Fabrics
        </Link>
        <FaChevronRight className="text-xs" aria-hidden="true" />
        <Link
          to="/footwear"
          className="transition-colors rounded hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          Footwear & Shoes
        </Link>
        <FaChevronRight className="text-xs" aria-hidden="true" />
        <span className="font-medium text-gray-800">
          Custom Shoes & Sandals
        </span>
      </motion.nav>
      <motion.h1
        variants={childVariants}
        className="mb-6 text-2xl font-bold text-gray-800"
      >
        Custom Shoes & Sandals
      </motion.h1>
      {isLoading ? (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="w-full h-64 bg-gray-200 rounded-lg animate-pulse"
                aria-hidden="true"
              ></div>
            ))}
        </motion.div>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : products.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {sortedProducts.map((product) => (
            <motion.div key={product._id} variants={childVariants}>
              <NewArrival
                product={{
                    ...product,
                  id: product._id,
                  poster: product.images[0] || "/placeholder.svg",
                  
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CSS;