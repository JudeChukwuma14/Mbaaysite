"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronLeft,
  X,
  Layers,
  LayoutGrid,
  Store,
  Crown,
  Sparkles,
  LucideListStart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useUpgradeVendorPlan } from "@/utils/upgradeApi";

export default function UpgradePage() {
  // Track selected categories for the current selection
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [upgradeType, setUpgradeType] = useState<
    "Shelf" | "Counter" | "Shop" | null
  >(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Get user token from Redux
  const user = useSelector((state: RootState) => state.vendor);

  // All available categories
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

  // TanStack Query mutation for upgrading plan
  const upgradeMutation = useUpgradeVendorPlan();

  // Get max categories allowed for the current upgrade type
  const getMaxCategories = () => {
    switch (upgradeType) {
      case "Shelf":
        return 1;
      case "Counter":
        return 3;
      case "Shop":
        return 5;
      default:
        return 0;
    }
  };

  // Handle category selection in the modal
  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      const maxCategories = getMaxCategories();
      if (selectedCategories.length < maxCategories) {
        setSelectedCategories([...selectedCategories, category]);
      }
    }
  };

  // Open the upgrade dialog
  const handleUpgrade = (type: "Shelf" | "Counter" | "Shop") => {
    setUpgradeType(type);
    setOpenDialog(true);
    setSelectedCategories([]); // Reset selections when opening dialog
  };

  // Confirm the upgrade and call the API
  const confirmUpgrade = () => {
    if (!upgradeType) return;

    // Call the mutation to upgrade the plan
    upgradeMutation.mutate({
      newPlan: upgradeType,
      categories: selectedCategories,
      token: user.token ?? "",
    });

    // Close dialog on success (handled in the mutation's onSuccess)
    setOpenDialog(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
              Current Account: Starter
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <div className="p-4 pt-0">
                <div className="w-full text-center py-2 bg-gray-100 rounded text-sm font-medium">
                  Current Plan
                </div>
              </div>
            </motion.div>

            {/* Shelves Plan */}
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
                <h3 className="font-semibold">Shelves</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Select <strong>1</strong> product category
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Showcase products in your own shelves
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
              <div className="p-4 pt-0">
                <motion.button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-medium"
                  onClick={() => handleUpgrade("Shelf")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Upgrade to Shelves
                </motion.button>
              </div>
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
                      Select <strong>3</strong> product categories
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
              <div className="p-4 pt-0">
                <motion.button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
                  onClick={() => handleUpgrade("Counter")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Upgrade to Counter
                </motion.button>
              </div>
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
                      Select <strong>5</strong> product categories
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
              <div className="p-4 pt-0">
                <motion.button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
                  onClick={() => handleUpgrade("Shop")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Upgrade to Shop
                </motion.button>
              </div>
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
              {/* Coming Soon Overlay */}
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

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/app">
              <motion.button
                className="text-blue-600 text-sm flex items-center gap-1 mx-auto"
                whileHover={{ x: -3 }}
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Home
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Category Selection Dialog */}
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
                  Please select {getMaxCategories()}{" "}
                  {getMaxCategories() === 1 ? "category" : "categories"} for
                  your {upgradeType} upgrade:
                </p>

                <div className="grid grid-cols-1 gap-3">
                  {allCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <div
                          className={`w-5 h-5 border rounded flex items-center justify-center ${
                            selectedCategories.includes(category)
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300"
                          } ${
                            selectedCategories.length >= getMaxCategories() &&
                            !selectedCategories.includes(category)
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => {
                            if (
                              !(
                                selectedCategories.length >=
                                  getMaxCategories() &&
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
                      selectedCategories.length === getMaxCategories()
                        ? upgradeType === "Counter"
                          ? "bg-orange-500 text-white"
                          : "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={confirmUpgrade}
                    disabled={
                      selectedCategories.length !== getMaxCategories() ||
                      upgradeMutation.isPending
                    }
                    whileHover={
                      selectedCategories.length === getMaxCategories()
                        ? { scale: 1.03 }
                        : {}
                    }
                    whileTap={
                      selectedCategories.length === getMaxCategories()
                        ? { scale: 0.97 }
                        : {}
                    }
                  >
                    {upgradeMutation.isPending ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      "Confirm Upgrade"
                    )}
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
