"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Download, Home, ShoppingBag, Copy } from "lucide-react"
import { Link } from "react-router-dom"


interface PaymentSuccessProps {
  orderNumber?: string
  amount?: string
  date?: string
  email?: string
  paymentMethod?: string
  items?: number
}

export default function PaymentSuccess({
  orderNumber = "ORD-7829354",
  amount = "$249.99",
  date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  email = "customer@example.com",
  paymentMethod = "Visa •••• 4242",
}: PaymentSuccessProps) {
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState(5)

  // Simulate a redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-green-50 to-white">
      <div className="w-full max-w-md overflow-hidden bg-white shadow-xl rounded-2xl">
        {/* Success Header */}
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

        {/* Order Details */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500">Order Number</span>
              <button
                onClick={copyOrderNumber}
                className="flex items-center text-xs text-gray-500 transition-colors hover:text-gray-700"
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
                to="/order-details"
                className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                View Order Details
              </Link>
              <Link
                to="/download-receipt"
                className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
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
            <div className="text-sm text-gray-500">
              Redirecting in <span className="font-medium">{countdown}s</span>
            </div>
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
          Need help with your order?{" "}
          <Link to="/support" className="text-green-600 transition-colors hover:text-green-700">
            Contact Support
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
