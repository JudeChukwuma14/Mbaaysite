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
  search_vendor_community,
} from "@/utils/communityApi";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface Vendor {
  _id: string;
  storeName: string;
  craftCategories: string[];
  followers: string[];
}

export default function SocialList() {
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: any) => state.vendor);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const getUserId = () => user.vendor._id || user.vendor.id;

  const { data: vendors = [], isLoading } = useQuery<Vendor[]>({
    queryKey: ["vendors"],
    queryFn: () => get_vendors_community(user.token),
  });
  console.log("All", vendors);

  const { data: all_communities = [] } = useQuery({
    queryKey: ["all_comm"],
    queryFn: () => get_all_communities(),
  });

  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: ["search_res", searchQuery],
    queryFn: () => search_vendor_community(user?.token, searchQuery),
    enabled: !!searchQuery,
  });

  const searchVendors = searchResults?.vendors || [];
  const searchCommunities = searchResults?.communities || [];

  const isSearchActive = !!searchQuery;
  const displayVendors = isSearchActive ? searchVendors : vendors?.slice(0, 3);
  const displayCommunities = isSearchActive
    ? searchCommunities
    : all_communities?.slice(0, 3);

  // Enhanced follow mutation with optimistic updates
  const followMutation = useMutation({
    mutationFn: async ({
      vendorId,
      isFollowing,
    }: {
      vendorId: string;
      isFollowing: boolean;
    }) => {
      if (isFollowing) {
        return await unfollow_vendor(user.token, vendorId);
      } else {
        return await follow_vendor(user.token, vendorId);
      }
    },
    onMutate: async ({ vendorId, isFollowing }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["vendors"] });
      await queryClient.cancelQueries({ queryKey: ["search_res"] });

      // Snapshot the previous value
      const previousVendors = queryClient.getQueryData(["vendors"]);
      const previousSearchResults = queryClient.getQueryData([
        "search_res",
        searchQuery,
      ]);

      // Optimistically update vendors list
      queryClient.setQueryData(
        ["vendors"],
        (oldVendors: Vendor[] | undefined) => {
          if (!oldVendors) return oldVendors;
          return oldVendors.map((vendor) => {
            if (vendor._id === vendorId) {
              const updatedFollowers = isFollowing
                ? vendor.followers.filter((id) => id !== getUserId())
                : [...vendor.followers, getUserId()];
              return { ...vendor, followers: updatedFollowers };
            }
            return vendor;
          });
        }
      );

      // Optimistically update search results if search is active
      if (searchQuery) {
        queryClient.setQueryData(
          ["search_res", searchQuery],
          (oldData: any) => {
            if (!oldData?.vendors) return oldData;
            return {
              ...oldData,
              vendors: oldData.vendors.map((vendor: Vendor) => {
                if (vendor._id === vendorId) {
                  const updatedFollowers = isFollowing
                    ? vendor.followers.filter(
                        (id: string) => id !== getUserId()
                      )
                    : [...vendor.followers, getUserId()];
                  return { ...vendor, followers: updatedFollowers };
                }
                return vendor;
              }),
            };
          }
        );
      }

      return { previousVendors, previousSearchResults };
    },
    onError: (err, _variables, context) => {
      // Revert optimistic updates on error
      if (context?.previousVendors) {
        queryClient.setQueryData(["vendors"], context.previousVendors);
      }
      if (context?.previousSearchResults) {
        queryClient.setQueryData(
          ["search_res", searchQuery],
          context.previousSearchResults
        );
      }
      console.error("Follow/Unfollow failed:", err);
    },
    onSettled: () => {
      // Refetch to ensure we have the latest data
      queryClient.refetchQueries({ queryKey: ["vendors"] });
      queryClient.refetchQueries({ queryKey: ["search_res"] });
      queryClient.refetchQueries({ queryKey: ["vendor"] });
      queryClient.refetchQueries({ queryKey: ["communities"] });
    },
  });

  // Enhanced community join/leave mutation with optimistic updates
  const communityMutation = useMutation({
    mutationFn: async ({
      communityId,
      isMember,
    }: {
      communityId: string;
      isMember: boolean;
    }) => {
      if (isMember) {
        return await leave_community(user.token, communityId);
      } else {
        return await join_community(user.token, communityId);
      }
    },
    onMutate: async ({ communityId, isMember }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["all_comm"] });
      await queryClient.cancelQueries({ queryKey: ["search_res"] });

      // Snapshot the previous value
      const previousCommunities = queryClient.getQueryData(["all_comm"]);
      const previousSearchResults = queryClient.getQueryData([
        "search_res",
        searchQuery,
      ]);

      // Optimistically update communities list
      queryClient.setQueryData(
        ["all_comm"],
        (oldCommunities: any[] | undefined) => {
          if (!oldCommunities) return oldCommunities;
          return oldCommunities.map((community) => {
            if (community._id === communityId) {
              const updatedMembers = isMember
                ? community.members.filter((id: string) => id !== getUserId())
                : [...community.members, getUserId()];
              return { ...community, members: updatedMembers };
            }
            return community;
          });
        }
      );

      // Optimistically update search results if search is active
      if (searchQuery) {
        queryClient.setQueryData(
          ["search_res", searchQuery],
          (oldData: any) => {
            if (!oldData?.communities) return oldData;
            return {
              ...oldData,
              communities: oldData.communities.map((community: any) => {
                if (community._id === communityId) {
                  const updatedMembers = isMember
                    ? community.members.filter(
                        (id: string) => id !== getUserId()
                      )
                    : [...community.members, getUserId()];
                  return { ...community, members: updatedMembers };
                }
                return community;
              }),
            };
          }
        );
      }

      return { previousCommunities, previousSearchResults };
    },
    onError: (err, _variables, context) => {
      // Revert optimistic updates on error
      if (context?.previousCommunities) {
        queryClient.setQueryData(["all_comm"], context.previousCommunities);
      }
      if (context?.previousSearchResults) {
        queryClient.setQueryData(
          ["search_res", searchQuery],
          context.previousSearchResults
        );
      }

      console.error("Join/Leave failed:", err);
    },

    onSettled: () => {
      // Refetch to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ["all_comm"] });
      queryClient.invalidateQueries({ queryKey: ["search_res"] });
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });

  const handleFollowToggle = async (vendorId: string) => {
    try {
      const vendor = displayVendors.find((v: any) => v._id === vendorId);
      if (!vendor) return;

      const isFollowing = vendor.followers.includes(getUserId());

      followMutation.mutate({ vendorId, isFollowing });
    } catch (error) {
      console.error("Follow/Unfollow failed:", error);
    }
  };

  const handleCommunityToggle = async (communityId: string) => {
    try {
      const community = displayCommunities.find(
        (v: any) => v._id === communityId
      );
      if (!community) return;

      const isMember = community.members.includes(getUserId());

      communityMutation.mutate({ communityId, isMember });
    } catch (error) {
      console.log("Join/Leave failed:", error);
    }
  };

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

      {/* Search Loading Indicator */}
      {isSearching && (
        <div className="mb-3 text-sm text-center text-gray-500">
          Searching...
        </div>
      )}

      {/* Vendors & Communities List */}
      <div
        ref={scrollContainerRef}
        className="flex-1 px-4 pb-4 space-y-6 overflow-y-auto transition-shadow duration-300"
      >
        {/* Vendors Section */}
        <div>
          <h2 className="sticky top-0 py-2 mb-3 text-xs font-semibold text-gray-500 bg-white">
            VENDORS
          </h2>
          {isLoading ? (
            <p>Loading vendors...</p>
          ) : displayVendors.length === 0 ? (
            <p className="text-sm text-gray-500">No vendors found.</p>
          ) : (
            displayVendors.map((vendor: any) => {
              const isFollowing = vendor.followers.includes(getUserId());
              const isFollowPending = followMutation.isPending;

              return (
                <motion.div key={vendor._id} layout className="space-y-4">
                  <AnimatePresence>
                    <Link to={`community-vendor/:${vendor._id}`}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center justify-between cursor-pointer"
                      >
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

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleFollowToggle(vendor._id)}
                          disabled={isFollowPending}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ml-[15px] transition-all duration-200 ${
                            isFollowing
                              ? "bg-gray-100 text-gray-700"
                              : "bg-blue-500 text-white"
                          } ${
                            isFollowPending
                              ? "opacity-70 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <AnimatePresence mode="wait">
                            {isFollowing ? (
                              <motion.div
                                key="following"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center space-x-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>
                                  {isFollowPending
                                    ? "Updating..."
                                    : "Following"}
                                </span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="follow"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center space-x-1"
                              >
                                <UserPlus className="w-3 h-3" />
                                <span>
                                  {isFollowPending ? "Following..." : "Follow"}
                                </span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </motion.div>
                    </Link>
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Communities Section */}
        <div>
          <h2 className="sticky top-0 py-2 mb-3 text-xs font-semibold text-gray-500 bg-white">
            COMMUNITIES
          </h2>
          {isLoading ? (
            <p>Loading communities...</p>
          ) : displayCommunities.length === 0 ? (
            <p className="text-sm text-gray-500">No communities found.</p>
          ) : (
            displayCommunities.map((community: any) => {
              const isMember = community.members.includes(getUserId());
              const isCommunityPending = communityMutation.isPending;

              return (
                <motion.div key={community._id} layout className="space-y-4">
                  <AnimatePresence>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3 mb-[10px]">
                        <div className="bg-orange-500 w-[40px] h-[40px] rounded-full text-white flex items-center justify-center">
                          {community?.community_Images ? (
                            <img
                              src={
                                community?.community_Images ||
                                "/placeholder.svg"
                              }
                              alt="community"
                              className="object-cover w-full h-full rounded-full"
                            />
                          ) : (
                            <p>{community?.name?.charAt(0)}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {community.name}
                          </p>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCommunityToggle(community._id)}
                        disabled={isCommunityPending}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ml-[15px] transition-all duration-200 ${
                          isMember
                            ? "bg-gray-100 text-gray-700"
                            : "bg-blue-500 text-white"
                        } ${
                          isCommunityPending
                            ? "opacity-70 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={isMember ? "joined" : "join"}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            {isCommunityPending
                              ? "Updating..."
                              : isMember
                              ? "Joined"
                              : "Join"}
                          </motion.span>
                        </AnimatePresence>
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
