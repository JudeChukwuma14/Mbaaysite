import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Users, Shield, Star, Crown, Sparkles, ArrowRight } from "lucide-react";

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
  const [billingCycle, setBillingCycle] = useState<
    "Monthly" | "Quarterly" | "HalfYearly" | "Yearly"
  >("Monthly");

  const user = useSelector((state: any) => state.vendor);
  const navigate = useNavigate();

  const { data: vendor } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => get_single_vendor(user.token),
  });

  // Plan hierarchy for progression
  const planHierarchy = ["Starter", "Shelf", "Counter", "Shop", "Premium"];

  // New design data
  const plans = [
    {
      name: "Starter",
      description: "Perfect for new vendors getting started",
      categories: 1,
      pricing: {
        Monthly: 3000,
        Quarterly: 8100,
        HalfYearly: 15300,
        Yearly: 30000,
      },
      features: [
        { name: "1 product category", included: true },
        { name: "5 products per category", included: true },
        { name: "Basic listing features", included: true },
        { name: "Email support", included: true },
        { name: "Mobile app access", included: true },
        { name: "Advanced analytics", included: false },
        { name: "Priority support", included: false },
        { name: "Custom branding", included: false },
      ],
    },
    {
      name: "Shelf",
      description: "Great for growing businesses",
      categories: 2,
      pricing: {
        Monthly: 5000,
        Quarterly: 13500,
        HalfYearly: 25500,
        Yearly: 54000,
      },
      features: [
        { name: "2 product categories", included: true },
        { name: "Unlimited products", included: true },
        { name: "Customer chat integration", included: true },
        { name: "Basic analytics", included: true },
        { name: "Email support", included: true },
        { name: "Mobile app access", included: true },
        { name: "Advanced analytics", included: false },
        { name: "Priority support", included: false },
      ],
    },
    {
      name: "Counter",
      description: "Enhanced features for established vendors",
      categories: 5,
      popular: true,
      pricing: {
        Monthly: 7500,
        Quarterly: 20250,
        HalfYearly: 38250,
        Yearly: 81000,
      },
      features: [
        { name: "5 product categories", included: true },
        { name: "Unlimited products", included: true },
        { name: "Advanced customer features", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Priority email support", included: true },
        { name: "Mobile app access", included: true },
        { name: "Custom branding", included: true },
        { name: "API access", included: false },
      ],
    },
    {
      name: "Shop",
      description: "Comprehensive solution for serious sellers",
      categories: 8,
      pricing: {
        Monthly: 12000,
        Quarterly: 32400,
        HalfYearly: 61200,
        Yearly: 129600,
      },
      features: [
        { name: "8 product categories", included: true },
        { name: "Unlimited products", included: true },
        { name: "Full feature access", included: true },
        { name: "Advanced analytics & insights", included: true },
        { name: "Priority support", included: true },
        { name: "Custom branding", included: true },
        { name: "API access", included: true },
        { name: "Dedicated account manager", included: false },
      ],
    },
    {
      name: "Premium",
      description: "Enterprise-grade solution with all features",
      categories: 13,
      recommended: true,
      pricing: {
        Monthly: 20000,
        Quarterly: 54000,
        HalfYearly: 102000,
        Yearly: 216000,
      },
      features: [
        { name: "All 13 categories", included: true },
        { name: "Unlimited everything", included: true },
        { name: "Full platform access", included: true },
        { name: "Advanced analytics & insights", included: true },
        { name: "24/7 priority support", included: true },
        { name: "Custom branding", included: true },
        { name: "Full API access", included: true },
        { name: "Dedicated account manager", included: true },
      ],
    },
  ] as const;

  const discounts = { Quarterly: 10, HalfYearly: 15, Yearly: 20 } as const;

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
    console.log("handleConfirmAndNavigate called", { upgradeType, selectedCategories });
    if (!upgradeType) {
      console.log("No upgradeType, returning");
      return;
    }

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

      console.log("Premium upgrade, navigating with categories:", finalCategories);
      setOpenDialog(false); // Close dialog before navigation
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
      console.log("Regular upgrade, navigating with categories:", allSelectedCategories);
      setOpenDialog(false); // Close dialog before navigation
      navigate("/app/upgrade", {
        state: {
          plan: upgradeType,
          selectedCategories: allSelectedCategories,
          maxCategories: allSelectedCategories.length,
        },
      });
    } else {
      console.log("Not enough categories selected", { selectedCategories: selectedCategories.length, needed: additionalCategoriesNeeded });
      toast.error(
        `Please select exactly ${additionalCategoriesNeeded} additional categor${
          additionalCategoriesNeeded === 1 ? "y" : "ies"
        }`
      );
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      <ToastContainer />
      <main className="relative">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-200 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />
          
          <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold mb-6 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Flexible Pricing Plans</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-red-800 bg-clip-text text-transparent mb-6"
              >
                Choose Your Perfect Plan
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
              >
                Start free and scale as you grow. Upgrade anytime to unlock more categories and powerful features.
              </motion.p>

              {/* Billing Toggle */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="hidden sm:flex items-center gap-1 p-1 bg-white rounded-xl shadow-lg border border-gray-200"
              >
                {(["Monthly", "Quarterly", "HalfYearly", "Yearly"] as const).map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => setBillingCycle(cycle)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                      billingCycle === cycle
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {cycle === "HalfYearly" ? "6 Months" : cycle}
                    {cycle !== "Monthly" && (
                      <span className="ml-1 text-xs text-green-600 font-bold">
                        -{discounts[cycle as keyof typeof discounts]}%
                      </span>
                    )}
                  </button>
                ))}
              </motion.div> */}

              {/* Mobile Billing Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex sm:hidden flex-wrap justify-center gap-2 p-3 bg-white rounded-xl shadow-lg border border-gray-200 max-w-full overflow-hidden"
              >
                {(["Monthly", "Quarterly", "HalfYearly", "Yearly"] as const).map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => setBillingCycle(cycle)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
                      billingCycle === cycle
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <span>{cycle === "HalfYearly" ? "6m" : cycle === "Quarterly" ? "3m" : cycle === "Monthly" ? "1m" : "1y"}</span>
                    {cycle !== "Monthly" && (
                      <span className="ml-1 text-xs text-green-600 font-bold">
                        -{discounts[cycle as keyof typeof discounts]}%
                      </span>
                    )}
                  </button>
                ))}
              </motion.div>

                 {/* Desktop/Tablet Billing Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className=" items-center gap-1 p-1 bg-white rounded-xl shadow-lg border border-gray-200 hidden sm:inline-flex"
              >
                {(["Monthly", "Quarterly", "HalfYearly", "Yearly"] as const).map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => setBillingCycle(cycle)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                      billingCycle === cycle
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {cycle === "HalfYearly" ? "6 Months" : cycle}
                    {cycle !== "Monthly" && (
                      <span className="ml-1 text-xs text-green-600 font-bold">
                        -{discounts[cycle as keyof typeof discounts]}%
                      </span>
                    )}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const price = plan.pricing[billingCycle];
              const monthlyEquivalent =
                billingCycle !== "Monthly"
                  ? price /
                    (billingCycle === "Quarterly"
                      ? 3
                      : billingCycle === "HalfYearly"
                      ? 6
                      : 12)
                  : price;

              // Determine popular and recommended plans based on business logic
              const isPopular = plan.name === "Counter"; // Counter is most popular
              const isRecommended = plan.name === "Premium"; // Premium is recommended
              const isCurrentPlan = plan.name === (vendor?.storeType || "Starter");

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`relative group`}
                >
                  {/* Popular/Recommended Badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  {isRecommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                        <Crown className="w-4 h-4" />
                        Recommended
                      </div>
                    </div>
                  )}

                  <div className={`relative h-full bg-white rounded-2xl border-2 ${
                    isRecommended 
                      ? "border-orange-500 shadow-2xl shadow-orange-500/20" 
                      : isPopular
                      ? "border-orange-500 shadow-xl shadow-orange-500/10"
                      : "border-gray-200 shadow-lg hover:shadow-xl"
                  } p-6 transition-all duration-300 hover:-translate-y-1 ${
                    isCurrentPlan ? "ring-2 ring-green-500 ring-offset-2" : ""
                  }`}>
                    {/* Current Plan Badge */}
                    {isCurrentPlan && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Current Plan
                        </div>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {plan.name}
                        </h3>
                        {isRecommended && (
                          <Crown className="w-6 h-6 text-orange-500" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">
                        {plan.description}
                      </p>

                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            ₦{price.toLocaleString()}
                          </span>
                          <span className="text-gray-500">
                            /
                            {billingCycle === "HalfYearly"
                              ? "6mo"
                              : billingCycle === "Quarterly"
                              ? "3mo"
                              : billingCycle === "Yearly"
                              ? "year"
                              : "month"}
                          </span>
                        </div>
                        {billingCycle !== "Monthly" && (
                          <p className="text-sm text-green-600 font-medium mt-1">
                            Save ₦{Math.round(monthlyEquivalent * (billingCycle === "Quarterly" ? 3 : billingCycle === "HalfYearly" ? 6 : 12) - price).toLocaleString()} ({discounts[billingCycle as keyof typeof discounts]}% off)
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">
                          {plan.categories === 13
                            ? "All categories"
                            : `${plan.categories} categor${plan.categories === 1 ? "y" : "ies"}`}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <div
                            className={`${
                              feature.included
                                ? "text-green-500"
                                : "text-gray-300"
                            } mt-0.5 flex-shrink-0`}
                          >
                            <Check className="w-5 h-5" />
                          </div>
                          <span
                            className={`text-sm leading-relaxed ${
                              feature.included
                                ? "text-gray-700"
                                : "text-gray-400 line-through"
                            }`}
                          >
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="w-full">
                      {renderPlanButton(plan.name)}
                    </div>

                    {plan.name === "Premium" && (
                      <div className="mt-4 text-center">
                        <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-purple-50 px-3 py-2 rounded-lg">
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span>30-day money-back guarantee</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-center gap-3 text-gray-700 mb-4">
                <Shield className="w-6 h-6 text-green-500" />
                <span className="text-lg font-semibold">All plans include:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Mobile app access</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Email support</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>No setup fees</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Category Selection Dialog */}
      <AnimatePresence>
        {openDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            {/* {console.log("Dialog rendering with upgradeType:", upgradeType)} */}
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {upgradeType === "Premium"
                        ? "Complete Your Premium Setup"
                        : "Choose Additional Categories"}
                    </h2>
                    <p className="text-blue-100">
                      {upgradeType === "Premium"
                        ? `Select ${upgradeInfo.additionalCategories} more categories to unlock all 13 categories`
                        : `Select ${upgradeInfo.additionalCategories} additional categor${upgradeInfo.additionalCategories === 1 ? "y" : "ies"} for your ${upgradeType} plan`}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setOpenDialog(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              <div className="p-6">
                {/* Debug info - remove in production */}
                <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
                  Debug: upgradeType = {upgradeType || "null"}, selectedCategories = {selectedCategories.length}
                </div>

                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <p className="text-sm text-orange-800 font-medium mb-2">{upgradeInfo.message}</p>
                  {vendorCategories.length > 0 && (
                    <p className="text-xs text-orange-700">
                      <strong>Current categories:</strong> {vendorCategories.join(", ")} ({vendorCategories.length}/13)
                    </p>
                  )}
                </div>

                <div className="max-h-[30vh] overflow-y-auto mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableCategories.map((category) => (
                      <motion.div
                        key={category}
                        whileHover={upgradeType !== "Premium" ? { scale: 1.02 } : {}}
                        whileTap={upgradeType !== "Premium" ? { scale: 0.98 } : {}}
                      >
                        <label className={`flex items-center gap-3 p-3 border-2 rounded-xl transition-all ${
                          upgradeType === "Premium" 
                            ? "border-gray-200 bg-gray-50 cursor-default" 
                            : "cursor-pointer hover:border-orange-300 hover:bg-orange-50"
                        }`}>
                          <div
                            className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all ${
                              upgradeType === "Premium"
                                ? "bg-gray-200 border-gray-300"
                                : selectedCategories?.includes(category)
                                ? "bg-orange-600 border-orange-600"
                                : "border-gray-300"
                            } ${
                              upgradeType === "Premium"
                                ? "cursor-not-allowed"
                                : upgradeType &&
                                  selectedCategories.length >= upgradeInfo.additionalCategories &&
                                  !selectedCategories.includes(category)
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => {
                              if (upgradeType !== "Premium") {
                                if (
                                  !(
                                    upgradeType &&
                                    selectedCategories.length >= upgradeInfo.additionalCategories &&
                                    !selectedCategories.includes(category)
                                  )
                                ) {
                                  handleCategoryChange(category);
                                }
                              }
                            }}
                          >
                            {upgradeType === "Premium" ? (
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            ) : selectedCategories.includes(category) ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 10, stiffness: 200 }}
                              >
                                <Check className="w-3 h-3 text-white" />
                              </motion.div>
                            ) : null}
                          </div>
                          <span className={`text-sm font-medium ${
                            upgradeType === "Premium" ? "text-gray-600" : "text-gray-700"
                          }`}>{category}</span>
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <motion.button
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      console.log("Cancel clicked, current upgradeType:", upgradeType);
                      setOpenDialog(false);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      upgradeType
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-lg"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={() => {
                      console.log("Button clicked", { upgradeType });
                      handleConfirmAndNavigate();
                    }}
                    disabled={!upgradeType}
                    whileHover={upgradeType ? { scale: 1.02 } : {}}
                    whileTap={upgradeType ? { scale: 0.98 } : {}}
                  >
                    {upgradeType === "Premium" ? (
                      <span className="flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        Complete Premium Setup
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        Continue to Payment
                      </span>
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

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Check, X, Zap, Users, Shield } from "lucide-react";

// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useQuery } from "@tanstack/react-query";
// import { useSelector } from "react-redux";
// import { get_single_vendor } from "@/utils/vendorApi";
// import { useNavigate } from "react-router-dom";

// export default function UpgradePage() {
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [upgradeType, setUpgradeType] = useState<
//     "Shelf" | "Counter" | "Shop" | "Premium" | null
//   >(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [billingCycle, setBillingCycle] = useState<
//     "Monthly" | "Quarterly" | "HalfYearly" | "Yearly"
//   >("Monthly");

//   const user = useSelector((state: any) => state.vendor);
//   const navigate = useNavigate();

//   const { data: vendor } = useQuery({
//     queryKey: ["vendor"],
//     queryFn: () => get_single_vendor(user.token),
//   });

//   // Plan hierarchy for progression
//   const planHierarchy = [
//     "Starter",
//     // "Starter plus",
//     "Shelf",
//     "Counter",
//     "Shop",
//     "Premium",
//   ];

//   // New design data
//   const plans = [
//     {
//       name: "Starter",
//       description: "Perfect for new vendors getting started",
//       categories: 1,
//       pricing: {
//         Monthly: 3000,
//         Quarterly: 8100,
//         HalfYearly: 15300,
//         Yearly: 30000,
//       },
//       features: [
//         { name: "1 product category", included: true },
//         { name: "5 products per category", included: true },
//         { name: "Basic listing features", included: true },
//         { name: "Email support", included: true },
//         { name: "Mobile app access", included: true },
//         { name: "Advanced analytics", included: false },
//         { name: "Priority support", included: false },
//         { name: "Custom branding", included: false },
//       ],
//     },
//     // {
//     //   name: "Starter plus",
//     //   description: "Perfect for new vendors getting started",
//     //   categories: 1,
//     //   pricing: {
//     //     Monthly: 3000,
//     //     Quarterly: 8100,
//     //     HalfYearly: 15300,
//     //     Yearly: 30000,
//     //   },
//     //   features: [
//     //     { name: "1 product category", included: true },
//     //     { name: "Unlimited products per category", included: true },
//     //     { name: "Basic listing features", included: true },
//     //     { name: "Email support", included: true },
//     //     { name: "Mobile app access", included: true },
//     //     { name: "Advanced analytics", included: false },
//     //     { name: "Priority support", included: false },
//     //     { name: "Custom branding", included: false },
//     //   ],
//     // },
//     {
//       name: "Shelf",
//       description: "Great for growing businesses",
//       categories: 2,
//       pricing: {
//         Monthly: 5000,
//         Quarterly: 13500,
//         HalfYearly: 25500,
//         Yearly: 54000,
//       },
//       features: [
//         { name: "2 product categories", included: true },
//         { name: "Unlimited products", included: true },
//         { name: "Customer chat integration", included: true },
//         { name: "Basic analytics", included: true },
//         { name: "Email support", included: true },
//         { name: "Mobile app access", included: true },
//         { name: "Advanced analytics", included: false },
//         { name: "Priority support", included: false },
//       ],
//     },
//     {
//       name: "Counter",
//       description: "Enhanced features for established vendors",
//       categories: 5,
//       popular: true,
//       pricing: {
//         Monthly: 7500,
//         Quarterly: 20250,
//         HalfYearly: 38250,
//         Yearly: 81000,
//       },
//       features: [
//         { name: "5 product categories", included: true },
//         { name: "Unlimited products", included: true },
//         { name: "Advanced customer features", included: true },
//         { name: "Advanced analytics", included: true },
//         { name: "Priority email support", included: true },
//         { name: "Mobile app access", included: true },
//         { name: "Custom branding", included: true },
//         { name: "API access", included: false },
//       ],
//     },
//     {
//       name: "Shop",
//       description: "Comprehensive solution for serious sellers",
//       categories: 8,
//       pricing: {
//         Monthly: 12000,
//         Quarterly: 32400,
//         HalfYearly: 61200,
//         Yearly: 129600,
//       },
//       features: [
//         { name: "8 product categories", included: true },
//         { name: "Unlimited products", included: true },
//         { name: "Full feature access", included: true },
//         { name: "Advanced analytics & insights", included: true },
//         { name: "Priority support", included: true },
//         { name: "Custom branding", included: true },
//         { name: "API access", included: true },
//         { name: "Dedicated account manager", included: false },
//       ],
//     },
//     {
//       name: "Premium",
//       description: "Enterprise-grade solution with all features",
//       categories: 13,
//       recommended: true,
//       pricing: {
//         Monthly: 20000,
//         Quarterly: 54000,
//         HalfYearly: 102000,
//         Yearly: 216000,
//       },
//       features: [
//         { name: "All 13 categories", included: true },
//         { name: "Unlimited everything", included: true },
//         { name: "Full platform access", included: true },
//         { name: "Advanced analytics & insights", included: true },
//         { name: "24/7 priority support", included: true },
//         { name: "Custom branding", included: true },
//         { name: "Full API access", included: true },
//         { name: "Dedicated account manager", included: true },
//       ],
//     },
//   ] as const;

//   const discounts = { Quarterly: 10, HalfYearly: 15, Yearly: 20 } as const;

//   // Hard-coded categories (13 total)
//   const allCategories = [
//     "Beauty and Wellness",
//     "Jewelry and Gemstones",
//     "Vintage & Antique Jewelry",
//     "Books and Poetry",
//     "Home Décor and Accessories",
//     "Vintage Stocks",
//     "Plant and Seeds",
//     "Spices, Condiments, and Seasonings",
//     "Local & Traditional Foods",
//     "Fashion Clothing and Fabrics",
//     "Art & Sculptures",
//     "Handmade Furniture",
//     "Traditional Musical Instruments (Religious & Ceremonial)",
//     // Removed 3 categories to make it 13 total
//     // "Local Food and Drinks Products",
//     // "Music & Beats",
//     // "Drama, Plays & Short Skits",
//   ];

//   // Get vendor's current categories
//   const vendorCategories = vendor?.craftCategories || [];

//   // Filter out categories the vendor already has
//   const availableCategories = allCategories.filter(
//     (category) => !vendorCategories.includes(category)
//   );

//   // Calculate how many additional categories the vendor can select based on their plan
//   const getAdditionalCategoriesCount = (targetPlan: string) => {
//     const totalCategoriesForPlan = {
//       Starter: 1,
//       Shelf: 2,
//       Counter: 3,
//       Shop: 5,
//       Premium: 13, // Total of 13 categories for Premium
//     };

//     const currentTotal = vendorCategories.length;
//     const targetTotal =
//       totalCategoriesForPlan[
//         targetPlan as keyof typeof totalCategoriesForPlan
//       ] || 0;

//     // Return how many more categories they can add (cannot exceed available categories)
//     const additionalNeeded = Math.max(0, targetTotal - currentTotal);
//     return Math.min(additionalNeeded, availableCategories.length);
//   };

//   const getAdditionalCategoriesCountSafe = () => {
//     if (!upgradeType) return 0;
//     return getAdditionalCategoriesCount(upgradeType);
//   };

//   const handleCategoryChange = (category: string) => {
//     if (selectedCategories.includes(category)) {
//       setSelectedCategories(selectedCategories.filter((c) => c !== category));
//     } else {
//       const maxAdditional = getAdditionalCategoriesCountSafe();
//       if (upgradeType && selectedCategories.length < maxAdditional) {
//         setSelectedCategories([...selectedCategories, category]);
//       }
//     }
//   };

//   const handleGetStarted = (plan: string) => {
//     const currentPlan = vendor?.storeType || "Starter";
//     const currentPlanIndex = planHierarchy.indexOf(currentPlan);
//     const targetPlanIndex = planHierarchy.indexOf(plan);

//         setUpgradeType(plan as "Shelf" | "Counter" | "Shop" | "Premium");
//         setSelectedCategories([]);
//         setOpenDialog(true);

//   };

//   const handleConfirmAndNavigate = () => {
//     if (!upgradeType) return;

//     const additionalCategoriesNeeded =
//       getAdditionalCategoriesCount(upgradeType);

//     // For Premium, automatically select all available categories to complete the 13
//     if (upgradeType === "Premium") {
//       // Select all available categories (up to 13 total)
//       const allSelectedCategories = [
//         ...vendorCategories,
//         ...availableCategories,
//       ];
//       const finalCategories = allSelectedCategories.slice(0, 13); // Ensure we don't exceed 13

//       navigate("/app/upgrade", {
//         state: {
//           plan: upgradeType,
//           selectedCategories: finalCategories,
//           maxCategories: 13,
//         },
//       });
//     }
//     // For other plans, validate the selection
//     else if (selectedCategories.length === additionalCategoriesNeeded) {
//       // Combine vendor's existing categories with newly selected ones
//       const allSelectedCategories = [
//         ...vendorCategories,
//         ...selectedCategories,
//       ];
//       navigate("/app/upgrade", {
//         state: {
//           plan: upgradeType,
//           selectedCategories: allSelectedCategories,
//           maxCategories: allSelectedCategories.length,
//         },
//       });
//     } else {
//       toast.error(
//         `Please select exactly ${additionalCategoriesNeeded} additional categor${
//           additionalCategoriesNeeded === 1 ? "y" : "ies"
//         }`
//       );
//     }

//     setOpenDialog(false);
//   };

//   const renderPlanButton = (plan: string) => {
//     const currentPlan = vendor?.storeType || "Starter";
//     const currentPlanIndex = planHierarchy.indexOf(currentPlan);
//     const targetPlanIndex = planHierarchy.indexOf(plan);

//     if (plan === currentPlan) {
//       return (
//         <div className="w-full py-2 text-sm font-medium text-center bg-gray-100 rounded">
//           Current Plan
//         </div>
//       );
//     }

//     if (targetPlanIndex > currentPlanIndex) {
//       return (
//         <motion.button
//           className="w-full py-2 text-sm font-medium text-center text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
//           onClick={() => handleGetStarted(plan)}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//         >
//           Get Started with {plan}
//         </motion.button>
//       );
//     }

//     if (targetPlanIndex < currentPlanIndex) {
//       return (
//         <div className="w-full py-2 text-sm font-medium text-center text-gray-500 bg-gray-200 rounded cursor-not-allowed">
//           Previous Plan
//         </div>
//       );
//     }

//     return (
//       <div className="w-full py-2 text-sm font-medium text-center text-gray-500 bg-gray-200 rounded cursor-not-allowed">
//         {plan}
//       </div>
//     );
//   };

//   const getUpgradeInfo = () => {
//     if (!upgradeType) return { additionalCategories: 0, message: "" };

//     const additionalCats = getAdditionalCategoriesCount(upgradeType);
//     const totalAfterUpgrade = vendorCategories.length + additionalCats;

//     let message = "";
//     if (upgradeType === "Premium") {
//       const currentCount = vendorCategories.length;
//       const neededToComplete = 13 - currentCount;
//       message = `🎉 Premium allows 13 categories total. You have ${currentCount}, so you can add ${neededToComplete} more to complete your selection.`;
//     } else {
//       message = `Select ${additionalCats} additional categor${
//         additionalCats === 1 ? "y" : "ies"
//       } to reach ${totalAfterUpgrade} total for your ${upgradeType} plan.`;
//     }

//     return { additionalCategories: additionalCats, message };
//   };

//   const upgradeInfo = getUpgradeInfo();

//   return (
//     <div className="flex flex-col max-w-full min-h-screen overflow-x-hidden bg-background">
//       <ToastContainer />
//       <main className="flex-1">
//         {/* Header */}
//         <div className="relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
//           <div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
//             <div className="text-center">
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary"
//               >
//                 <Zap className="w-4 h-4" />
//                 Introducing Multi-Term Pricing
//               </motion.div>

//               <motion.h1
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1 }}
//                 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl text-balance"
//               >
//                 Plans and Pricing
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2 }}
//                 className="max-w-2xl mx-auto mb-8 text-xl text-muted-foreground text-balance"
//               >
//                 Get started immediately for free. Upgrade for more categories,
//                 features and collaboration.
//               </motion.p>

