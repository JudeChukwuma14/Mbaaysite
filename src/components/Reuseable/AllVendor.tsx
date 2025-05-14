import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { getAllVendor } from "@/utils/vendorApi";
import { Country, type ICountry } from "country-state-city";
import { Link } from "react-router-dom";
import Spinner from "../Common/Spinner";

// Define the VendorProfile interface based on the API response
interface VendorProfile {
    _id: string;
    storeName: string;
    storePhone: string;
    storeType: string;
    email: string;
    businessLogo: string;
    city: string;
    country: string; // ISO code (e.g., "ng", "us")
    state: string;
    address1: string;
    avatar: string;
    verificationStatus: string;
    craftCategories: string[];
    createdAt: string;
}

// Map of ISO country codes to full names
const countryMap: Record<string, string> = Country.getAllCountries().reduce(
    (map, country: ICountry) => {
        map[country.isoCode.toLowerCase()] = country.name;
        return map;
    },
    {} as Record<string, string>
);

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

    // Pagination logic
    const itemsPerPage = 12;
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
        return <Spinner/>;
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
        <div className="container px-4 py-8 mx-auto sm:px-6">
            {/* Vendor Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                {currentItems.map((vendor) => (
                    <div key={vendor._id} className="bg-[#d9d9d9] rounded-lg overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-6 h-6 text-sm font-bold text-white bg-red-600 rounded-full">
                                    {vendor.storeName.charAt(0)}
                                </div>
                                <span className="font-medium text-gray-800 truncate">{vendor.storeName}</span>
                            </div>
                            <div className="flex gap-1 sm:gap-2">
                                <button
                                    aria-label="Follow vendor"
                                    className="p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition-colors"
                                >
                                    <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                        <Link to={`/veiws-profile/${vendor._id}`}>
                            <div className="relative flex-1 px-4 pb-4">
                                <div className="relative overflow-hidden aspect-square">
                                    <img
                                        src={vendor.businessLogo || "https://mbaaysite-6b8n.vercel.app/assets/MBLogo-spwX6zWd.png"}
                                        alt={`${vendor.storeName} logo`}
                                        loading="lazy"
                                        className="absolute inset-0 object-cover object-center w-full h-full"
                                    />
                                </div>
                                <div className="absolute p-3 bg-white shadow-lg bottom-4 left-4 right-4">
                                    <h2 className="text-base font-semibold text-gray-800 truncate sm:text-lg">{vendor.storeName}</h2>
                                    <p className="text-sm text-gray-600 truncate">
                                        {vendor.city}, {countryMap[vendor.country.toLowerCase()] || vendor.country}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{vendor.craftCategories.join(", ") || "No categories"}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
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
                                className={`h-9 min-w-[2.25rem] px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentPage === page ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-200 hover:bg-gray-300"
                                    } ${typeof page !== "number" ? "cursor-default" : "cursor-pointer"}`}
                                aria-label={typeof page === "number" ? `Go to page ${page}` : undefined}
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