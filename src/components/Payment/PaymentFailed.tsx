// src/components/PaymentFailed.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { XCircle, AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { getPaymentStatus, OrderData } from "@/utils/orderApi";
import ImageWithFallback from "../Reuseable/ImageWithFallback";

interface PaymentFailedProps {
  orderNumber?: string;
  amount?: string;
  date?: string;
  email?: string;
  paymentMethod?: string;
  errorCode?: string;
  errorMessage?: string;
  orderData?: OrderData;
}

export default function PaymentFailed({
  orderNumber: defaultOrderNumber = "ORD-7829354",
  amount: defaultAmount = "$249.99",
  date: defaultDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  email: defaultEmail = "customer@example.com",
  paymentMethod: defaultPaymentMethod = "Visa •••• 4242",
  errorCode: defaultErrorCode = "ERR_PAYMENT_DECLINED",
  errorMessage: defaultErrorMessage = "Your payment was declined by your bank. Please try a different payment method or contact your bank for more information.",
  orderData: defaultOrderData,
}: PaymentFailedProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(defaultOrderData || null);
  const [orderNumber, setOrderNumber] = useState(defaultOrderNumber);
  const [amount, setAmount] = useState(defaultAmount);
  const [email, setEmail] = useState(defaultEmail);
  const [paymentMethod, setPaymentMethod] = useState(defaultPaymentMethod);
  const [errorCode, setErrorCode] = useState(defaultErrorCode);
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage);
  const [searchParams] = useSearchParams();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("PaymentFailed state:", state); // Debug log
    const reference = searchParams.get("reference");
    if (reference && !state?.orderData) {
      setIsLoading(true);
      getPaymentStatus(reference)
        .then(({ orderId, orderData }) => {
          setOrderNumber(orderId || defaultOrderNumber);
          setOrderData(orderData || null);
          setAmount(`$${orderData?.pricing.total || defaultAmount}`);
          setEmail(orderData?.email || defaultEmail);
          setPaymentMethod(
            orderData?.paymentOption === "Pay Before Delivery" ? "Credit Card" : "Cash on Delivery"
          );
          setErrorCode(state?.errorCode || defaultErrorCode);
          setErrorMessage(state?.errorMessage || defaultErrorMessage);
        })
        .catch((error) => {
          console.error("PaymentFailed error:", error);
          setErrorCode(state?.errorCode || "ERR_PAYMENT_STATUS_FETCH");
          setErrorMessage(
            state?.errorMessage || "Failed to fetch payment status. Please try again later."
          );
        })
        .finally(() => setIsLoading(false));
    } else if (state?.orderData || state?.errorCode) {
      setOrderNumber(state.orderId || defaultOrderNumber);
      setOrderData(state.orderData || null);
      setAmount(`$${state.orderData?.pricing.total || defaultAmount}`);
      setEmail(state.orderData?.email || defaultEmail);
      setPaymentMethod(
        state.orderData?.paymentOption === "before" ? "Credit Card" : "Cash on Delivery"
      );
      setErrorCode(state.errorCode || defaultErrorCode);
      setErrorMessage(state.errorMessage || defaultErrorMessage);
    }
  }, [searchParams, state, defaultOrderNumber, defaultAmount, defaultEmail, defaultErrorCode, defaultErrorMessage]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/");
    }
  }, [countdown, navigate]);

  const commonIssues = [
    {
      title: "Insufficient funds",
      description: "Your card doesn't have enough funds to complete this purchase.",
    },
    {
      title: "Card verification failed",
      description: "The card verification details (CVV or billing address) may be incorrect.",
    },
    {
      title: "Unusual activity detected",
      description: "Your bank may have flagged this as an unusual transaction.",
    },
    {
      title: "Card expired or invalid",
      description: "Your card may be expired or the card number was entered incorrectly.",
    },
  ];

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto text-center max-w-7xl">
        <Loader2 className="w-8 h-8 mx-auto text-red-600 animate-spin" />
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-red-50 to-white">
      <div className="w-full max-w-md overflow-hidden bg-white shadow-xl rounded-2xl">
        <div className="p-6 text-center bg-red-500">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white rounded-full"
          >
            <XCircle className="w-10 h-10 text-red-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-white"
          >
            Payment Failed
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-1 text-red-100"
          >
            We couldn't process your payment
          </motion.p>
        </div>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-4 mb-6 border border-red-100 rounded-lg bg-red-50"
          >
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <div className="mb-1 text-sm font-medium text-red-800">{errorCode}</div>
                <div className="text-sm text-red-600">{errorMessage}</div>
              </div>
            </div>
          </motion.div>

          <div className="mb-6">
            <div className="mb-1 text-sm text-gray-500">Order Reference</div>
            <div className="text-lg font-semibold text-gray-800">{orderNumber}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="mb-1 text-sm text-gray-500">Attempted Amount</div>
              <div className="text-lg font-semibold text-gray-800">{amount}</div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">Date</div>
              <div className="text-gray-800">{defaultDate}</div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">Email</div>
              <div className="text-gray-800 truncate">{email}</div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">Payment Method</div>
              <div className="text-gray-800">{paymentMethod}</div>
            </div>
          </div>

          {orderData?.cartItems && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-gray-700">Attempted Items</h3>
              <ul className="space-y-4">
                {orderData.cartItems.map((item) => (
                  <li key={item.productId} className="flex items-center gap-4">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-12 h-12 rounded"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} x {item.quantity} = $
                        {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {orderData?.pricing && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-gray-700">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">${orderData.pricing.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-800">${orderData.pricing.tax}</span>
                </div>
                {orderData.pricing.discount !== "0.00" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount ({orderData.couponCode})</span>
                    <span className="font-medium text-green-600">
                      -${orderData.pricing.discount}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-medium text-gray-800">Total Attempted</span>
                  <span className="font-semibold text-gray-800">${orderData.pricing.total}</span>
                </div>
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-6"
          >
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-between w-full py-3 text-left border-t border-b border-gray-100"
              aria-expanded={showDetails}
              aria-controls="common-issues"
            >
              <span className="font-medium text-gray-800">Common reasons for payment failure</span>
              {showDetails ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {showDetails && (
              <div id="common-issues" className="pt-3 pb-1 text-sm">
                <ul className="space-y-3">
                  {commonIssues.map((issue, index) => (
                    <li key={index} className="pb-3 border-b border-gray-100 last:border-0">
                      <div className="font-medium text-gray-800">{issue.title}</div>
                      <div className="mt-1 text-gray-600">{issue.description}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          <div className="pt-6 space-y-4 border-t border-gray-100">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/checkout"
                className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                aria-label="Try payment again"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Link>
              <Link
                to="/checkout/payment-methods"
                className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                aria-label="Change payment method"
              >
                Change Payment Method
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900"
              aria-label="Return to home"
            >
              <Home className="w-4 h-4 mr-1" />
              Return to Home
            </Link>
            <div className="text-sm text-gray-500">
              Redirecting in <span className="font-medium">{countdown}s</span>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="max-w-md mt-6 text-sm text-center text-gray-500"
      >
        <p>
          Need immediate assistance?{" "}
          <Link to="/support" className="text-red-600 transition-colors hover:text-red-700">
            Contact our support team
          </Link>
        </p>
      </motion.div>
    </div>
  );
}