import { FiHeart, FiEye } from "react-icons/fi";

interface ProductCardProps {
  image: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
}

const ExploreCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  rating,
  reviews,
}) => {
  return (
    <div className=" p-4 h-[322px] bg-gray-100 group relative">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
      
        {/* Hover Icons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200">
            <FiHeart className="text-gray-600 text-sm" />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200">
            <FiEye className="text-gray-600 text-sm" />
          </button>
        </div>

        {/* Add to Cart Button (Hidden by Default) */}
        <button className="absolute bottom-0 left-0 w-full bg-orange-500 text-white py-2 text-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          Add To Cart
        </button>
      </div>

      {/* Product Info */}
      <h5 className="  mt-3">{title}</h5>
      <div className="flex items-center gap-2">
        <span className="text-red-500 font-bold">${price}</span>
        <div className="flex text-yellow-400">
          {"★".repeat(Math.floor(rating))}
          {"☆".repeat(5 - Math.floor(rating))}
        </div>
        <span className="text-gray-500 text-sm">({reviews})</span>
      </div>
    </div>
  );
};

export default ExploreCard;
