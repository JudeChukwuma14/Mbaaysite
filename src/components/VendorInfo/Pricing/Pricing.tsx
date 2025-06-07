"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Layers,
  LayoutGrid,
  Store,
  Crown,
  Sparkles,
  LucideListStart,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { upgradePlan, type UpgradePlanPayload } from "@/utils/upgradeApi";
import { useSelector } from "react-redux";
import { get_single_vendor } from "@/utils/vendorApi";

export default function UpgradePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [upgradeType, setUpgradeType] = useState<
    "Shelf" | "Counter" | "Shop" | null
  >(null);
  const [openDialog, setOpenDialog] = useState(false);

  const user = useSelector((state: any) => state.vendor);
  const queryClient = useQueryClient();

  const { data: vendor } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => get_single_vendor(user.token),
  });

  // Plan hierarchy for progression
  const planHierarchy = ["Starter", "Shelf", "Counter", "Shop"];

  // Hardcoded categories
  const allCategories = [
    "Beauty and Wellness",
    "Jewelry and Gemstones",
    "Books and Poetry",
    "Home Décor and Accessories",
    "Vintage Stocks",
    "Plant and Seeds",
    "Spices, Condiments, and Seasonings",
    "Local & Traditional Foods",
    "Traditional Clothing & Fabrics",
  ];

  // Replace the existing maxCategories object with this function
  const getMaxCategories = (currentPlan: string, targetPlan: string) => {
    const baseCategoriesForPlan = {
      Shelf: 1,
      Counter: 1,
      Shop: 2,
    };

    const currentPlanIndex = planHierarchy.indexOf(currentPlan);
    const targetPlanIndex = planHierarchy.indexOf(targetPlan);

    // Calculate how many tiers are being skipped
    const tiersSkipped = targetPlanIndex - currentPlanIndex - 1;

    // Base categories for the target plan + bonus for skipped tiers
    const baseCategories =
      baseCategoriesForPlan[targetPlan as keyof typeof baseCategoriesForPlan] ||
      0;
    const bonusCategories = Math.max(0, tiersSkipped);

    return Math.min(baseCategories + bonusCategories, 5); // Cap at 5 total categories
  };

  // Get max categories safely handling null upgradeType
  const getMaxCategoriesSafe = () => {
    if (!upgradeType) return 0;
    return getMaxCategories(vendor?.storeType || "Starter", upgradeType);
  };

  // Filter out categories that vendor already has in their craftCategories
  const availableCategories = allCategories.filter(
    (category) => !vendor?.craftCategories?.includes(category)
  );

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      const maxCats = getMaxCategoriesSafe();
      if (upgradeType && selectedCategories.length < maxCats) {
        setSelectedCategories([...selectedCategories, category]);
      }
    }
  };

  const handleUpgrade = (type: "Shelf" | "Counter" | "Shop") => {
    setUpgradeType(type);
    setSelectedCategories([]);
    setOpenDialog(true);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: Omit<UpgradePlanPayload, "token">) =>
      upgradePlan({ ...payload, token: user.token }),
    onSuccess: () => {
      toast.success(`Successfully upgraded to ${upgradeType} plan!`, {
        position: "top-right",
        autoClose: 3000,
      });
      setOpenDialog(false);
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message || "Failed to upgrade plan"}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  const confirmUpgrade = () => {
    if (!upgradeType || !user.token) {
      toast.error("Authentication token is missing", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    mutate({
      currentPlan: vendor?.storeType || "Starter",
      newPlan: upgradeType,
      newCategories: selectedCategories,
    });
  };

  const renderPlanButton = (plan: string) => {
    // The renderPlanButton function already handles this correctly, but let's add a comment to make it clearer
    // and ensure the styling is consistent for all previous plans
    const currentPlan = vendor?.storeType || "Starter";
    const currentPlanIndex = planHierarchy.indexOf(currentPlan);
    const targetPlanIndex = planHierarchy.indexOf(plan);

    // Current plan
    if (plan === currentPlan) {
      return (
        <div className="w-full text-center py-2 bg-gray-100 rounded text-sm font-medium">
          Current Plan
        </div>
      );
    }

    // Higher tier plans (can upgrade to any of them)
    if (targetPlanIndex > currentPlanIndex) {
      return (
        <motion.button
          className="w-full text-center py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
          onClick={() => handleUpgrade(plan as "Shelf" | "Counter" | "Shop")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Upgrade to {plan}
        </motion.button>
      );
    }

    // In the renderPlanButton function, update the "Previous plans" section:

    // Previous plans (inactive)
    if (targetPlanIndex < currentPlanIndex) {
      return (
        <div className="w-full text-center py-2 bg-gray-200 rounded text-sm font-medium text-gray-500 cursor-not-allowed">
          Previous Plan
        </div>
      );
    }

    // Fallback (shouldn't reach here)
    return (
      <div className="w-full text-center py-2 bg-gray-200 rounded text-sm font-medium text-gray-500 cursor-not-allowed">
        {plan}
      </div>
    );
  };

  // Calculate bonus message and max categories for the dialog
  const getUpgradeInfo = () => {
    if (!upgradeType) return { maxCategories: 0, message: "" };

    const currentPlan = vendor?.storeType || "Starter";
    const currentPlanIndex = planHierarchy.indexOf(currentPlan);
    const targetPlanIndex = planHierarchy.indexOf(upgradeType);
    const tiersSkipped = targetPlanIndex - currentPlanIndex - 1;
    const maxCats = getMaxCategories(currentPlan, upgradeType);

    let message = "";
    if (tiersSkipped > 0) {
      message = `🎉 Bonus! You're skipping ${tiersSkipped} tier${
        tiersSkipped > 1 ? "s" : ""
      }, so you get ${tiersSkipped} extra categor${
        tiersSkipped > 1 ? "ies" : "y"
      }!`;
    } else {
      message = `Standard upgrade: ${maxCats} categor${
        maxCats > 1 ? "ies" : "y"
      } for ${upgradeType} plan.`;
    }

    return { maxCategories: maxCats, message };
  };

  const upgradeInfo = getUpgradeInfo();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ToastContainer />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold">
              Upgrade Your Class Option for more Features
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Current Account: {vendor?.storeType}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Starter Plan */}
            <motion.div
              className="border rounded-lg overflow-hidden bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="bg-gray-50 p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <LucideListStart className="h-4 w-4 text-gray-600" />
                </div>
                <h3 className="font-semibold">Starter</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-black shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Showcase products up to 10 different categories
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-black shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Add products to help buyers and potential customers
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-black shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Stay available to help buyers and potential customers
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-black shrink-0 mt-0.5" />
                    <span className="text-sm">Clients can contact</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 pt-0">{renderPlanButton("Starter")}</div>
            </motion.div>

            {/* Shelf Plan */}
            <motion.div
              className="border rounded-lg overflow-hidden bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="bg-gray-50 p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Layers className="h-4 w-4 text-gray-600" />
                </div>
                <h3 className="font-semibold">Shelf</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Categorize products up to 100 products
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Showcase products in your own shelf
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">Get verified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">Clients can contact</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 pt-0">{renderPlanButton("Shelf")}</div>
            </motion.div>

            {/* Counter Plan */}
            <motion.div
              className="border rounded-lg overflow-hidden bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="bg-gray-50 p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <LayoutGrid className="h-4 w-4 text-yellow-600" />
                </div>
                <h3 className="font-semibold">Counter</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Categorize products up to 100 products
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Showcase products in your own counter
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">Get verified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">Clients can contact</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 pt-0">{renderPlanButton("Counter")}</div>
            </motion.div>

            {/* Shop Plan */}
            <motion.div
              className="border rounded-lg overflow-hidden bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="bg-gray-50 p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Store className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-semibold">Shop</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Categorize products up to 500
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Showcase products in your own shop
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Have access to local order processing
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">Clients can contact</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 pt-0">{renderPlanButton("Shop")}</div>
            </motion.div>

            {/* Premium Plan - Coming Soon */}
            <motion.div
              className="border rounded-lg overflow-hidden bg-white relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <motion.div
                className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full"
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 0 rgba(255, 255, 255, 0)",
                      "0 0 20px rgba(255, 255, 255, 0.5)",
                      "0 0 0 rgba(255, 255, 255, 0)",
                    ],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold text-gray-800">Coming Soon</span>
                </motion.div>
              </motion.div>

              <div className="bg-gray-50 p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Crown className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-semibold">Premium</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">Unlimited products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Have access to local and global order processing
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Have analytics for sales and product performance
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">Premium chat support</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 pt-0">
                <button
                  className="w-full bg-gray-400 text-white py-2 rounded font-medium cursor-not-allowed opacity-70"
                  disabled
                >
                  Upgrade to Premium
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {openDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white rounded-lg max-w-md w-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Choose Categories</h2>
                  <motion.button
                    onClick={() => setOpenDialog(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </motion.button>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Please select{" "}
                  {upgradeInfo.maxCategories === 1
                    ? "1 category"
                    : `${upgradeInfo.maxCategories} categories`}{" "}
                  for your {upgradeType} upgrade:
                </p>

                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-xs text-blue-700">{upgradeInfo.message}</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {availableCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <div
                          className={`w-5 h-5 border rounded flex items-center justify-center ${
                            selectedCategories?.includes(category)
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300"
                          } ${
                            upgradeType &&
                            selectedCategories.length >=
                              upgradeInfo.maxCategories &&
                            !selectedCategories.includes(category)
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => {
                            if (
                              upgradeType &&
                              !(
                                selectedCategories.length >=
                                  upgradeInfo.maxCategories &&
                                !selectedCategories.includes(category)
                              )
                            ) {
                              handleCategoryChange(category);
                            }
                          }}
                        >
                          {selectedCategories.includes(category) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                damping: 10,
                                stiffness: 200,
                              }}
                            >
                              <Check className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <span className="text-sm">{category}</span>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between">
                  <motion.button
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 font-medium"
                    onClick={() => setOpenDialog(false)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    className={`px-4 py-2 rounded font-medium ${
                      upgradeType &&
                      selectedCategories.length === upgradeInfo.maxCategories
                        ? upgradeType === "Shelf"
                          ? "bg-orange-500 text-white"
                          : "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={confirmUpgrade}
                    disabled={
                      !upgradeType ||
                      selectedCategories.length !== upgradeInfo.maxCategories ||
                      isPending
                    }
                    whileHover={
                      upgradeType &&
                      selectedCategories.length === upgradeInfo.maxCategories &&
                      !isPending
                        ? { scale: 1.03 }
                        : {}
                    }
                    whileTap={
                      upgradeType &&
                      selectedCategories.length === upgradeInfo.maxCategories &&
                      !isPending
                        ? { scale: 0.97 }
                        : {}
                    }
                  >
                    {isPending ? "Upgrading..." : "Confirm Upgrade"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
