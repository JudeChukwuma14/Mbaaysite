import React, { useState } from "react";
import { FiHeart, FiPlus, FiX, FiChevronDown } from "react-icons/fi";
import img from "../../assets/image/abt1.png";

const products = [
  {
    id: 1,
    name: "Relaxed blazer",
    price: "$348",
    image: img,
  },
  {
    id: 2,
    name: "Alpaca Wool Cropped Cardigan",
    price: "$248",
    image: img,
  },
  {
    id: 3,
    name: "Silk Wide-Leg Pant",
    price: "$24",
    image: img,
  },
  {
    id: 4,
    name: "Classic Pant",
    price: "$58",
    image: img,
  },
];

const Fashion: React.FC = () => {
  return (
    <div className="p-6 md:p-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span>Home</span> / <span className="font-semibold">Cart</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Shop</h1>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          "Outerwear",
          "Dresses",
          "Skirts",
          "Pants & Leggings",
          "Stretch",
          "Lounge",
        ].map((category, index) => (
          <button
            key={index}
            className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:border-black transition"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const ProductCard: React.FC<{
  product: { id: number; name: string; price: string; image: string };
}> = ({ product }) => {
  const [showAddToCart, setShowAddToCart] = useState(false);

  const toggleAddToCart = () => {
    setShowAddToCart((prev) => !prev);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg transition relative">
      <div className="h-64 flex justify-center items-center bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="object-contain h-full"
        />
        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition">
          <FiHeart size={20} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-sm font-semibold">{product.name}</h3>
        <p className="text-sm font-bold">{product.price}</p>
      </div>

      <div
        className={`transition-opacity duration-300 ${
          showAddToCart ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          className="w-full py-2 bg-orange-400 text-white flex justify-center items-center gap-2 hover:bg-orange-500 transition"
          onClick={toggleAddToCart}
        >
          <FiPlus size={18} />
          <span>Add to Cart</span>
        </button>
      </div>
      <button
        className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
        onClick={toggleAddToCart}
      >
        {showAddToCart ? <FiX size={20} /> : <FiChevronDown size={20} />}
      </button>
    </div>
  );
};

export default Fashion;
