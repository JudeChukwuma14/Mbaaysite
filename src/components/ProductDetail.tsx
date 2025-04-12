import React, {  useState } from "react";
import {  useParams } from "react-router-dom";
import { ProductData } from "./mockdata/data";
import { motion } from "framer-motion";
// import { getProductsById } from "@/utils/productApi";
// import { toast } from "react-toastify";
// import Spinner from "./Common/Spinner";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const [products, setProduct] = useState(null);
  // const [mainImage, setMainImage] = useState("");
  // const navigate = useNavigate();

  // State for quantity and selected size
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const product = ProductData.find((value) => value.id === id);

  // Handle size selection
  const handleSizeChange = (size: string) => setSelectedSize(size);

  // Handle quantity increment/decrement
  const handleQuantityChange = (type: "increment" | "decrement") => {
    setQuantity((prev) => {
      if (type === "increment") return prev + 1;
      if (type === "decrement" && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handleBuyNow = () => {
    alert(`Buying ${quantity} item(s) in size ${selectedSize}`);
  };

  // useEffect(() => {
  //   if (!id) {
  //     console.error("No product ID provided, redirecting to home...");
  //     navigate("/"); // Redirect to home if no ID
  //     return;
  //   }

  //   const fetchProduct = async () => {
  //     try {
  //       const data = await getProductsById(id);
  //       setProduct(data.product);
  //       setMainImage(data.product.images[0]); // Set the first image as default
  //     } catch (error) {
  //       console.error("Error fetching product:", error);
  //       if (error.message.includes("Cast to ObjectId failed")) {
  //         toast.error("Invalid product ID");
  //         navigate("/"); // Redirect if the ID is invalid
  //       }
  //     }
  //   };

  //   fetchProduct();
  // }, [id, navigate]);

  // if (!products) return <Spinner/>
  return (
    <div className="max-w-4xl p-4 mx-auto md:p-8">
      {/* Product Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <div className="mb-4">
            <img
              src={product?.image} // Replace with your image URL
              alt={product?.title}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, idx) => (
              <img
                key={idx}
                src={product?.image} // Replace with thumbnail URLs
                alt={`Thumbnail ${idx + 1}`}
                className="object-cover w-16 h-16 border rounded-lg cursor-pointer hover:ring-2 ring-orange-500"
              />
            ))}
          </div>
        </div>
{/* 
        <div>
          <img
            src={mainImage}
            alt={products?.title}
            className="w-full rounded-lg shadow-md"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300"; // Fallback image
            }}
          />
          <div className="flex mt-4 space-x-2">
            {products?.images.map((image, i) => (
              <img
                key={i}
                src={image}
                alt={`${products?.title} thumbnail ${i}`}
                className="object-cover w-16 h-16 border border-gray-300 rounded-md cursor-pointer"
                onClick={() => setMainImage(image)}
              />
            ))}
          </div>
        </div> */}

        <div>
          <h1 className="text-2xl font-bold">{product?.title}</h1>
          <p className="mt-2 text-gray-600">${product?.originalPrice}</p>

          <p className="mt-4 text-sm text-gray-500">
            High-quality vinyl with easy bubble-free install & mess-free
            removal. Pressure sensitive.
          </p>

          {/* Colors Section */}
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold">Colours:</h3>
            <div className="flex gap-2">
              <motion.button className="w-6 h-6 bg-gray-700 border border-gray-300 rounded-full"></motion.button>
              <motion.button className="w-6 h-6 bg-orange-500 border border-gray-300 rounded-full"></motion.button>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold">Size:</h3>
            <div className="flex gap-2">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`px-3 py-1 rounded border ${
                    selectedSize === size
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-700 border-gray-300"
                  } hover:bg-orange-500 hover:text-white`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => handleQuantityChange("decrement")}
              className="px-3 py-1 bg-gray-100 border rounded hover:bg-gray-200"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => handleQuantityChange("increment")}
              className="px-3 py-1 bg-gray-100 border rounded hover:bg-gray-200"
            >
              +
            </button>
          </div>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            className="w-full py-2 mt-6 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Related Items Section */}
      <div className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">Related Items</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="p-4 transition border rounded-lg shadow hover:shadow-lg"
            >
              <img
                src="https://img.freepik.com/free-photo/colorful-knitted-fabric_58702-1828.jpg?t=st=1737721644~exp=1737725244~hmac=99dfe62a7bd740d415d61e05cf6cd447d34e6b1602e0da3a729caf4ed1ac8c02&w=996"
                alt="Related Item"
                className="object-cover w-full h-40 mb-2 rounded-lg"
              />
              <p className="text-sm font-medium">Product Name</p>
              <p className="text-sm text-gray-500">$120</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
