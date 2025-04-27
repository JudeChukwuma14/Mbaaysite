import React, { useEffect, useState } from "react";
import ProductCard2 from "@/components/Cards/ProductCard2";
import TextilesFabrics from "@/assets/image/TextilesFabrics.jpg";
import CeramicsPottery from "@/assets/image/CeramicsPottery.jpg";
import Woodcraft from "@/assets/image/Woodcraft.jpg";
import Metalwork from "@/assets/image/Metalwork.jpg";
import BasketsWeaving from "@/assets/image/BasketsWeaving.jpg";
import Glasswork from "@/assets/image/Glasswork.jpg";
import LeatherGoods from "@/assets/image/LeatherGoods.jpg";
import BeadedDecor from "@/assets/image/BeadedDecor.jpg";
import StoneMarbleCrafts from "@/assets/image/StoneMarbleCrafts.jpg";
import HandcraftedLamps from "@/assets/image/HandcraftedLighting.jpg";
import WallArt from "@/assets/image/WallArt.jpg";
import JewelryTrinketBoxes from "@/assets/image/JewelryTrinket.jpg";
import Mirrors from "@/assets/image/Mirrors.jpg";
import HandwovenMats from "@/assets/image/HandwovenCarpets.jpg";
import HandcraftedKitchenware from "@/assets/image/HandcraftedKitchenware.jpg";
import { FaRegSadTear, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAllProduct } from "@/utils/productApi";

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
const HomeDecor: React.FC = () => {
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
              product.category?.toLowerCase() === "Home Décor and Accessories"
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
    { image: TextilesFabrics, link:"/textiles", text: "Textiles and Fabrics" },
    { image: CeramicsPottery, link:"/ceramics-pottery", text: "Ceramics and Pottery" },
    { image: Woodcraft, link:"/woodcraft", text: "Woodcraft" },
    { image: Metalwork, link:"/metalwork", text: "Metalwork" },
    { image: BasketsWeaving, link:"/baskets-weaving", text: "Baskets and Weaving" },
    { image: Glasswork, link:"/glasswork", text: "Glasswork" },
    { image: LeatherGoods, link:"/leather-woods", text: "Leather Goods" },
    { image: BeadedDecor, link:"/beaded-decor", text: "Beaded Decor" },
    { image: StoneMarbleCrafts, link:"/stone-marble", text: "Stone and Marble Crafts" },
    { image: HandcraftedLamps, link:"/handcrafted", text: "Handcrafted Lamps and Lighting" },
    { image: WallArt, link:"/wall-art", text: "Wall Art" },
    { image: JewelryTrinketBoxes, link:"/jewelry-trinket", text: "Jewelry and Trinket Boxes" },
    { image: Mirrors, link:"/mirrors", text: "Mirrors" },
    { image: HandwovenMats, link:"/handwoven", text: "Handwoven Mats and Carpets" },
    { image: HandcraftedKitchenware, link:"/handcrafted-kitchenware", text: "Handcrafted Kitchenware" },
  ];

  return (
    <div>
      <div className="py-3 pl-10 mb-10">
        <h3 className="text-xl font-semibold">
          <Link to="/">Home</Link> / Home Décor and Accessories
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
              No Books and Poetry Products Found
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

export default HomeDecor;
