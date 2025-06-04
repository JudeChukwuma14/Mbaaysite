import React, { useEffect, useState } from "react";
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


  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8 mx-auto lg:px-8">
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
