import { getAllVendor } from "@/utils/vendorApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Added for VendorCard's Link
import Spinner from "../Common/Spinner";
import VendorCard from "../VendorCard";

interface VendorProfile {
  _id: string;
  storeName: string;
  avatar?: string; // Made optional
  businessLogo?: string; // Made optional
  craftCategories: string[];
}

const AllVendor = () => {
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch vendors on mount
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await getAllVendor();
      setVendors(response.vendors || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load vendors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const createInitialAvatar = (name: string) => {
    // Get first letter and ensure it's uppercase
    const firstLetter = name.trim().charAt(0).toUpperCase();
    // Color options (you can customize these)
    const colors = ["#f97316", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];
    const color = colors[firstLetter.charCodeAt(0) % colors.length];

    // Create SVG with just the first letter
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>
      <rect width='100' height='100' fill='${color}' rx='50' />
      <text x='50%' y='50%' font-size='60' fill='white' 
            font-weight='bold'
            text-anchor='middle' dominant-baseline='middle'>${firstLetter}</text>
    </svg>`;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Pagination logic
  const itemsPerPage = 30;
  const totalPages = Math.ceil(vendors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = vendors.slice(indexOfFirstItem, indexOfLastItem);

  const getPagination = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    if (currentPage > 3) pages.push("...");

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchVendors()}
          className="px-4 py-2 mt-4 text-white bg-orange-500 rounded-md hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto sm:px-6 max-w-screen-2xl">
      {/* Vendor Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-8 md:gap-6 2xl:gap-8">
        {currentItems.map((vendor) => (
          <Link to={`/veiws-profile/${vendor._id}`}>
            <VendorCard
              key={vendor._id}
              backgroundImage={
                vendor.businessLogo ||
                "https://mbaaysite-6b8n.vercel.app/assets/MBLogo-spwX6zWd.png"
              }
              avatar={vendor.avatar || createInitialAvatar(vendor.storeName || "V")}
              name={vendor.storeName}
              craft={vendor.craftCategories[0] || "No categories"}
            />
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-2 text-sm font-medium transition-colors bg-gray-200 rounded-md h-9 hover:bg-gray-300"
              aria-label="Previous page"
            >
              Previous
            </button>
          )}

          <div className="flex flex-wrap gap-1 sm:gap-2">
            {getPagination().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={typeof page !== "number"}
                className={`h-9 min-w-[2.25rem] px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentPage === page
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-200 hover:bg-gray-300"
                  } ${typeof page !== "number" ? "cursor-default" : "cursor-pointer"}`}
                aria-label={
                  typeof page === "number" ? `Go to page ${page}` : undefined
                }
              >
                {page}
              </button>
            ))}
          </div>

          {currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 text-sm font-medium transition-colors bg-gray-200 rounded-md h-9 hover:bg-gray-300"
              aria-label="Next page"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AllVendor;