// import React from "react";
// import VintageArt from "@/assets/image/VintageArt.jpg";
// import Woodcraft from "@/assets/image/Woodcraft.jpg";

// const ArtProfile: React.FC = () => {
//   return (
//     <div>
//       <div className="relative w-full">
//         <div className="p-10 relative">
//           <div className="bg-white relative z-40 w-[65%] h-[300px] overflow-hidden">
//             <div className="relative h-full w-full">
//               <img
//                 src={VintageArt}
//                 alt=""
//                 className="w-full h-full object-cover  "
//               />
//               <div className="bg-black/40 absolute h-full inset-0"></div>
//             </div>
//             <div className=" absolute z-40 top-1/2  left-[36%] transform -translate-x-1/2 -translate-y-1/2  flex items-center justify-left px-12 inset-0">
//               <h2 className="text-white text-2xl font-semibold tracking-wide">
//                 ART - REAL PASSION
//               </h2>
//             </div>
//           </div>

//           <div className="bg-[#94A09E5E] absolute top-[20px] right-10 z-30 w-[60%] h-[340px] overflow-hidden"></div>
//           <div className="">
//             <div className="z-40 w-80 h-50 absolute border-8 border-white top-1/2 -translate-y-1/2 left-[45%] translate-x-1/2">
//               <img
//                 src={Woodcraft}
//                 alt=""
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ArtProfile;

// import React, { useEffect, useState } from "react";
// import { getAllVendor } from "@/utils/vendorApi";
// import { Navigate, useParams } from "react-router-dom";
// import Spinner from "@/components/Common/Spinner";
// import {
//   FaArrowLeft,
//   FaArrowRight,
//   FaRegSadTear,
//   FaShoppingCart,
// } from "react-icons/fa";
// import { Link } from "react-router-dom";

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

// const ArtProfile: React.FC = () => {
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
//     return <Navigate to="/random-product" replace />;
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
//     <div>
//       <div className="relative w-full">
//         <div className="p-4 sm:p-6 md:p-8 lg:p-10 relative">
//           {/* Main Image Container */}
//           <div className="bg-white relative z-40 w-full lg:w-[65%] h-[200px] sm:h-[250px] md:h-[280px] lg:h-[300px] overflow-hidden">
//             <div className="relative h-full w-full">
//               <img
//                 src={
//                   vendor.businessLogo ||
//                   vendor.avatar ||
//                   defaultBanner ||
//                   "/placeholder.svg"
//                 }
//                 alt={`${vendor.storeName} banner`}
//                 className="w-full h-full object-cover"
//               />
//               <div className="bg-black/40 absolute h-full inset-0"></div>
//             </div>
//             <div className="absolute z-40 top-1/2 left-1/2 lg:left-[45%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center lg:justify-start px-4 sm:px-6 md:px-8 lg:px-12 w-full text-center lg:text-left">
//               <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold tracking-wide">
//                 {vendor.storeName}
//               </h2>

//             </div>
//           </div>

//           {/* Background Container */}
//           <div className="bg-[#94A09E5E] absolute top-4 sm:top-5 md:top-6 lg:top-[20px] right-4 sm:right-6 md:right-8 lg:right-10 z-30 w-[85%] sm:w-[80%] md:w-[75%] lg:w-[60%] h-[220px] sm:h-[260px] md:h-[300px] lg:h-[340px] overflow-hidden"></div>

//           {/* Center Featured Image */}
//           <div className="z-40 w-48 h-32 sm:w-56 sm:h-36 md:w-64 md:h-40 lg:w-80 lg:h-50 absolute border-4 sm:border-6 md:border-8 border-white top-1/2 -translate-y-1/2 left-1/2 lg:left-[45%] transform -translate-x-1/2 lg:translate-x-1/2">
//             {vendor.avatar || vendor.businessLogo ? (
//               <img
//                 src={vendor.avatar || vendor.businessLogo || defaultBanner || "/placeholder.svg"}
//                 alt={`${vendor.storeName} logo`}
//                 className="object-cover w-full h-full"
//               />
//             ) : (
//               <div className="flex items-center justify-center w-full h-full bg-orange-500">
//                 <span className="text-4xl font-bold text-white">
//                   {vendor.storeName.charAt(0)}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Pagination Controls */}
//       {totalProducts > PRODUCTS_PER_PAGE && (
//         <div className="flex items-center justify-center gap-4 mt-8">
//           <button
//             onClick={handlePreviousPage}
//             disabled={currentPage === 1}
//             className={`flex items-center gap-2 px-4 py-2 font-medium text-white rounded-lg transition duration-300 ${
//               currentPage === 1
//                 ? "bg-gray-500 cursor-not-allowed"
//                 : "bg-orange-500 hover:bg-orange-600"
//             }`}
//           >
//             <FaArrowLeft />
//             Previous
//           </button>
//           <span className="text-gray-300">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={handleNextPage}
//             disabled={currentPage === totalPages}
//             className={`flex items-center gap-2 px-4 py-2 font-medium text-white rounded-lg transition duration-300 ${
//               currentPage === totalPages
//                 ? "bg-gray-500 cursor-not-allowed"
//                 : "bg-orange-500 hover:bg-orange-600"
//             }`}
//           >
//             Next
//             <FaArrowRight />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ArtProfile;

