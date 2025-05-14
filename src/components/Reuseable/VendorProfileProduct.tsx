import type React from "react";
import { useEffect, useState } from "react";
import NewArrival from "../Cards/NewArrival";
import { get_single_vendor } from "@/utils/vendorApi";
import { getVendorProducts } from "@/utils/VendorProductApi";


// Default banner image
const defaultBanner =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nnn.jpg-QWA6eh1XxoPvPC0bNonSUIuKqnTuLn.jpeg";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  poster: string; // Vendor ID
  [key: string]: any;
}

interface Vendor {
  _id: string;
  storeName: string;
  businessLogo?: string;
  avatar?: string;
  products: string[]; // Array of product IDs
  followers: string[]; // Array of follower IDs
  following: string[]; // Array of following IDs
  [key: string]: any;
}

const VendorProfileProduct: React.FC = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Assume token is available (e.g., from auth context or localStorage)
  const token = localStorage.getItem("token"); // Adjust based on your auth setup

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!token) {
        setError("Please log in to view your profile");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch vendor details
        const vendorData = await get_single_vendor(token);
        if (!vendorData) throw new Error("Failed to fetch vendor");
        setVendor(vendorData);

        // Fetch products
        const productsData = await getVendorProducts(token);
        if (!productsData) throw new Error("Failed to fetch products");

        // Filter products by vendor's _id
        const vendorProducts = productsData.filter(
          (product: Product) =>
            product.poster === vendorData._id ||
            vendorData.products.includes(product._id)
        );
        setProducts(vendorProducts);
      } catch (err) {
        setError((err as Error)?.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [token]);

  if (loading) {
    return <div className="min-h-screen text-white bg-black">Loading...</div>;
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen text-white bg-black">
        <div className="container px-4 py-12 mx-auto text-center text-red-400">
          {error || "Vendor not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Hero Banner */}
      <div className="relative w-full h-48 bg-white sm:h-56 md:h-64 lg:h-80">
        {/* Banner Image */}
        <div className="absolute inset-0">
          <img
            src={vendor.businessLogo || vendor.avatar || defaultBanner || "/placeholder.svg"}
            alt={`${vendor.storeName} banner`}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>

        {/* Banner Content */}
        <div className="container relative flex flex-col justify-end h-full px-4 pb-6 mx-auto">
          {/* Business Logo and Vendor Details */}
          <div className="flex items-end gap-4 -mt-16">
            <div className="relative">
              <div className="w-24 h-24 overflow-hidden bg-gray-200 border-4 border-white rounded-full">
                {vendor.avatar || vendor.businessLogo ? (
                  <img
                    src={vendor.avatar || vendor.businessLogo || "/placeholder.svg"}
                    alt={`${vendor.storeName} logo`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-300">
                    <span className="text-2xl font-bold text-gray-600">
                      {vendor.storeName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold tracking-wider text-white md:text-4xl">
                {vendor.storeName}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div>
                  <div className="font-semibold text-white">{vendor.followers.length}</div>
                  <div className="text-gray-300">Followers</div>
                </div>
                <div>
                  <div className="font-semibold text-white">{vendor.following.length}</div>
                  <div className="text-gray-300">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.length > 0 ? (
            products.map((product) => (
              <NewArrival
                key={product._id}
                product={{
                  ...product,
                  id: product._id,
                  poster: product.images[0] || "/placeholder.svg",
                }}
              />
            ))
          ) : (
            <div className="py-12 text-center text-gray-400 col-span-full">
              No artworks available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProfileProduct;