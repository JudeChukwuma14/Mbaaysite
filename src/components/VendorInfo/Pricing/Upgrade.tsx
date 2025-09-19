import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowLeft, AlertCircle } from "lucide-react";
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
      navigate("/pricing");
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
  const data = {
    plan,
    billing,
    amount,
  };

  const store = localStorage.setItem("plan", JSON.stringify(data));
  console.log(store);

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
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/app/pricing")}
            className="flex items-center gap-2 text-gray-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pricing
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white border-2 border-blue-500 shadow-lg rounded-2xl"
        >
          <h2 className="mb-2 text-2xl font-bold text-center text-gray-900">
            {plan} Plan
          </h2>
          <p className="mb-6 text-sm text-center text-gray-600">
            Choose your billing cycle and confirm upgrade
          </p>

          {/* Selected Categories Summary */}
          {selectedCategories.length > 0 && (
            <div className="p-4 mb-6 rounded-lg bg-green-50">
              <h3 className="mb-2 font-medium text-green-800">
                Selected Categories:
              </h3>
              <div className="text-sm text-green-700">
                {selectedCategories.slice(0, 3).join(", ")}
                {selectedCategories.length > 3 && (
                  <span className="font-medium">
                    {" "}
                    and {selectedCategories.length - 3} more
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs text-green-600">
                Total: {selectedCategories.length} of {maxCategories} categories
              </div>
            </div>
          )}

          {/* Billing toggle */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Billing Cycle
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  "Monthly",
                  "Quarterly",
                  "HalfYearly",
                  "Yearly",
                ] as DisplayBillingCycle[]
              ).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBilling(cycle)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    billing === cycle
                      ? "bg-blue-500 text-white shadow"
                      : "text-gray-600 hover:text-gray-900 bg-gray-100"
                  }`}
                >
                  <div className="font-medium">
                    {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                  </div>
                  {cycle !== "Monthly" && (
                    <div className="mt-1 text-xs">
                      Save{" "}
                      {discount[cycle.toLowerCase() as keyof DiscountRates]}%
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Features list */}
          <div className="pt-4 mb-6 border-t border-gray-200">
            <h3 className="mb-3 font-medium text-gray-900">Plan includes:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mr-2 text-green-500" />
                <span className="text-sm">All {plan} plan features</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mr-2 text-green-500" />
                <span className="text-sm">Priority support</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mr-2 text-green-500" />
                <span className="text-sm">No setup fees</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mr-2 text-green-500" />
                <span className="text-sm">30-day money-back guarantee</span>
              </li>
              {selectedCategories.length > 0 && (
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  <span className="text-sm">
                    Access to {selectedCategories.length} categor
                    {selectedCategories.length === 1 ? "y" : "ies"}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Price */}
          <div className="p-4 mb-6 rounded-lg bg-blue-50">
            <div className="text-3xl font-bold text-center text-gray-900">
              ₦{amount.toLocaleString()}
            </div>
            <div className="text-sm text-center text-gray-600">
              per {billingLabel}
              {billing !== "Monthly" && (
                <div className="mt-1">
                  <span className="font-medium text-green-600">
                    Save {savingsPercentage}% (₦{savingsAmount.toLocaleString()}
                    )
                  </span>
                </div>
              )}
            </div>

            {/* Equivalent monthly price */}
            {billing !== "Monthly" && (
              <div className="mt-2 text-xs text-center text-gray-50">
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

          {/* Action */}
          <Button
            onClick={() => mutate()}
            disabled={isPending}
            className="w-full"
            size="lg"
          >
            {isPending ? "Processing..." : `Upgrade to ${plan}`}
          </Button>

          <p className="mt-4 text-xs text-center text-gray-500">
            Your payment will be automatically charged at the end of each
            billing period until canceled.
          </p>
        </motion.div>

        {/* Error message for missing billing selection */}
        {!billing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 p-3 mt-4 text-red-700 rounded-lg bg-red-50"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Please select a billing cycle</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
