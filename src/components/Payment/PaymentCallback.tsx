// src/components/PaymentCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getPaymentStatus, PaymentStatusResponse, OrderData, OrderCartItem } from "@/utils/orderApi";
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
      localStorage.removeItem('cartItems');
    } catch (error: any) {
      console.error("Failed to clear cart:", error);
      toast.error("Failed to clear cart. Please clear it manually.");
    }
  };

  const mapBackendOrderData = (backendOrderData: any, orderId: string): OrderData | null => {
    console.log("Mapping backend order data:", backendOrderData);
    
    // Handle case where backendOrderData is null or undefined
    if (!backendOrderData) {
      console.log("No backend order data found");
      return null;
    }

    // Check if it's an array or a single object
    let orderData;
    if (Array.isArray(backendOrderData)) {
      if (backendOrderData.length === 0) {
        console.log("Empty backend order data array");
        return null;
      }
      // Take the first order if it's an array
      orderData = backendOrderData[0];
    } else {
      // It's already a single order object
      orderData = backendOrderData;
    }

    // Extract the order object (handle nested structure)
    const order = orderData.order || orderData;
    
    if (!order || !order.buyerInfo) {
      console.log("Order or buyer info missing:", order);
      return null;
    }

    // Extract cart items from the order
    const cartItems: OrderCartItem[] = [];
    
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item: any, index: number) => {
        const product = item.product;
        if (product) {
          cartItems.push({
            productId: product._id || `product-${index}`,
            name: product.name || `Product ${index + 1}`,
            price: item.price || product.price || 0,
            quantity: item.quantity || 1,
            image: product.images?.[0] || product.poster || "",
          });
        }
      });
    } else {
      console.log("No items found in order or items is not an array:", order.items);
    }

    // Calculate total price
    const totalPrice = order.totalPrice || 0;

    // Create mapped order data
    const mappedData: OrderData = {
      id: order._id || orderId,
      first_name: order.buyerInfo.first_name || "",
      last_name: order.buyerInfo.last_name || "",
      email: order.buyerInfo.email || "",
      phone: order.buyerInfo.phone || "",
      address: order.buyerInfo.address || "",
      country: order.buyerInfo.country || "",
      apartment: order.buyerInfo.apartment || "",
      city: order.buyerInfo.city || "",
      region: order.buyerInfo.region || "",
      postalCode: order.buyerInfo.postalCode || "",
      couponCode: order.couponCode || "",
      paymentOption: order.paymentOption || "Pay Before Delivery",
      cartItems: cartItems,
      pricing: {
        subtotal: totalPrice.toString(),
        shipping: "0.00",
        tax: "0.00",
        discount: "0.00",
        total: totalPrice.toString(),
      },
    };

    console.log("Successfully mapped order data:", {
      orderId: mappedData.id,
      totalItems: cartItems.length,
      totalPrice: totalPrice
    });
    
    return mappedData;
  };

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");
      const status = searchParams.get("status");
      const tx_ref = searchParams.get("tx_ref");

      console.log("Payment callback parameters:", { reference, status, tx_ref });

      if (!reference) {
        console.error("No reference provided in URL query", {
          searchParams: Object.fromEntries(searchParams)
        });
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

      if (status === "cancelled") {
        toast.error("Payment was cancelled by user");
        navigate("/cart");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Verifying payment with reference:", reference);
        const response: PaymentStatusResponse = await getPaymentStatus(reference);
        console.log("Payment status response:", response);

        // The backend returns orderData as a single object, not necessarily an array
        const backendOrderData = response.orderData;
        const mappedOrderData = mapBackendOrderData(backendOrderData, response.orderId);

        // Add detailed debug logging
        console.log("Response structure check:", {
          hasOrderId: !!response.orderId,
          orderIdType: typeof response.orderId,
          orderIdValue: response.orderId,
          orderIdTrimmed: response.orderId?.trim(),
          hasMappedData: !!mappedOrderData,
          hasPricing: mappedOrderData?.pricing,
          hasTotal: mappedOrderData?.pricing?.total,
          totalValue: mappedOrderData?.pricing?.total,
          responseKeys: Object.keys(response),
          responseStructure: response
        });

        // Validate response - IMPORTANT: Check that total is not "0.00"
        if (
          response.orderId &&
          typeof response.orderId === "string" &&
          response.orderId.trim() !== "" &&
          mappedOrderData &&
          mappedOrderData.pricing &&
          mappedOrderData.pricing.total &&
          mappedOrderData.pricing.total !== "0.00" &&
          mappedOrderData.pricing.total !== "0"
        ) {
          console.log("✅ Payment verification successful, clearing session and cart...");

          // Clear session and cart
          dispatch(clearSessionId());
          handleClearCart();

          toast.success("Payment verified successfully!");

          // Navigate to success page
          navigate(`/${response.orderId}/success`, {
            state: {
              orderId: response.orderId,
              orderData: mappedOrderData,
              reference: reference
            },
            replace: true
          });
        } else {
          console.error("❌ Invalid response structure or validation failed:", {
            orderIdValid: response.orderId && typeof response.orderId === "string" && response.orderId.trim() !== "",
            mappedDataValid: !!mappedOrderData,
            pricingValid: mappedOrderData?.pricing,
            totalValid: mappedOrderData?.pricing?.total && 
                       mappedOrderData.pricing.total !== "0.00" && 
                       mappedOrderData.pricing.total !== "0",
            totalValue: mappedOrderData?.pricing?.total,
            responseStructure: response
          });
          
          toast.error("Payment verification failed. Invalid response from server.");
          
          // Navigate to failed page with useful error info
          navigate("/failed", {
            state: {
              orderId: response.orderId || "unknown",
              orderData: mappedOrderData,
              errorCode: "ERR_INVALID_RESPONSE",
              errorMessage: "Order verification failed. Please contact support.",
              reference: reference
            },
            replace: true
          });
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to verify payment status.";
        toast.error(errorMessage);
        navigate("/failed", {
          state: {
            errorCode: "ERR_PAYMENT_STATUS_FETCH",
            errorMessage,
            reference: reference,
          },
          replace: true
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
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 mx-auto text-orange-600 animate-spin" />
          <p className="mt-4 text-lg font-medium text-gray-700">Verifying your payment...</p>
          <p className="mt-2 text-sm text-gray-500">This may take a few moments</p>
          <div className="w-64 h-2 mt-6 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}