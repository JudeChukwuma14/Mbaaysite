import React, { useEffect, useState } from "react";
import ProductCard2 from "@/components/Cards/ProductCard2";
import Vintagetextiles from "@/assets/image/VintageTextiles.jpg";
import Vintageclothing from "@/assets/image/VintageClothing.jpg";
import VintageHome from "@/assets/image/VintageHomeDecor.jpg";
import VintageInstruments from "@/assets/image/VintageInstruments.jpg";
import VintageArt from "@/assets/image/VintageArt.jpg";
import VintageFurniture from "@/assets/image/VintageFurniture.jpg";
import VintageHandicrafts from "@/assets/image/VintageHandicrafts.jpg";
import VintageR from "@/assets/image/VintageR.jpg";
import VintageStorage from "@/assets/image/VintageStorage.jpg";
import { Link } from "react-router-dom";
import { FaChevronRight, FaHome, FaRegSadTear, FaShoppingCart } from "react-icons/fa";
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
const Vintage: React.FC = () => {
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
            product.category?.toLowerCase() === "vintage"
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
    {
      image: Vintagetextiles,
      link: "/vintagetextiles",
      text: "Vintage Textiles and Fabrics",
    },
    {
      image: Vintageclothing,
      link: "/Vintage-Clothing",
      text: "Vintage Clothing",
    },
    { image: VintageHome, link: "/Vintage-Home", text: "Vintage Home Decor" },
    {
      image: VintageInstruments,
      link: "/Vintage-Instruments",
      text: "Vintage Instruments",
    },
    { image: VintageArt, link: "/Vintage-Art", text: "Vintage Art" },
    {
      image: VintageFurniture,
      link: "/Vintage-Furniture",
      text: "Vintage Furniture",
    },
    {
      image: VintageHandicrafts,
      link: "/Vintage-Handicrafts",
      text: "Vintage Handicrafts",
    },
    {
      image: VintageR,
      link: "/Vintage-Religious",
      text: "Vintage Religious and Spiritual Items",
    },
    {
      image: VintageStorage,
      link: "/Vintage-Storage",
      text: "Vintage Storage",
    },
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
          <span className="font-medium text-gray-800">Vintage</span>
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
                No Vintage Product Found
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

export default Vintage;
