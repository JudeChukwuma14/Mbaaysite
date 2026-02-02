import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowLeft, AlertCircle, Crown, Shield, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { upgradePlan } from "@/utils/upgradeApi";
import { useSelector } from "react-redux";

// Define the billing cycle types for both display and API
type DisplayBillingCycle = "Monthly" | "Quarterly" | "HalfYearly" | "Yearly";
type ApiBillingCycle = "Monthly" | "Quarterly" | "HalfYearly" | "Yearly";

interface PricingTiers {
  Starter: {
    Monthly: number;
    Quarterly: number;
    HalfYearly: number;
    Yearly: number;
  };
  "Starter plus": {
    Monthly: number;
    Quarterly: number;
    HalfYearly: number;
    Yearly: number;
  };
  Shelf: {
    Monthly: number;
    Quarterly: number;
    HalfYearly: number;
    Yearly: number;
  };
  Counter: {
    Monthly: number;
    Quarterly: number;
    HalfYearly: number;
    Yearly: number;
  };
  Shop: {
    Monthly: number;
    Quarterly: number;
    HalfYearly: number;
    Yearly: number;
  };
  Premium: {
    Monthly: number;
    Quarterly: number;
    HalfYearly: number;
    Yearly: number;
  };
}

interface DiscountRates {
  quarterly: number;
  halfYearly: number;
  yearly: number;
}

interface UpgradeLocationState {
  plan: keyof PricingTiers;
  selectedCategories: string[];
  maxCategories: number;
}

// Store reference in localStorage for later use
const storePaymentReference = (reference: string) => {
  localStorage.setItem("paymentReference", reference);
};

