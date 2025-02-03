import React, { useState } from "react";
import { FiHeart, FiPlus, FiX, FiChevronDown } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  showAddToCartButton?: boolean;
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
}

const ExploreCard: React.FC<ProductCardProps> = ({
  product,
  showAddToCartButton = true,
  onAddToCart,
  onToggleFavorite,
}) => {
  const [showAddToCart, setShowAddToCart] = useState(false);
  // const dispatch = useDispatch();

  const toggleAddToCart = () => {
    setShowAddToCart((prev) => !prev);
  };

  // const handleAddToCartClick = () => {
  //   toggleAddToCart();
  //   dispatch(addItem({
  //     id: product.id,
  //     name: product.name,
  //     price: parseFloat(product.price.replace('$', '')),
  //     quantity: 1,
  //     image: product.image,
  //   }));
  //   toast.success(`${product.name} added to cart!`, {
  //     position: "bottom-right",
  //     autoClose: 3000,
  //   });
  // };

  const handleToggleFavoriteClick = () => {
    onToggleFavorite?.();
    toast.info(`${product.name} added to favorites!`, {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg transition relative">
      <ToastContainer />
      <div className="h-64 flex justify-center items-center bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="object-contain h-full"
        />
        <button
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
          onClick={handleToggleFavoriteClick}
        >
          <FiHeart size={20} />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-sm font-semibold">{product.name}</h3>
        <p className="text-sm font-bold">{product.price}</p>
      </div>
      {showAddToCartButton && (
        <div
          className={`transition-opacity duration-300 ${
            showAddToCart ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            className="w-full py-2 bg-orange-400 text-white flex justify-center items-center gap-2 hover:bg-orange-500 transition"
            onClick={onAddToCart}
          >
            <FiPlus size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      )}
      <button
        className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
        onClick={toggleAddToCart}
      >
        {showAddToCart ? <FiX size={20} /> : <FiChevronDown size={20} />}
      </button>
    </div>
  );
};

export default ExploreCard;