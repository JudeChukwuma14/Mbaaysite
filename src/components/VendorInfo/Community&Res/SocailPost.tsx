"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, Check } from "lucide-react";
import { follow_vendor, unfollow_vendor, get_vendors_community } from "@/utils/communityApi";
import { useSelector } from "react-redux";

interface Vendor {
  _id: string;
  storeName: string;
  craftCategories: string[];
  following: string[]; // List of followed vendor IDs
}

export default function SocialList() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: any) => state.vendor);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await get_vendors_community(user?.token);
        setVendors(response?.data?.vendors || []);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, [user?.token]); // Fetch only when the token changes

  const handleFollowToggle = async (vendorId: string) => {
    try {
      const isFollowing = vendors.some((vendor) => vendor._id === vendorId && vendor.following.includes(user?.id));

      if (isFollowing) {
        await unfollow_vendor(user.token, vendorId);
      } else {
        await follow_vendor(user.token, vendorId);
      }

      // Update state instantly for better UX
      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor._id === vendorId
            ? {
                ...vendor,
                following: isFollowing
                  ? vendor.following.filter((id) => id !== user?.id) // Remove user from following
                  : [...vendor.following, user?.id], // Add user to following
              }
            : vendor
        )
      );
    } catch (error) {
      console.error("Follow/Unfollow failed:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white h-screen flex flex-col">
      <div className="p-4 bg-white">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search People or Group"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 pb-4 space-y-6 transition-shadow duration-300">
        <div>
          <h2 className="text-xs font-semibold text-gray-500 mb-3 sticky top-0 bg-white py-2">VENDORS</h2>
          {vendors.map((vendor) => {
            const isFollowing = vendor.following.includes(user?.id);

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
                    <div className="flex items-center space-x-3 mb-[10px]">
                      <div className="bg-orange-500 w-[40px] h-[40px] rounded-full text-white flex items-center justify-center">
                        <p>{vendor?.storeName?.charAt(0)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{vendor.storeName}</p>
                        {vendor?.craftCategories[0] && <p className="text-xs text-gray-500">{vendor.craftCategories[0]}</p>}
                      </div>
                    </div>

                    {/* Follow/Unfollow Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFollowToggle(vendor._id)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ml-[15px] ${
                        isFollowing ? "bg-gray-100 text-gray-700" : "bg-blue-500 text-white"
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
          })}
        </div>
      </div>
    </div>
  );
}