export default function Upgrade() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const locationState = state as UpgradeLocationState;
  const plan = locationState?.plan;
  const selectedCategories = locationState?.selectedCategories || [];
  const maxCategories = locationState?.maxCategories || 0;
  const [billing, setBilling] = useState<DisplayBillingCycle>("Monthly");
  const user = useSelector((s: any) => s.vendor);

  const pricing: PricingTiers = {
    Starter: {
      Monthly: 3000,
      Quarterly: 8100,
      HalfYearly: 15300,
      Yearly: 30000,
    },
    "Starter plus": {
      Monthly: 3000,
      Quarterly: 8100,
      HalfYearly: 15300,
      Yearly: 30000,
    },
    Shelf: {
      Monthly: 5000,
      Quarterly: 13500,
      HalfYearly: 25500,
      Yearly: 54000,
    },
    Counter: {
      Monthly: 7500,
      Quarterly: 20250,
      HalfYearly: 38250,
      Yearly: 81000,
    },
    Shop: {
      Monthly: 12000,
      Quarterly: 32400,
      HalfYearly: 61200,
      Yearly: 129600,
    },
    Premium: {
      Monthly: 20000,
      Quarterly: 54000,
      HalfYearly: 102000,
      Yearly: 216000,
    },
  };

  const discount: DiscountRates = {
    quarterly: 10,
    halfYearly: 15,
    yearly: 20,
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!plan || !billing) {
        throw new Error("Please select a billing cycle");
      }
      console.log("plan", plan);
      console.log("billing", billing);

      // Ensure the billing cycle is in the correct format for the API
      const apiBillingCycle = billing as ApiBillingCycle;

      return upgradePlan({
        token: user.token,
        newPlan: plan as any,
        billingCycle: apiBillingCycle,
        newCategories: selectedCategories,
      });
    },
    onSuccess: (response) => {
      if (response.success && response.authorizationUrl) {
        // Store the reference for later use
        storePaymentReference(response.reference);

        // Redirect to Paystack payment page
        window.location.href = response.authorizationUrl;
      } else {
        toast.error(response.message || "Failed to initiate payment");
      }
    },
    onError: (err: any) => {
      console.log("err", err);
      // Check if it's the specific billing cycle error
      if (err.message.includes("Invalid billing cycle")) {
        toast.error("Please select a valid billing cycle");
      } else {
        toast.error(err?.message || "Upgrade failed");
      }
    },
  });

  // Redirect if no valid plan is provided
  useEffect(() => {
    if (!plan || !pricing[plan]) {
      toast.error("Please select a plan first");
      navigate("/app/pricing");
    }
  }, [plan, navigate]);

  if (!plan || !pricing[plan]) {
    return null;
  }

  const amount =
    pricing[plan][
      billing === "HalfYearly"
        ? "HalfYearly"
        : billing === "Yearly"
        ? "Yearly"
        : billing
    ];
  // Persist current selection for recovery (side-effect, not during render)
  useEffect(() => {
    const data = { plan, billing, amount };
    localStorage.setItem("plan", JSON.stringify(data));
  }, [plan, billing, amount]);

  const billingLabel =
    billing === "HalfYearly"
      ? "6 months"
      : billing === "Quarterly"
      ? "3 months"
      : billing === "Yearly"
      ? "year"
      : "month";

  // Calculate savings compared to monthly
  const monthlyCost = pricing[plan].Monthly;
  let savingsPercentage = 0;
  let savingsAmount = 0;

  if (billing === "Quarterly") {
    savingsPercentage = discount.quarterly;
    savingsAmount = monthlyCost * 3 - pricing[plan].Quarterly;
  } else if (billing === "HalfYearly") {
    savingsPercentage = discount.halfYearly;
    savingsAmount = monthlyCost * 6 - pricing[plan].HalfYearly;
  } else if (billing === "Yearly") {
    savingsPercentage = discount.yearly;
    savingsAmount = monthlyCost * 12 - pricing[plan].Yearly;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      <div className="relative">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-200 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />
        
        <div className="relative max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/app/pricing")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Pricing</span>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold mb-4 shadow-lg"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade to {plan}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-red-800 bg-clip-text text-transparent mb-4"
            >
              Complete Your Upgrade
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600"
            >
              Choose your billing cycle and confirm your upgrade to unlock powerful features
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          >
            {/* Selected Categories Summary */}
            {selectedCategories.length > 0 && (
              <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Selected Categories</h3>
                </div>
                <div className="text-gray-700 mb-2">
                  {selectedCategories.slice(0, 3).join(", ")}
                  {selectedCategories.length > 3 && (
                    <span className="font-medium">
                      {" "}and {selectedCategories.length - 3} more
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Total: {selectedCategories.length} of {maxCategories} categories
                </div>
              </div>
            )}

            <div className="p-6">
              {/* Billing Toggle */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Choose Billing Cycle</h3>
                
                {/* Desktop/Tablet Billing Toggle */}
                <div className="hidden sm:flex justify-center">
                  <div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-xl shadow-inner">
                    {[
                      { label: "Monthly", value: "Monthly" },
                      { label: "3 Months", value: "Quarterly" },
                      { label: "6 Months", value: "HalfYearly" },
                      { label: "Yearly", value: "Yearly" },
                    ].map(({ label, value }) => (
                      <button
                        key={value}
                        onClick={() => setBilling(value as DisplayBillingCycle)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                          billing === value
                            ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {label}
                        {value !== "Monthly" && (
                          <span className="ml-1 text-xs text-green-600 font-bold">
                            -{discount[value.toLowerCase() as keyof DiscountRates]}%
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Billing Toggle */}
                <div className="flex sm:hidden justify-center">
                  <div className="flex flex-wrap justify-center gap-2 p-3 bg-gray-100 rounded-xl shadow-inner max-w-full overflow-hidden">
                    {[
                      { label: "1m", value: "Monthly" },
                      { label: "3m", value: "Quarterly" },
                      { label: "6m", value: "HalfYearly" },
                      { label: "1y", value: "Yearly" },
                    ].map(({ label, value }) => (
                      <button
                        key={value}
                        onClick={() => setBilling(value as DisplayBillingCycle)}
                        className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
                          billing === value
                            ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {label}
                        {value !== "Monthly" && (
                          <span className="ml-1 text-xs text-green-600 font-bold">
                            -{discount[value.toLowerCase() as keyof DiscountRates]}%
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                    ₦{amount.toLocaleString()}
                  </div>
                  <div className="text-gray-600 mb-3">
                    per {billingLabel}
                    {billing !== "Monthly" && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                          Save {savingsPercentage}% (₦{savingsAmount.toLocaleString()})
                        </span>
                      </div>
                    )}
                  </div>
                  {billing !== "Monthly" && (
                    <div className="text-sm text-gray-500">
                      Equivalent to ₦
                      {Math.round(
                        amount /
                          (billing === "Quarterly"
                            ? 3
                            : billing === "HalfYearly"
                            ? 6
                            : 12)
                      ).toLocaleString()}
                      /month
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Get</h3>
                <div className="space-y-3">
                  {[
                    `All ${plan} plan features`,
                    'Priority support',
                    'No setup fees',
                    '30-day money-back guarantee',
                    ...(selectedCategories.length > 0 
                      ? [`Access to ${selectedCategories.length} categor${selectedCategories.length === 1 ? 'y' : 'ies'}`] 
                      : [])
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrade Button */}
              <Button
                onClick={() => mutate()}
                disabled={isPending}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all text-base"
                size="lg"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Upgrade to {plan}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>

              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                  <Shield className="w-4 h-4" />
                  <span>Secure payment powered by Paystack</span>
                </div>
              </div>

              <p className="mt-3 text-sm text-center text-gray-500 leading-relaxed">
                Your subscription renews automatically at the end of each billing period until canceled. 
                You can manage your plan in Account Settings.
              </p>
            </div>
          </motion.div>

          {/* Error message for missing billing selection */}
          {!billing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-start gap-3 p-4 mt-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <div className="w-5 h-5 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="w-3 h-3 text-red-600" />
              </div>
              <span className="text-red-700">Please select a billing cycle to continue</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
