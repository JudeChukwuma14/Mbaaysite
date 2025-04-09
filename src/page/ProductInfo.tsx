import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// import { IoCartOutline } from "react-icons/io5";
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
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!id) throw new Error("Product ID is undefined");
        const data = await getProductsById(id);
        if (!data.product || !data.product._id) throw new Error("Product not found");
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

  if (loading) return <div className="py-10 text-center"><Spinner/></div>;
  if (error) return <p className="py-10 text-center text-red-500">{error}</p>;
  if (!product) return <p className="py-10 text-center text-gray-500">No product found.</p>;

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
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
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

  return (
    <div className="px-4 py-8 mx-auto ">
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
                className="w-full h-24 overflow-hidden transition-opacity border border-gray-200 shadow hover:opacity-80"
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
                    src={media}
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
              (selectedMedia.includes("youtube.com") ? (
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
                <img
                  src={selectedMedia}
                  alt={`${product.name} main view`}
                  className="object-cover w-full shadow max-h-[400px]"
                />
              ))}
          </div>

          {/* Product Details */}
          <div className="w-full p-10 rounded md:w-1/3 ">
            <h1 className="text-xl font-semibold text-gray-800">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-yellow-400">
              ★★★★☆ (150 Reviews)
            </div>
            <p className="mt-2 text-sm text-green-700">In Stock</p>
            <p className="mt-4 text-3xl font-bold">
              ${product.price.toLocaleString()}
            </p>
            <p className="mt-2 text-gray-600">
              {product.description.substring(0, 100)}...
            </p>

            {/* Colors */}
            {/* <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Colours:</p>
              <div className="flex gap-2 mt-2">
                <button className="w-6 h-6 bg-red-500 rounded-full"></button>
                <button className="w-6 h-6 bg-blue-500 rounded-full"></button>
              </div>
            </div> */}

            {/* Sizes */}
            {/* <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Size:</p>
              <div className="flex gap-2 mt-2">
                <button className="px-2 py-1 border rounded">XS</button>
                <button className="px-2 py-1 border rounded">S</button>
                <button className="px-2 py-1 border rounded">M</button>
                <button className="px-2 py-1 border rounded">L</button>
                <button className="px-2 py-1 border rounded">XL</button>
              </div>
            </div> */}

            {/* Quantity */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => handleQuantityChange("decrease")}
                className="px-3 py-1 border rounded"
              >
                -
              </button>
              <span className="px-4 py-1 border rounded">{quantity}</span>
              <button
                onClick={() => handleQuantityChange("increase")}
                className="px-3 py-1 border rounded"
              >
                +
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
                aria-label="Add to cart"
              >
                Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className="p-2 "
                aria-label="Add to wishlist"
              >
                <AiOutlineHeart className="text-red-500" size={30} />
              </button>
            </div>

            {/* Delivery Info */}
            {/* <div className="p-2 mt-4 bg-gray-100 rounded">
              <p className="text-sm text-gray-700">
                <span className="text-green-600">Free Delivery</span>
                <br />
                Enter your postal code for Delivery Availability
              </p>
            </div> */}

            {/* Return Info */}
            {/* <div className="p-2 mt-2 bg-gray-100 rounded">
              <p className="text-sm text-gray-700">
                <span className="text-green-600">Return Delivery</span>
                <br />
                Free 30 Days Delivery Returns, Details
              </p>
            </div> */}
          </div>
        </div>

        {/* Description and Categories */}
        <div className="p-4 border-t">
          <h2 className="mb-2 text-lg font-semibold">Description</h2>
          <p className="text-gray-700">{product.description}</p>
          <h2 className="mt-4 mb-2 text-lg font-semibold">Categories</h2>
          <p className="text-gray-700">
            {product.category} {product.sub_category} {product.sub_category2}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;