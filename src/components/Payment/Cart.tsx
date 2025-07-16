import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { removeItem, setCartItems, updateQuantity } from "@/redux/slices/cartSlice";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getCart, removeFromCart, updateCartQuantity } from "@/utils/cartApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { calculatePricing } from "@/utils/pricingUtils";
import { convertPrice, getCurrencySymbol } from "@/utils/currencyCoverter";

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
        const mappedItems: CartItem[] = items.map((item: any) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0] || item.product.poster || "/placeholder.jpg",
        }));
        dispatch(setCartItems(mappedItems));

        // Calculate pricing
        const pricingData = await calculatePricing(mappedItems, discount, currency);
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
    if (!sessionId) {
      toast.error(t("sessionError"));
      return;
    }

    try {
      await updateCartQuantity(sessionId, itemId, newQuantity);
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
      // Recalculate pricing after quantity update
      const pricingData = await calculatePricing(cartItems, discount, currency);
      setPricing(pricingData);
    } catch (error) {
      toast.error(t("updateError"));
    }
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
      toast.success(t("removeSuccess", { name: removedItem ? removedItem.name : "Item" }));
      // Recalculate pricing after item removal
      const updatedItems = cartItems.filter((item) => item.id !== itemId);
      const pricingData = await calculatePricing(updatedItems, discount, currency);
      setPricing(pricingData);
    } catch (error) {
      toast.error(t("removeError"));
    }
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
  };

  // const applyCoupon = async () => {
  //   if (couponCode === "SUMMER10") {
  //     dispatch(setDiscount(0.1));
  //     toast.success(t("couponApplied"));
  //     // Recalculate pricing with new discount
  //     const pricingData = await calculatePricing(cartItems, 0.1, currency);
  //     setPricing(pricingData);
  //   } else {
  //     dispatch(setDiscount(0));
  //     toast.error(t("invalidCoupon"));
  //     // Recalculate pricing without discount
  //     const pricingData = await calculatePricing(cartItems, 0, currency);
  //     setPricing(pricingData);
  //   }
  // };

  const handleUpdateCart = async () => {
    if (!sessionId) {
      toast.error(t("sessionError"));
      return;
    }
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
        image: item.product.images[0] || item.product.poster || "/placeholder.jpg",
      }));
      dispatch(setCartItems(mappedItems));
      const pricingData = await calculatePricing(mappedItems, discount, currency);
      setPricing(pricingData);
      toast.success(t("cartUpdated"));
    } catch (error) {
      toast.error(t("updateError"));
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
      className="container px-4 py-8 mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="mb-4 text-3xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {t("Shopping Cart")}
      </motion.h1>
      {isLoading ? (
        <motion.p
          className="py-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {t("loading")}
        </motion.p>
      ) : cartItems.length === 0 ? (
        <motion.p
          className="py-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {t("empty")}
        </motion.p>
      ) : (
        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">{t("product")}</th>
                <th className="px-4 py-2 text-left">{t("price")}</th>
                <th className="px-4 py-2 text-left">{t("quantity")}</th>
                <th className="px-4 py-2 text-left">{t("subtotal")}</th>
                <th className="px-4 py-2 text-left">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => {
                const convertedPrice = convertPrice(item.price, "NGN", currency);
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="flex items-center px-4 py-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-16 h-16 mr-4"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />
                      <span className="truncate">{item.name}</span>
                    </td>
                    <td className="px-4 py-2">
                      {currencySymbol}{Number(convertedPrice).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <motion.input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                        className="w-12 text-center border border-gray-300 rounded"
                        whileFocus={{ scale: 1.1 }}
                      />
                    </td>
                    <td className="px-4 py-2">
                      {currencySymbol}{(convertedPrice * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <motion.button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {t("Remove")}
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      )}
      <motion.div
        className="flex flex-col justify-between gap-4 mt-4 sm:flex-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.button
          className="w-full px-4 py-2 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400 sm:w-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/shop")} // Assuming a shop page exists
        >
          {t("Return To Shop")}
        </motion.button>
        <motion.button
          className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded hover:bg-orange-700 sm:w-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUpdateCart}
          disabled={isLoading}
        >
          {t("Update Cart")}
        </motion.button>
      </motion.div>
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <motion.input
            type="text"
            value={couponCode}
            onChange={handleCouponChange}
            placeholder={t("Coupon")}
            className="flex-grow px-3 py-2 border border-gray-300 rounded"
            whileFocus={{ scale: 1.02 }}
            disabled={isLoading}
          />
          <motion.button
            // onClick={applyCoupon}
            className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded hover:bg-orange-700 sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {t("Apply Coupon")}
          </motion.button>
        </div>
      </motion.div>
      <motion.div
        className="p-4 mt-8 bg-gray-100 rounded"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.h2
          className="mb-2 text-xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {t("total")}
        </motion.h2>
        <div className="flex justify-between mb-2">
          <span>{t("subtotal")}</span>
          <span>{currencySymbol}{pricing.subtotal}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>{t("tax")}</span>
          <span>{currencySymbol}{pricing.tax}</span>
        </div>
        {Number(pricing.discount) > 0 && (
          <div className="flex justify-between mb-2">
            <span>{t("discount")} ({couponCode})</span>
            <span className="text-green-600">-{currencySymbol}{pricing.discount}</span>
          </div>
        )}
        <div className="flex justify-between mb-2">
          <span>{t("shipping")}</span>
          <span>{t("free")}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>{t("total")}</span>
          <span>{currencySymbol}{pricing.total}</span>
        </div>
        <motion.button
          onClick={handleCheckout}
          className="w-full px-4 py-2 mt-4 font-bold text-white bg-orange-500 rounded hover:bg-orange-700"
          disabled={isLoading || cartItems.length === 0}
        >
          {t("Checkout")}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Cart;