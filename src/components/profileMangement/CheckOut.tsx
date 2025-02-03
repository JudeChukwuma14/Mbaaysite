import React, { useState } from "react";
import { FaCreditCard,  FaMoneyBillWave } from "react-icons/fa";
import img from "@/assets/image/bg1.jpg"

const Checkout: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    companyName: "",
    streetAddress: "",
    apartment: "",
    city: "",
    phone: "",
    email: "",
    saveInfo: false,
    paymentMethod: "cash",
  });

  const [couponCode, setCouponCode] = useState<string>("");
  const [cartItems] = useState([
    { id: 1, name: "LCD Monitor", price: 650, image: img },
    { id: 2, name: "HI Gamepad", price: 1100, image: img },
  ]);

  const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCouponApply = () => {
    if (couponCode === "DISCOUNT10") {
      alert("Coupon applied successfully!");
    } else {
      alert("Invalid coupon code.");
    }
  };

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
  };

  return (
    <div className="container mx-auto p-4 lg:flex lg:space-x-8">
      {/* Billing Details */}
      <div className="w-full lg:w-2/3 bg-white p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">Billing Details</h2>
        <form className="space-y-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="First Name*"
            className="w-full border border-gray-300 rounded p-2"
          />
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Company Name"
            className="w-full border border-gray-300 rounded p-2"
          />
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleInputChange}
            placeholder="Street Address*"
            className="w-full border border-gray-300 rounded p-2"
          />
          <input
            type="text"
            name="apartment"
            value={formData.apartment}
            onChange={handleInputChange}
            placeholder="Apartment, floor, etc. (optional)"
            className="w-full border border-gray-300 rounded p-2"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Town/City*"
            className="w-full border border-gray-300 rounded p-2"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number*"
            className="w-full border border-gray-300 rounded p-2"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address*"
            className="w-full border border-gray-300 rounded p-2"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="saveInfo"
              checked={formData.saveInfo}
              onChange={handleInputChange}
              className="h-4 w-4"
            />
            <span>Save this information for faster checkout next time</span>
          </label>
        </form>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-1/3 bg-white p-6 rounded mt-8 lg:mt-0">
        <h2 className="text-2xl font-bold mb-4">Your Order</h2>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                <span>{item.name}</span>
              </div>
              <span>${item.price}</span>
            </div>
          ))}
          <hr className="border-t" />
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>${shipping}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="paymentMethod"
              value="bank"
              checked={formData.paymentMethod === "bank"}
              onChange={handleInputChange}
              className="h-4 w-4"
            />
            <span className="flex items-center space-x-2">
              <FaCreditCard />
              <span>Bank</span>
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={formData.paymentMethod === "cash"}
              onChange={handleInputChange}
              className="h-4 w-4"
            />
            <span className="flex items-center space-x-2">
              <FaMoneyBillWave />
              <span>Cash on Delivery</span>
            </span>
          </label>
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Coupon Code"
            className="flex-grow border border-gray-300 rounded p-2"
          />
          <button
            onClick={handleCouponApply}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            Apply Coupon
          </button>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="mt-4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 w-full rounded"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
