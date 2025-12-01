// // src/components/PaymentCallback.tsx
// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { Loader2 } from "lucide-react";
// import { toast } from "react-toastify";
// import { getPaymentStatus, PaymentStatusResponse, OrderData } from "@/utils/orderApi";
// import { clearCart } from "@/redux/slices/cartSlice";
// import { clearSessionId } from "@/redux/slices/sessionSlice";


// export default function PaymentCallback() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(true);

//   const handleClearCart = () => {
//     try {
//       dispatch(clearCart());
//     } catch (error: any) {
//       toast.error("Failed to clear cart. Please clear it manually.");
//     }
//   };

//   const mapBackendOrderData = (backendOrderData: any[]): OrderData | null => {
//     if (!backendOrderData || !Array.isArray(backendOrderData) || backendOrderData.length === 0) {
//       return null;
//     }

//     const firstOrder = backendOrderData[0].order;
//     const product = backendOrderData[0].product;

//     if (!firstOrder || !product || !firstOrder.buyerInfo) {
//       return null;
//     }

//     const mappedData: OrderData = {
//       first_name: firstOrder.buyerInfo.first_name || "",
//       last_name: firstOrder.buyerInfo.last_name || "",
//       email: firstOrder.buyerInfo.email || "",
//       phone: firstOrder.buyerInfo.phone || "",
//       address: firstOrder.buyerInfo.address || "",
//       country: firstOrder.buyerInfo.country || "",
//       apartment: firstOrder.buyerInfo.apartment || "",
//       city: firstOrder.buyerInfo.city || "",
//       region: firstOrder.buyerInfo.region || "",
//       postalCode: firstOrder.buyerInfo.postalCode || "",
//       couponCode: "",
//       paymentOption: firstOrder.paymentOption || "Pay Before Delivery",
//       cartItems: [
//         {
//           productId: product._id || "",
//           name: product.name || "",
//           price: product.price || 0,
//           quantity: firstOrder.quantity || 1,
//           image: product.images?.[0] || "",
//         },
//       ],
//       pricing: {
//         subtotal: firstOrder.totalPrice?.toString() || "0.00",
//         shipping: "0.00",
//         tax: "0.00",
//         discount: "0.00",
//         total: firstOrder.totalPrice?.toString() || "0.00",
//       },
//     };
//     return mappedData;
//   };

//   useEffect(() => {
//     const verifyPayment = async () => {
//       const reference = searchParams.get("reference");
//       if (!reference) {
//         console.error("No reference provided in URL query", { searchParams: Object.fromEntries(searchParams) });
//         toast.error("Invalid payment reference");
//         navigate("/failed", {
//           state: {
//             errorCode: "ERR_NO_REFERENCE",
//             errorMessage: "No payment reference provided.",
//           },
//         });
//         setIsLoading(false);
//         return;
//       }
//       try {
//         const response: PaymentStatusResponse = await getPaymentStatus(reference);

//         const mappedOrderData = mapBackendOrderData(
//           Array.isArray(response.orderData) ? response.orderData : []
//         );

//         // Check orderId and mapped orderData
//         if (
//           response.orderId &&
//           typeof response.orderId === "string" &&
//           response.orderId.trim() !== "" &&
//           mappedOrderData &&
//           mappedOrderData.pricing &&
//           mappedOrderData.pricing.total &&
//           mappedOrderData.cartItems &&
//           mappedOrderData.cartItems.length > 0
//         ) {

//           dispatch(clearSessionId())
//           handleClearCart();
//           toast.success("Payment verified successfully!");
//           navigate(`/${response.orderId}/success`, {
//             state: { orderId: response.orderId, orderData: mappedOrderData },
//           });
//         } else {
//           toast.error("Payment failed. Please try again.");
//           navigate("/failed", {
//             state: {
//               orderId: response.orderId || "unknown",
//               orderData: mappedOrderData,
//               errorCode: "ERR_INVALID_RESPONSE",
//               errorMessage: "Order ID or order data is missing or invalid.",
//             },
//           });
//         }
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || "Failed to verify payment status.";
//         toast.error(errorMessage);
//         navigate("/failed", {
//           state: {
//             errorCode: "ERR_PAYMENT_STATUS_FETCH",
//             errorMessage,
//           },
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     verifyPayment();
//   }, [searchParams, navigate, dispatch]);