//               {/* Billing Toggle */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="inline-flex items-center gap-1 p-1 rounded-lg bg-muted"
//               >
//                 {(
//                   ["Monthly", "Quarterly", "HalfYearly", "Yearly"] as const
//                 ).map((cycle) => (
//                   <button
//                     key={cycle}
//                     onClick={() => setBillingCycle(cycle)}
//                     className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
//                       billingCycle === cycle
//                         ? "bg-background text-foreground shadow-sm"
//                         : "text-muted-foreground hover:text-foreground"
//                     }`}
//                   >
//                     {cycle === "HalfYearly" ? "6 Months" : cycle}
//                     {cycle !== "Monthly" && (
//                       <span className="ml-1 text-xs text-primary">
//                         -{discounts[cycle as keyof typeof discounts]}%
//                       </span>
//                     )}
//                   </button>
//                 ))}
//               </motion.div>
//             </div>
//           </div>
//         </div>

//         {/* Pricing Cards */}
//         <div className="px-4 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6">
//             {plans.map((plan, index) => {
//               const price = plan.pricing[billingCycle];
//               const monthlyEquivalent =
//                 billingCycle !== "Monthly"
//                   ? price /
//                     (billingCycle === "Quarterly"
//                       ? 3
//                       : billingCycle === "HalfYearly"
//                       ? 6
//                       : 12)
//                   : price;

//               return (
//                 <motion.div
//                   key={plan.name}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 * index }}
//                   className={`relative rounded-2xl border bg-card p-8 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1 lg:col-span-2 ${
//                     index === 3 ? "lg:col-start-2" : ""
//                   }`}
//                 >
//                   {/* Badge
//                   {plan.popular && (
//                     <Badge className="absolute -translate-x-1/2 -top-3 left-1/2 bg-primary text-primary-foreground">
//                       <Star className="w-3 h-3 mr-1" />
//                       Popular
//                     </Badge>
//                   )}
//                   {plan.recommended && (
//                     <Badge className="absolute -translate-x-1/2 -top-3 left-1/2 bg-accent text-accent-foreground">
//                       <TrendingUp className="w-3 h-3 mr-1" />
//                       Recommended
//                     </Badge>
//                   )} */}

//                   {/* Plan Header */}
//                   <div className="mb-6">
//                     <h3 className="mb-3 text-2xl font-bold md:text-3xl">
//                       {plan.name}
//                     </h3>
//                     <p className="mb-5 text-base text-muted-foreground">
//                       {plan.description}
//                     </p>

//                     <div className="mb-4">
//                       <div className="flex items-baseline gap-2">
//                         <span className="text-4xl font-bold md:text-5xl">
//                           ₦{price.toLocaleString()}
//                         </span>
//                         <span className="text-base text-muted-foreground">
//                           /
//                           {billingCycle === "HalfYearly"
//                             ? "6mo"
//                             : billingCycle === "Quarterly"
//                             ? "3mo"
//                             : billingCycle === "Yearly"
//                             ? "year"
//                             : "month"}
//                         </span>
//                       </div>
//                       {billingCycle !== "Monthly" && (
//                         <p className="mt-1 text-sm text-muted-foreground">
//                           ₦{Math.round(monthlyEquivalent).toLocaleString()}
//                           /month equivalent
//                         </p>
//                       )}
//                     </div>

//                     <div className="flex items-center gap-2 mb-4 text-base text-muted-foreground">
//                       <Users className="w-5 h-5" />
//                       {plan.categories === 13
//                         ? "All categories"
//                         : `${plan.categories} categor${
//                             plan.categories === 1 ? "y" : "ies"
//                           }`}
//                     </div>
//                   </div>

//                   {/* Features */}
//                   <div className="mb-6 space-y-3">
//                     {plan.features.map((feature, featureIndex) => (
//                       <div
//                         key={featureIndex}
//                         className="flex items-start gap-3"
//                       >
//                         <div
//                           className={`${
//                             feature.included
//                               ? "text-primary"
//                               : "text-muted-foreground"
//                           } mt-0.5`}
//                         >
//                           <Check className="w-5 h-5" />
//                         </div>
//                         <span
//                           className={`text-base break-words ${
//                             feature.included
//                               ? "text-foreground"
//                               : "text-muted-foreground line-through"
//                           }`}
//                         >
//                           {feature.name}
//                         </span>
//                       </div>
//                     ))}
//                   </div>

//                   {/* CTA Button - preserve existing behavior */}
//                   <div className="w-full">{renderPlanButton(plan.name)}</div>

//                   {plan.name === "Premium" && (
//                     <p className="mt-3 text-sm text-center text-muted-foreground">
//                       <Shield className="inline w-4 h-4 mr-1" />
//                       30-day money-back guarantee
//                     </p>
//                   )}
//                 </motion.div>
//               );
//             })}
//           </div>

//           {/* Additional Info */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6 }}
//             className="mt-16 text-center"
//           >
//             <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
//               <Shield className="w-4 h-4" />
//               All plans include mobile app access, email support, and no setup
//               fees
//             </div>
//           </motion.div>
//         </div>
//       </main>

//       <AnimatePresence>
//         {openDialog && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
//             <motion.div
//               className="bg-white rounded-lg max-w-md w-full overflow-hidden max-h-[70vh]"
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.9 }}
//               transition={{ type: "spring", damping: 25, stiffness: 300 }}
//             >
//               <div className="p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <h2 className="text-lg font-semibold">
//                     {upgradeType === "Premium"
//                       ? "Complete Your Categories"
//                       : "Choose Additional Categories"}
//                   </h2>
//                   <motion.button
//                     onClick={() => setOpenDialog(false)}
//                     whileHover={{ scale: 1.1, rotate: 90 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     <X className="w-5 h-5 text-gray-500" />
//                   </motion.button>
//                 </div>

//                 <p className="mb-3 text-sm text-gray-500">
//                   {upgradeType === "Premium"
//                     ? `Premium allows 13 categories total. You have ${vendorCategories.length}, select ${upgradeInfo.additionalCategories} more to complete your selection:`
//                     : `Please select ${
//                         upgradeInfo.additionalCategories
//                       } additional categor${
//                         upgradeInfo.additionalCategories === 1 ? "y" : "ies"
//                       } for your ${upgradeType} upgrade:`}
//                 </p>

//                 <div className="p-2 mb-3 rounded-lg bg-blue-50">
//                   <p className="text-xs text-blue-700">{upgradeInfo.message}</p>
//                   {vendorCategories.length > 0 && (
//                     <p className="mt-1 text-xs text-blue-700">
//                       You already have: {vendorCategories.join(", ")} (
//                       {vendorCategories.length}/13)
//                     </p>
//                   )}
//                 </div>

//                 <div className="max-h-[35vh] overflow-y-auto">
//                   <div className="grid grid-cols-1 gap-2">
//                     {availableCategories.map((category) => (
//                       <div
//                         key={category}
//                         className="flex items-center space-x-2"
//                       >
//                         <label className="flex items-center space-x-2 cursor-pointer">
//                           <div
//                             className={`w-4 h-4 border rounded flex items-center justify-center ${
//                               selectedCategories?.includes(category)
//                                 ? "bg-orange-600 border-orange-600"
//                                 : "border-gray-300"
//                             } ${
//                               upgradeType &&
//                               selectedCategories.length >=
//                                 upgradeInfo.additionalCategories &&
//                               !selectedCategories.includes(category)
//                                 ? "opacity-50 cursor-not-allowed"
//                                 : ""
//                             }`}
//                             onClick={() => {
//                               if (
//                                 upgradeType &&
//                                 !(
//                                   selectedCategories.length >=
//                                     upgradeInfo.additionalCategories &&
//                                   !selectedCategories.includes(category)
//                                 )
//                               ) {
//                                 handleCategoryChange(category);
//                               }
//                             }}
//                           >
//                             {selectedCategories.includes(category) && (
//                               <motion.div
//                                 initial={{ scale: 0 }}
//                                 animate={{ scale: 1 }}
//                                 transition={{
//                                   type: "spring",
//                                   damping: 10,
//                                   stiffness: 200,
//                                 }}
//                               >
//                                 <Check className="w-3 h-3 text-white" />
//                               </motion.div>
//                             )}
//                           </div>
//                           <span className="text-sm">{category}</span>
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex justify-between mt-4">
//                   <motion.button
//                     className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded"
//                     onClick={() => setOpenDialog(false)}
//                     whileHover={{ scale: 1.03 }}
//                     whileTap={{ scale: 0.97 }}
//                   >
//                     Cancel
//                   </motion.button>

//                   <motion.button
//                     className={`px-3 py-2 rounded font-medium text-sm ${
//                       upgradeType &&
//                       (upgradeType === "Premium" ||
//                         selectedCategories.length ===
//                           upgradeInfo.additionalCategories)
//                         ? "bg-blue-600 text-white"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                     onClick={handleConfirmAndNavigate}
//                     disabled={
//                       !upgradeType ||
//                       (upgradeType !== "Premium" &&
//                         selectedCategories.length !==
//                           upgradeInfo.additionalCategories)
//                     }
//                     whileHover={
//                       upgradeType &&
//                       (upgradeType === "Premium" ||
//                         selectedCategories.length ===
//                           upgradeInfo.additionalCategories)
//                         ? { scale: 1.03 }
//                         : {}
//                     }
//                     whileTap={
//                       upgradeType &&
//                       (upgradeType === "Premium" ||
//                         selectedCategories.length ===
//                           upgradeInfo.additionalCategories)
//                         ? { scale: 0.97 }
//                         : {}
//                     }
//                   >
//                     {upgradeType === "Premium"
//                       ? "Complete Selection"
//                       : "Continue to Payment"}
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
