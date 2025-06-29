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

  const { data: communities = [] } = useQuery({
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
    <div className="p-4 mt-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="mb-1 mr-3 text-sm font-semibold">COMMUNITIES</h3>
        <motion.select
          name="communityFilter"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value as "all" | "owner" | "member");
            setCurrentPage(1); // Reset page when filter changes
          }}
          className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All</option>
          <option value="owner">Owner</option>
          <option value="member">Member</option>
        </motion.select>
      </div>

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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.03 }}
              className="relative p-3 rounded-lg bg-orange-50"
            >
              <h4 className="mb-1 text-sm font-semibold text-orange-800">
                {community.name}
              </h4>
              <p className="text-xs text-orange-600">
                {community.members?.length || 0} members
              </p>
              <span
                className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                  community.admin === user?.vendor?.id
                    ? "bg-orange-200 text-orange-800"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                {community.admin === user?.vendor?._id ? "Owner" : "Member"}
              </span>
              <div className="w-[50px] h-[50px] bg-red-900 absolute right-[10px] top-[10px] rounded-full overflow-hidden">
                <img
                  src={community.community_Images}
                  alt=""
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
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
