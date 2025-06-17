// src/components/PaymentCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getPaymentStatus } from "@/utils/orderApi";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");
      if (!reference) {
        toast.error("Invalid payment reference");
        navigate("/failed", {
          state: { errorCode: "ERR_NO_REFERENCE", errorMessage: "No payment reference provided." },
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await getPaymentStatus(reference);
        console.log("Payment Status Response:", response); // Debug log
        if (response.status === "success") {
          toast.success("Payment verified successfully!");
          navigate(`/${response.orderId}/success`, { state: { orderId: response.orderId, orderData: response.orderDetails } });
        } else {
          toast.error("Payment failed. Please try again.");
          navigate("/failed", {
            state: {
              orderId: response.orderId,
              orderData: response.orderDetails,
              errorCode: "ERR_PAYMENT_FAILED",
              errorMessage: "Payment was not successful. Please try again.",
            },
          });
        }
      } catch (error: any) {
        console.error("Payment Verification Error:", error.message, error.response?.data); // Debug log
        toast.error(error.message || "Failed to verify payment status.");
        navigate("/failed", {
          state: {
            errorCode: "ERR_PAYMENT_STATUS_FETCH",
            errorMessage: error.message || "Unable to verify payment status.",
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
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