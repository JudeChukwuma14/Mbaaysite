import React, { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface Order {
  id: string;
  date: string;
  vendor: string;
  location: string;
  amount: string;
  status: "On Delivery" | "Delivered" | "Cancelled";
}

const OrderList: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All status");
  const [currentPage, setCurrentPage] = useState(1);

  const orders: Order[] = Array.from({ length: 50 }, (_, i) => ({
    id: `#123450${i + 1}`,
    date: "Nov 20th 2024 09:21AM",
    vendor: "James Ikenna",
    location: "Center Park Orange St, London",
    amount: "$50,000",
    status: i % 3 === 0 ? "On Delivery" : i % 3 === 1 ? "Delivered" : "Cancelled",
  }));

  const tabs = ["All status", "On Delivery", "Delivered", "Cancelled"];

  const filteredOrders =
    activeTab === "All status"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  const ordersPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handlePageChange = (direction: "prev" | "next") => {
    setCurrentPage((prev) => {
      if (direction === "prev" && prev > 1) return prev - 1;
      if (direction === "next" && prev < totalPages) return prev + 1;
      return prev;
    });
  };

  return (
    <div className="container mx-auto p-4">
      {/* Tabs */}
      <div className="flex space-x-4 mb-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 font-bold ${
              activeTab === tab
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-gray-500 hover:text-orange-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Vendor</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.date}</td>
                <td className="px-4 py-2">{order.vendor}</td>
                <td className="px-4 py-2">{order.location}</td>
                <td className="px-4 py-2">{order.amount}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded text-sm font-bold ${
                      order.status === "On Delivery"
                        ? "bg-yellow-100 text-yellow-600"
                        : order.status === "Delivered"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button className="text-blue-500 hover:underline">
                    View details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange("prev")}
          className="flex items-center space-x-2 text-gray-500 hover:text-orange-500 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          <FaAngleLeft />
          <span>Previous</span>
        </button>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-orange-500 text-white"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange("next")}
          className="flex items-center space-x-2 text-gray-500 hover:text-orange-500 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          <span>Next</span>
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
};

export default OrderList;
