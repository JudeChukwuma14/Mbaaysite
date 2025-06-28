
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { addItem, updateQuantity } from "@/redux/slices/cartSlice";
import { addWishlistItem } from "@/redux/slices/wishlistSlice";
import { toast } from "react-toastify";
import { getProductsById } from "@/utils/productApi";
import { Heart, ShoppingCart, Minus, Plus, Star, ChevronRight, Share2 } from "lucide-react";
import Spinner from "@/components/Common/Spinner";
import { convertPrice } from "@/utils/currencyCoverter";
import { addToCart, updateCartQuantity } from "@/utils/cartApi";
import { initializeSession } from "@/redux/slices/sessionSlice";


interface Product {
  _id: string;
  name: string;
  poster: string;
  description: string;
  price: number;
  inventory: number;
  images: string[];
  category: string;
  sub_category: string;
  sub_category2: string;
  product_video: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  upload_type?: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const { currency, language } = useSelector((state: RootState) => state.settings);
  const sessionId = useSelector((state: RootState) => state.session.sessionId);

  // Initialize sessionId if missing
  useEffect(() => {
    if (!sessionId) {
      setIsSessionLoading(true);
      dispatch(initializeSession())
      setIsSessionLoading(false);
    }
  }, [dispatch, sessionId]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!id) throw new Error("Product ID is undefined");
        const data = await getProductsById(id);
        if (!data.product || !data.product._id) throw new Error("Product not found");
        setProduct(data.product);
        setSelectedMedia(data.product.images[0] || data.product.poster || "/placeholder.svg");
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !isZoomed) return;

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg text-red-500">{error}</p>
        <Link to="/" className="px-4 py-2 mt-4 transition-colors bg-gray-100 rounded-md hover:bg-gray-200">
          Return to Home
        </Link>
      </div>
    );

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg text-gray-500">Product not found</p>
        <Link to="/" className="px-4 py-2 mt-4 transition-colors bg-gray-100 rounded-md hover:bg-gray-200">
          Return to Home
        </Link>
      </div>
    );

  const handleAddToCart = async () => {
    if (!sessionId || isSessionLoading) {
      toast.error("Session not initialized. Please try again.");
      return;
    }
    if (!product) {
      toast.error("Product not found. Please try again.");
      return;
    }
    try {
      await addToCart(sessionId, product._id, 1)
      dispatch(
        addItem({
          id: product._id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.images[0] || product.poster,
        })
      );
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error((error as Error)?.message || String(error), {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleAddToWishlist = () => {
    dispatch(
      addWishlistItem({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0] || product.poster,
      })
    );
    toast.success(`${product.name} added to your wishlist!`);
  };

  const getYouTubeVideoId = (url: string) => {
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const mediaItems = [
    ...product.images,
    ...(product.product_video && getYouTubeVideoId(product.product_video) ? [product.product_video] : []),
  ];

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (!sessionId || isSessionLoading) {
      toast.error("Session not initialized. Please try again.");
      return;
    }
    if (isNaN(newQuantity) || newQuantity < 1) {
      toast.error("Please enter a valid quantity (1 or more).");
      return;
    }
    if (newQuantity > product.inventory) {
      toast.error(`Cannot exceed available stock (${product.inventory}).`);
      return;
    }

    try {
      await updateCartQuantity(sessionId, itemId, newQuantity);
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
      setQuantity(newQuantity);
    } catch (error) {
      toast.error("Failed to update quantity. Please try again.");
    }
  };

  const isVideo = selectedMedia?.includes("youtube.com");
  const isInStock = product.inventory > 0;
  const convertedPrice = convertPrice(product.price, "USD", currency);

  return (
    <div className="bg-white">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <nav className="flex mb-6 text-sm text-gray-500">
          <Link to="/" className="transition-colors hover:text-gray-900">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <span className="text-gray-700">{product.category}</span>
          {product.sub_category && (
            <>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              <span className="text-gray-700">{product.sub_category}</span>
            </>
          )}
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <span className="font-medium text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
          <div className="space-y-6">
            <div className="overflow-hidden border border-gray-200 rounded-lg aspect-square bg-gray-50">
              {isVideo ? (
                <div className="w-full h-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedMedia || "")}`}
                    title={`${product.name} Video`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div
                  ref={imageContainerRef}
                  className="relative w-full h-full cursor-zoom-in"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={selectedMedia || "/placeholder.svg"}
                    alt={product.name}
                    className="object-contain w-full h-full transition-transform duration-200"
                    style={{
                      transform: isZoomed ? "scale(1.8)" : "scale(1)",
                      transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : "center center",
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 gap-2">
              {mediaItems.map((media, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMedia(media)}
                  className={`aspect-square overflow-hidden rounded-md border ${selectedMedia === media ? "border-2 border-orange-600" : "border-gray-200 hover:border-gray-300"
                    } transition-all`}
                >
                  {media.includes("youtube.com") ? (
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeVideoId(media)}/0.jpg`}
                      alt={`${product.name} video thumbnail`}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <img
                      src={media || "/placeholder.svg"}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>

              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">4.0 (150 reviews)</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <p className="text-3xl font-bold text-gray-900">
                  {convertedPrice.toLocaleString(language, {
                    style: "currency",
                    currency: currency,
                  })}
                </p>
                {isInStock ? (
                  <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    In Stock
                  </span>
                ) : (
                  <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                )}
              </div>
              {isInStock && (
                <p className="mt-1 text-sm text-gray-500">
                  {product.inventory < 10 ? `Only ${product.inventory} left in stock` : ""}
                </p>
              )}
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                {product.description.length > 200 ? `${product.description.substring(0, 200)}...` : product.description}
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleUpdateQuantity(product._id, quantity - 1)}
                  disabled={quantity <= 1}
                  className={`rounded-l-md p-2 border border-r-0 border-gray-300 ${quantity <= 1 ? "bg-gray-100 text-gray-400" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  id="quantity"
                  value={quantity}
                  readOnly
                  className="w-16 py-2 text-center text-gray-900 border-gray-300 border-y focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateQuantity(product._id, quantity + 1)}
                  disabled={quantity >= product.inventory}
                  className={`rounded-r-md p-2 border border-l-0 border-gray-300 ${quantity >= product.inventory ? "bg-gray-100 text-gray-400" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-md text-base font-medium text-white ${isInStock
                  ? "bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
              <button
                type="button"
                onClick={handleAddToWishlist}
                className="flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <Heart className="w-5 h-5 mr-2" />
                Wishlist
              </button>
              <button
                type="button"
                className="items-center justify-center hidden p-3 text-gray-700 bg-white border border-gray-300 rounded-md sm:flex hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <div className="pt-6 mt-10 border-t border-gray-200">
              <div className="flex border-b border-gray-200">
                <button
                  className={`pb-4 px-1 ${activeTab === "description"
                    ? "border-b-2 border-orange-600 text-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                    } font-medium text-sm`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`ml-8 pb-4 px-1 ${activeTab === "reviews"
                    ? "border-b-2 border-orange-600 text-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                    } font-medium text-sm`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews (150)
                </button>
              </div>

              <div className="py-6">
                {activeTab === "description" ? (
                  <div className="prose-sm prose text-gray-500 max-w-none">
                    <p className="whitespace-pre-line">{product.description}</p>

                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                          {product.category}
                        </span>
                        {product.sub_category && (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                            {product.sub_category}
                          </span>
                        )}
                        {product.sub_category2 && (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                            {product.sub_category2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <p className="italic">Reviews coming soon...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;