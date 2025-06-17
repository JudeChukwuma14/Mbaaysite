import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-12">
      <nav className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 text-gray-500 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  currentPage === pageNumber ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {pageNumber}
              </button>
            );
          }
          if (pageNumber === 2 && currentPage > 3) {
            return (
              <span key="ellipsis-1" className="px-2 text-gray-500">
                ...
              </span>
            );
          }
          if (pageNumber === totalPages - 1 && currentPage < totalPages - 2) {
            return (
              <span key="ellipsis-2" className="px-2 text-gray-500">
                ...
              </span>
            );
          }
          return null;
        })}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-500 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`ml-2 px-4 py-2 text-sm ${
            currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default Pagination;