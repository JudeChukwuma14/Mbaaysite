// src/components/PaymentCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getPaymentStatus, PaymentStatusResponse, OrderData } from "@/utils/orderApi";
import { clearCart } from "@/redux/slices/cartSlice";
import { clearSessionId } from "@/redux/slices/sessionSlice";


export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const handleClearCart = () => {
    try {
      dispatch(clearCart());
    } catch (error: any) {
      toast.error("Failed to clear cart. Please clear it manually.");
    }
  };

  const mapBackendOrderData = (backendOrderData: any[]): OrderData | null => {
    if (!backendOrderData || !Array.isArray(backendOrderData) || backendOrderData.length === 0) {
      return null;
    }

    const firstOrder = backendOrderData[0].order;
    const product = backendOrderData[0].product;

    if (!firstOrder || !product || !firstOrder.buyerInfo) {
      return null;
    }

    const mappedData: OrderData = {
      first_name: firstOrder.buyerInfo.first_name || "",
      last_name: firstOrder.buyerInfo.last_name || "",
      email: firstOrder.buyerInfo.email || "",
      phone: firstOrder.buyerInfo.phone || "",
      address: firstOrder.buyerInfo.address || "",
      country: firstOrder.buyerInfo.country || "",
      apartment: firstOrder.buyerInfo.apartment || "",
      city: firstOrder.buyerInfo.city || "",
      region: firstOrder.buyerInfo.region || "",
      postalCode: firstOrder.buyerInfo.postalCode || "",
      couponCode: "",
      paymentOption: firstOrder.paymentOption || "Pay Before Delivery",
      cartItems: [
        {
          productId: product._id || "",
          name: product.name || "",
          price: product.price || 0,
          quantity: firstOrder.quantity || 1,
          image: product.images?.[0] || "",
        },
      ],
      pricing: {
        subtotal: firstOrder.totalPrice?.toString() || "0.00",
        shipping: "0.00",
        tax: "0.00",
        discount: "0.00",
        total: firstOrder.totalPrice?.toString() || "0.00",
      },
    };
    return mappedData;
  };

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");
      if (!reference) {
        console.error("No reference provided in URL query", { searchParams: Object.fromEntries(searchParams) });
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
      try {
        const response: PaymentStatusResponse = await getPaymentStatus(reference);

        const mappedOrderData = mapBackendOrderData(
          Array.isArray(response.orderData) ? response.orderData : []
        );

        // Check orderId and mapped orderData
        if (
          response.orderId &&
          typeof response.orderId === "string" &&
          response.orderId.trim() !== "" &&
          mappedOrderData &&
          mappedOrderData.pricing &&
          mappedOrderData.pricing.total &&
          mappedOrderData.cartItems &&
          mappedOrderData.cartItems.length > 0
        ) {

          dispatch(clearSessionId())
          handleClearCart();
          toast.success("Payment verified successfully!");
          navigate(`/${response.orderId}/success`, {
            state: { orderId: response.orderId, orderData: mappedOrderData },
          });
        } else {
          toast.error("Payment failed. Please try again.");
          navigate("/failed", {
            state: {
              orderId: response.orderId || "unknown",
              orderData: mappedOrderData,
              errorCode: "ERR_INVALID_RESPONSE",
              errorMessage: "Order ID or order data is missing or invalid.",
            },
          });
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to verify payment status.";
        toast.error(errorMessage);
        navigate("/failed", {
          state: {
            errorCode: "ERR_PAYMENT_STATUS_FETCH",
            errorMessage,
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