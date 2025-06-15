import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Download, Home, ShoppingBag, Copy, Loader2 } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getPaymentStatus, OrderData } from "@/utils/orderApi";
import ImageWithFallback from "../Reuseable/ImageWithFallback";

interface PaymentSuccessProps {
  orderNumber?: string;
  amount?: string;
  date?: string;
  email?: string;
  paymentMethod?: string;
  orderData?: OrderData;
}

export default function PaymentSuccess({
  orderNumber: defaultOrderNumber = "ORD-7829354",
  amount: defaultAmount = "$249.99",
  date: defaultDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  email: defaultEmail = "customer@example.com",
  paymentMethod: defaultPaymentMethod = "Visa •••• 4242",
  orderData: defaultOrderData,
}: PaymentSuccessProps) {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [orderDetails, setOrderDetails] = useState<OrderData | null>(defaultOrderData || null);
  const [orderNumber, setOrderNumber] = useState(defaultOrderNumber);
  const [amount, setAmount] = useState(defaultAmount);
  const [email, setEmail] = useState(defaultEmail);
  const [paymentMethod, setPaymentMethod] = useState(defaultPaymentMethod);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const reference = searchParams.get("reference");
    if (reference && !state?.orderData) {
      setIsLoading(true);
      getPaymentStatus(reference)
        .then(({ orderId, orderDetails }) => {
          setOrderNumber(orderId);
          setOrderDetails(orderDetails || null);
          setAmount(`$${orderDetails?.pricing.total || defaultAmount}`);
          setEmail(orderDetails?.email || defaultEmail);
          setPaymentMethod(orderDetails?.paymentOption === "before" ? "Credit Card" : "Cash on Delivery");
        })
        .catch(() => navigate("/failed"))
        .finally(() => setIsLoading(false));
    } else if (state?.orderData && state?.orderId) {
      setOrderNumber(state.orderId);
      setOrderDetails(state.orderData);
      setAmount(`$${state.orderData.pricing.total}`);
      setEmail(state.orderData.email);
      setPaymentMethod(state.orderData.paymentOption === "before" ? "Credit Card" : "Cash on Delivery");
    }
  }, [searchParams, state, navigate, defaultAmount, defaultEmail]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/");
    }
  }, [countdown, navigate]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto text-center max-w-7xl">
        <Loader2 className="w-8 h-8 mx-auto text-green-600 animate-spin" />
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-green-50 to-white">
      <div className="w-full max-w-md overflow-hidden bg-white shadow-xl rounded-2xl">
        <div className="p-6 text-center bg-green-500">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white rounded-full"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-white"
          >
            Payment Successful!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-1 text-green-100"
          >
            Your order has been processed successfully
          </motion.p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500">Order Number</span>
              <button
                onClick={copyOrderNumber}
                className="flex items-center text-xs text-gray-500 transition-colors hover:text-gray-700"
                aria-label={copied ? "Order number copied" : "Copy order number"}
              >
                <Copy className="w-3 h-3 mr-1" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="text-lg font-semibold text-gray-800">{orderNumber}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="mb-1 text-sm text-gray-500">Amount Paid</div>
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

          {orderDetails?.cartItems && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-gray-700">Ordered Items</h3>
              <ul className="space-y-4">
                {orderDetails.cartItems.map((item) => (
                  <li key={item.productId} className="flex items-center gap-4">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-12 h-12 rounded"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {orderDetails?.pricing && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-gray-700">Pricing Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">${orderDetails.pricing.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-800">${orderDetails.pricing.tax}</span>
                </div>
                {orderDetails.pricing.discount !== "0.00" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount ({orderDetails.couponCode})</span>
                    <span className="font-medium text-green-600">-${orderDetails.pricing.discount}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-medium text-gray-800">Total</span>
                  <span className="font-semibold text-gray-800">${orderDetails.pricing.total}</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 space-y-4 border-t border-gray-100">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-between"
            >
              <span className="text-gray-600">
                A confirmation email has been sent to <span className="font-medium">{email}</span>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to={`/order-details/${orderNumber}`}
                className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
                aria-label="View order details"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                View Order Details
              </Link>
              <Link
                to="/download-receipt"
                className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                aria-label="Download receipt"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
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
          Need help with your order?{" "}
          <Link to="/support" className="text-green-600 transition-colors hover:text-green-700">
            Contact Support
          </Link>
        </p>
      </motion.div>
    </div>
  );
}