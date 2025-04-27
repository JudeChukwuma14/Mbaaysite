"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/slices/cartSlice";
import { addWishlistItem } from "@/redux/slices/wishlistSlice";
import { toast } from "react-toastify";
import { getProductsById } from "@/utils/productApi";
import Spinner from "@/components/Common/Spinner";

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
  const [error, setError] = useState<string>("");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1); // For quantity selection
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!id) throw new Error("Product ID is undefined");
        const data = await getProductsById(id);
        if (!data.product || !data.product._id)
          throw new Error("Product not found");
        setProduct(data.product);
        setSelectedMedia(data.product.images[0] || data.product.poster);
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

    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();
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
      <div className="py-10 text-center">
        <Spinner />
      </div>
    );
  if (error) return <p className="py-10 text-center text-red-500">{error}</p>;
  if (!product)
    return <p className="py-10 text-center text-gray-500">No product found.</p>;

  const handleAddToCart = () => {
    if (product) {
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
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      dispatch(
        addWishlistItem({
          id: product._id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.images[0] || product.poster,
        })
      );
      toast.success(`${product.name} added to your wishlist!`);
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const mediaItems = [
    ...product.images,
    ...(product.product_video && product.product_video.includes("youtube.com")
      ? [product.product_video]
      : []),
  ];

  const handleQuantityChange = (action: "decrease" | "increase") => {
    if (action === "decrease" && quantity > 1) setQuantity(quantity - 1);
    if (action === "increase" && quantity < product.inventory)
      setQuantity(quantity + 1);
  };

  const isVideo = selectedMedia?.includes("youtube.com");

  return (
    <div className="px-4 py-8 mx-auto">
      <div className="max-w-5xl mx-auto overflow-hidden">
        {/* Breadcrumb */}
        <div className="p-4 text-gray-500 border-b">
          <Link to="/" className="text-orange-600 hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col gap-6 p-4 md:flex-row">
          {/* Thumbnails */}
          <div className="flex flex-col w-full gap-2 md:w-1/5">
            {mediaItems.map((media, index) => (
              <button
                key={index}
                onClick={() => setSelectedMedia(media)}
                className={`w-full h-24 overflow-hidden transition-opacity border shadow hover:opacity-80 ${
                  selectedMedia === media
                    ? "border-orange-500 border-2"
                    : "border-gray-200"
                }`}
              >
                {media.includes("youtube.com") ? (
                  <img
                    src={`https://img.youtube.com/vi/${getYouTubeVideoId(
                      media
                    )}/0.jpg`}
                    alt={`${product.name} video thumbnail`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <img
                    src={media || "/placeholder.svg"}
                    alt={`${product.name} image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Main Image/Video View */}
          <div className="flex items-center justify-center w-full md:w-1/2">
            {selectedMedia &&
              (isVideo ? (
                <div className="w-full aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                      selectedMedia
                    )}`}
                    title={`${product.name} Video`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded object-fit-cover"
                  />
                </div>
              ) : (
                <div
                  ref={imageContainerRef}
                  className="relative overflow-hidden shadow cursor-zoom-in max-h-[400px]"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={selectedMedia || "/placeholder.svg"}
                    alt={`${product.name} main view`}
                    className="object-cover w-full transition-transform duration-200 ease-out"
                    style={{
                      transform: isZoomed ? "scale(1.5)" : "scale(1)",
                      transformOrigin: isZoomed
                        ? `${mousePosition.x}% ${mousePosition.y}%`
                        : "center center",
                    }}
                  />
                </div>
              ))}
          </div>

          {/* Product Details */}
          <div className="w-full p-10 border border-gray-100 rounded shadow-sm md:w-1/3 bg-gray-50">
            <h1 className="text-xl font-semibold text-gray-800">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-yellow-400">
              ★★★★☆ <span className="text-sm text-gray-600">(150 Reviews)</span>
            </div>
            <p className="mt-2 text-sm font-medium text-green-700">In Stock</p>
            <div className="w-full h-px my-4 bg-gray-200"></div>
            <p className="mt-4 text-3xl font-bold text-gray-900">
              ${product.price.toLocaleString()}
            </p>
            <p className="mt-4 text-gray-600">
              {product.description.substring(0, 100)}...
            </p>

            {/* Quantity */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Quantity:
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  className="px-3 py-1 transition-colors bg-gray-100 border rounded-md hover:bg-gray-200"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 border rounded-md min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="px-3 py-1 transition-colors bg-gray-100 border rounded-md hover:bg-gray-200"
                  disabled={quantity >= product.inventory}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 px-4 py-3 font-medium text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600"
                aria-label="Add to cart"
              >
                Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className="p-3 transition-colors border border-gray-300 rounded-md hover:bg-gray-100"
                aria-label="Add to wishlist"
              >
                <AiOutlineHeart className="text-red-500" size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Description and Categories */}
        <div className="p-6 mt-6 bg-white border rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {product.description}
          </p>
          <div className="w-full h-px my-4 bg-gray-200"></div>
          <h2 className="mb-2 text-lg font-semibold">Categories</h2>
          <p className="text-gray-700">
            {product.category}{" "}
            {product.sub_category && `> ${product.sub_category}`}{" "}
            {product.sub_category2 && `> ${product.sub_category2}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
