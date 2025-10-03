import NewArrival from "@/components/Cards/NewArrival";
import { getAllProduct } from "@/utils/productApi";
import { useEffect, useState } from "react";
import { FaRegSadTear, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

interface Product {
  _id: string;
  id?: string;
  name: string;
  price: number;
  images: string[];
  createdAt: string;
  category: string;
  sub_category?: string;
  sub_category2?: string;
inventory: number; 
}

const Plants = () => {
  const { subcategory } = useParams<{ subcategory: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHairScalpProducts = async () => {
      try {
        const result = await getAllProduct();
        const allProducts = Array.isArray(result)
          ? (result as Product[])
          : result.products || [];

        // Define keywords for hair and scalp subcategories
        const keywords = [
          "indoor plants",
          "succulents",
          "air plants",
          "potted herbs",
          "tropical houseplants",
          "outdoor plants",
          "perennials",
          "shrubs and bushes",
          "climbing plants",
          "garden flowers",
        ];

        const filtered = allProducts.filter((product: Product) => {
          const category = product.category?.toLowerCase() || "";
          const sub1 = product.sub_category?.toLowerCase() || "";
          const sub2 = product.sub_category2?.toLowerCase() || "";
          return (
            category === "plant and seeds" &&
            (keywords.includes(sub1) ||
              keywords.includes(sub2) ||
              sub1 === subcategory?.toLowerCase() ||
              sub2 === subcategory?.toLowerCase())
          );
        });

        setProducts(filtered);
        console.log("Filtered products:", filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please try again.");
      }
    };

    fetchHairScalpProducts();
  }, [subcategory]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FaRegSadTear className="mb-4 text-5xl text-gray-300" />
        <h2 className="mb-2 text-2xl font-semibold text-gray-400">Error</h2>
        <p className="max-w-md mb-6 text-gray-500">{error}</p>
        <Link
          to="/random-product"
          className="flex items-center gap-2 px-6 py-2 font-medium text-white transition duration-300 bg-orange-500 rounded-lg hover:bg-orange-600"
        >
          <FaShoppingCart />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="px-8 py-6">
      <h2 className="mb-6 text-2xl font-bold">Plants</h2>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FaRegSadTear className="mb-4 text-5xl text-gray-300" />
          <h2 className="mb-2 text-2xl font-semibold text-gray-400">
            No Plants Product Found
          </h2>
          <p className="max-w-md mb-6 text-gray-500">
            No products match your criteria. Browse our shop to find your
            favorite hair and scalp products!
          </p>
          <Link
            to="/random-product"
            className="flex items-center gap-2 px-6 py-2 font-medium text-white transition duration-300 bg-orange-500 rounded-lg hover:bg-orange-600"
          >
            <FaShoppingCart />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 5)
            .map((product) => (
              <NewArrival
                key={product._id}
                product={{
                  ...product,
                  id: product._id,
                  poster: product.images[0] || "",
                }}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Plants;
