import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Layers,
  LayoutGrid,
  Store,
  Crown,
  LucideListStart,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { get_single_vendor } from "@/utils/vendorApi";
import { useNavigate } from "react-router-dom";

export default function UpgradePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [upgradeType, setUpgradeType] = useState<
    "Shelf" | "Counter" | "Shop" | "Premium" | null
  >(null);
  const [openDialog, setOpenDialog] = useState(false);

  const user = useSelector((state: any) => state.vendor);
  const navigate = useNavigate();

  const { data: vendor } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => get_single_vendor(user.token),
  });

  // Plan hierarchy for progression
  const planHierarchy = ["Starter", "Shelf", "Counter", "Shop", "Premium"];

  // Hard-coded categories (13 total)
  const allCategories = [
    "Beauty and Wellness",
    "Jewelry and Gemstones",
    "Vintage & Antique Jewelry",
    "Books and Poetry",
    "Home Décor and Accessories",
    "Vintage Stocks",
    "Plant and Seeds",
    "Spices, Condiments, and Seasonings",
    "Local & Traditional Foods",
    "Fashion Clothing and Fabrics",
    "Art & Sculptures",
    "Handmade Furniture",
    "Traditional Musical Instruments (Religious & Ceremonial)",
    // Removed 3 categories to make it 13 total
    // "Local Food and Drinks Products",
    // "Music & Beats",
    // "Drama, Plays & Short Skits",
  ];

  // Get vendor's current categories
  const vendorCategories = vendor?.craftCategories || [];

  // Filter out categories the vendor already has
  const availableCategories = allCategories.filter(
    (category) => !vendorCategories.includes(category)
  );

  // Calculate how many additional categories the vendor can select based on their plan
  const getAdditionalCategoriesCount = (targetPlan: string) => {
    const totalCategoriesForPlan = {
      Starter: 1,
      Shelf: 2,
      Counter: 3,
      Shop: 5,
      Premium: 13, // Total of 13 categories for Premium
    };

    const currentTotal = vendorCategories.length;
    const targetTotal =
      totalCategoriesForPlan[
        targetPlan as keyof typeof totalCategoriesForPlan
      ] || 0;

    // Return how many more categories they can add (cannot exceed available categories)
    const additionalNeeded = Math.max(0, targetTotal - currentTotal);
    return Math.min(additionalNeeded, availableCategories.length);
  };

  const getAdditionalCategoriesCountSafe = () => {
    if (!upgradeType) return 0;
    return getAdditionalCategoriesCount(upgradeType);
  };

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      const maxAdditional = getAdditionalCategoriesCountSafe();
      if (upgradeType && selectedCategories.length < maxAdditional) {
        setSelectedCategories([...selectedCategories, category]);
      }
    }
  };

  const handleGetStarted = (plan: string) => {
    const currentPlan = vendor?.storeType || "Starter";
    const currentPlanIndex = planHierarchy.indexOf(currentPlan);
    const targetPlanIndex = planHierarchy.indexOf(plan);

    if (targetPlanIndex > currentPlanIndex) {
      setUpgradeType(plan as "Shelf" | "Counter" | "Shop" | "Premium");
      setSelectedCategories([]);
      setOpenDialog(true);
    }
  };

  const handleConfirmAndNavigate = () => {
    if (!upgradeType) return;

    const additionalCategoriesNeeded =
      getAdditionalCategoriesCount(upgradeType);

    // For Premium, automatically select all available categories to complete the 13
    if (upgradeType === "Premium") {
      // Select all available categories (up to 13 total)
      const allSelectedCategories = [
        ...vendorCategories,
        ...availableCategories,
      ];
      const finalCategories = allSelectedCategories.slice(0, 13); // Ensure we don't exceed 13

      navigate("/app/upgrade", {
        state: {
          plan: upgradeType,
          selectedCategories: finalCategories,
          maxCategories: 13,
        },
      });
    }
    // For other plans, validate the selection
    else if (selectedCategories.length === additionalCategoriesNeeded) {
      // Combine vendor's existing categories with newly selected ones
      const allSelectedCategories = [
        ...vendorCategories,
        ...selectedCategories,
      ];
      navigate("/app/upgrade", {
        state: {
          plan: upgradeType,
          selectedCategories: allSelectedCategories,
          maxCategories: allSelectedCategories.length,
        },
      });
    } else {
      toast.error(
        `Please select exactly ${additionalCategoriesNeeded} additional categor${
          additionalCategoriesNeeded === 1 ? "y" : "ies"
        }`
      );
    }

    setOpenDialog(false);
  };

  const renderPlanButton = (plan: string) => {
    const currentPlan = vendor?.storeType || "Starter";
    const currentPlanIndex = planHierarchy.indexOf(currentPlan);
    const targetPlanIndex = planHierarchy.indexOf(plan);

    if (plan === currentPlan) {
      return (
        <div className="w-full py-2 text-sm font-medium text-center bg-gray-100 rounded">
          Current Plan
        </div>
      );
    }

    if (targetPlanIndex > currentPlanIndex) {
      return (
        <motion.button
          className="w-full py-2 text-sm font-medium text-center text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
          onClick={() => handleGetStarted(plan)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Get Started with {plan}
        </motion.button>
      );
    }

    if (targetPlanIndex < currentPlanIndex) {
      return (
        <div className="w-full py-2 text-sm font-medium text-center text-gray-500 bg-gray-200 rounded cursor-not-allowed">
          Previous Plan
        </div>
      );
    }

    return (
      <div className="w-full py-2 text-sm font-medium text-center text-gray-500 bg-gray-200 rounded cursor-not-allowed">
        {plan}
      </div>
    );
  };

  const getUpgradeInfo = () => {
    if (!upgradeType) return { additionalCategories: 0, message: "" };

    const additionalCats = getAdditionalCategoriesCount(upgradeType);
    const totalAfterUpgrade = vendorCategories.length + additionalCats;

    let message = "";
    if (upgradeType === "Premium") {
      const currentCount = vendorCategories.length;
      const neededToComplete = 13 - currentCount;
      message = `🎉 Premium allows 13 categories total. You have ${currentCount}, so you can add ${neededToComplete} more to complete your selection.`;
    } else {
      message = `Select ${additionalCats} additional categor${
        additionalCats === 1 ? "y" : "ies"
      } to reach ${totalAfterUpgrade} total for your ${upgradeType} plan.`;
    }

    return { additionalCategories: additionalCats, message };
  };

  const upgradeInfo = getUpgradeInfo();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ToastContainer />
      <main className="flex-1 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold">
              Upgrade Your Class Option for more Features
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Current Account: {vendor?.storeType}
              {vendorCategories.length > 0 && (
                <span className="block mt-1">
                  Current Categories: {vendorCategories.join(", ")} (
                  {vendorCategories.length}/13)
                </span>
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            {/* Starter Plan */}
            <motion.div
              className="overflow-hidden bg-white border rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center gap-3 p-4 bg-gray-50">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                  <LucideListStart className="w-4 h-4 text-gray-600" />
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
              className="overflow-hidden bg-white border rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center gap-3 p-4 bg-gray-50">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
                  <Layers className="w-4 h-4 text-gray-600" />
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
              className="overflow-hidden bg-white border rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center gap-3 p-4 bg-gray-50">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
                  <LayoutGrid className="w-4 h-4 text-yellow-600" />
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
                  <li className="flex items-start gap极2">
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
                    <span className="text极-sm">Clients can contact</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 pt-0">{renderPlanButton("Counter")}</div>
            </motion.div>

            {/* Shop Plan */}
            <motion.div
              className="overflow-hidden bg-white border rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center gap-3 p-4 bg-gray-50">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <Store className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-semib极old">Shop</h3>
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
                    <Check className="h-5 w-5 text-blue-600 shrink-0极 mt-0.5" />
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

            {/* Premium Plan */}
            <motion.div
              className="overflow-hidden bg-white border rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba极(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center gap-3 p极-4 bg-gray-50">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <Crown className="w-4 h-4 text-blue-600" />
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
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm">Access to all 13 categories</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 pt-0">{renderPlanButton("Premium")}</div>
            </motion.div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {openDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              className="bg-white rounded-lg max-w-md w-full overflow-hidden max-h-[70vh]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">
                    {upgradeType === "Premium"
                      ? "Complete Your Categories"
                      : "Choose Additional Categories"}
                  </h2>
                  <motion.button
                    onClick={() => setOpenDialog(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </motion.button>
                </div>

                <p className="mb-3 text-sm text-gray-500">
                  {upgradeType === "Premium"
                    ? `Premium allows 13 categories total. You have ${vendorCategories.length}, select ${upgradeInfo.additionalCategories} more to complete your selection:`
                    : `Please select ${
                        upgradeInfo.additionalCategories
                      } additional categor${
                        upgradeInfo.additionalCategories === 1 ? "y" : "ies"
                      } for your ${upgradeType} upgrade:`}
                </p>

                <div className="p-2 mb-3 rounded-lg bg-blue-50">
                  <p className="text-xs text-blue-700">{upgradeInfo.message}</p>
                  {vendorCategories.length > 0 && (
                    <p className="mt-1 text-xs text-blue-700">
                      You already have: {vendorCategories.join(", ")} (
                      {vendorCategories.length}/13)
                    </p>
                  )}
                </div>

                <div className="max-h-[35vh] overflow-y-auto">
                  <div className="grid grid-cols-1 gap-2">
                    {availableCategories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <div
                            className={`w-4 h-4 border rounded flex items-center justify-center ${
                              selectedCategories?.includes(category)
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                            } ${
                              upgradeType &&
                              selectedCategories.length >=
                                upgradeInfo.additionalCategories &&
                              !selectedCategories.includes(category)
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => {
                              if (
                                upgradeType &&
                                !(
                                  selectedCategories.length >=
                                    upgradeInfo.additionalCategories &&
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
                                <Check className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                          </div>
                          <span className="text-sm">{category}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <motion.button
                    className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded"
                    onClick={() => setOpenDialog(false)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    className={`px-3 py-2 rounded font-medium text-sm ${
                      upgradeType &&
                      (upgradeType === "Premium" ||
                        selectedCategories.length ===
                          upgradeInfo.additionalCategories)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={handleConfirmAndNavigate}
                    disabled={
                      !upgradeType ||
                      (upgradeType !== "Premium" &&
                        selectedCategories.length !==
                          upgradeInfo.additionalCategories)
                    }
                    whileHover={
                      upgradeType &&
                      (upgradeType === "Premium" ||
                        selectedCategories.length ===
                          upgradeInfo.additionalCategories)
                        ? { scale: 1.03 }
                        : {}
                    }
                    whileTap={
                      upgradeType &&
                      (upgradeType === "Premium" ||
                        selectedCategories.length ===
                          upgradeInfo.additionalCategories)
                        ? { scale: 0.97 }
                        : {}
                    }
                  >
                    {upgradeType === "Premium"
                      ? "Complete Selection"
                      : "Continue to Payment"}
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