//   if (isLoading) {
//     return (
//       <div className="container px-4 py-8 mx-auto text-center max-w-7xl">
//         <Loader2 className="w-8 h-8 mx-auto text-blue-600 animate-spin" />
//         <p className="mt-4 text-gray-600">Verifying payment...</p>
//       </div>
//     );
//   }

//   return null;
// }


// src/components/PaymentCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getPaymentStatus, PaymentStatusResponse, OrderData } from "@/utils/orderApi";
import { clearCart } from "@/redux/slices/cartSlice";
import { clearSessionId } from "@/redux/slices/sessionSlice";

interface BackendOrderItem {
  order: {
    _id: string;
    totalPrice: number;
    buyerInfo: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      address: string;
      country: string;
      apartment: string;
      city: string;
      region: string;
      postalCode: string;
    };
    paymentOption: "Pay Before Delivery" | "Pay After Delivery";
    items: any[];
    couponCode?: string;
  };
  product?: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    poster?: string;
  };
}

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

  const mapBackendOrderData = (backendOrderData: BackendOrderItem[]): OrderData | null => {
    if (!backendOrderData || !Array.isArray(backendOrderData) || backendOrderData.length === 0) {
      console.log("No backend order data found");
      return null;
    }

    const firstOrder = backendOrderData[0].order;
    
    if (!firstOrder || !firstOrder.buyerInfo) {
      console.log("Order or buyer info missing:", firstOrder);
      return null;
    }

    // Extract cart items - handle multiple scenarios
    let cartItems: OrderData['cartItems'] = [];
    
    // Scenario 1: If items array exists and has data
    if (firstOrder.items && Array.isArray(firstOrder.items) && firstOrder.items.length > 0) {
      cartItems = firstOrder.items.map((item: any) => ({
        productId: item.product?._id || item.productId || `item-${Date.now()}`,
        name: item.product?.name || item.name || "Product",
        price: item.product?.price || item.price || 0,
        quantity: item.quantity || 1,
        image: item.product?.images?.[0] || item.product?.poster || item.image || "",
      }));
    } 
    // Scenario 2: Use product data from backendOrderData[0].product if available
    else if (backendOrderData[0].product) {
      const product = backendOrderData[0].product;
      cartItems = [{
        productId: product._id || "product-1",
        name: product.name || "Product",
        price: product.price || firstOrder.totalPrice || 0,
        quantity: 1,
        image: product.images?.[0] || product.poster || "",
      }];
    }
    // Scenario 3: Create placeholder from order total
    else {
      cartItems = [{
        productId: `order-${firstOrder._id}`,
        name: "Order Items",
        price: firstOrder.totalPrice || 0,
        quantity: 1,
        image: "",
      }];
    }

    // Create mapped order data
    const mappedData: OrderData = {
      id: firstOrder._id,
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
      couponCode: firstOrder.couponCode || "",
      paymentOption: firstOrder.paymentOption || "Pay Before Delivery",
      cartItems: cartItems,
      pricing: {
        subtotal: firstOrder.totalPrice?.toString() || "0.00",
        shipping: "0.00",
        tax: "0.00",
        discount: "0.00",
        total: firstOrder.totalPrice?.toString() || "0.00",
      },
    };

    console.log("Mapped order data:", mappedData);
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

        const backendOrderData = Array.isArray(response.orderData) ? response.orderData : [];
        const mappedOrderData = mapBackendOrderData(backendOrderData);

        // Validate response
        if (
          response.orderId &&
          typeof response.orderId === "string" &&
          response.orderId.trim() !== "" &&
          mappedOrderData &&
          mappedOrderData.pricing &&
          mappedOrderData.pricing.total
        ) {
          console.log("Payment verification successful, clearing session and cart...");
          
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
          console.error("Invalid response structure:", response);
          toast.error("Payment verification failed. Invalid response from server.");
          navigate("/failed", {
            state: {
              orderId: response.orderId || "unknown",
              orderData: mappedOrderData,
              errorCode: "ERR_INVALID_RESPONSE",
              errorMessage: "Order verification failed. Please contact support.",
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