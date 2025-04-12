import NewArrival from "@/components/Cards/NewArrival";
import Spinner from "@/components/Common/Spinner";
import { getAllProduct } from "@/utils/productApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  images: string[];
}

const RandomProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getAllProduct();
        const productsData = Array.isArray(result)
          ? result
          : result.products || [];
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section>
      <div className="flex items-center justify-between w-full px-8 py-8">
        <div>
          <Link to="/" className="font-semibold text-orange-600">
            Home
          </Link>{" "}
          / <span>Product</span>
        </div>
        <select
          name=""
          id=""
          className="p-2 border-2 rounded-full outline-none"
        >
          <option value="">Default sorting</option>
        </select>
      </div>

      <div className="px-8 mb-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
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
      </div>
    </section>
  );
};

export default RandomProductPage;
