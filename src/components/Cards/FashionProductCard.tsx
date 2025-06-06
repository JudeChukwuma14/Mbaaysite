

import { Heart, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface FashionProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  colors?: string[];
  isInWishlist: boolean;
  toggleWishlist: (id: string) => void;
}

const FashionProductCard: React.FC<FashionProductCardProps> = ({
  id,
  name,
  price,
  image,
  colors,
  isInWishlist,
  toggleWishlist,
}) => {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group"
    >
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full group-hover:scale-105"
        />
        <button
          onClick={() => toggleWishlist(id)}
          className="absolute flex items-center justify-center w-6 h-6 rounded-full top-2 right-2 bg-white/80 hover:bg-white"
        >
          <Heart
            className={`w-4 h-4 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </button>
        <button className="absolute flex items-center justify-center w-6 h-6 rounded-full opacity-0 bottom-2 right-2 bg-white/80 group-hover:opacity-100 hover:bg-white">
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <h3 className="mt-2 text-sm text-gray-700">{name}</h3>
      <p className="text-sm font-medium text-gray-900">${price}</p>
      {colors && (
        <div className="flex gap-1 mt-1">
          {colors.map((color) => (
            <div
              key={color}
              className="w-3 h-3 border rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FashionProductCard;