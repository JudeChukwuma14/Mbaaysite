import type React from "react";
import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import NewArrival from "../Cards/NewArrival";
import { getAllVendor } from "@/utils/vendorApi";
import Spinner from "../Common/Spinner";
import { FaRegSadTear, FaShoppingCart, FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Default banner image
const defaultBanner =
  "https://www.mbaay.com/assets/MBLogo-spwX6zWd.png";

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
  products: Product[];
  followers: string[];
  following: string[];
  [key: string]: any;
}

const PRODUCTS_PER_PAGE = 20;

const VendorProfileProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get vendorId from URL
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!id) {
        setError("Invalid vendor URL. Please select a vendor.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching vendors for vendorId:", id); // Debug log
        const response = await getAllVendor();
        console.log("API response:", response); // Debug log

        if (!response || !Array.isArray(response.vendors)) {
          throw new Error("Invalid response format: vendors array not found");
        }

        // Find the vendor by vendorId
        const selectedVendor = response.vendors.find(
          (v: Vendor) => v._id === id
        );
        if (!selectedVendor) {
          throw new Error(`Vendor with ID ${id} not found`);
        }

        console.log("Selected vendor:", selectedVendor); // Debug log
        setVendor(selectedVendor);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Error fetching vendor data:", errorMessage); // Debug log
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [id]);

  // Pagination logic
  const totalProducts = vendor?.products.length || 0;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = vendor?.products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  ) || [];

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!id) {
    return <Navigate to="/" replace />;
  }
  if (loading) {
    return <Spinner />;
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen">
        <div className="container px-4 py-12 mx-auto text-center">
          <FaRegSadTear className="mx-auto mb-4 text-5xl text-gray-300" />
          <h2 className="mb-2 text-2xl font-semibold text-gray-400">Error</h2>
          <p className="max-w-md mx-auto mb-6 text-gray-500">
            {error || "Vendor not found"}
          </p>
          <Link
            to="/more-vendor"
            className="flex items-center gap-2 px-6 py-2 mx-auto font-medium text-white transition duration-300 bg-orange-500 rounded-lg hover:bg-orange-600 w-fit"
          >
            <FaShoppingCart />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
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
            <div className="flex flex-col items-center justify-center py-16 text-center col-span-full">
              <FaRegSadTear className="mb-4 text-5xl text-gray-300" />
              <h2 className="mb-2 text-2xl font-semibold text-gray-400">No Products</h2>
              <p className="max-w-md mb-6 text-gray-500">
                This vendor has no products available at the moment.
              </p>
              <Link
                to="/more-vendor"
                className="flex items-center gap-2 px-6 py-2 font-medium text-white transition duration-300 bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                <FaShoppingCart />
                Continue Shopping
              </Link>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalProducts > PRODUCTS_PER_PAGE && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-white rounded-lg transition duration-300 ${
                currentPage === 1
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              <FaArrowLeft />
              Previous
            </button>
            <span className="text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-white rounded-lg transition duration-300 ${
                currentPage === totalPages
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              Next
              <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProfileProduct;