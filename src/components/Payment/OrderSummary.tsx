import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";

import { Loader2 } from "lucide-react";
import { calculatePricing } from "@/utils/pricingUtils";
import ImageWithFallback from "../Reuseable/ImageWithFallback";

interface OrderSummaryProps {
  couponCode: string;
  setCouponCode: (code: string) => void;
  couponApplied: boolean;
  couponLoading: boolean;
  handleApplyCoupon: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  couponCode,
  setCouponCode,
  couponApplied,
  couponLoading,
  handleApplyCoupon,
}) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const discount = useSelector((state: RootState) => state.cart.discount);
  const pricing = calculatePricing(cartItems, discount);

  return (
    <motion.div
      className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Order Summary</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <ul className="mb-4 space-y-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center gap-4">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-12 h-12 rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={couponLoading}
                aria-label="Coupon code"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={couponLoading}
                className="px-4 py-2 font-medium text-white bg-orange-500 rounded-r-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label={couponApplied ? "Coupon applied" : "Apply coupon"}
              >
                {couponLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : couponApplied ? (
                  "Applied"
                ) : (
                  "Apply"
                )}
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-800">${pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-800">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-800">${pricing.tax.toFixed(2)}</span>
              </div>
              {pricing.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">-${pricing.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-medium text-gray-800">Total</span>
                <span className="font-semibold text-gray-800">${pricing.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default OrderSummary;