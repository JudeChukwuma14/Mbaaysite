import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { removeItem, updateQuantity } from "@/redux/slices/cartSlice";
import { motion } from "framer-motion";

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  console.log(cartItems)
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeItem(itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
  };

  const applyCoupon = () => {
    if (couponCode === "SUMMER10") {
      setDiscount(0.1); // 10% discount
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>

      {/* Responsive table wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Product</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Subtotal</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover mr-4"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                  <span className="truncate">{item.name}</span>
                </td>
                <td className="py-2 px-4">${item.price}</td>
                <td className="py-2 px-4">
                  <motion.input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateQuantity(item.id, parseInt(e.target.value, 10))
                    }
                    className="w-12 text-center border border-gray-300 rounded"
                  />
                </td>
                <td className="py-2 px-4">${item.price * item.quantity}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between gap-4">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded w-full sm:w-auto">
          Return To Shop
        </button>
        <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto">
          Update Cart
        </button>
      </div>

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            value={couponCode}
            onChange={handleCouponChange}
            placeholder="Coupon Code"
            className="border border-gray-300 rounded px-3 py-2 flex-grow"
          />
          <button
            onClick={applyCoupon}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          >
            Apply Coupon
          </button>
        </div>
      </div>

      <div className="mt-8 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Cart Total</h2>
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
        <button className="mt-4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-full">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;