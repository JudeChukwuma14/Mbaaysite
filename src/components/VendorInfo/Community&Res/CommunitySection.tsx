"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { get_communities } from "@/utils/communityApi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface Community {
  _id: string;
  name: string;
  members: any[];
  admin: string;
  community_Images: string;
}

const CommunitySection: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "owner" | "member">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const user = useSelector((state: any) => state.vendor);

  const { data: communities = [], isLoading } = useQuery({
    queryKey: ["communities"],
    queryFn: () => get_communities(user?.token),
    enabled: !!user?.token, // Only fetch if token exists
  });

  // Apply filtering
  const filteredCommunities = useMemo(() => {
    return communities.filter((community: Community) => {
      if (filter === "all") return true;
      if (filter === "owner") return community.admin === user?.vendor?._id;
      if (filter === "member") return community.admin !== user?.vendor?._id;
      return true;
    });
  }, [communities, filter, user]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCommunities.length / itemsPerPage);

  const paginatedCommunities = filteredCommunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-full p-4 sm:p-5 mt-4 overflow-x-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold tracking-wide text-gray-900">
            Communities
          </h3>
          <p className="mt-1 text-xs text-gray-500 break-words">
            Discover and manage the communities you belong to.
          </p>
        </div>
        <motion.select
          name="communityFilter"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value as "all" | "owner" | "member");
            setCurrentPage(1); // Reset page when filter changes
          }}
          className="px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white w-full sm:w-auto"
        >
          <option value="all">All</option>
          <option value="owner">Owner</option>
          <option value="member">Member</option>
        </motion.select>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-4 border border-gray-100 rounded-lg bg-gray-50 animate-pulse"
            >
              <div className="w-24 h-4 mb-2 bg-gray-200 rounded" />
              <div className="w-16 h-3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredCommunities.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed rounded-xl bg-gray-50"
        >
          <div className="mb-4">
            <svg
              width="72"
              height="72"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="3"
                className="fill-orange-50 stroke-orange-300"
                strokeWidth="1.5"
              />
              <path
                d="M7 12h6M7 9h10M7 15h10"
                className="stroke-orange-400"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h4 className="text-sm font-semibold text-gray-900">
            No communities found
          </h4>
          <p className="max-w-sm mt-1 text-xs text-gray-600">
            You haven't joined any communities yet. Change the filter above or
            check back later.
          </p>
        </motion.div>
      )}

      {/* Communities grid */}
      {!isLoading && filteredCommunities.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {paginatedCommunities.map((community: Community) => (
            <Link
              to={`/app/comunity-detail/${community._id}`}
              key={community._id}
            >
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                className="relative p-3 sm:p-4 transition-shadow border border-orange-100 rounded-lg bg-gradient-to-br from-orange-50 to-white hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 text-sm font-semibold text-gray-900 break-words pr-2">
                      {community.name}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {community.members?.length || 0} members
                    </p>
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full inline-block ${
                        community.admin === user?.vendor?._id
                          ? "bg-orange-100 text-orange-700 border border-orange-200"
                          : "bg-blue-100 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {community.admin === user?.vendor?._id
                        ? "Owner"
                        : "Member"}
                    </span>
                  </div>
                  <div className="w-12 h-12 sm:w-[50px] sm:h-[50px] bg-gray-200 rounded-full overflow-hidden ring-2 ring-white shadow-sm flex-shrink-0">
                    <img
                      src={community.community_Images}
                      alt="Community"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4 sm:mt-5">
          <motion.button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-8 h-8 text-orange-600 disabled:text-gray-400 hover:bg-orange-50 disabled:hover:bg-transparent rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <span className="text-xs sm:text-sm text-gray-600 min-w-fit">
            {currentPage} of {totalPages}
          </span>
          <motion.button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-8 h-8 text-orange-600 disabled:text-gray-400 hover:bg-orange-50 disabled:hover:bg-transparent rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default CommunitySection;
