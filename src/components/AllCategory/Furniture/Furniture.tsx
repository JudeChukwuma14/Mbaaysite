import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getAllProduct} from "@/utils/productApi";
import {
  FaChevronRight,
  FaHome,
  FaRegSadTear,
  FaShoppingCart,
} from "react-icons/fa";
import { motion, Variants } from "framer-motion";
import NewArrival from "@/components/Cards/NewArrival";


// Define interfaces for type safety
interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  createdAt: string;
  category: string;
  sub_category?: string;
  sub_category2?: string;
}

interface Subcategory {
  image: string;
  link: string;
  text: string;
}

// Static subcategories
const SUBCATEGORIES: Subcategory[] = [
  { image: "https://i.pinimg.com/736x/94/0e/cb/940ecb862d684587726ef15db97b8e8b.jpg", text: "Seating", link: "/seating" },
  { image: "https://i.pinimg.com/736x/8f/41/2e/8f412e3cf0631cd5a8305c542ad3fd36.jpg", text: "Tables", link: "/tables" },
  { image: "https://i.pinimg.com/736x/ef/57/c9/ef57c90f6b83afa9188e43857f203131.jpg", text: "Storage", link: "/storage" },
  { image: "https://i.pinimg.com/736x/e0/d2/d3/e0d2d3e38303b2c6f9fb33098fa0d618.jpg", text: "Bedroom Items", link: "/bedroom-items" },
  { image: "https://i.pinimg.com/736x/08/0f/9f/080f9fe34dd0490d150f6015ecf53cb2.jpg", text: "Décor & Utility", link: "/decor-utility" },
  { image: "https://i.pinimg.com/736x/ef/34/f3/ef34f317f79d6ebacfebe546b0a2a6fa.jpg", text: "Outdoor & Patio", link: "/outdoor-patio" },
];

// Animation variants for containers
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

// Animation variants for child elements (subcategories, products, heading)
const childVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

// Reusable Error Message Component
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <FaRegSadTear className="mb-4 text-5xl text-gray-300" aria-hidden="true" />
    <h2 className="mb-2 text-2xl font-semibold text-gray-800">Something Went Wrong</h2>
    <p className="max-w-md mb-6 text-gray-600">{message}</p>
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

// Reusable Empty State Component
const EmptyState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <FaRegSadTear className="mb-4 text-5xl text-gray-300" aria-hidden="true" />
    <h2 className="mb-2 text-2xl font-semibold text-gray-800">
      No Handmade Furniture Products Found
    </h2>
    <p className="max-w-md mb-6 text-gray-600">
      No products are available in this category. Browse our shop to find your favorite products!
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

// Reusable Subcategory Card Component
const SubcategoryCard: React.FC<Subcategory> = ({ image, link, text }) => (
  <motion.div variants={childVariants}>
    <Link to={link} className="focus:outline-none focus:ring-2 focus:ring-orange-400">
      <div className="flex flex-col items-center justify-center group">
        <div className="flex items-center justify-center w-24 h-24 mb-2 overflow-hidden bg-gray-100 rounded-full shadow-md md:w-32 md:h-32">
          <img
            src={image}
            alt={text}
            width={300}
            height={300}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <p className="text-sm font-medium text-center text-gray-800 group-hover:text-orange-500">
          {text}
        </p>
      </div>
    </Link>
  </motion.div>
);

const Furniture: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const result = await getAllProduct();
        const allProducts = Array.isArray(result)
          ? result
          : result.products || [];

        const filtered = allProducts.filter(
          (product: Product) =>
            product.category?.toLowerCase() === "handmade furniture"
        );

        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Memoize sorted products for two rows (10 products)
  const sortedProducts = useMemo(
    () =>
      products
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 10), // Limit to 10 products for 2 rows on xl screens
    [products]
  );

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50"
    >
      <div className="container px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <motion.nav
          variants={containerVariants}
          className="flex items-center gap-2 mb-8 text-sm text-gray-600"
          aria-label="Breadcrumb"
        >
          <Link
            to="/"
            className="flex items-center gap-1 transition-colors hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
            aria-label="Home"
          >
            <FaHome aria-hidden="true" />
            Home
          </Link>
          <FaChevronRight className="text-xs" aria-hidden="true" />
          <span className="font-medium text-gray-800">Handmade Furniture</span>
        </motion.nav>

        {/* Subcategories */}
        <motion.section
          variants={containerVariants}
          className="mb-12"
          aria-labelledby="subcategories-heading"
        >
          <h2 id="subcategories-heading" className="sr-only">
            Subcategories
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {SUBCATEGORIES.map((item, index) => (
              <SubcategoryCard key={index} {...item} />
            ))}
          </div>
        </motion.section>

        {/* Products Section */}
        <motion.section
          variants={containerVariants}
          aria-labelledby="products-heading"
        >
          <motion.h2
            id="products-heading"
            variants={childVariants}
            className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl"
          >
            Featured Products
          </motion.h2>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center py-16"
            >
              <div className="w-12 h-12 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div>
            </motion.div>
          ) : products.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {sortedProducts.map((product) => (
                <motion.div key={product._id} variants={childVariants}>
                  <NewArrival
                    product={{
                      ...product,
                      id: product._id,
                      poster: product.images[0] || "",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </motion.div>
  );
};

export default Furniture;