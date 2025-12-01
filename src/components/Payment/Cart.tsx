import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { removeItem, setCartItems, updateQuantity } from "@/redux/slices/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { getCart, removeFromCart, updateCartQuantity } from "@/utils/cartApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { calculatePricing } from "@/utils/pricingUtils";
import { convertPrice, formatPrice, getCurrencySymbol } from "@/utils/currencyCoverter";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft,
  Tag,
  Truck,
  Shield,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  const user = useSelector((state: RootState) => state.user.user);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const currency = useSelector((state: RootState) => state.settings.currency || "NGN");
  const discount = useSelector((state: RootState) => state.cart.discount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [couponCode, setCouponCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [pricing, setPricing] = useState({
    subtotal: "0.00",
    shipping: "0.00",
    tax: "0.00",
    discount: "0.00",
    total: "0.00",
  });

  // Function to recalculate pricing
  const recalculatePricing = useCallback(async (items: CartItem[]) => {
    try {
      const pricingData = await calculatePricing(items, discount, currency);
      setPricing(pricingData);
    } catch (error) {
      console.error("Error calculating pricing:", error);
      // Fallback to manual calculation if API fails
      const subtotal = items.reduce((sum, item) => {
        const convertedPrice = convertPrice(item.price, "NGN", currency);
        return sum + (Number(convertedPrice) * item.quantity);
      }, 0);
      
      // Simple fallback calculation (adjust based on your business logic)
      const tax = subtotal * 0.1; // 10% tax example
      const shipping = 0; // Free shipping
      const discountAmount = subtotal * discount;
      const total = subtotal + tax + shipping - discountAmount;
      
      setPricing({
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        discount: discountAmount.toFixed(2),
        total: total.toFixed(2),
      });
    }
  }, [discount, currency]);

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
          await recalculatePricing([]);
          return;
        }
        const mappedItems: CartItem[] = items.map((item: any) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0] || item.product.poster || "/placeholder.jpg",
        }));
        dispatch(setCartItems(mappedItems));
        await recalculatePricing(mappedItems);
      } catch (error) {
        toast.error(t("loadError"));
        dispatch(setCartItems([]));
        await recalculatePricing([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCartAndPricing();
  }, [dispatch, sessionId, t, discount, currency, recalculatePricing]);

  // Update pricing whenever cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      recalculatePricing(cartItems);
    }
  }, [cartItems, recalculatePricing]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (isNaN(newQuantity) || newQuantity < 1) {
      toast.error(t("invalidQuantity"));
      return;
    }
    if (!sessionId) {
      toast.error(t("sessionError"));
      return;
    }

    setIsUpdating(itemId);
    try {
      // Update on server
      await updateCartQuantity(sessionId, itemId, newQuantity);
      
      // Update in Redux store
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
      
      // No need to manually recalculate here - useEffect will handle it
      // when cartItems changes from the Redux update
    } catch (error) {
      toast.error(t("updateError"));
      // Revert to original quantity in UI by fetching fresh cart
      const freshItems = await getCart(sessionId);
      if (freshItems) {
        const mappedItems: CartItem[] = freshItems.map((item: any) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0] || item.product.poster || "/placeholder.jpg",
        }));
        dispatch(setCartItems(mappedItems));
      }
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!sessionId) {
      toast.error(t("sessionError"));
      return;
    }

    try {
      // Remove from server
      await removeFromCart(sessionId, itemId);
      
      // Remove from Redux store
      dispatch(removeItem(itemId));
      
      const removedItem = cartItems.find((item) => item.id === itemId);
      toast.success(t("removeSuccess", { name: removedItem ? removedItem.name : "Item" }));
      
      // No need to manually recalculate - useEffect handles it
    } catch (error) {
      toast.error(t("removeError"));
    }
  };

  const handleQuickQuantity = (itemId: string, change: number) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      handleUpdateQuantity(itemId, newQuantity);
    }
  };

  const handleRefreshCart = async () => {
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
        await recalculatePricing([]);
        return;
      }
      const mappedItems: CartItem[] = items.map((item: any) => ({
        id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || item.product.poster || "/placeholder.jpg",
      }));
      dispatch(setCartItems(mappedItems));
      await recalculatePricing(mappedItems);
      toast.success(t("Cart updated"));
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

  if (isLoading) {
    return (
      <div className="container px-4 py-16 mx-auto">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 mb-4 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin"></div>
          <p className="text-gray-600">{t("loadingCart")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{t("Your Cart")}</h1>
          <p className="mt-2 text-gray-600">
            {cartItems.length === 0 
              ? t("Your cart is currently empty") 
              : `${cartItems.length} ${t("item(s) in your cart")}`
            }
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="max-w-md mx-auto text-center">
            <div className="relative mb-6">
              <ShoppingBag className="w-24 h-24 mx-auto text-gray-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full"></div>
              </div>
            </div>
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">{t("Your cart is empty")}</h2>
            <p className="mb-8 text-gray-600">
              {t("Looks like you haven't added any products to your cart yet")}
            </p>
            <Link
              to="/random-product"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              {t("Continue Shopping")}
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">{t("Cart Items")}</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {cartItems.map((item) => {
                      const convertedPrice = convertPrice(item.price, "NGN", currency);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-6"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            {/* Product Image */}
                            <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden bg-gray-100 rounded-lg">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.jpg";
                                }}
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 line-clamp-2">
                                {item.name}
                              </h3>
                              <div className="flex items-center justify-between mt-3">
                                {/* Quantity Controls */}
                                <div className="flex items-center space-x-3">
                                  <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleQuickQuantity(item.id, -1)}
                                    disabled={isUpdating === item.id}
                                    className="flex items-center justify-center w-8 h-8 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </motion.button>
                                  
                                  <div className="min-w-[40px] text-center">
                                    {isUpdating === item.id ? (
                                      <div className="w-4 h-4 mx-auto border-2 border-t-orange-500 border-gray-200 rounded-full animate-spin"></div>
                                    ) : (
                                      <span className="font-medium">{item.quantity}</span>
                                    )}
                                  </div>

                                  <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleQuickQuantity(item.id, 1)}
                                    disabled={isUpdating === item.id}
                                    className="flex items-center justify-center w-8 h-8 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </motion.button>
                                </div>

                                {/* Price and Remove */}
                                <div className="flex items-center space-x-4">
                                  <div className="text-right">
                                    <p className="text-lg font-semibold text-gray-900">
                                      {currencySymbol}{formatPrice(Number(convertedPrice) * item.quantity)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {currencySymbol}{formatPrice(Number(convertedPrice))} {t("each")}
                                    </p>
                                  </div>
                                  
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-2 text-gray-400 transition-colors duration-200 rounded-lg hover:text-red-500 hover:bg-red-50"
                                    title={t("Remove item")}
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="flex items-center justify-between mt-6">
                <Link
                  to="/random-product"
                  className="inline-flex items-center px-6 py-3 text-gray-700 transition-colors duration-200 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  {t("Continue Shopping")}
                </Link>
                
                <button
                  onClick={handleRefreshCart}
                  className="inline-flex items-center px-6 py-3 text-gray-700 transition-colors duration-200 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  {t("Refresh Cart")}
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="p-6 bg-white border border-gray-200 rounded-xl">
                  <h2 className="mb-6 text-lg font-semibold text-gray-900">{t("Order Summary")}</h2>
                  
                  {/* Pricing Breakdown */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("Subtotal")}</span>
                      <span className="font-medium">{currencySymbol}{pricing.subtotal}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("Shipping")}</span>
                      <span className="font-medium text-green-600">{t("Free")}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("Tax")}</span>
                      <span className="font-medium">{currencySymbol}{pricing.tax}</span>
                    </div>
                    
                    {Number(pricing.discount) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t("Discount")}</span>
                        <span className="font-medium text-green-600">
                          -{currencySymbol}{pricing.discount}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Coupon Section */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <Tag className="w-5 h-5 mr-2 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{t("Have a coupon?")}</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder={t("Enter coupon code")}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <button className="px-4 py-2 font-medium text-white transition-colors duration-200 bg-gray-800 rounded-lg hover:bg-gray-900">
                        {t("Apply")}
                      </button>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="py-4 border-t border-b border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">{t("Total")}</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {currencySymbol}{pricing.total}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {t("Inclusive of all taxes")}
                    </p>
                  </div>
                  
                  {/* Checkout Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full py-4 mt-6 text-lg font-semibold text-white transition-colors duration-200 bg-orange-500 rounded-lg hover:bg-orange-600"
                  >
                    {t("Proceed to Checkout")}
                  </motion.button>
                  
                  {/* Trust Signals */}
                  <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                    <div className="p-3 rounded-lg bg-gray-50">
                      <Truck className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <p className="text-xs text-gray-600">{t("Free Shipping")}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <Shield className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <p className="text-xs text-gray-600">{t("Secure Payment")}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <RefreshCw className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <p className="text-xs text-gray-600">{t("Easy Returns")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Cart;