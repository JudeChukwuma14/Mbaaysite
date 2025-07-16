import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import { calculatePricing } from "@/utils/pricingUtils";
import { getCurrencySymbol, convertPrice } from "@/utils/currencyCoverter";
import ImageWithFallback from "../Reuseable/ImageWithFallback";

interface OrderSummaryProps {
  couponCode: string;
  setCouponCode: (code: string) => void;
  couponApplied: boolean;
  couponLoading: boolean;
  handleApplyCoupon: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ couponCode }) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const discount = useSelector((state: RootState) => state.cart.discount);
  const currency = useSelector((state: RootState) => state.settings.currency || "NGN");

  // Use useEffect to handle async calculatePricing
  const [pricing, setPricing] = React.useState({
    subtotal: "0.00",
    shipping: "0.00",
    tax: "0.00",
    discount: "0.00",
    total: "0.00",
  });

  React.useEffect(() => {
    const fetchPricing = async () => {
      const pricingData = await calculatePricing(cartItems, discount, currency);
      setPricing(pricingData);
    };
    fetchPricing();
  }, [cartItems, discount, currency]);

  // Validate pricing to prevent NaN display
  const isValidPricing = Object.values(pricing).every(
    (value) => !isNaN(Number(value)) && Number(value) >= 0
  );

  const currencySymbol = getCurrencySymbol(currency);

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
      className="w-full max-w-md p-6 bg-white border border-gray-100 shadow-lg rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Order Summary</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <ul className="mb-6 space-y-4">
            {cartItems.map((item) => {
              const priceNGN = Number(item.price);
              const quantity = Number(item.quantity);
              if (isNaN(priceNGN) || isNaN(quantity)) {
                console.warn("Invalid cart item:", item);
                return null;
              }
              const price = convertPrice(priceNGN, "NGN", currency);
              return (
                <li key={item.id} className="flex items-start gap-4">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="flex-shrink-0 object-cover w-12 h-12 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {currencySymbol}{price.toFixed(2)} x {quantity} = {currencySymbol}{(price * quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-800">{currencySymbol}{Number(pricing.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-800">{currencySymbol}{Number(pricing.tax).toFixed(2)}</span>
              </div>
              {Number(pricing.discount) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount ({couponCode})</span>
                  <span className="font-medium text-green-600">-{currencySymbol}{Number(pricing.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-800">Free</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-semibold text-gray-800">{currencySymbol}{Number(pricing.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default OrderSummary;