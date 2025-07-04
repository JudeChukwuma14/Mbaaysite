// src/components/OrderSummary.tsx
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
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
}) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const discount = useSelector((state: RootState) => state.cart.discount);
  const pricing = calculatePricing(cartItems, discount);


  // Validate pricing to prevent NaN display
  const isValidPricing = Object.values(pricing).every(
    (value) => !isNaN(Number(value)) && Number(value) >= 0
  );

  if (!isValidPricing) {
    console.error("Invalid pricing data:", pricing);
    return (
      <motion.div
        className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Order Summary</h2>
        <p className="text-red-600">Error: Invalid pricing data. Please refresh or contact support.</p>
      </motion.div>
    );
  }

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
            {cartItems.map((item) => {
              const price = Number(item.price);
              const quantity = Number(item.quantity);
              if (isNaN(price) || isNaN(quantity)) {
                console.warn("Invalid cart item:", item);
                return null;
              }
              return (
                <li key={item.id} className="flex items-center gap-4">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-12 h-12 rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      ₦{price.toFixed(2)} x {quantity} = ₦{(price * quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-800">₦{pricing.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mbaay’s Commission (10%)</span>
                <span className="font-medium text-gray-800">₦{pricing.commission}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-800">₦{pricing.tax}</span>
              </div>
              {Number(pricing.discount) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount ({couponCode})</span>
                  <span className="font-medium text-green-600">-₦{pricing.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-800">Free</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-medium text-gray-800">Total</span>
                <span className="font-semibold text-gray-800">₦{pricing.total}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default OrderSummary;