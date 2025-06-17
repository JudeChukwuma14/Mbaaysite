// src/components/Cart.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { removeItem, setCartItems, updateQuantity } from "@/redux/slices/cartSlice";
import { motion } from "framer-motion";
import { getSessionId } from "@/utils/session";
import { toast } from "react-toastify";
import { getCart, removeFromCart, updateCartQuantity } from "@/utils/cartApi";
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
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    const fetchCart = async () => {
      const sessionId = getSessionId();
      console.log(sessionId)
      try {
        const items = await getCart(sessionId);
        console.log("...Cart", items)
        if (!items || !Array.isArray(items)) {
          toast.error("No cart items found.");
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
      } catch (error) {
        toast.error("Failed to load cart. Please try again.");
        dispatch(setCartItems([]));
      }
    };
    fetchCart();
  }, [dispatch]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (isNaN(newQuantity) || newQuantity < 1) {
      toast.error("Please enter a valid quantity (1 or more).");
      return;
    }
    const sessionId = getSessionId();
    try {
      await updateCartQuantity(sessionId, itemId, newQuantity);
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    } catch (error) {
      toast.error("Failed to update quantity. Please try again.");
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    const sessionId = getSessionId();
    try {
      await removeFromCart(sessionId, itemId);
      dispatch(removeItem(itemId));
      const removedItem = cartItems.find(item => item.id === itemId);
      toast.success(`${removedItem ? removedItem.name : "Item"} removed from cart!`);
    } catch (error) {
      toast.error("Failed to remove item. Please try again.");
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
  };

  const applyCoupon = () => {
    if (couponCode === "SUMMER10") {
      setDiscount(0.1);
      alert("Coupon applied! 10% off");
    } else {
      setDiscount(0);
      alert("Invalid coupon code.");
    }
  };

  const subtotal = calculateSubtotal();
  const shipping = 0;
  const total = (subtotal + shipping) * (1 - discount);

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
        Shopping Cart
      </motion.h1>
      {cartItems.length === 0 ? (
        <motion.p
          className="py-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Your cart is empty.
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
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Subtotal</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
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
                  <td className="px-4 py-2">${item.price}</td>
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
                  <td className="px-4 py-2">${item.price * item.quantity}</td>
                  <td className="px-4 py-2">
                    <motion.button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Remove
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
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
        >
          Return To Shop
        </motion.button>
        <motion.button
          className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded hover:bg-orange-700 sm:w-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Update Cart
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
            placeholder="Coupon Code"
            className="flex-grow px-3 py-2 border border-gray-300 rounded"
            whileFocus={{ scale: 1.02 }}
          />
          <motion.button
            onClick={applyCoupon}
            className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded hover:bg-orange-700 sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Apply Coupon
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
          Cart Total
        </motion.h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping:</span>
          <span>${shipping}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${total}</span>
        </div>
        <Link to="/checkout">
          <button
            className="w-full px-4 py-2 mt-4 font-bold text-white bg-orange-500 rounded hover:bg-orange-700"
          >
            Proceed to Checkout
          </button></Link>
      </motion.div>
    </motion.div>
  );
};

export default Cart;