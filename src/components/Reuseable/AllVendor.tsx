import { getAllVendor } from "@/utils/vendorApi";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import VendorCard from "../VendorCard";
import VendorGridSkeleton from "../skeletons/VendorGridSkeleton";

interface VendorProfile {
  _id: string;
  storeName: string;
  avatar?: string;
  businessLogo?: string;
  craftCategories: string[];
}

interface VendorApiResponse {
  vendors: VendorProfile[];
}

const AllVendor = () => {
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [retryLoading, setRetryLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setRetryLoading(true);
      const response: VendorApiResponse = await getAllVendor();
      setVendors(response.vendors || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load vendors. Please try again.");
    } finally {
      setLoading(false);
      setRetryLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Reset pagination when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const createInitialAvatar = useMemo(() => {
    return (name: string): string => {
      const firstLetter = name.trim().charAt(0).toUpperCase();
      const colors = ["#f97316", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];
      const color = colors[firstLetter.charCodeAt(0) % colors.length];

      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>
        <rect width='100' height='100' fill='${color}' rx='50' />
        <text x='50%' y='50%' font-size='60' fill='white' font-weight='bold'
              text-anchor='middle' dominant-baseline='middle'>${firstLetter}</text>
      </svg>`;

      return `data:image/svg+xml;base64,${btoa(svg)}`;
    };
  }, []);

  const filteredVendors = vendors.filter(
    vendor =>
      vendor.storeName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "" || vendor.craftCategories.includes(selectedCategory))
  );

  const itemsPerPage = 30;
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVendors.slice(indexOfFirstItem, indexOfLastItem);

  const getPagination = (): (number | string)[] => {
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
    return (
      <div className="container px-4 py-8 mx-auto sm:px-6 max-w-screen-2xl">
        <VendorGridSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchVendors()}
          className="px-4 py-2 mt-4 text-white bg-orange-500 rounded-md hover:bg-orange-600 flex items-center justify-center"
          disabled={retryLoading}
        >
          {retryLoading ? (
            <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
          ) : null}
          Retry
        </button>
      </div>
    );
  }

  if (filteredVendors.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-600">
          {searchQuery || selectedCategory
            ? "No vendors match your search or filter."
            : "No vendors found."}
        </p>
        <button
          onClick={() => fetchVendors()}
          className="px-4 py-2 mt-4 text-white bg-orange-500 rounded-md hover:bg-orange-600"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto sm:px-6 max-w-screen-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Explore All Vendors</h1>
        <p className="mt-2 text-gray-600">Discover artisans and their unique crafts from various categories.</p>
        <div className="flex flex-col gap-4 mt-4 sm:flex-row">
          <input
            type="text"
            placeholder="Search vendors by name..."
            className="w-full max-w-md px-4 py-2 border rounded-md"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-md"
            value={selectedCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {[...new Set(vendors.flatMap(v => v.craftCategories))].map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vendor Grid */}
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
        role="grid"
      >
        {currentItems.map((vendor) => (
          <Link
            key={vendor._id}
            to={`/veiws-profile/${vendor._id}`}
            className="transition-transform duration-200 hover:scale-105"
            role="gridcell"
            aria-label={`View ${vendor.storeName} profile`}
          >
            <VendorCard
              backgroundImage={
                vendor.businessLogo ||
                "https://mbaaysite-6b8n.vercel.app/assets/MBLogo-spwX6zWd.png"
              }
              avatar={vendor.avatar || createInitialAvatar(vendor.storeName || "V")}
              name={vendor.storeName}
              craft={vendor.craftCategories.slice(0, 2).join(", ") || "No categories"}
            />
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === 1 ? "bg-gray-100 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
            }`}
            aria-label="Previous page"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {getPagination().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={typeof page !== "number"}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === page
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } ${typeof page !== "number" ? "cursor-default" : "cursor-pointer"}`}
                aria-label={typeof page === "number" ? `Go to page ${page}` : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === totalPages ? "bg-gray-100 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllVendor;