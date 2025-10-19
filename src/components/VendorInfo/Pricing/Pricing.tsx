import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Zap,
  Users,
  Shield,
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
      pricing: { Monthly: 3000, Quarterly: 8100, HalfYearly: 15300, Yearly: 30000 },
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
      pricing: { Monthly: 5000, Quarterly: 13500, HalfYearly: 25500, Yearly: 54000 },
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
      pricing: { Monthly: 7500, Quarterly: 20250, HalfYearly: 38250, Yearly: 81000 },
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
      pricing: { Monthly: 12000, Quarterly: 32400, HalfYearly: 61200, Yearly: 129600 },
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
      pricing: { Monthly: 20000, Quarterly: 54000, HalfYearly: 102000, Yearly: 216000 },
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
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden max-w-full">
      <ToastContainer />
      <main className="flex-1">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              >
                <Zap className="w-4 h-4" />
                Introducing Multi-Term Pricing
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6"
              >
                Plans and Pricing
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto mb-8"
              >
                Get started immediately for free. Upgrade for more categories, features and collaboration.
              </motion.p>

              {/* Billing Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-1 p-1 bg-muted rounded-lg"
              >
                {(["Monthly", "Quarterly", "HalfYearly", "Yearly"] as const).map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => setBillingCycle(cycle)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      billingCycle === cycle
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cycle === "HalfYearly" ? "6 Months" : cycle}
                    {cycle !== "Monthly" && (
                      <span className="ml-1 text-xs text-primary">-{discounts[cycle as keyof typeof discounts]}%</span>
                    )}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
            {plans.map((plan, index) => {
              const price = plan.pricing[billingCycle];
              const monthlyEquivalent =
                billingCycle !== "Monthly"
                  ? price / (billingCycle === "Quarterly" ? 3 : billingCycle === "HalfYearly" ? 6 : 12)
                  : price;

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`relative rounded-2xl border bg-card p-8 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1 lg:col-span-2 ${index === 3 ? "lg:col-start-2" : ""}`}
                >
                  {/* Badge
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  {plan.recommended && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  )} */}

                  {/* Plan Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">{plan.name}</h3>
                    <p className="text-base text-muted-foreground mb-5">{plan.description}</p>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl md:text-5xl font-bold">₦{price.toLocaleString()}</span>
                        <span className="text-base text-muted-foreground">
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
                        <p className="text-sm text-muted-foreground mt-1">
                          ₦{Math.round(monthlyEquivalent).toLocaleString()}/month equivalent
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-base text-muted-foreground mb-4">
                      <Users className="w-5 h-5" />
                      {plan.categories === 13 ? "All categories" : `${plan.categories} categor${plan.categories === 1 ? "y" : "ies"}`}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <div className={`${feature.included ? "text-primary" : "text-muted-foreground"} mt-0.5`}>
                          <Check className="w-5 h-5" />
                        </div>
                        <span className={`text-base break-words ${feature.included ? "text-foreground" : "text-muted-foreground line-through"}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button - preserve existing behavior */}
                  <div className="w-full">
                    {renderPlanButton(plan.name)}
                  </div>

                  {plan.name === "Premium" && (
                    <p className="text-sm text-center text-muted-foreground mt-3">
                      <Shield className="w-4 h-4 inline mr-1" />
                      30-day money-back guarantee
                    </p>
                  )}
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
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              All plans include mobile app access, email support, and no setup fees
            </div>
          </motion.div>
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
