import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  removeItem,
  setCartItems,
  updateQuantity,
} from "@/redux/slices/cartSlice";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getCart, removeFromCart, updateCartQuantity } from "@/utils/cartApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { calculatePricing } from "@/utils/pricingUtils";
import {
  convertPrice,
  formatPrice,
  getCurrencySymbol,
} from "@/utils/currencyCoverter";
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaArrowLeft,
  FaSyncAlt,
  FaShoppingCart,
} from "react-icons/fa";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  inventory: number; // Changed from stock to inventory
}

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  const user = useSelector((state: RootState) => state.user.user);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const currency = useSelector(
    (state: RootState) => state.settings.currency || "NGN"
  );
  const discount = useSelector((state: RootState) => state.cart.discount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [couponCode, setCouponCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [pricing, setPricing] = useState({
    subtotal: "0.00",
    shipping: "0.00",
    tax: "0.00",
    discount: "0.00",
    total: "0.00",
  });

  // Fetch cart items and pricing
  useEffect(() => {
    const fetchCartAndPricing = async () => {
      if (!sessionId) {
        toast.error(t("sessionError"));
        return;
      }
      setIsLoading(true);
      try {
        const items = await getCart(sessionId);
        if (!items || !Array.isArray(items)) {
          toast.error(t("noItems"));
          dispatch(setCartItems([]));
          setPricing({
            subtotal: "0.00",
            shipping: "0.00",
            tax: "0.00",
            discount: "0.00",
            total: "0.00",
          });
          return;
        }

        // Map items with inventory information
        const mappedItems: CartItem[] = items.map((item: any) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image:
            item.product.images?.[0] ||
            item.product.poster ||
            "/placeholder.jpg",
          inventory: item.product.inventory || 0, // Use inventory from API response
        }));

        dispatch(setCartItems(mappedItems));

        // Calculate pricing
        const pricingData = await calculatePricing(
          mappedItems,
          discount,
          currency
        );
        setPricing(pricingData);
      } catch (error) {
        toast.error(t("loadError"));
        dispatch(setCartItems([]));
        setPricing({
          subtotal: "0.00",
          shipping: "0.00",
          tax: "0.00",
          discount: "0.00",
          total: "0.00",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCartAndPricing();
  }, [dispatch, sessionId, t, discount, currency]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (isNaN(newQuantity) || newQuantity < 1) {
      toast.error(t("invalidQuantity"));
      return;
    }

    const item = cartItems.find((item) => item.id === itemId) as CartItem;
    if (item && newQuantity > item.inventory) {
      toast.error(t("insufficientStock"));
      return;
    }

    if (!sessionId) {
      toast.error(t("sessionError"));
      return;
    }

    setUpdatingItems((prev) => new Set(prev).add(itemId));

    try {
      await updateCartQuantity(sessionId, itemId, newQuantity);
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
      // Recalculate pricing after quantity update
      const updatedItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      const pricingData = await calculatePricing(
        updatedItems,
        discount,
        currency
      );
      setPricing(pricingData);
    } catch (error) {
      toast.error(t("updateError"));
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = cartItems.find((item) => item.id === itemId) as CartItem;
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    handleUpdateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!sessionId) {
      toast.error(t("sessionError"));
      return;
    }

    try {
      await removeFromCart(sessionId, itemId);
      dispatch(removeItem(itemId));
      const removedItem = cartItems.find((item) => item.id === itemId);
      toast.success(
        t("removeSuccess", { name: removedItem ? removedItem.name : "Item" })
      );
      // Recalculate pricing after item removal
      const updatedItems = cartItems.filter((item) => item.id !== itemId);
      const pricingData = await calculatePricing(
        updatedItems,
        discount,
        currency
      );
      setPricing(pricingData);
    } catch (error) {
      toast.error(t("removeError"));
    }
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
  };

  const handleUpdateCart = async () => {
    if (!sessionId) {
      toast.error(t("sessionError"));
      return;
    }
    setIsLoading(true);
    try {
      const items = await getCart(sessionId);
      if (!items || !Array.isArray(items)) {
        toast.error(t("noItems"));
        dispatch(setCartItems([]));
        return;
      }
      const mappedItems: CartItem[] = items.map((item: any) => ({
        id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image:
          item.product.images?.[0] || item.product.poster || "/placeholder.jpg",
        inventory: item.product.inventory || 0,
      }));
      dispatch(setCartItems(mappedItems));
      const pricingData = await calculatePricing(
        mappedItems,
        discount,
        currency
      );
      setPricing(pricingData);
      toast.success(t("cartUpdated"));
    } catch (error) {
      toast.error(t("updateError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    const isAuthenticated = !!user || !!vendor;
    if (!isAuthenticated) {
      toast.info(t("loginRequired"));
      navigate("/selectpath");
      return;
    }
    if (!sessionId) {
      toast.error(t("sessionError"));
      return;
    }
    navigate("/dashboard/checkout");
  };

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <motion.div
      className="container px-4 py-8 mx-auto max-w-7xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center">
        <motion.h1
          className="text-2xl font-bold text-gray-900 md:text-4xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {t("Shopping Cart")}
        </motion.h1>
        <motion.button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 transition-colors duration-200 hover:text-gray-900"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t("Continue Shopping")}</span>
          <span className="sm:hidden">{t("Back to Shop")}</span>
        </motion.button>
      </div>

      {isLoading && cartItems.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-600">{t("loading")}</p>
          </div>
        </div>
      ) : cartItems.length === 0 ? (
        <motion.div
          className="py-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FaShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            {t("Your cart is empty")}
          </h3>
          <p className="mb-6 text-gray-600">
            {t("Add some items to get started")}
          </p>
          <motion.button
            onClick={() => navigate("/shop")}
            className="px-6 py-3 font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("Start Shopping")}
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items Section */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Cart Header */}
              <div className="px-4 py-4 border-b border-gray-200 sm:px-6">
                <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("Cart Items")} ({cartItems.length})
                  </h2>
                  <motion.button
                    onClick={handleUpdateCart}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 transition-colors duration-200 hover:text-gray-900 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaSyncAlt
                      className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`}
                    />
                    {t("Refresh")}
                  </motion.button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const cartItem = item as CartItem;
                  const convertedPrice = convertPrice(
                    item.price,
                    "NGN",
                    currency
                  );
                  const isUpdating = updatingItems.has(item.id);
                  const isMaxQuantity = cartItem.quantity >= cartItem.inventory;
                  const lowStock =
                    cartItem.inventory <= 5 && cartItem.inventory > 0;

                  return (
                    <motion.div
                      key={item.id}
                      className="flex flex-col p-4 sm:flex-row sm:items-center sm:p-6"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Product Image and Details */}
                      <div className="flex items-start flex-1 mb-4 space-x-4 sm:mb-0">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-full h-full rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.jpg";
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-lg font-semibold text-orange-600">
                            {currencySymbol}
                            {formatPrice(Number(convertedPrice))}
                          </p>

                          {/* Stock Information */}
                          <div className="mt-1 space-y-1">
                            {isMaxQuantity && (
                              <p className="text-xs text-red-600">
                                {t("Maximum quantity reached")} (
                                {cartItem.inventory})
                              </p>
                            )}
                            {lowStock && !isMaxQuantity && (
                              <p className="text-xs text-yellow-600">
                                {t("Only")} {cartItem.inventory}{" "}
                                {t("left in stock")}
                              </p>
                            )}
                            {cartItem.inventory === 0 && (
                              <p className="text-xs text-red-600">
                                {t("Out of stock")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls and Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center">
                          <motion.button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1 || isUpdating}
                            className="flex items-center justify-center w-8 h-8 text-gray-600 border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed sm:w-10 sm:h-10"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaMinus className="w-3 h-3" />
                          </motion.button>

                          <div className="flex items-center justify-center w-12 h-8 border-t border-b border-gray-300 sm:h-10">
                            {isUpdating ? (
                              <div className="w-4 h-4 border-2 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
                            ) : (
                              <span className="font-medium">
                                {item.quantity}
                              </span>
                            )}
                          </div>

                          <motion.button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            disabled={
                              isMaxQuantity ||
                              isUpdating ||
                              cartItem.inventory === 0
                            }
                            className="flex items-center justify-center w-8 h-8 text-gray-600 border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed sm:w-10 sm:h-10"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaPlus className="w-3 h-3" />
                          </motion.button>
                        </div>

                        {/* Subtotal and Remove */}
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              {currencySymbol}
                              {formatPrice(
                                Number(convertedPrice) * item.quantity
                              )}
                            </p>
                          </div>
                          <motion.button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={isUpdating}
                          >
                            <FaTrash className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Coupon Section */}
            <motion.div
              className="p-4 mt-6 bg-white rounded-lg shadow-sm border border-gray-200 sm:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {t("Apply Coupon")}
              </h3>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={handleCouponChange}
                  placeholder={t("Enter coupon code")}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <motion.button
                  className="px-6 py-2 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  {t("Apply")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Order Summary - Responsive Sticky Behavior */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="sticky top-4">
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 sm:p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  {t("Order Summary")}
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("Subtotal")}</span>
                    <span className="font-medium">
                      {currencySymbol}
                      {pricing.subtotal}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("Shipping")}</span>
                    <span className="font-medium text-green-600">
                      {t("Free")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("Tax")}</span>
                    <span className="font-medium">
                      {currencySymbol}
                      {pricing.tax}
                    </span>
                  </div>

                  {Number(pricing.discount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("Discount")}</span>
                      <span className="font-medium text-green-600">
                        -{currencySymbol}
                        {pricing.discount}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>{t("Total")}</span>
                      <span className="text-orange-600">
                        {currencySymbol}
                        {pricing.total}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleCheckout}
                  disabled={isLoading || cartItems.length === 0}
                  className="w-full py-3 mt-6 font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      {t("Processing...")}
                    </div>
                  ) : (
                    t("Proceed to Checkout")
                  )}
                </motion.button>

                <motion.button
                  onClick={() => navigate("/shop")}
                  className="w-full py-3 mt-3 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t("Continue Shopping")}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
