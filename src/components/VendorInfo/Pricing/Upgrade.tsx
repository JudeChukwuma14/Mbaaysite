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
    'Starter plus': {
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
      console.log("plan", plan)
      console.log("billing", billing) 

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
      console.log("err", err)
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
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Back */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/app/pricing")}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pricing
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold"
          >
            Upgrade to {plan}
          </motion.h1>
          <p className="text-muted-foreground mt-2">
            Choose your billing cycle and confirm your upgrade
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-card p-6 shadow-sm"
        >
          {/* Selected Categories Summary */}
          {selectedCategories.length > 0 && (
            <div className="p-4 mb-6 rounded-lg bg-primary/5">
              <h3 className="mb-2 font-medium text-primary">Selected Categories</h3>
              <div className="text-sm">
                {selectedCategories.slice(0, 3).join(", ")}
                {selectedCategories.length > 3 && (
                  <span className="font-medium"> and {selectedCategories.length - 3} more</span>
                )}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Total: {selectedCategories.length} of {maxCategories} categories
              </div>
            </div>
          )}

          {/* Billing Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-lg">
              {(["Monthly", "Quarterly", "HalfYearly", "Yearly"] as DisplayBillingCycle[]).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBilling(cycle)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    billing === cycle ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cycle === "HalfYearly" ? "6 Months" : cycle}
                  {cycle !== "Monthly" && (
                    <span className="ml-1 text-xs text-primary">-
                      {discount[cycle.toLowerCase() as keyof DiscountRates]}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="rounded-lg bg-muted/40 p-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold">₦{amount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">
                per {billingLabel}
                {billing !== "Monthly" && (
                  <div className="mt-1">
                    <span className="font-medium text-green-600">
                      Save {savingsPercentage}% (₦{savingsAmount.toLocaleString()})
                    </span>
                  </div>
                )}
              </div>
              {billing !== "Monthly" && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Equivalent to ₦
                  {Math.round(
                    amount / (billing === "Quarterly" ? 3 : billing === "HalfYearly" ? 6 : 12)
                  ).toLocaleString()}
                  /month
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2 mb-6">
            <div className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-primary mt-0.5" />
              <span>All {plan} plan features</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-primary mt-0.5" />
              <span>Priority support</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-primary mt-0.5" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-primary mt-0.5" />
              <span>30-day money-back guarantee</span>
            </div>
            {selectedCategories.length > 0 && (
              <div className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-primary mt-0.5" />
                <span>
                  Access to {selectedCategories.length} categor{selectedCategories.length === 1 ? "y" : "ies"}
                </span>
              </div>
            )}
          </div>

          {/* Action */}
          <Button onClick={() => mutate()} disabled={isPending} className="w-full" size="lg">
            {isPending ? "Processing..." : `Upgrade to ${plan}`}
          </Button>

          <p className="mt-4 text-xs text-center text-muted-foreground">
            Your subscription renews automatically at the end of each billing period until canceled. You can manage your
            plan in Account Settings.
          </p>
        </motion.div>

        {/* Error message for missing billing selection */}
        {!billing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3 mt-4 text-red-700 rounded-lg bg-red-50">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Please select a billing cycle</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
