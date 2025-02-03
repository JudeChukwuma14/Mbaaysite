import React from "react";
import { FaMapMarkerAlt, FaTruck, FaClipboardCheck, FaCopy } from "react-icons/fa";

const OrderDetail: React.FC = () => {
  const items = [
    { id: 1, name: "Nike Air Max SYSTM", price: 200000, size: 24 },
    { id: 2, name: "Nike Air Max Rift", price: 300000, size: 24 },
    { id: 3, name: "Nike Air Max Pulse", price: 200000, size: 24 },
    { id: 4, name: "Nike Air Max Air", price: 200000, size: 24 },
  ];

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleCopyTrackingNumber = () => {
    navigator.clipboard.writeText("872198298212").then(() => {
      alert("Tracking number copied!");
    });
  };

  return (
    <div className="container mx-auto p-4">
      {/* Order Header */}
      <div className="bg-white p-6 rounded shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Order ID #9891786</h2>
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded">On Delivery</span>
        </div>

        <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-gray-600" />
            <span>Lagos, Nigeria ➡ Uyo, Nigeria</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaTruck className="text-gray-600" />
            <span>Estimated Arrival: 9 July 2024</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaClipboardCheck className="text-gray-600" />
            <span>Delivered in: 5 Days</span>
          </div>
        </div>
      </div>

      {/* Shipment and Timeline */}
      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h3 className="font-bold text-lg">Timeline</h3>
          <div className="space-y-2">
            <p className="text-gray-600">
              4 July (Now) 06:00 - Your package is packed by the courier in Lagos, Nigeria.
            </p>
            <p className="text-gray-600">
              Shipment has been created. Order placed: <span className="font-bold">Nike</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow space-y-4">
          <h3 className="font-bold text-lg">Shipment</h3>
          <div>
            <p>
              <span className="font-bold">Location:</span> Lagos, Nigeria ➡ Uyo, Nigeria
            </p>
            <p>
              <span className="font-bold">Recipient:</span> Uyo, Nigeria
            </p>
            <p>
              <span className="font-bold">Delivery Address:</span> Lagos, Nigeria
            </p>
            <p className="flex items-center space-x-2">
              <span className="font-bold">Tracking No:</span> 872198298212
              <FaCopy
                className="text-gray-600 cursor-pointer"
                onClick={handleCopyTrackingNumber}
              />
            </p>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="mt-6">
        <h3 className="font-bold text-lg mb-4">Items ({items.length})</h3>
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h4 className="font-bold">{item.name}</h4>
                <p className="text-gray-600">₦{item.price.toLocaleString()} x1</p>
                <p className="text-gray-600">Size: {item.size}</p>
              </div>
              <div className="w-16 h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded shadow mt-6">
        <h3 className="font-bold text-lg mb-4">Order Summary</h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name}</span>
              <span>₦{item.price.toLocaleString()}</span>
            </div>
          ))}
          <hr />
          <div className="flex justify-between font-bold">
            <span>TOTAL</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded">
            Contact Vendor
          </button>
          <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
            Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
