"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useVendorOrders } from "@/hook/useOrders";
import { Order } from "@/utils/orderVendorApi";

const AllOrdersPage = () => {
  const [currentTab, setCurrentTab] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const user = useSelector((state: RootState) => state.vendor);

  // Fetch orders using TanStack Query
  const {
    data: ordersResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useVendorOrders({
    token: user.token ?? "",
    page: currentPage,
    limit: rowsPerPage,
    status: currentTab,
    sortBy: sortOrder,
  });

  const orders = ordersResponse?.data?.orders || [];
  const totalPages = ordersResponse?.data?.pagination?.totalPages || 1;
  const totalOrders = ordersResponse?.data?.totalOrders || 0;

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
    setCurrentPage(1); // Reset to first page when changing sort
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "On Delivery":
        return "text-yellow-500";
      case "Delivered":
        return "text-green-500";
      case "Cancelled":
        return "text-red-500";
      case "Pending":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="p-5">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            <span className="text-gray-600">Loading orders...</span>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (isError) {
    return (
      <main className="p-5">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to load orders
            </h3>
            <p className="text-gray-600 mb-4">
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred"}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => refetch()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </motion.button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">
          {totalOrders} {totalOrders === 1 ? "order" : "orders"} found
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {["All", "Pending", "On Delivery", "Delivered", "Cancelled"].map(
          (tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange(tab)}
              className={`px-5 py-2 rounded-full transition-all duration-300 font-semibold whitespace-nowrap ${
                currentTab === tab
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {tab}
            </motion.button>
          )
        )}
      </div>

      {/* Sort Dropdown */}
      <div className="flex justify-end mb-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative"
        >
          <button
            onClick={handleSortChange}
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow-md hover:bg-gray-200 transition-all duration-300"
          >
            {sortOrder === "newest" ? "Newest First" : "Oldest First"}
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 text-center">
              {currentTab === "All"
                ? "You haven't received any orders yet."
                : `No orders with status "${currentTab}" found.`}
            </p>
          </div>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 border-b">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    className="border-b hover:bg-gray-50 transition-all duration-300"
                  >
                    <td className="py-3 px-4 font-mono text-sm">
                      #{order.orderId}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">
                          {order.customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm max-w-xs truncate">
                      {order.deliveryAddress.fullAddress}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {formatAmount(order.totalAmount)}
                    </td>
                    <td
                      className={`py-3 px-4 font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          // Navigate to order details with the order ID
                          window.location.href = `/app/order-details/${order._id}`;
                        }}
                        className="text-blue-500 hover:underline font-medium"
                      >
                        View Details
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 bg-gray-100">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full shadow hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </motion.button>

              <div className="flex items-center gap-2">
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <span className="text-sm text-gray-500">
                  ({totalOrders} total orders)
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full shadow hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default AllOrdersPage;
