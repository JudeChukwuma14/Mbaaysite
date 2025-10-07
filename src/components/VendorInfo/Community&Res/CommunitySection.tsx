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
    <div className="p-5 mt-4 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold tracking-wide text-gray-900">Communities</h3>
          <p className="mt-1 text-xs text-gray-500">Discover and manage the communities you belong to.</p>
        </div>
        <motion.select
          name="communityFilter"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value as "all" | "owner" | "member");
            setCurrentPage(1); // Reset page when filter changes
          }}
          className="px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value="all">All</option>
          <option value="owner">Owner</option>
          <option value="member">Member</option>
        </motion.select>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-100 bg-gray-50 animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
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
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="5" width="18" height="14" rx="3" className="fill-orange-50 stroke-orange-300" strokeWidth="1.5" />
              <path d="M7 12h6M7 9h10M7 15h10" className="stroke-orange-400" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h4 className="text-sm font-semibold text-gray-900">No communities found</h4>
          <p className="mt-1 text-xs text-gray-600 max-w-sm">
            You haven't joined or created any communities yet. Change the filter above or check back later.
          </p>
        </motion.div>
      )}

      {/* Communities grid */}
      {!isLoading && filteredCommunities.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative grid grid-cols-2 gap-3"
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
                className="relative p-3 rounded-lg bg-gradient-to-br from-orange-50 to-white border border-orange-100 hover:shadow-md transition-shadow"
              >
                <h4 className="mb-1 text-sm font-semibold text-gray-900">
                  {community.name}
                </h4>
                <p className="text-xs text-gray-600">
                  {community.members?.length || 0} members
                </p>
                <span
                  className={`text-[10px] px-2 py-1 rounded-full mt-2 inline-block ${
                    community.admin === user?.vendor?._id
                      ? "bg-orange-100 text-orange-700 border border-orange-200"
                      : "bg-blue-100 text-blue-700 border border-blue-200"
                  }`}
                >
                  {community.admin === user?.vendor?._id ? "Owner" : "Member"}
                </span>
                <div className="w-[50px] h-[50px] bg-gray-200 absolute right-2 top-2 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                  <img
                    src={community.community_Images}
                    alt="Community"
                    className="object-cover w-full h-full"
                  />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <motion.button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="text-orange-600 disabled:text-gray-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <motion.button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="text-orange-600 disabled:text-gray-400"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default CommunitySection;
