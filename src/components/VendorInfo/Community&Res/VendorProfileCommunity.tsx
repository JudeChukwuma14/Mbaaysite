"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import NewArrival from "../../Cards/NewArrival";
import { getAllVendor } from "@/utils/vendorApi";
import Spinner from "../../Common/Spinner";
import {
  FaRegSadTear,
  FaShoppingCart,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaPhone,
  FaUsers,
  FaBox,
  FaComments,
} from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Default banner image
const defaultBanner = "https://www.mbaay.com/assets/MBLogo-spwX6zWd.png";

interface Subscription {
  currentPlan: string;
  billingCycle: string;
  status: string;
  startDate: string;
  expiryDate: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  poster: string;
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
  subscription?: Subscription;
  verificationStatus?: string;
  kycStatus?: string;
  storeType?: string;
  storePhone?: string;
  craftCategories?: string[];
  communityPosts?: string[];
  communities?: string[];
  [key: string]: any;
}

const PRODUCTS_PER_PAGE = 20;

const VendorProfileCommunity: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!id) {
        setError("Invalid vendor URL. Please select a vendor.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching vendors for vendorId:", id);
        const response = await getAllVendor();
        console.log("API response:", response);

        if (!response || !Array.isArray(response.vendors)) {
          throw new Error("Invalid response format: vendors array not found");
        }

        const selectedVendor = response.vendors.find(
          (v: Vendor) => v._id === id
        );
        if (!selectedVendor) {
          throw new Error(`Vendor with ID ${id} not found`);
        }

        console.log("Selected vendor:", selectedVendor);
        setVendor(selectedVendor);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Error fetching vendor data:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [id]);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement actual follow API call here
  };

  // Pagination logic
  const totalProducts = vendor?.products.length || 0;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts =
    vendor?.products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE) || [];

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
    return <Navigate to="/shop" replace />;
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
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative w-full h-48 bg-white sm:h-56 md:h-64 lg:h-80">
        <div className="absolute inset-0">
          <img
            src={
              vendor.businessLogo ||
              vendor.avatar ||
              defaultBanner ||
              "/placeholder.svg" ||
              "/placeholder.svg"
            }
            alt={`${vendor.storeName} banner`}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>

        <div className="container relative flex flex-col justify-end h-full px-4 pb-6 mx-auto">
          <div className="flex items-end gap-4 -mt-16">
            <div className="relative">
              <div className="w-24 h-24 overflow-hidden bg-gray-200 border-4 border-white rounded-full sm:w-28 sm:h-28">
                {vendor.avatar || vendor.businessLogo ? (
                  <img
                    src={
                      vendor.avatar || vendor.businessLogo || "/placeholder.svg"
                    }
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
            <div className="flex flex-col flex-1">
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-2xl font-bold tracking-wider text-white sm:text-3xl md:text-4xl">
                    {vendor.storeName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {vendor.verificationStatus === "Approved" && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        <FaCheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {vendor.subscription && (
                      <Badge className="bg-orange-500 hover:bg-orange-600">
                        {vendor.subscription.currentPlan} Plan
                      </Badge>
                    )}
                    {vendor.storeType && (
                      <Badge variant="secondary">{vendor.storeType}</Badge>
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleFollowToggle}
                  className={`${
                    isFollowing
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-orange-500 hover:bg-orange-600"
                  } text-white`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
          {/* Stats Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/10">
                    <FaUsers className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {vendor.followers.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Followers
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10">
                    <FaBox className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalProducts}</div>
                    <div className="text-sm text-muted-foreground">
                      Products
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/10">
                    <FaComments className="text-purple-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {vendor.communityPosts?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10">
                    <FaUsers className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {vendor.communities?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Communities
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Card */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold">About</h3>
              <div className="space-y-4">
                {vendor.craftCategories &&
                  vendor.craftCategories.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                        Specialties
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {vendor.craftCategories.map((category, index) => (
                          <Badge key={index} variant="outline">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                {vendor.storePhone && (
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-muted-foreground" />
                    <span className="text-sm">{vendor.storePhone}</span>
                  </div>
                )}
                {vendor.subscription && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                      Subscription
                    </h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className={`inline-flex items-center gap-1 ${
                          vendor.subscription.status === "Active"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {vendor.subscription.status === "Active" ? (
                          <FaCheckCircle />
                        ) : (
                          <FaClock />
                        )}
                        {vendor.subscription.status}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span>
                        {vendor.subscription.currentPlan} (
                        {vendor.subscription.billingCycle})
                      </span>
                    </div>
                  </div>
                )}
                {vendor.kycStatus && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                      KYC Status
                    </h4>
                    <Badge
                      variant={
                        vendor.kycStatus === "Approved"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {vendor.kycStatus}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">Products</h2>
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
                <h2 className="mb-2 text-2xl font-semibold text-gray-400">
                  No Products
                </h2>
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
              <span className="text-foreground">
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
    </div>
  );
};

export default VendorProfileCommunity;

// import type React from "react";
// import { useEffect, useState } from "react";
// import { useParams, Link, Navigate } from "react-router-dom";
// import NewArrival from "../../Cards/NewArrival";
// import { getAllVendor } from "@/utils/vendorApi";
// import Spinner from "../../Common/Spinner";
// import {
//   FaRegSadTear,
//   FaShoppingCart,
//   FaArrowLeft,
//   FaArrowRight,
// } from "react-icons/fa";

// // Default banner image
// const defaultBanner = "https://www.mbaay.com/assets/MBLogo-spwX6zWd.png";

// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   images: string[];
//   poster: string; // Vendor ID
//   [key: string]: any;
// }

// interface Vendor {
//   _id: string;
//   storeName: string;
//   businessLogo?: string;
//   avatar?: string;
//   products: Product[];
//   followers: string[];
//   following: string[];
//   [key: string]: any;
// }

// const PRODUCTS_PER_PAGE = 20;

// const VendorProfileCommunity: React.FC = () => {
//   const { id } = useParams<{ id: string }>(); // Get vendorId from URL
//   const [vendor, setVendor] = useState<Vendor | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const fetchVendorData = async () => {
//       if (!id) {
//         setError("Invalid vendor URL. Please select a vendor.");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         console.log("Fetching vendors for vendorId:", id); // Debug log
//         const response = await getAllVendor();
//         console.log("API response:", response); // Debug log

//         if (!response || !Array.isArray(response.vendors)) {
//           throw new Error("Invalid response format: vendors array not found");
//         }

//         // Find the vendor by vendorId
//         const selectedVendor = response.vendors.find(
//           (v: Vendor) => v._id === id
//         );
//         if (!selectedVendor) {
//           throw new Error(`Vendor with ID ${id} not found`);
//         }

//         console.log("Selected vendor:", selectedVendor); // Debug log
//         setVendor(selectedVendor);
//       } catch (err) {
//         const errorMessage = err instanceof Error ? err.message : String(err);
//         console.error("Error fetching vendor data:", errorMessage); // Debug log
//         setError(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVendorData();
//   }, [id]);

//   // Pagination logic
//   const totalProducts = vendor?.products.length || 0;
//   const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
//   const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
//   const currentProducts =
//     vendor?.products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE) || [];

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   if (!id) {
//     return <Navigate to="/shop" replace />;
//   }
//   if (loading) {
//     return <Spinner />;
//   }

//   if (error || !vendor) {
//     return (
//       <div className="min-h-screen">
//         <div className="container px-4 py-12 mx-auto text-center">
//           <FaRegSadTear className="mx-auto mb-4 text-5xl text-gray-300" />
//           <h2 className="mb-2 text-2xl font-semibold text-gray-400">Error</h2>
//           <p className="max-w-md mx-auto mb-6 text-gray-500">
//             {error || "Vendor not found"}
//           </p>
//           <Link
//             to="/more-vendor"
//             className="flex items-center gap-2 px-6 py-2 mx-auto font-medium text-white transition duration-300 bg-orange-500 rounded-lg hover:bg-orange-600 w-fit"
//           >
//             <FaShoppingCart />
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       {/* Hero Banner */}
//       <div className="relative w-full h-48 bg-white sm:h-56 md:h-64 lg:h-80">
//         {/* Banner Image */}
//         <div className="absolute inset-0">
//           <img
//             src={
//               vendor.businessLogo ||
//               vendor.avatar ||
//               defaultBanner ||
//               "/placeholder.svg"
//             }
//             alt={`${vendor.storeName} banner`}
//             className="object-cover w-full h-full"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
//         </div>

//         {/* Banner Content */}
//         <div className="container relative flex flex-col justify-end h-full px-4 pb-6 mx-auto">
//           {/* Business Logo and Vendor Details */}
//           <div className="flex items-end gap-4 -mt-16">
//             <div className="relative">
//               <div className="w-24 h-24 overflow-hidden bg-gray-200 border-4 border-white rounded-full">
//                 {vendor.avatar || vendor.businessLogo ? (
//                   <img
//                     src={
//                       vendor.avatar || vendor.businessLogo || "/placeholder.svg"
//                     }
//                     alt={`${vendor.storeName} logo`}
//                     className="object-cover w-full h-full"
//                   />
//                 ) : (
//                   <div className="flex items-center justify-center w-full h-full bg-gray-300">
//                     <span className="text-2xl font-bold text-gray-600">
//                       {vendor.storeName.charAt(0)}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="flex flex-col">
//               <h1 className="text-3xl font-bold tracking-wider text-white md:text-4xl">
//                 {vendor.storeName}
//               </h1>
//               <div className="flex items-center gap-4 mt-2 text-sm">
//                 <div>
//                   <div className="font-semibold text-white">
//                     {vendor.followers.length}
//                   </div>
//                   <div className="text-gray-300">Followers</div>
//                 </div>
//                 <div>
//                   <div className="font-semibold text-white">
//                     {vendor.following.length}
//                   </div>
//                   <div className="text-gray-300">Following</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Product Grid */}
//       <div className="container px-4 py-12 mx-auto">
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
//           {currentProducts.length > 0 ? (
//             currentProducts.map((product) => (
//               <NewArrival
//                 key={product._id}
//                 product={{
//                   ...product,
//                   id: product._id,
//                   poster: product.images[0] || "/placeholder.svg",
//                 }}
//               />
//             ))
//           ) : (
//             <div className="flex flex-col items-center justify-center py-16 text-center col-span-full">
//               <FaRegSadTear className="mb-4 text-5xl text-gray-300" />
//               <h2 className="mb-2 text-2xl font-semibold text-gray-400">
//                 No Products
//               </h2>
//               <p className="max-w-md mb-6 text-gray-500">
//                 This vendor has no products available at the moment.
//               </p>
//               <Link
//                 to="/more-vendor"
//                 className="flex items-center gap-2 px-6 py-2 font-medium text-white transition duration-300 bg-orange-500 rounded-lg hover:bg-orange-600"
//               >
//                 <FaShoppingCart />
//                 Continue Shopping
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* Pagination Controls */}
//         {totalProducts > PRODUCTS_PER_PAGE && (
//           <div className="flex items-center justify-center gap-4 mt-8">
//             <button
//               onClick={handlePreviousPage}
//               disabled={currentPage === 1}
//               className={`flex items-center gap-2 px-4 py-2 font-medium text-white rounded-lg transition duration-300 ${
//                 currentPage === 1
//                   ? "bg-gray-500 cursor-not-allowed"
//                   : "bg-orange-500 hover:bg-orange-600"
//               }`}
//             >
//               <FaArrowLeft />
//               Previous
//             </button>
//             <span className="text-gray-300">
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               onClick={handleNextPage}
//               disabled={currentPage === totalPages}
//               className={`flex items-center gap-2 px-4 py-2 font-medium text-white rounded-lg transition duration-300 ${
//                 currentPage === totalPages
//                   ? "bg-gray-500 cursor-not-allowed"
//                   : "bg-orange-500 hover:bg-orange-600"
//               }`}
//             >
//               Next
//               <FaArrowRight />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VendorProfileCommunity;
