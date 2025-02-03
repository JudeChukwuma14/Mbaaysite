import React, { useState } from "react";

const ProductDetail: React.FC = () => {
  // State for quantity and selected size
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("M");

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

  // Handle buy now action
  const handleBuyNow = () => {
    alert(`Buying ${quantity} item(s) in size ${selectedSize}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Gallery */}
        <div>
          <div className="mb-4">
            <img
              src="https://img.freepik.com/free-photo/colorful-knitted-fabric_58702-1828.jpg?t=st=1737721644~exp=1737725244~hmac=99dfe62a7bd740d415d61e05cf6cd447d34e6b1602e0da3a729caf4ed1ac8c02&w=996" // Replace with your image URL
              alt="Product"
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, idx) => (
              <img
                key={idx}
                src="https://img.freepik.com/free-photo/colorful-knitted-fabric_58702-1828.jpg?t=st=1737721644~exp=1737725244~hmac=99dfe62a7bd740d415d61e05cf6cd447d34e6b1602e0da3a729caf4ed1ac8c02&w=996" // Replace with thumbnail URLs
                alt={`Thumbnail ${idx + 1}`}
                className="w-16 h-16 object-cover rounded-lg border hover:ring-2 ring-orange-500 cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold">T-shirt</h1>
          <p className="text-gray-600 mt-2">$192.00</p>

          <p className="text-sm text-gray-500 mt-4">
            High-quality vinyl with easy bubble-free install & mess-free removal. Pressure sensitive.
          </p>

          {/* Colors Section */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Colours:</h3>
            <div className="flex gap-2">
              <button className="w-6 h-6 bg-gray-700 rounded-full border border-gray-300"></button>
              <button className="w-6 h-6 bg-orange-500 rounded-full border border-gray-300"></button>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Size:</h3>
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
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={() => handleQuantityChange("decrement")}
              className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => handleQuantityChange("increment")}
              className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200"
            >
              +
            </button>
          </div>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            className="mt-6 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Related Items Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Related Items</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <img
                src="https://img.freepik.com/free-photo/colorful-knitted-fabric_58702-1828.jpg?t=st=1737721644~exp=1737725244~hmac=99dfe62a7bd740d415d61e05cf6cd447d34e6b1602e0da3a729caf4ed1ac8c02&w=996"
                alt="Related Item"
                className="w-full h-40 object-cover rounded-lg mb-2"
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
