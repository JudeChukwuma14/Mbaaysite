import type React from "react";
import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { getAllVendor } from "@/utils/vendorApi";
import Spinner from "../../Common/Spinner";
import { useSelector } from "react-redux";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { follow_vendor, unfollow_vendor } from "@/utils/communityApi";
import {
  FaRegSadTear,
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaPhone,
  FaUsers,
  FaBox,
  FaComments,
} from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Default banner image
const defaultBanner = "https://www.mbaay.com/assets/MBLogo-spwX6zWd.png";

interface Subscription {
  currentPlan: string;
  billingCycle: string;
  status: string;
  startDate: string;
  expiryDate: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  poster: string;
  [key: string]: any;
}

interface Vendor {
  _id: string;
  storeName: string;
  businessLogo?: string;
  avatar?: string;
  products: Product[];
  followers: string[];
  following: string[];
  subscription?: Subscription;
  verificationStatus?: string;
  kycStatus?: string;
  storeType?: string;
  storePhone?: string;
  craftCategories?: string[];
  communityPosts?: string[];
  communities?: string[];
  [key: string]: any;
}

const VendorProfileCommunity: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: any) => state.vendor);
  const queryClient = useQueryClient();
  const getUserId = () => user?.vendor?._id || user?.vendor?.id;
  const [pendingAction, setPendingAction] = useState<
    "follow" | "unfollow" | null
  >(null);

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!id) {
        setError("Invalid vendor URL. Please select a vendor.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching vendors for vendorId:", id);
        const response = await getAllVendor();
        console.log("API response:", response);

        if (!response || !Array.isArray(response.vendors)) {
          throw new Error("Invalid response format: vendors array not found");
        }

        const selectedVendor = response.vendors.find(
          (v: Vendor) => v._id === id
        );
        if (!selectedVendor) {
          throw new Error(`Vendor with ID ${id} not found`);
        }

        console.log("Selected vendor:", selectedVendor);
        setVendor(selectedVendor);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Error fetching vendor data:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [id]);

  const isFollowing = vendor?.followers?.includes(getUserId());
  const followMutation = useMutation({
    mutationFn: async (currentlyFollowing: boolean) => {
      if (!vendor) return;
      return currentlyFollowing
        ? unfollow_vendor(user.token, vendor._id)
        : follow_vendor(user.token, vendor._id);
    },
    onMutate: async (currentlyFollowing: boolean) => {
      setPendingAction(currentlyFollowing ? "unfollow" : "follow");
      // Cancel relevant queries to avoid race conditions
      await queryClient.cancelQueries({ queryKey: ["vendors"] });
      await queryClient.cancelQueries({ queryKey: ["vendor"] });

      setVendor((prev) => {
        if (!prev) return prev;
        const updatedFollowers = currentlyFollowing
          ? prev.followers.filter((id: string) => id !== getUserId())
          : [...prev.followers, getUserId()];
        return { ...prev, followers: updatedFollowers };
      });

      // Optimistically update vendors list cache for consistency
      queryClient.setQueryData(["vendors"], (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((v: any) => {
          if (v?._id !== vendor?._id) return v;
          const updatedFollowers = currentlyFollowing
            ? (v?.followers || []).filter((id: string) => id !== getUserId())
            : [...(v?.followers || []), getUserId()];
          return { ...v, followers: updatedFollowers };
        });
      });

      // Optimistically update current vendor (me) following list, preserving shape
      queryClient.setQueryData(["vendor", user?.token], (oldMe: any) => {
        if (!oldMe) return oldMe;
        const prevFollowing: any[] = Array.isArray(oldMe.following)
          ? oldMe.following
          : [];
        const isObjectArray = prevFollowing.some((f) => typeof f !== "string");
        const filtered = prevFollowing.filter((f: any) => {
          const id = typeof f === "string" ? f : f?._id;
          return id !== vendor?._id;
        });
        let nextFollowing: any[];
        if (currentlyFollowing) {
          nextFollowing = filtered; // unfollow
        } else {
          nextFollowing = [
            ...prevFollowing,
            isObjectArray ? { _id: vendor?._id } : vendor?._id,
          ];
        }
        return { ...oldMe, following: nextFollowing };
      });
    },
    onError: () => {
      // Revert optimistic update by toggling back
      setVendor((prev) => {
        if (!prev) return prev;
        const currentlyFollowing = prev.followers.includes(getUserId());
        const revertedFollowers = currentlyFollowing
          ? prev.followers.filter((id: string) => id !== getUserId())
          : [...prev.followers, getUserId()];
        return { ...prev, followers: revertedFollowers };
      });
    },
    onSettled: () => {
      setPendingAction(null);
      // Keep global caches consistent
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });

  const handleFollowToggle = () => {
    if (!vendor) return;
    followMutation.mutate(!!isFollowing);
  };

  // Pagination logic
  const totalProducts = vendor?.products.length || 0;

  if (!id) {
    return <Navigate to="/shop" replace />;
  }
  if (loading) {
    return <Spinner />;
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen">
        <div className="container px-4 py-12 mx-auto text-center">
          <FaRegSadTear className="mx-auto mb-4 text-5xl text-gray-300" />
          <h2 className="mb-2 text-2xl font-semibold text-gray-400">Error</h2>
          <p className="max-w-md mx-auto mb-6 text-gray-500">
            {error || "Vendor not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden max-w-full">
      {/* Hero Banner */}
      <div className="relative w-full h-48 bg-white sm:h-56 md:h-64 lg:h-80">
        <div className="absolute inset-0">
          <img
            src={
              vendor.businessLogo ||
              vendor.avatar ||
              defaultBanner ||
              "/placeholder.svg" ||
              "/placeholder.svg"
            }
            alt={`${vendor.storeName} banner`}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition rounded-md cursor-pointer top-4 left-4 bg-black/40 hover:bg-black/60 z-10"
          aria-label="Go back"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="container relative flex flex-col justify-end h-full px-4 pb-6 mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 overflow-hidden bg-gray-200 border-4 border-white rounded-full">
                {vendor.avatar || vendor.businessLogo ? (
                  <img
                    src={
                      vendor.avatar || vendor.businessLogo || "/placeholder.svg"
                    }
                    alt={`${vendor.storeName} logo`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-300">
                    <span className="text-xl sm:text-2xl font-bold text-gray-600">
                      {vendor.storeName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex flex-col gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider text-white break-words">
                    {vendor.storeName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {vendor.verificationStatus === "Approved" && (
                      <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                        <FaCheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {vendor.subscription && (
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-xs">
                        {vendor.subscription.currentPlan} Plan
                      </Badge>
                    )}
                    {vendor.storeType && (
                      <Badge variant="secondary" className="text-xs">
                        {vendor.storeType}
                      </Badge>
                    )}
                  </div>
                </div>
                {vendor._id !== getUserId() && (
                  <div className="flex justify-start sm:justify-end">
                    <Button
                      onClick={handleFollowToggle}
                      disabled={followMutation.isPending}
                      className={`${
                        isFollowing
                          ? "bg-gray-600 hover:bg-gray-700"
                          : "bg-orange-500 hover:bg-orange-600"
                      } text-white ${
                        followMutation.isPending
                          ? "opacity-80 cursor-not-allowed"
                          : ""
                      } text-sm px-4 py-2`}
                    >
                      {followMutation.isPending
                        ? pendingAction === "unfollow"
                          ? "Unfollowing..."
                          : "Following..."
                        : isFollowing
                        ? "Unfollow"
                        : "Follow"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
          {/* Stats Card */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="mb-4 text-lg font-semibold">Stats</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/10">
                    <FaUsers className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">
                      {vendor.followers.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Followers
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10">
                    <FaUsers className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">
                      {vendor.following.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Following
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/10">
                    <FaBox className="text-purple-500" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">
                      {totalProducts}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Products
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/10">
                    <FaComments className="text-indigo-500" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">
                      {vendor.communityPosts?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10">
                    <FaUsers className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">
                      {vendor.communities?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Communities
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Card */}
          <Card className="lg:col-span-2">
            <CardContent className="p-4 sm:p-6">
              <h3 className="mb-4 text-lg font-semibold">About</h3>
              <div className="space-y-3 sm:space-y-4">
                {vendor.craftCategories &&
                  vendor.craftCategories.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                        Specialties
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {vendor.craftCategories.map((category, index) => (
                          <Badge key={index} variant="outline">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                {vendor.storePhone && (
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-muted-foreground" />
                    <span className="text-sm">{vendor.storePhone}</span>
                  </div>
                )}
                {vendor.subscription && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                      Subscription
                    </h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className={`inline-flex items-center gap-1 ${
                          vendor.subscription.status === "Active"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {vendor.subscription.status === "Active" ? (
                          <FaCheckCircle />
                        ) : (
                          <FaClock />
                        )}
                        {vendor.subscription.status}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span>
                        {vendor.subscription.currentPlan} (
                        {vendor.subscription.billingCycle})
                      </span>
                    </div>
                  </div>
                )}
                {vendor.kycStatus && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                      KYC Status
                    </h4>
                    <Badge
                      variant={
                        vendor.kycStatus === "Approved"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {vendor.kycStatus}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileCommunity;
