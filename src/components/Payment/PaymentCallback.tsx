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
                const { status, orderId, orderDetails } = await getPaymentStatus(reference);
                if (status === "success") {
                    toast.success("Payment verified successfully!");
                    navigate(`/${orderId}/success`, { state: { orderId, orderData: orderDetails } });
                } else {
                    toast.error("Payment failed. Please try again.");
                    navigate("/failed", { state: { orderId, orderData: orderDetails } });
                }
            } catch (error) {
                toast.error("Failed to verify payment status.");
                navigate("/failed", {
                    state: {
                        errorCode: "ERR_PAYMENT_STATUS_FETCH",
                        errorMessage: "Unable to verify payment status. Please try again later.",
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