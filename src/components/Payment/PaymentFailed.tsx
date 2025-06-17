"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { XCircle, AlertTriangle, RefreshCw, Home, HelpCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Link } from "react-router-dom"

interface PaymentFailedProps {
  orderNumber?: string
  amount?: string
  date?: string
  email?: string
  paymentMethod?: string
  errorCode?: string
  errorMessage?: string
}

export default function PaymentFailed({
  orderNumber = "ORD-7829354",
  amount = "$249.99",
  date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  email = "customer@example.com",
  paymentMethod = "Visa •••• 4242",
  errorCode = "ERR_PAYMENT_DECLINED",
  errorMessage = "Your payment was declined by your bank. Please try a different payment method or contact your bank for more information.",
}: PaymentFailedProps) {
  const [showDetails, setShowDetails] = useState(false)

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
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-red-50 to-white">
      <div className="w-full max-w-md overflow-hidden bg-white shadow-xl rounded-2xl">
        {/* Failed Header */}
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

        {/* Error Details */}
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
              <div className="mb-1 text-sm text-gray-500">Amount</div>
              <div className="text-lg font-semibold text-gray-800">{amount}</div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">Date</div>
              <div className="text-gray-800">{date}</div>
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

          {/* Common Issues Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-6"
          >
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-between w-full py-3 text-left border-t border-b border-gray-100"
            >
              <span className="font-medium text-gray-800">Common reasons for payment failure</span>
              {showDetails ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {showDetails && (
              <div className="pt-3 pb-1 text-sm">
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
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Link>
              <Link
                to="/checkout/payment-methods"
                className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Change Payment Method
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900">
              <Home className="w-4 h-4 mr-1" />
              Return to Home
            </Link>
            <Link
              to="/support"
              className="flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              Get Help
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Information */}
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
  )
}
