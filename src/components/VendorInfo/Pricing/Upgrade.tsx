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
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Back */}
        <div className="mb-3 sm:mb-5">
          <Button
            variant="ghost"
            onClick={() => navigate("/app/pricing")}
            className="flex items-center gap-1.5 text-muted-foreground text-xs sm:text-sm md:text-base px-2 sm:px-3"
            size="sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Back to Pricing</span>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-5 sm:mb-7">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold px-2"
          >
            Upgrade to {plan}
          </motion.h1>
          <p className="text-muted-foreground mt-1.5 text-xs sm:text-sm md:text-base px-3">
            Choose your billing cycle and confirm your upgrade
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl sm:rounded-2xl border bg-card p-4 sm:p-5 md:p-6 shadow-sm"
        >
          {/* Selected Categories Summary */}
          {selectedCategories.length > 0 && (
            <div className="p-3 sm:p-4 mb-4 sm:mb-5 rounded-lg bg-primary/5 border border-primary/10">
              <h3 className="mb-1.5 text-sm sm:text-base font-medium text-primary">
                Selected Categories
              </h3>
              <div className="text-xs sm:text-sm break-words line-clamp-2">
                {selectedCategories.slice(0, 3).join(", ")}
                {selectedCategories.length > 3 && (
                  <span className="font-medium whitespace-nowrap">
                    {" "}
                    and {selectedCategories.length - 3} more
                  </span>
                )}
              </div>
              <div className="mt-1 text-[10px] sm:text-xs text-muted-foreground">
                Total: {selectedCategories.length} of {maxCategories} categories
              </div>
            </div>
          )}

          {/* Billing Toggle */}
          <div className="flex justify-center mb-4 sm:mb-5">
            <div className="inline-flex items-center gap-0.5 p-0.5 bg-muted rounded-lg overflow-x-auto w-full max-w-md">
              {(
                [
                  { label: "Monthly", value: "Monthly" },
                  { label: "3 Months", value: "Quarterly" },
                  { label: "6 Months", value: "HalfYearly" },
                  { label: "Yearly", value: "Yearly" },
                ] as const
              ).map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setBilling(value as DisplayBillingCycle)}
                  className={`flex-1 min-w-[70px] sm:min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] xs:text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap flex-shrink-0 justify-center items-center ${
                    billing === value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                  {value !== "Monthly" && (
                    <span className="ml-0.5 text-[8px] xs:text-[10px] text-primary font-bold">
                      -{discount[value.toLowerCase() as keyof DiscountRates]}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="rounded-lg bg-muted/20 p-3 sm:p-4 mb-5 border border-muted">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                ₦{amount.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                per {billingLabel}
                {billing !== "Monthly" && (
                  <div className="mt-0.5">
                    <span className="font-medium text-green-600 text-xs sm:text-sm">
                      Save {savingsPercentage}% (₦{savingsAmount.toLocaleString()})
                    </span>
                  </div>
                )}
              </div>
              {billing !== "Monthly" && (
                <div className="mt-1 text-[10px] xs:text-xs text-muted-foreground">
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
          <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5">
            {[
              `All ${plan} plan features`,
              'Priority support',
              'No setup fees',
              '30-day money-back guarantee',
              ...(selectedCategories.length > 0 
                ? [`Access to ${selectedCategories.length} categor${selectedCategories.length === 1 ? 'y' : 'ies'}`] 
                : [])
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Action */}
          <Button
            onClick={() => mutate()}
            disabled={isPending}
            className="w-full text-sm sm:text-base py-1.5 h-auto"
            size="lg"
          >
            {isPending ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Upgrade to ${plan}`
            )}
          </Button>

          <p className="mt-3 text-[10px] xs:text-xs text-center text-muted-foreground leading-relaxed">
            Your subscription renews automatically at the end of each billing
            period until canceled. You can manage your plan in Account Settings.
          </p>
        </motion.div>

        {/* Error message for missing billing selection */}
        {!billing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-start gap-2 p-2.5 mt-3 text-red-600 rounded-lg bg-red-50 border border-red-100 text-xs sm:text-sm"
          >
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
            <span>Please select a billing cycle to continue</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
