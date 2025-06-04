import React, { useEffect, useState } from "react";
import image from "@/assets/image/Group 14.png";
import ProductCard2 from "@/components/Cards/ProductCard2";
import { getAllProduct } from "@/utils/productApi";
import { FaChevronRight, FaHome, FaRegSadTear, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
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

const TranditionalFabrics: React.FC = () => {
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
            product.category?.toLowerCase() === "traditional clothing & fabrics"
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
    { image: image, text: "Men’s Traditional Wear", link: "/MenTraditional" },
    { image: image, text: "Women’s Traditional Wear", link: "/WomenTranditional" },
    { image: image, text: "Children’s Traditional Wear", link: "/ChildrenTranditional" },
    { image: image, text: "Unisex Traditional Clothing", link: "/UnisexTranditional" },
    { image: image, text: "Modern Clothing with Traditional Influence", link: "/FashionSpecific" },
    { image: image, text: "Footwear & Shoes", link: "/Footwear" },
    { image: image, text: "Cultural Accessories & Adornments", link: "/CulturalAccessories" },
    { image: image, text: "Fabrics & Textiles", link: "/FabricsTextiles" },
    { image: image, text: "Cultural Footwear for Specific Occasions", link: "/CulturalFootwear" },
    { image: image, text: "Cultural & Festival Clothing", link: "/FestivalClothing" },
    { image: image, text: "Bespoke & Tailored Clothing", link: "/TailoredClothing" },
    { image: image, text: "Sustainable & Ethical Fashion", link: "/EthicalFashion" },
    { image: image, text: "Traditional Embroidery & Design Work", link: "/TraditionalEmbroidery" },
    { image: image, text: "Fashion for Specific Cultures & Regions", link: "/FashionSpecific" },
    { image: image, text: "Seasonal & Special Occasion Fashion", link: "/OccasionFashion" },
    { image: image, text: "Other Functional Categories", link: "/FunctionalCategories" },
    { image: image, text: "By Country or Region", link: "/CountryRegional" },
    { image: image, text: "By Fabric Type", link: "/FabricType" },
  ];


  return (
    <div className="min-h-screen ">
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
          <span className="font-medium text-gray-800">Traditional Clothing and Fabrics</span>
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
                No Traditional Clothing & Fabrics Product Found
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

export default TranditionalFabrics;
