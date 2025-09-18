import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { verifySubscriptionPayment } from "@/utils/upgradeApi";

export default function SubscriptionCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      setIsLoading(true);
      const reference = searchParams.get("reference");
      // const trxref = searchParams.get("app?trxref");
      const storedDataString = localStorage.getItem("plan") as any;

      const retrievedData = JSON.parse(storedDataString);

      // Now you can access the properties of the retrieved object
      const plan = retrievedData.plan;
      const billing = retrievedData.billing;

      console.log("Retrieved plan:", plan);
      console.log("Retrieved selectedCategories:", billing);

      if (!reference) {
        toast.error("No payment reference");
        navigate("subscription_failed", {
          state: {
            plan: plan,
            ref: reference,
            billing: billing,
          },
        });
        setIsLoading(false);
        return;
      }

      try {
        if (reference) {
          const data = await verifySubscriptionPayment(reference as any);
          console.log(data);
          if (data.success) {
            setIsLoading(false);
            toast.success("Payment confirmed – plan upgraded!");
            navigate("/subscription_success", {
              state: {
                plan: plan,
                ref: reference,
                billing: billing,
              },
              replace: true,
            });
          } else {
            setIsLoading(false);
            toast.error(data.message || "Verification failed");
            navigate("subscription_success", {
              state: {
                plan: plan,
                ref: reference,
                billing: billing,
              },
              replace: true,
            });
          }
        }
      } catch (e: any) {
        setIsLoading(false);
        console.log(e);
        toast.error(e?.response?.data?.message || "Verification error");
        navigate("/app/pricing", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto text-center max-w-7xl">
        <Loader2 className="w-8 h-8 mx-auto text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-600">Verifying payment...</p>
      </div>
    );
  }

  return null;
}
