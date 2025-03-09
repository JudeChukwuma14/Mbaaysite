import { useState } from "react";
import { Auction } from "../mockdata/data";
import AuctionCard from "./AuctionCard";
import { SlidersHorizontal } from "lucide-react";

const AuctionView: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOption, setSortOption] = useState<string>("default"); // Sorting state
  const itemsPerPage = 12;
  const totalPages = Math.ceil(Auction.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Function to sort items based on the selected option
  const sortItems = (items: typeof Auction) => {
    let sortedItems = [...items];

    if (sortOption === "lowest") {
      sortedItems.sort((a, b) => a.currentBid - b.currentBid);
    } else if (sortOption === "highest") {
      sortedItems.sort((a, b) => b.currentBid - a.currentBid);
    } else if (sortOption === "newest") {
      sortedItems.sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime());
    }

    return sortedItems;
  };

  const sortedAuction = sortItems(Auction);
  const currentItems = sortedAuction.slice(indexOfFirstItem, indexOfLastItem);

  const getPagination = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="mx-auto px-8 mt-10">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div>
          <nav className="text-gray-500 text-sm">
            <span>Home</span> <span className="mx-2">/</span>
            <span className="text-black">Auction</span>
          </nav>
          <p className="text-gray-700 text-sm mt-1">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, Auction.length)} of {Auction.length} Results
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 px-4 py-2">
            <SlidersHorizontal size={16} />
            Filters
          </button>

          <select
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Sort By</option>
            <option value="lowest">Lowest price</option>
            <option value="highest">Highest price</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Auction Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {currentItems.map((item, index) => (
          <AuctionCard key={index} {...item} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center my-10 items-center gap-2">
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 bg-gray-300">
            Previous
          </button>
        )}

        {getPagination().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && setCurrentPage(page)}
            className={`px-4 py-2 hover:bg-orange-600 ${currentPage === page ? "bg-orange-500 " : "bg-gray-300"}`}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages && (
          <button onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 bg-gray-300">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default AuctionView;
