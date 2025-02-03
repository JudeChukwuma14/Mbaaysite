import React from "react";

interface ProductCardProps {
  label: string;
  image: string;
  name: string;
  price: string;
  rating: number; // Rating out of 5
}

const ProductCard2: React.FC<ProductCardProps> = ({
  label,
  image,
  name,
  price,
  rating,
}) => {
  return (
    <div className="max-w-sm  bg-white border border-gray-200 shadow-lg overflow-hidden">
      {/* Label Section */}
      <div className="relative">
        <div className="absolute top-2 left-2 bg-white text-xs px-2 py-1 rounded-full">
          {label}
        </div>
        {/* Image Section */}
        <div className=" h-72 w-full bg-[#f9a000] flex justify-center items-center">
          <img src={image} alt={name} className="h-40 w-auto object-contain" />
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4 text-left">
        {/* Rating Section */}
        <div className="flex items-center space-x-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        {/* Product Name */}
        <h2 className="text-lg font-medium text-gray-800">{name}</h2>
        {/* Price */}
        <p className="text-lg font-semibold text-gray-600">{price}</p>
      </div>
    </div>
  );
};

export default ProductCard2;
