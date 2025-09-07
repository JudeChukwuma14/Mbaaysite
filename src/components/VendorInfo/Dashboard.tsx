import { useState } from "react";
import {
  Eye,
  EyeOff,
  ShoppingCart,
  Package,
  Layers,
  ExternalLink,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import type { ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { get_single_vendor } from "@/utils/vendorApi";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { useOrderStats, useVendorOrders } from "@/hook/useOrders";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [selectedMonths, setSelectedMonths] = useState(1);

  const user = useSelector((state: RootState) => state.vendor);
  console.log(user)

  const { data: vendors } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => get_single_vendor(user.token),
  });

  // Fetch real orders data
  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useVendorOrders({
    token: user.token || "",
    page: currentPage,
    limit: rowsPerPage,
    sortBy: "newest",
  });

  // Fetch order statistics
  const { data: orderStats, isLoading: statsLoading } = useOrderStats(
    user.token || ""
  );

  const accountType = vendors?.storeType || "Loading...";

  // Use real data from API or fallback to loading/default values
  // const totalOrders = orderStats?.totalOrders || 0;
  const productsSold = orderStats?.deliveredOrders || 0;
  const orders = ordersData?.data?.orders || [];
  const totalPages = ordersData?.data?.pagination?.totalPages || 1;

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-500";
      case "Processing":
        return "text-blue-500";
      case "Delivered":
        return "text-green-500";
      case "Cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const chartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
    ], // Placeholder months
    datasets: [
      {
        label: "Revenue",
        data: [5000, 10000, 7500, 12000, 8000, 15000, 5000, 20000], // Replace with real data
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "rgba(200, 200, 200, 0.2)" } },
    },
  };

  return (
    <main className="p-5 flex-1 overflow-auto">
      {/* Cards Section */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          {
            title: "Money Earned",
            value: balanceVisible
              ? formatCurrency(orderStats?.totalRevenue || 0)
              : "****",
            icon: balanceVisible ? EyeOff : Eye,
            onClick: toggleBalanceVisibility,
            loading: statsLoading,
          },
          {
            title: "Total Orders",
            value: statsLoading
              ? "Loading..."
              : ordersData?.data?.orders?.length?.toString() || "0",
            icon: ShoppingCart,
            loading: statsLoading,
          },
          {
            title: "Products Sold",
            value: statsLoading ? "Loading..." : productsSold.toString(),
            icon: Package,
            loading: statsLoading,
          },
          {
            title: "Account Type",
            value: accountType,
            icon: Layers,
            loading: false,
          },
        ].map((card, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg p-5 shadow flex items-center justify-between"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h3 className="text-sm text-gray-500">{card.title}</h3>
              {card.loading ? (
                <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              )}
            </div>
            {card.icon && (
              <motion.button onClick={card.onClick}>
                <card.icon className="w-6 h-6 text-gray-600" />
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Chart and Notifications */}
      <div className="w-full gap-4">
        <motion.div
          className="col-span-2 bg-white rounded-lg p-5 shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-bold mb-4">Revenue Report</h2>
          <div className="flex justify-end mb-3">
            {[1, 3, 6].map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonths(month)}
                className={`px-3 py-1 rounded ${
                  selectedMonths === month
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200"
                } mx-1`}
              >
                {month} Month{month > 1 && "s"}
              </button>
            ))}
          </div>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* <motion.div
          className="bg-white rounded-lg p-5 shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-bold mb-4">Recent Notifications</h2>
          <ul className="text-sm space-y-2">
            {[
              "Your account is logged in",
              "Payment successfully processed",
              "New product added to inventory",
            ].map((notif, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded shadow">
                {notif}
              </li>
            ))}
          </ul>
        </motion.div> */}
      </div>

      {/* Orders Table */}
      <motion.div
        className="bg-white rounded-lg p-5 shadow mt-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">Recent Orders</h2>
          <NavLink
            to="/app/orders"
            className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
          >
            View All Orders
            <ExternalLink className="w-4 h-4" />
          </NavLink>
        </div>

        {/* Loading State */}
        {ordersLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading orders...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {ordersError && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-red-500 mb-2">Failed to load orders</div>
            <button
              onClick={() => refetchOrders()}
              className="px-4 py-2 text-sm text-white bg-orange-500 rounded-lg hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Orders Table */}
        {!ordersLoading && !ordersError && (
          <>
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-500">No orders found</p>
                <p className="text-sm text-gray-400">
                  Orders will appear here when customers place them
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2">Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order: any, index: any) => (
                        <motion.tr
                          key={order._id}
                          className="border-b hover:bg-gray-50"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <td className="py-3">
                            <span className="font-mono text-sm">
                              {order?._id}
                            </span>
                          </td>
                          <td className="py-3">
                            <div>
                              <div className="font-medium">
                                {order.buyerInfo.first_name}
                              </div>
                              {/* <div className="text-sm text-gray-500">
                                {order.buyerInfo.email}
                              </div> */}
                            </div>
                          </td>
                          <td className="py-3 text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                {/* {order.name?.length} item
                                {order.name?.length > 1 ? "s" : ""} */}
                                {order.product.name}
                              </span>
                              {order.name?.[0]?.image && (
                                <img
                                  src={
                                    order.items[0].image || "/placeholder.svg"
                                  }
                                  alt={order.items[0].name}
                                  className="w-8 h-8 rounded object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "/placeholder.svg?height=32&width=32";
                                  }}
                                />
                              )}
                            </div>
                          </td>
                          <td className="py-3 font-semibold">
                            {formatCurrency(order.totalPrice)}
                          </td>
                          <td className="py-3">
                            <span
                              className={`font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <NavLink
                              to={`/app/order-details/${order._id}`}
                              className="text-blue-500 hover:text-blue-700 text-sm hover:underline"
                            >
                              View Details
                            </NavLink>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </motion.div>
    </main>
  );
};

export default Dashboard;
