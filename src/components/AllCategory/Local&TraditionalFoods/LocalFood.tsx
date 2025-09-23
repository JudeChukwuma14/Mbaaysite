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



// Define interfaces for type safety
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

interface Subcategory {
  image: string;
  link: string;
  text: string;
}

// Static subcategories
const SUBCATEGORIES: Subcategory[] = [
  { image: "https://i.pinimg.com/736x/8c/24/3c/8c243cc8e49925b96f1cac71cd39de6d.jpg", text: "Staple Foods", link: "/StapleFoods" },
  { image: "https://i.pinimg.com/736x/f7/f9/70/f7f970ab5863f61dccbf537c778bbb44.jpg", text: "Specialty Grains & Legumes", link: "/SpecialtyGrains" },
  { image: "https://i.pinimg.com/736x/d4/45/72/d44572a1377ff38b905ee0f1f2e93836.jpg", text: "Traditional Snacks & Street Foods", link: "/TraditionalSnacks" },
  { image: "https://i.pinimg.com/736x/ab/05/6a/ab056ac4af088946df08d582c48e1f25.jpg", text: "Indigenous Baked Goods", link: "/IndigenousBake" },
  { image: "https://i.pinimg.com/736x/bd/41/fc/bd41fcca77a123f8051bcb4694752f51.jpg", text: "Traditional Soups & Stews", link: "/TraditionalSoup" },
  { image: "https://i.pinimg.com/736x/1b/38/26/1b3826d79f7bc7f45f4a07fc31df459e.jpg", text: "Fermented & Preserved Foods", link: "/FermentedFood" },
  { image: "https://i.pinimg.com/736x/39/d4/32/39d432048883f46dfe0a4e92bdea2d05.jpg", text: "Local Beverages", link: "/LocalBeverages" },
  { image: "https://i.pinimg.com/736x/68/c3/01/68c30124e1c273f0594322210684035c.jpg", text: "Regional & Ethnic Foods", link: "/RegionalEthnicFood" },
  { image: "https://i.pinimg.com/736x/d7/50/08/d750084792b2e3dfa183e81356d1af41.jpg", text: "Ethnic Sauces, Spices & Seasonings", link: "/EthinicSauces" },
  { image: "https://i.pinimg.com/736x/ec/84/be/ec84bedee518ce4d22c2ed4f1babc762.jpg", text: "Culturally Specific Food Categories", link: "/CulturallySpecific" },
  { image: "https://i.pinimg.com/736x/69/b1/84/69b184f5da8171481bf9116831421f05.jpg", text: "Traditional Sweets & Desserts", link: "/TraditionalSweet" },
  { image: "https://i.pinimg.com/736x/48/21/4b/48214b21418ba149b90c9a3589a65245.jpg", text: "Packaged & Ready-to-Eat Foods", link: "/PackagedReadyFood" },
  { image: "https://i.pinimg.com/736x/aa/5d/80/aa5d80dc85227846af3eafcb19830a52.jpg", text: "Traditional Oils & Fats", link: "/TraditionalOil" },
  { image: "https://i.pinimg.com/736x/96/89/43/9689436d5d44b6732d214229a3dd9e6d.jpg", text: "Local Grains & Flours", link: "/LocalGrains" },
  { image: "https://i.pinimg.com/736x/2d/6c/01/2d6c01b64bddcf654ad429b4dcc00624.jpg", text: "Fermented & Pickled Foods", link: "/PickledFood" },
  { image: "https://i.pinimg.com/736x/15/21/cd/1521cdb184809bc64671c11f21470ade.jpg", text: "Cultural Holiday & Festival Foods", link: "/FestivalFood" },
  { image: "https://i.pinimg.com/736x/9f/64/b9/9f64b9e23d2eefd6112e3598c2bf7e53.jpg", text: "Meal Plans & Subscription Boxes", link: "/MealPlans" },

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
      to="/random-product"
      className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors duration-200 bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
      No Local & Traditional Foods Products Found
    </h2>
    <p className="max-w-md mb-6 text-gray-600">
      No products are available in this category. Browse our shop to find your favorite products!
    </p>
    <Link
      to="/random-product"
      className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors duration-200 bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
    <Link to={link} className="rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
      <div className="flex flex-col items-center justify-center group">
        <div className="flex items-center justify-center w-24 h-24 mb-3 overflow-hidden bg-gray-100 rounded-full shadow-md sm:w-28 sm:h-28 md:w-32 md:h-32">
          <img
            src={image}
            alt={text}
            width={300}
            height={300}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <p className="text-sm font-medium text-center text-gray-800 group-hover:text-orange-600 line-clamp-2">
          {text}
        </p>
      </div>
    </Link>
  </motion.div>
);

const LocalFoods: React.FC = () => {
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
            product.category?.toLowerCase() === "local & traditional foods"
        );

        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch local foods. Please try again later.");
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
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
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
            className="flex items-center gap-1 transition-colors rounded hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            aria-label="Home"
          >
            <FaHome aria-hidden="true" />
            Home
          </Link>
          <FaChevronRight className="text-xs" aria-hidden="true" />
          <span className="font-medium text-gray-800">Local & Traditional Foods</span>
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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

export default LocalFoods;