// ArtProfile.tsx (complete version with product grid and pagination integrated)
import React, { useEffect, useState } from "react";
import { getAllVendor } from "@/utils/vendorApi";
import { Navigate, useParams } from "react-router-dom";
import Spinner from "@/components/Common/Spinner";

import {
  FaArrowLeft,
  FaArrowRight,
  FaRegSadTear,
  FaShoppingCart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import NewArrival from "@/components/Cards/NewArrival";

const defaultBanner = "https://www.mbaay.com/assets/MBLogo-spwX6zWd.png";

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

const ArtProfile: React.FC = () => {
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
    return <Navigate to="/random-product" replace />;
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
      {/* Hero Banner - Updated to include followers/following for consistency */}
      <div className="relative w-full border-b border-[#E5E5E5]">
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 relative">
          {/* Main Image Container */}
          <div className="bg-white relative z-40 w-full lg:w-[65%] h-[200px] sm:h-[250px] md:h-[280px] lg:h-[300px] overflow-hidden">
            <div className="relative h-full w-full">
              <img
                src={
                  vendor.businessLogo ||
                  vendor.avatar ||
                  defaultBanner ||
                  "/placeholder.svg"
                }
                alt={`${vendor.storeName} banner`}
                className="w-full h-full object-cover"
              />
              <div className="bg-black/40 absolute h-full inset-0"></div>
            </div>
            <div className="absolute z-40 top-1/2 left-1/2 lg:left-[45%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center lg:justify-start px-4 sm:px-6 md:px-8 lg:px-12 w-full text-center lg:text-left">
              <div className=" flex flex-col items-center lg:items-start">
                <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold tracking-wide">
                  {vendor.storeName}
                </h2>

                {/* Vendor Details (Followers/Following) - Added for consistency with VendorProfileProduct */}
                <div className="  flex items-center gap-4 text-sm text-white">
                  <div>
                    <div className="font-semibold">
                      {vendor.followers.length}
                    </div>
                    <div className="text-gray-300">Followers</div>
                  </div>
                  <div>
                    <div className="font-semibold">
                      {vendor.following.length}
                    </div>
                    <div className="text-gray-300">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background Container */}
          <div className="bg-[#94A09E5E] absolute top-4 sm:top-5 md:top-6 lg:top-[20px] right-4 sm:right-6 md:right-8 lg:right-10 z-30 w-[85%] sm:w-[80%] md:w-[75%] lg:w-[60%] h-[220px] sm:h-[260px] md:h-[300px] lg:h-[340px] overflow-hidden"></div>

          {/* Center Featured Image */}
          <div className="z-40 w-48 h-32 sm:w-56 sm:h-36 md:w-64 md:h-40 lg:w-80 lg:h-50 absolute border-4 sm:border-6 md:border-8 border-white top-1/2 -translate-y-1/2 left-1/2 lg:left-[45%] transform -translate-x-1/2 lg:translate-x-1/2">
            {vendor.avatar || vendor.businessLogo ? (
              <img
                src={
                  vendor.avatar ||
                  vendor.businessLogo ||
                  defaultBanner ||
                  "/placeholder.svg"
                }
                alt={`${vendor.storeName} logo`}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-orange-500">
                <span className="text-4xl font-bold text-white">
                  {vendor.storeName.charAt(0)}
                </span>
              </div>
            )}
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
              className={`flex items-center gap-2 px-4 py-2 font-medium text-white rounded-lg transition duration-300 ${currentPage === 1
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
              className={`flex items-center gap-2 px-4 py-2 font-medium text-white rounded-lg transition duration-300 ${currentPage === totalPages
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

export default ArtProfile;
