import React, { useEffect, useState } from "react";
import image from "@/assets/image/Group 14.png";
import ProductCard2 from "../../Cards/ProductCard2";
import { FaChevronRight, FaHome, FaRegSadTear, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAllProduct } from "@/utils/productApi";
import { motion } from 'framer-motion';

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
const LocalFood: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getAllProduct();
        const allProducts = Array.isArray(result)
          ? (result as Product[])
          : result.products || [];

        //
        const filtered = allProducts.filter(
          (product: Product) =>
            product.category?.toLowerCase() === "local & traditional foods"
        );

        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please try again.");
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FaRegSadTear className="mb-4 text-5xl text-gray-300" />
        <h2 className="mb-2 text-2xl font-semibold text-gray-400">Error</h2>
        <p className="max-w-md mb-6 text-gray-500">{error}</p>
        <Link
          to="/shop"
          className="flex items-center gap-2 px-6 py-2 font-medium text-white transition duration-300 bg-orange-500 rounded-lg hover:bg-orange-600"
        >
          <FaShoppingCart />
          Continue Shopping
        </Link>
      </div>
    );
  }

  const ImagePart: Subcategory[] = [
    { image: image, text: "Staple Foods", link: "/StapleFoods" },
    { image: image, text: "Specialty Grains & Legumes", link: "/SpecialtyGrains" },
    { image: image, text: "Traditional Snacks & Street Foods", link: "/TraditionalSnacks" },
    { image: image, text: "Indigenous Baked Goods", link: "/IndigenousBake" },
    { image: image, text: "Traditional Soups & Stews", link: "/TraditionalSoup" },
    { image: image, text: "Fermented & Preserved Foods", link: "/FermentedFood" },
    { image: image, text: "Local Beverages", link: "/LocalBeverages" },
    { image: image, text: "Regional & Ethnic Foods", link: "/RegionalEthnicFood" },
    { image: image, text: "Ethnic Sauces, Spices & Seasonings", link: "/EthinicSauces" },
    { image: image, text: "Culturally Specific Food Categories", link: "/CulturallySpecific" },
    { image: image, text: "Traditional Sweets & Desserts", link: "/TraditionalSweet" },
    { image: image, text: "Packaged & Ready-to-Eat Foods", link: "/PackagedReadyFood" },
    { image: image, text: "Traditional Oils & Fats", link: "/TraditionalOil" },
    { image: image, text: "Local Grains & Flours", link: "/LocalGrains" },
    { image: image, text: "Fermented & Pickled Foods", link: "/PickledFood" },
    { image: image, text: "Cultural Holiday & Festival Foods", link: "/FestivalFood" },
    { image: image, text: "Meal Plans & Subscription Boxes", link: "/MealPlans" },
  ];


  return (
    <div className="min-h-screen">
      <div className="container px-4  lg:px-8 py-8 mx-auto">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-8 text-sm text-gray-600"
        >
          <a href="/" className="flex items-center gap-1 transition-colors hover:text-orange-500">
            <FaHome />
            Home
          </a>
          <FaChevronRight className="text-xs" />
          <span className="font-medium text-gray-800">Local & Traditional Foods</span>
        </motion.nav>
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-3 lg:grid-cols-5">
            {ImagePart.map((item, index) => (
              <Link to={item.link} key={index}>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center w-32 h-32 mb-2 overflow-hidden bg-gray-100 rounded-full shadow-lg">
                    <img
                      src={item.image}
                      alt={item.text}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full transition-transform duration-300 transform hover:scale-105"
                    />
                  </div>
                  <p className="text-center">{item.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FaRegSadTear className="mb-4 text-5xl text-gray-300" />
              <h2 className="mb-2 text-2xl font-semibold text-gray-400">
                No Local & Traditional Foods Product Found
              </h2>
              <p className="max-w-md mb-6 text-gray-500">
                No products are available in this category. Browse our shop to
                find your favorite products!
              </p>
              <Link
                to="/random-product"
                className="flex items-center gap-2 px-6 py-2 font-medium text-white transition duration-300 bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                <FaShoppingCart />
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid items-center grid-cols-1 gap-4 px-4 py-8 md:grid-cols-3 lg:grid-cols-5">
              {products
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 10)
                .map((product) => (
                  <ProductCard2
                    key={product._id}
                    image={product.images[0] || ""}
                    name={product.name}
                    price={product.price.toString()}
                    rating={4} // Replace with actual rating if available
                    label="sales!" // Replace with dynamic label if applicable
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocalFood;
