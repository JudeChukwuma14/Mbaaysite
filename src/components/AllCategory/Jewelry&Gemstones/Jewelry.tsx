import React, { useEffect, useState } from "react";
import ProductCard2 from "@/components/Cards/ProductCard2";
import { FaRegSadTear, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAllProduct } from "@/utils/productApi";
import HandmadeJewelry from "@/assets/image/HandmadeJewelry.jpg";
import Gemstones from "@/assets/image/Gemstones.jpg";
import JewelryMaterials from "@/assets/image/JewelryMaterials.jpg";
import SustainableJewelry from "@/assets/image/EthicallySourced.jpg";
import menJewelry from "@/assets/image/menJewelry.jpg";
import childrenJewelry from "@/assets/image/childrenJewelry.jpg";
import OccasionJewelry from "@/assets/image/OccasionJewelry.jpg";
import TraditionalJewelry from "@/assets/image/TraditionalJewelry.jpg";
import GemstoneBirthstone from "@/assets/image/GemstoneBirthstone.jpg";

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
const Jewelry: React.FC = () => {
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
            product.category?.toLowerCase() === "jewelry and gemstones"
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
      image: HandmadeJewelry,
      link: "/handmade-jewelry",
      text: "Handmade Jewelry",
    },
    { image: Gemstones, link: "/gemstones", text: "Gemstones" },
    {
      image: JewelryMaterials,
      link: "/jewelry-materials",
      text: "Jewelry Materials",
    },
    {
      image: SustainableJewelry,
      link: "/sustainable-jewelry",
      text: "Ethically Sourced & Sustainable Jewelry",
    },
    { image: menJewelry, link: "/men-jewelry", text: "Men’s Jewelry" },
    {
      image: childrenJewelry,
      link: "/children-jewelry",
      text: "Children’s Jewelry",
    },
    {
      image: OccasionJewelry,
      link: "/occasion-jewelry",
      text: "Bridal & Special Occasion Jewelry",
    },
    {
      image: TraditionalJewelry,
      link: "/traditional-jewelry",
      text: "Cultural & Traditional Jewelry",
    },
    {
      image: GemstoneBirthstone,
      link: "/gemstone-jewelry",
      text: "Gemstone Jewelry by Birthstone",
    },
  ];

  return (
    <div>
      <div className="py-3 pl-10 mb-10">
        <h3 className="text-xl font-semibold">
          <Link to="/">Home</Link> / Jewelry and Gemstones
        </h3>
      </div>
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
              No Jewelry and GemstonesProducts Found
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
  );
};

export default Jewelry;
