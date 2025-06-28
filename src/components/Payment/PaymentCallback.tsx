// src/components/PaymentCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getPaymentStatus, PaymentStatusResponse, OrderData } from "@/utils/orderApi";
import { clearCart } from "@/redux/slices/cartSlice";


export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const handleClearCart = () => {
    try {
      dispatch(clearCart());
      console.log("Cart cleared successfully");
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart. Please clear it manually.");
    }
  };

  const mapBackendOrderData = (backendOrderData: any[]): OrderData | null => {
    console.log("Mapping backend orderData:", JSON.stringify(backendOrderData, null, 2));

    if (!backendOrderData || !Array.isArray(backendOrderData) || backendOrderData.length === 0) {
      console.warn("Invalid or empty orderData array:", backendOrderData);
      return null;
    }

    const firstOrder = backendOrderData[0].order;
    const product = backendOrderData[0].product;

    if (!firstOrder || !product || !firstOrder.buyerInfo) {
      console.warn("Missing order, product, or buyerInfo in orderData:", backendOrderData);
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
        commission: "0.00",
        total: firstOrder.totalPrice?.toString() || "0.00",
      },
    };

    console.log("Mapped orderData:", JSON.stringify(mappedData, null, 2));
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

      console.log("Verifying payment with reference:", reference);

      try {
        const response: PaymentStatusResponse = await getPaymentStatus(reference);
        console.log("Payment Status Response:", JSON.stringify(response, null, 2));

        // Map backend orderData to expected OrderData
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
          console.log("Navigating to success with state:", {
            orderId: response.orderId,
            orderData: mappedOrderData,
          });
          // Clear cart on successful payment
          handleClearCart();

          toast.success("Payment verified successfully!");
          navigate(`/${response.orderId}/success`, {
            state: { orderId: response.orderId, orderData: mappedOrderData },
          });
        } else {
          console.warn("Invalid or missing orderId or orderData in response:", {
            orderId: response.orderId,
            orderData: response.orderData,
            mappedOrderData,
          });
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
        console.error("Payment Verification Error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
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