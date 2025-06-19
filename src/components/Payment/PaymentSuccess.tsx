// src/components/PaymentSuccess.tsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Download, Home, Copy } from "lucide-react";
import { jsPDF } from "jspdf";
import { OrderData } from "@/utils/orderApi";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

interface LocationState {
  orderId: string;
  orderData: OrderData;
}

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location as { state: LocationState };
  const { orderId, orderData } = state || {};
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(5);

  console.log("PaymentSuccess state:", {
    orderId,
    orderData: JSON.stringify(orderData, null, 2),
  });

  // Fallback if state or required data is missing
  if (
    !orderId ||
    !orderData ||
    !orderData.pricing ||
    !orderData.pricing.total ||
    !orderData.cartItems ||
    orderData.cartItems.length === 0 ||
    !orderData.first_name ||
    !orderData.email ||
    !orderData.address ||
    !orderData.paymentOption
  ) {
    console.error("Invalid state in PaymentSuccess:", {
      orderId,
      hasOrderData: !!orderData,
      hasPricing: !!orderData?.pricing,
      hasTotal: !!orderData?.pricing?.total,
      hasCartItems: !!orderData?.cartItems,
      cartItemsLength: orderData?.cartItems?.length,
      hasFirstName: !!orderData?.first_name,
      hasEmail: !!orderData?.email,
      hasAddress: !!orderData?.address,
      hasPaymentOption: !!orderData?.paymentOption,
    });
    return (
      <div className="container px-4 py-8 mx-auto text-center max-w-7xl">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-4 text-gray-600">Order information is missing. Please contact support.</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Return to Home
        </Button>
      </div>
    );
  }

  const { cartItems, pricing, first_name, last_name, email, address, paymentOption } = orderData;

  // Countdown redirect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/");
    }
  }, [countdown, navigate]);

  // Copy order number
  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate and download PDF
  const downloadReceipt = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Order Receipt - Order ID: ${orderId}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Customer: ${first_name} ${last_name}`, 20, 30);
    doc.text(`Email: ${email}`, 20, 40);
    doc.text(`Address: ${address}`, 20, 50);
    doc.text(`Payment Option: ${paymentOption}`, 20, 60);
    doc.text("Items:", 20, 70);

    let yPos = 80;
    cartItems.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`,
        20,
        yPos
      );
      yPos += 10;
    });

    yPos += 10;
    doc.text(`Subtotal: $${pricing.subtotal}`, 20, yPos);
    doc.text(`Tax: $${pricing.tax}`, 20, yPos + 10);
    doc.text(`Discount: -$${pricing.discount}`, 20, yPos + 20);
    doc.text(`Commission: $${pricing.commission}`, 20, yPos + 30);
    doc.text(`Total: $${pricing.total}`, 20, yPos + 40);

    doc.save(`order_${orderId}_receipt.pdf`);
  };

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
            <div className="text-lg font-semibold text-gray-800">{orderId}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="mb-1 text-sm text-gray-500">Amount Paid</div>
              <div className="text-lg font-semibold text-gray-800">${pricing.total}</div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">Date</div>
              <div className="text-gray-800">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">Email</div>
              <div className="text-gray-800 truncate">{email}</div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">Payment Method</div>
              <div className="text-gray-800">
                {paymentOption === "Pay Before Delivery" ? "Credit Card" : "Cash on Delivery"}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-gray-700">Purchased Items</h3>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.productId} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded" />
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

          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-gray-700">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-800">${pricing.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-800">${pricing.tax}</span>
              </div>
              {pricing.discount !== "0.00" && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">-${pricing.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Mbaay Commission</span>
                <span className="font-medium text-gray-800">${pricing.commission}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-medium text-gray-800">Total Paid</span>
                <span className="font-semibold text-gray-800">${pricing.total}</span>
              </div>
            </div>
          </div>

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
                to={`/order-details/${orderId}`}
                className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
              >
                View Order Details
              </Link>
              <Button
                onClick={downloadReceipt}
                className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900"
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