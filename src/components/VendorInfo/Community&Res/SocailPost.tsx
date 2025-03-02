"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, Check } from "lucide-react";
import {
  follow_vendor,
  unfollow_vendor,
  get_vendors_community,
  get_all_communities,
  leave_community,
  join_community,
  // search_vendor_community,
} from "@/utils/communityApi";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Vendor {
  _id: string;
  storeName: string;
  craftCategories: string[];
  followers: string[]; // To check follow status
  following: string[]; // In case you need this elsewhere
}

export default function SocialList() {
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: any) => state.vendor); // Ensure this shape is correct for your app
  const queryClient = useQueryClient();

  // Helper to get current user ID
  const getUserId = () => user.vendor.id;

  // Fetch vendors list
  const {
    data: vendors = [],
    isLoading,
    // refetch,
  } = useQuery<Vendor[]>({
    queryKey: ["vendors"],
    queryFn: () => get_vendors_community(user.token),
  });

  const { data: all_communities } = useQuery({
    queryKey: ["all_comm"],
    queryFn: () => get_all_communities(),
  });

//   const { data: searchResults, error } = useQuery({
//     queryKey: ["search_res", searchQuery], 
//     queryFn: () => search_vendor_community(user?.token, searchQuery), 
//     enabled: !!searchQuery, 
// })



  const handleFollowToggle = async (vendorId: string) => {
    try {
      const vendor = vendors.find((v) => v._id === vendorId);
      if (!vendor) return;

      const isFollowing = vendor.followers.includes(getUserId());
      console.log(`Is following before toggle: ${isFollowing}`);

      if (isFollowing) {
        await unfollow_vendor(user.token, vendorId);
        console.log(`Unfollowed vendor ${vendorId}`);
      } else {
        await follow_vendor(user.token, vendorId);
        console.log(`Followed vendor ${vendorId}`);
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);
      // Force refresh vendor list after follow/unfollow
      await queryClient.invalidateQueries({ queryKey: ["vendors"] });
    } catch (error) {
      console.error("Follow/Unfollow failed:", error);
    }
  };

  const handlecommunityToggle = async (communityId: string) => {
    try {
      const communities = all_communities.find(
        (v: any) => v._id === communityId
      );
      if (!communities) return;

      const isFollowing = communities.members.includes(getUserId());
      console.log(`Is following before toggle: ${isFollowing}`);

      if (isFollowing) {
        await leave_community(user.token, communityId);
        console.log(`left community ${communityId}`);
      } else {
        await join_community(user.token, communityId);
        console.log(`joined community${communityId}`);
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);
      // Force refresh vendor list after follow/unfollow
      await queryClient.invalidateQueries({ queryKey: ["all_comm"] });
    } catch (error) {
      console.error("Follow/Unfollow failed:", error);
    }
  };

  // const filteredVendors = vendors.filter((vendor) =>
  //   vendor.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  // )
  // const filteredcommunites = all_communities.filter((all_comm) =>
  //   all_comm.nane.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white">
      {/* Search Bar */}
      <div className="p-4 bg-white">
        <div className="relative mb-4">
          <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search People or Group"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
      </div>

      {/* Vendors List */}
      <div
        ref={scrollContainerRef}
        className="flex-1 px-4 pb-4 space-y-6 overflow-y-auto transition-shadow duration-300"
      >
        <div>
          <h2 className="sticky top-0 py-2 mb-3 text-xs font-semibold text-gray-500 bg-white">
            VENDORS
          </h2>

          {isLoading ? (
            <p>Loading vendors...</p>
          ) : (
            vendors.slice(0, 3).map((vendor) => {
              const isFollowing = vendor.followers.includes(getUserId());

              return (
                <motion.div key={vendor._id} layout className="space-y-4">
                  <AnimatePresence>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-between"
                    >
                      {/* Vendor Info */}
                      <div className="flex items-center space-x-3 mb-[10px]">
                        <div className="bg-orange-500 w-[40px] h-[40px] rounded-full text-white flex items-center justify-center">
                          <p>{vendor?.storeName?.charAt(0)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {vendor.storeName}
                          </p>
                          {vendor?.craftCategories[0] && (
                            <p className="text-xs text-gray-500">
                              {vendor.craftCategories[0]}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Follow/Unfollow Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleFollowToggle(vendor._id)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ml-[15px] ${
                          isFollowing
                            ? "bg-gray-100 text-gray-700"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3" />
                            <span>Follow</span>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
        <div>
          <h2 className="sticky top-0 py-2 mb-3 text-xs font-semibold text-gray-500 bg-white">
            COMMUNITIES
          </h2>

          {isLoading ? (
            <p>Loading communities...</p>
          ) : (
            all_communities.slice(0, 3).map((vendor: any) => {
              return (
                <motion.div key={vendor._id} layout className="space-y-4">
                  <AnimatePresence>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-between"
                    >
                      {/* Vendor Info */}
                      <div className="flex items-center space-x-3 mb-[10px]">
                        <div className="bg-orange-500 w-[40px] h-[40px] rounded-full text-white flex items-center justify-center">
                          {vendor?.community_Images ? (
                            <img
                              src={vendor?.community_Images}
                              alt="community"
                              className="object-cover w-full h-full rounded-full"
                            />
                          ) : (
                            <p>{vendor?.name?.charAt(0)}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{vendor?.name}</p>
                        </div>
                      </div>

                      {/* Follow/Unfollow Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlecommunityToggle(vendor._id)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ml-[15px] ${
                          vendor?.members?.includes(user?.vendor?.id)
                            ? "bg-gray-100 text-gray-700"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {vendor?.members?.includes(user?.vendor?.id) ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Joined</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3" />
                            <span>Join</span>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
