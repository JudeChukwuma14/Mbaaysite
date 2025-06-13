// src/components/OrderSummary.tsx
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface OrderSummaryProps {
  couponCode: string;
  setCouponCode: (code: string) => void;
  couponApplied: boolean;
  couponLoading: boolean;
  handleApplyCoupon: () => void;
}


export default function OrderSummary({
  couponCode,
  setCouponCode,
  couponApplied,
  couponLoading,
  handleApplyCoupon,
}: OrderSummaryProps) {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = 0; // Free shipping as in Cart
  const tax = subtotal * 0.085; // 8.5% tax
  const discount = couponApplied ? subtotal * 0.1 : 0; // 10% for SUMMER10
  const total = subtotal + shipping + tax - discount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="sticky p-8 bg-white border border-gray-100 shadow-lg rounded-2xl top-8"
    >
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Order Summary</h2>

      <div className="space-y-6">
        {/* Product Details */}
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-sm text-gray-600">No items in cart</p>
          ) : (
            cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.jpg";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </motion.div>
            ))
          )}
        </div>

        {/* Price Breakdown */}
        <div className="pt-4 space-y-3 border-t border-gray-200">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax (8.5%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          {couponApplied && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between font-medium text-green-600"
            >
              <span>Coupon (SUMMER10)</span>
              <span>-${discount.toFixed(2)}</span>
            </motion.div>
          )}
        </div>

        {/* Total */}
        <div className="pt-4 border-t-2 border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-orange-600">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Coupon Code */}
        <div className="pt-6 space-y-3 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700">Have a coupon code?</label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 p-3 transition-all duration-200 border-2 border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white"
              disabled={couponApplied || couponLoading}
            />
            <motion.button
              onClick={handleApplyCoupon}
              disabled={couponLoading || couponApplied || !couponCode}
              className="px-6 py-3 text-sm font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              whileHover={{ scale: couponLoading || couponApplied ? 1 : 1.05 }}
              whileTap={{ scale: couponLoading || couponApplied ? 1 : 0.95 }}
            >
              {couponLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : couponApplied ? (
                "Applied"
              ) : (
                "Apply"
              )}
            </motion.button>
          </div>
          {!couponApplied && (
            <p className="text-xs text-gray-500">Try "SUMMER10" for a 10% discount</p>
          )}
        </div>

        {/* Security Badge */}
        <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Secure Checkout</p>
              <p className="text-xs text-green-600">Your payment is protected</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}