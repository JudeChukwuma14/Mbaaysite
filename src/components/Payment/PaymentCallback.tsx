// src/components/PaymentCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getPaymentStatus } from "@/utils/orderApi";
import { clearCart } from "@/redux/slices/cartSlice";
import { clearSessionId } from "@/utils/session";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const handleClearCart = () => {
    try {
      // Reset sessionId to clear server-side cart
      const newSessionId = clearSessionId();
      console.log("Session ID reset to:", newSessionId);
      // Clear client-side Redux cart
      dispatch(clearCart());
      console.log("Cart cleared successfully");
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart. Please clear it manually.");
    }
  };

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");
      if (!reference) {
        console.error("No reference provided in URL query");
        toast.error("Invalid payment reference");
        navigate("/failed", {
          state: {
            errorCode: "ERR_NO_REFERENCE",
            errorMessage: "No payment reference provided.",
          },
        });
        setIsLoading(false);
        return;
      }

      console.log("Verifying payment with reference:", reference);

      try {
        const response = await getPaymentStatus(reference);
        console.log("Payment Status Response:", JSON.stringify(response, null, 2));

        // Check orderId
        if (!response.orderId || typeof response.orderId !== "string" || response.orderId.trim() === "") {
          console.warn("Invalid or missing orderId in response:", response);
          toast.error("Payment verification failed due to missing order information.");
          navigate("/failed", {
            state: {
              errorCode: "ERR_MISSING_ORDER_ID",
              errorMessage: "Order ID is missing or invalid.",
            },
          });
          return;
        }

        if (response.status === "success") {
          // Check orderDetails for success case
          if (
            !response.orderDetails ||
            typeof response.orderDetails !== "object" ||
            !response.orderDetails.cartItems ||
            !response.orderDetails.pricing
          ) {
            console.warn("Invalid or missing orderDetails in success response:", response);
            toast.error("Payment verification failed due to incomplete order details.");
            navigate("/failed", {
              state: {
                errorCode: "ERR_MISSING_ORDER_DETAILS",
                errorMessage: "Order details are missing or invalid for a successful payment.",
              },
            });
            return;
          }

          // Clear cart on successful payment
          handleClearCart();

          toast.success("Payment verified successfully!");
          navigate(`/${response.orderId}/success`, {
            state: { orderId: response.orderId, orderData: response.orderDetails },
          });
        } else {
          console.warn("Payment failed with response:", response);
          toast.error("Payment failed. Please try again.");
          navigate("/failed", {
            state: {
              orderId: response.orderId,
              orderData: response.orderDetails,
              errorCode: "ERR_PAYMENT_FAILED",
              errorMessage: (response as any).message || "Payment was not successful.",
            },
          });
        }
      } catch (error: any) {
        console.error("Payment Verification Error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        toast.error(error.response?.data?.message || "Failed to verify payment status.");
        navigate("/failed", {
          state: {
            errorCode: "ERR_PAYMENT_STATUS_FETCH",
            errorMessage: error.response?.data?.message || "Unable to verify payment status.",
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, dispatch]);

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