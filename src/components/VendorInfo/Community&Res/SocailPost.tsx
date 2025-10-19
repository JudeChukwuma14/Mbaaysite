import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, UserMinus, X } from "lucide-react";
import {
  follow_vendor,
  unfollow_vendor,
  get_vendors_community,
  get_all_communities,
  leave_community,
  join_community,
  search_vendor_community,
} from "@/utils/communityApi";
import { get_single_vendor } from "@/utils/vendorApi";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
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
  const [pendingFollowId, setPendingFollowId] = useState<string | null>(null);
  const [pendingFollowAction, setPendingFollowAction] = useState<
    "follow" | "unfollow" | null
  >(null);
  const [pendingCommunityId, setPendingCommunityId] = useState<string | null>(
    null
  );
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  // const navigate = useNavigate();

  // Constants
  const VISIBLE_COUNT = 4;

  // Debounce helper (use named generic function to avoid TSX generic parsing issues)
  function useDebouncedValue<T>(value: T, delay = 120): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const t = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(t);
    }, [value, delay]);
    return debounced as T;
  }

  const debouncedSearch = useDebouncedValue(searchQuery, 120);

  // Get the currently logged-in vendor using the same endpoint as KYC
  const { data: currentVendor } = useQuery({
    queryKey: ["vendor", user?.token],
    queryFn: () => get_single_vendor(user?.token || ""),
    enabled: !!user?.token,
  });

  // Prefer Redux vendor id first to avoid early-empty id during initial vendor fetch
  const currentUserId: string =
    user?.vendor?._id ?? user?.vendor?.id ?? (currentVendor as any)?._id ?? "";

  const { data: vendors = [], isLoading: isLoadingVendors } = useQuery({
    queryKey: ["vendors"],
    queryFn: () => get_vendors_community(user.token),
    enabled: !!user?.token,
  });

  const { data: all_communities = [], isLoading: isLoadingCommunities } =
    useQuery({
      queryKey: ["all_comm"],
      queryFn: () => get_all_communities(),
    });
    console.log("Comm", all_communities)

  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: ["search_res", debouncedSearch],
    queryFn: () => search_vendor_community(user?.token, debouncedSearch),
    enabled: (debouncedSearch?.trim()?.length ?? 0) >= 2,
  });

  const localFilteredVendors = useMemo(() => {
    const q = debouncedSearch?.trim().toLowerCase();
    if (!q) return [] as any[];
    return vendors.filter((v: any) =>
      (v?.storeName || "").toLowerCase().includes(q)
    );
  }, [vendors, debouncedSearch]);

  const localFilteredCommunities = useMemo(() => {
    const q = debouncedSearch?.trim().toLowerCase();
    if (!q) return [] as any[];
    return (all_communities as any[]).filter((c: any) =>
      (c?.name || "").toLowerCase().includes(q)
    );
  }, [all_communities, debouncedSearch]);

  // Normalize search results in case API nests payload differently
  const sr: any = searchResults as any;
  const apiVendors =
    sr?.vendors ?? sr?.data?.vendors ?? sr?.result?.vendors ?? [];
  const apiCommunities =
    sr?.communities ??
    sr?.data?.communities ??
    sr?.result?.communities ??
    sr?.totalCommunities?.communities ?? [];

  const searchVendors = (apiVendors?.length ? apiVendors : localFilteredVendors) || [];
  const searchCommunities =
    (apiCommunities?.length ? apiCommunities : localFilteredCommunities) || [];

  const isSearchActive = (debouncedSearch?.trim()?.length ?? 0) >= 1;
  // Daily rotation to make lists feel fresh every day
  const dayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const rotateArray = <T,>(arr: T[], seedStr: string): T[] => {
    if (!arr?.length) return [];
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }
    const start = Math.abs(hash) % arr.length;
    return [...arr.slice(start), ...arr.slice(0, start)];
  };

  const rotatedVendors = useMemo(
    () => rotateArray(vendors, dayKey),
    [vendors, dayKey]
  );
  const rotatedCommunities = useMemo(
    () => rotateArray(all_communities, dayKey),
    [all_communities, dayKey]
  );

  // Dropdown data sources: all on focus, filtered when typing
  const dropdownVendors = (debouncedSearch?.trim()?.length ?? 0) >= 1
    ? searchVendors
    : vendors;
  const dropdownCommunities = (debouncedSearch?.trim()?.length ?? 0) >= 1
    ? searchCommunities
    : all_communities;

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(e.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSearchDropdown(false);
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Build display lists: exclude already-followed vendors and joined communities, then cap at 4
  const vendorsSource = isSearchActive ? searchVendors : rotatedVendors;
  const communitiesSource = isSearchActive
    ? searchCommunities
    : rotatedCommunities;

  const displayVendors = useMemo(() => {
    const arr = Array.isArray(vendorsSource) ? vendorsSource : [];
    // Do NOT exclude already-followed vendors to avoid disappearing cards during optimistic updates
    return arr.slice(0, VISIBLE_COUNT);
  }, [vendorsSource]);

  const displayCommunities = useMemo(() => {
    const arr = Array.isArray(communitiesSource) ? communitiesSource : [];
    // Show both joined and unjoined to allow leaving directly
    return arr.slice(0, VISIBLE_COUNT);
  }, [communitiesSource]);

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
      // Track which vendor is pending to make loading state per-item
      setPendingFollowId(vendorId);
      setPendingFollowAction(isFollowing ? "unfollow" : "follow");
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["vendors"] });
      await queryClient.cancelQueries({ queryKey: ["search_res"] });

      // Snapshot the previous values
      const previousVendors = queryClient.getQueryData(["vendors"]);
      const previousSearchResults = queryClient.getQueryData([
        "search_res",
        debouncedSearch,
      ]);
      // const previousMe = queryClient.getQueryData(["vendor", user?.token]);

      // Optimistically update vendors list
      queryClient.setQueryData(
        ["vendors"],
        (oldVendors: Vendor[] | undefined) => {
          if (!oldVendors) return oldVendors;
          return oldVendors.map((vendor) => {
            if (vendor._id === vendorId) {
              const updatedFollowers = isFollowing
                ? vendor.followers.filter((id) => id !== currentUserId)
                : [...vendor.followers, currentUserId];
              return { ...vendor, followers: updatedFollowers };
            }
            return vendor;
          });
        }
      );

      // Optimistically update current vendor's following list while preserving shape (strings vs objects)
      queryClient.setQueryData(["vendor", user?.token], (oldMe: any) => {
        if (!oldMe) return oldMe;
        const prevFollowing: any[] = Array.isArray(oldMe.following)
          ? oldMe.following
          : [];
        const isObjectArray = prevFollowing.some((f) => typeof f !== "string");

        const filtered = prevFollowing.filter((f: any) => {
          const id = typeof f === "string" ? f : f?._id;
          return id !== vendorId;
        });

        let nextFollowing: any[];
        if (isFollowing) {
          // We were following; now unfollow (already filtered above)
          nextFollowing = filtered;
        } else {
          // We were not following; now follow by adding in the same shape
          nextFollowing = [
            ...prevFollowing,
            isObjectArray ? { _id: vendorId } : vendorId,
          ];
        }

        return { ...oldMe, following: nextFollowing };
      });

      // Optimistically update search results if search is active
      if (debouncedSearch) {
        queryClient.setQueryData(
          ["search_res", debouncedSearch],
          (oldData: any) => {
            if (!oldData?.vendors) return oldData;
            return {
              ...oldData,
              vendors: oldData.vendors.map((vendor: Vendor) => {
                if (vendor._id === vendorId) {
                  const updatedFollowers = isFollowing
                    ? vendor.followers.filter(
                        (id: string) => id !== currentUserId
                      )
                    : [...vendor.followers, currentUserId];
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
          ["search_res", debouncedSearch],
          context.previousSearchResults
        );
      }
      console.error("Follow/Unfollow failed:", err);
    },
    onSettled: () => {
      // Clear pending id regardless of outcome
      setPendingFollowId(null);
      setPendingFollowAction(null);
      // Refetch to ensure we have the latest data
      queryClient.refetchQueries({ queryKey: ["vendors"] });
      queryClient.refetchQueries({ queryKey: ["search_res"] });
      queryClient.refetchQueries({ queryKey: ["vendor"] });
      queryClient.refetchQueries({ queryKey: ["vendor", user?.token] });
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
      // Track which community is pending to make loading state per-item
      setPendingCommunityId(communityId);
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["all_comm"] });
      await queryClient.cancelQueries({ queryKey: ["search_res"] });

      // Snapshot the previous value
      const previousCommunities = queryClient.getQueryData(["all_comm"]);
      const previousSearchResults = queryClient.getQueryData([
        "search_res",
        debouncedSearch,
      ]);

      // Optimistically update communities list
      queryClient.setQueryData(
        ["all_comm"],
        (oldCommunities: any[] | undefined) => {
          if (!oldCommunities) return oldCommunities;
          return oldCommunities.map((community) => {
            if (community._id === communityId) {
              const updatedMembers = isMember
                ? community.members.filter((id: string) => id !== currentUserId)
                : [...community.members, currentUserId];
              return { ...community, members: updatedMembers };
            }
            return community;
          });
        }
      );

      // Optimistically update search results if search is active
      if (debouncedSearch) {
        queryClient.setQueryData(
          ["search_res", debouncedSearch],
          (oldData: any) => {
            if (!oldData?.communities) return oldData;
            return {
              ...oldData,
              communities: oldData.communities.map((community: any) => {
                if (community._id === communityId) {
                  const updatedMembers = isMember
                    ? community.members.filter(
                        (id: string) => id !== currentUserId
                      )
                    : [...community.members, currentUserId];
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
          ["search_res", debouncedSearch],
          context.previousSearchResults
        );
      }

      console.error("Join/Leave failed:", err);
    },

    onSettled: () => {
      // Clear pending id regardless of outcome
      setPendingCommunityId(null);
      // Refetch to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ["all_comm"] });
      queryClient.invalidateQueries({ queryKey: ["search_res"] });
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      // Also refresh the main posts feed so new community posts show immediately
      queryClient.invalidateQueries({ queryKey: ["comm_posts"] });
    },
  });

  const handleFollowToggle = async (vendorId: string) => {
    try {
      if (!currentUserId) return; // wait until we have a stable user id
      const vendor = displayVendors.find((v: any) => v._id === vendorId);
      if (!vendor) return;

      const followingRaw = (currentVendor as any)?.following;
      const followingIds: string[] = Array.isArray(followingRaw)
        ? followingRaw
            .map((f: any) => (typeof f === "string" ? f : f?._id))
            .filter(Boolean)
        : [];
      const isFollowing = Boolean(
        vendor?.followers?.includes(currentUserId) ||
          followingIds.includes(vendorId)
      );

      followMutation.mutate({ vendorId, isFollowing });
    } catch (error) {
      console.error("Follow/Unfollow failed:", error);
    }
  };

  const handleCommunityToggle = async (communityId: string) => {
    try {
      // prevent duplicate click on the same item while pending
      if (pendingCommunityId === communityId) return;
      if (!currentUserId) return; // wait until we have a stable user id
      const community = displayCommunities.find(
        (v: any) => v._id === communityId
      );
      if (!community) return;

      const isMember = community.members.includes(currentUserId);

      communityMutation.mutate({ communityId, isMember });
    } catch (error) {
      console.log("Join/Leave failed:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-auto md:h-screen max-w-md mx-auto overflow-x-hidden bg-white max-w-full">
      {/* Search Bar */}
      <div className="p-4 bg-white">
        <div ref={searchWrapRef} className="relative mb-2">
          <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search vendors or communities"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full py-2 pl-10 pr-10 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          {searchQuery && (
            <button
              aria-label="Clear search"
              onClick={() => setSearchQuery("")}
              className="absolute p-1 -translate-y-1/2 rounded right-2 top-1/2 hover:bg-gray-200"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
          {showSearchDropdown && (
            <div className="absolute left-0 right-0 z-20 w-full mt-2 overflow-hidden bg-white border rounded-lg shadow-lg max-h-96">
              <div className="p-3 text-xs font-semibold text-gray-500">VENDORS</div>
              {Array.isArray(dropdownVendors) && dropdownVendors.length > 0 ? (
                <div className="max-h-40 overflow-y-auto">
                  {dropdownVendors.map((v: any) => {
                    const followingRaw = (currentVendor as any)?.following;
                    const followingIds: string[] = Array.isArray(followingRaw)
                      ? followingRaw
                          .map((f: any) => (typeof f === "string" ? f : f?._id))
                          .filter(Boolean)
                      : [];
                    const isFollowing = Boolean(
                      v?.followers?.includes(currentUserId) ||
                        followingIds.includes(v?._id)
                    );
                    const isFollowPending =
                      followMutation.isPending && pendingFollowId === v._id;
                    return (
                      <div
                        key={v._id}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50"
                      >
                        <Link
                          to={`/app/vendor-details/${v._id}`}
                          className="flex items-center gap-3 min-w-0 flex-1"
                          onClick={() => setShowSearchDropdown(false)}
                        >
                          <div className="w-8 h-8 overflow-hidden bg-orange-500 rounded-full text-white flex items-center justify-center shrink-0">
                            {v?.avatar || v?.businessLogo ? (
                              <img
                                src={(v?.avatar || v?.businessLogo) as string}
                                alt={v?.storeName || "vendor"}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span className="text-sm font-medium">{v?.storeName?.charAt(0)}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">{v?.storeName}</div>
                            {v?.craftCategories?.[0] && (
                              <div className="text-xs text-gray-500 truncate">{v.craftCategories[0]}</div>
                            )}
                          </div>
                        </Link>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleFollowToggle(v._id)}
                          disabled={isFollowPending || !currentUserId}
                          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 shrink-0 whitespace-nowrap ${
                            isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                          } ${
                            isFollowPending || !currentUserId
                              ? "opacity-70 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {isFollowPending ? (
                            <>
                              {pendingFollowAction === "unfollow" ? (
                                <UserMinus className="w-3 h-3" />
                              ) : (
                                <UserPlus className="w-3 h-3" />
                              )}
                              <span>
                                {pendingFollowAction === "unfollow"
                                  ? "Unfollowing..."
                                  : "Following..."}
                              </span>
                            </>
                          ) : isFollowing ? (
                            <>
                              <UserMinus className="w-3 h-3" />
                              <span>Unfollow</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3" />
                              <span>Follow</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-3 pb-3 text-xs text-gray-500">No vendors found.</div>
              )}

              <div className="p-3 text-xs font-semibold text-gray-500">COMMUNITIES</div>
              {Array.isArray(dropdownCommunities) && dropdownCommunities.length > 0 ? (
                <div className="max-h-40 overflow-y-auto">
                  {dropdownCommunities.map((c: any) => (
                    <Link
                      key={c._id}
                      to={`/app/comunity-detail/${c._id}`}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50"
                      onClick={() => setShowSearchDropdown(false)}
                    >
                      <div className="w-8 h-8 overflow-hidden bg-orange-500 rounded-full text-white flex items-center justify-center">
                        {c?.community_Images ? (
                          <img
                            src={c?.community_Images as string}
                            alt={c?.name || "community"}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-sm font-medium">{c?.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{c?.name}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-3 pb-3 text-xs text-gray-500">No communities found.</div>
              )}
            </div>
          )}
        </div>
        {isSearching ? (
          <div className="mb-2 text-xs text-gray-500">Searching…</div>
        ) : isSearchActive ? (
          <div className="mb-2 text-xs text-gray-500">
            Showing results for "{debouncedSearch}"
          </div>
        ) : (
          <div className="mb-2 text-xs text-gray-500">
            Discover new vendors and communities daily
          </div>
        )}
      </div>

      {/* Search Loading Indicator handled above */}

      {/* Vendors & Communities List */}
      <div
        ref={scrollContainerRef}
        className="flex-1 px-4 pb-6 space-y-8 overflow-x-hidden overflow-visible md:overflow-y-auto transition-shadow duration-300"
      >
        {/* Vendors Section */}
        <div>
          <h2 className="sticky top-0 py-2 mb-3 text-xs font-semibold text-gray-500 bg-white">
            VENDORS
          </h2>
          {isLoadingVendors ? (
            <div className="grid grid-cols-1 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg animate-pulse"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div>
                      <div className="h-3 mb-2 bg-gray-200 rounded w-28" />
                      <div className="w-16 h-3 bg-gray-100 rounded" />
                    </div>
                  </div>
                  <div className="w-20 h-6 bg-gray-200 rounded-full" />
                </div>
              ))}
            </div>
          ) : displayVendors.length === 0 ? (
            <p className="text-sm text-gray-500">No vendors found.</p>
          ) : (
            displayVendors.map((vendor: any) => {
              const followingRaw = (currentVendor as any)?.following;
              const followingIds: string[] = Array.isArray(followingRaw)
                ? followingRaw
                    .map((f: any) => (typeof f === "string" ? f : f?._id))
                    .filter(Boolean)
                : [];
              const isFollowing = Boolean(
                vendor?.followers?.includes(currentUserId) ||
                  followingIds.includes(vendor?._id)
              );
              const isFollowPending =
                followMutation.isPending && pendingFollowId === vendor._id;

              return (
                <motion.div key={vendor._id} layout className="space-y-4">
                  <AnimatePresence>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-between w-full gap-3 p-3 overflow-hidden transition border rounded-lg hover:shadow-sm"
                    >
                      <Link
                        to={`/app/vendor-details/${vendor._id}`}
                        className="flex items-center flex-1 min-w-0 space-x-3 overflow-hidden"
                      >
                        <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-orange-500 text-white flex items-center justify-center shrink-0">
                          {vendor?.avatar || vendor?.businessLogo ? (
                            <img
                              src={
                                (vendor?.avatar ||
                                  vendor?.businessLogo) as string
                              }
                              alt={vendor?.storeName || "vendor"}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <p>{vendor?.storeName?.charAt(0)}</p>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-full text-sm font-medium break-words truncate">
                            {vendor.storeName}
                          </p>
                          {vendor?.craftCategories?.[0] && (
                            <p className="max-w-full text-xs text-gray-500 break-words truncate">
                              {vendor.craftCategories[0]}
                            </p>
                          )}
                        </div>
                      </Link>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleFollowToggle(vendor._id)}
                        disabled={isFollowPending || !currentUserId}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 shrink-0 whitespace-nowrap ${
                          isFollowing
                            ? "bg-red-500 text-white"
                            : "bg-blue-500 text-white"
                        } ${
                          isFollowPending || !currentUserId
                            ? "opacity-70 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {isFollowPending ? (
                          <motion.div
                            key="pending"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center space-x-1"
                          >
                            {pendingFollowAction === "unfollow" ? (
                              <UserMinus className="w-3 h-3" />
                            ) : (
                              <UserPlus className="w-3 h-3" />
                            )}
                            <span className="whitespace-normal">
                              {pendingFollowAction === "unfollow"
                                ? "Unfollowing..."
                                : "Following..."}
                            </span>
                          </motion.div>
                        ) : (
                          <AnimatePresence mode="wait">
                            {isFollowing ? (
                              <motion.div
                                key="unfollow"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center space-x-1"
                              >
                                <UserMinus className="w-3 h-3" />
                                <span>Unfollow</span>
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
                                <span>Follow</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </motion.button>
                    </motion.div>
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
          {isLoadingCommunities ? (
            <div className="grid grid-cols-1 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg animate-pulse"
                >
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="h-3 mb-2 bg-gray-200 rounded w-28" />
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-gray-200 rounded-full" />
                </div>
              ))}
            </div>
          ) : displayCommunities.length === 0 ? (
            <p className="text-sm text-gray-500">No communities found.</p>
          ) : (
            displayCommunities.map((community: any) => {
               const isOwner = community?.admin?._id === user?.vendor?._id;
              const isMember = community.members.includes(currentUserId);
              const isCommunityPending = communityMutation.isPending && pendingCommunityId === community._id;

              return (
              <Link to={`/app/comunity-detail/${community._id}`}>
                    <motion.div key={community._id} layout className="space-y-4">
                  <AnimatePresence>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-between gap-3 p-3 overflow-hidden transition border rounded-lg hover:shadow-sm"
                    >
                      <div className="flex items-center flex-1 min-w-0 space-x-3">
                        <div className="bg-orange-500 w-[40px] h-[40px] rounded-full text-white flex items-center justify-center overflow-hidden">
                          {community?.community_Images ? (
                            <img
                              src={
                                community?.community_Images ||
                                "/placeholder.svg"
                              }
                              alt="community"
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <p>{community?.name?.charAt(0)}</p>
                          )}
                        </div>
                        <div className="min-w-0 overflow-hidden">
                          <p className="max-w-full text-sm font-medium break-words truncate">
                            {community.name}
                          </p>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCommunityToggle(community._id)}
                        disabled={isCommunityPending || isOwner}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 shrink-0 whitespace-nowrap ${
                           isOwner
                                ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                                : isMember
                            ? "bg-red-500 text-white"
                            : "bg-blue-500 text-white"
                        } ${
                          isCommunityPending
                            ? "opacity-70 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={isOwner ? "Owner" : isMember ? "Leave" : "Join"}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            {isCommunityPending
                              ? "Updating..."
                              : isOwner
                              ? "Owner"
                              : isMember
                              ? "Leave"
                              : "Join"}
                          </motion.span>
                        </AnimatePresence>
                      </motion.button>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
