import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useVendorOrders } from "@/hook/useOrders";
import { Link } from "react-router-dom";

// Order interface
interface Order {
  _id: string;
  orderDate: string;
  buyerInfo: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    region: string;
    apartment: string;
    postalCode: number;
  };
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    fullAddress: string;
  };
  totalPrice: number;
  status: "Processing" | "Delivered" | "Cancelled" | "Pending";
  product: {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  };
  payStatus: "Successful" | "Pending" | "Failed";
  createdAt: string;
  updatedAt: string;
}

const AllOrdersPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<"All" | Order["status"]>("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const rowsPerPage = 5;

  const user = useSelector((state: RootState) => state.vendor);

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
    status: currentTab === "All" ? "" : currentTab,
    sortBy: sortOrder,
  });

  const orders: Order[] = ordersResponse?.data?.orders || [];
  const totalPages = ordersResponse?.data?.pagination?.totalPages || 1;

  // Local filtering: tab + search + payment status
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = currentTab === "All" || order.status === currentTab;

      const matchesSearch =
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.buyerInfo.first_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order.buyerInfo.last_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesPayment =
        paymentFilter === "All" || order.payStatus === paymentFilter;

      return matchesTab && matchesSearch && matchesPayment;
    });
  }, [orders, currentTab, searchQuery, paymentFilter]);

  console.log("Filtered Orders:", filteredOrders);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab as typeof currentTab);
  };

  const handleSortChange = () => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setCurrentTab("All");
    setSearchQuery("");
    setPaymentFilter("All");
    setSortOrder("newest");
    setCurrentPage(1);
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
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Processing":
        return "text-yellow-400";
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

  if (isLoading) {
    return (
      <main className="p-5">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="h-7 w-40 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Controls skeleton */}
        <div className="flex flex-wrap justify-between gap-3 mb-4">
          <div className="h-10 w-full sm:w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Table skeleton */}
        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          <div className="h-10 bg-gray-100" />
          <div className="divide-y">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-7 gap-4 p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded col-span-1" />
                <div className="h-4 bg-gray-200 rounded col-span-1" />
                <div className="h-4 bg-gray-200 rounded col-span-1" />
                <div className="h-4 bg-gray-200 rounded col-span-1" />
                <div className="h-4 bg-gray-200 rounded col-span-1" />
                <div className="h-4 bg-gray-200 rounded col-span-1" />
                <div className="h-4 bg-gray-200 rounded col-span-1" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="p-5 flex flex-col justify-center items-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
        <h3 className="mb-2 text-lg font-semibold">Failed to load orders</h3>
        <p className="mb-4 text-gray-600">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred"}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => refetch()}
          className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
        >
          Try Again
        </motion.button>
      </main>
    );
  }

  return (
    <main className="p-5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Orders</h1>
        {filteredOrders.length > 0 && (
          <p className="text-gray-600">
            Showing {filteredOrders.length} order
            {filteredOrders.length > 1 ? "s" : ""}.
          </p>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-4 mb-6">
        {["All", "Pending", "Processing", "Delivered", "Cancelled"].map(
          (tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange(tab)}
              className={`px-5 py-2 rounded-full font-semibold ${
                currentTab === tab
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {tab}
            </motion.button>
          )
        )}
      </div>

      {/* Search + Payment Filter + Sort */}
      <div className="flex flex-wrap justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by ID or Customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg sm:w-1/3"
        />

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="All">All Payments</option>
          <option value="Successful">Successful</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSortChange}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full shadow hover:bg-gray-200"
        >
          {sortOrder === "newest" ? "Newest First" : "Oldest First"}
          <ChevronDown className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        {filteredOrders.length === 0 ? (
          <div className="p-12">
            <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl bg-gray-50 p-10">
              <div className="mb-3">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="5" width="18" height="14" rx="3" className="fill-orange-50 stroke-orange-300" strokeWidth="1.5" />
                  <path d="M7 12h6M7 9h10M7 15h10" className="stroke-orange-400" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-gray-900">No matching orders</h4>
              <p className="mt-1 text-xs text-gray-600 max-w-sm">
                Try adjusting your search or filters to find orders.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-full hover:bg-orange-600"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          <>
            <table className="w-full text-left">
              <thead className="text-gray-700 bg-gray-100">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-mono text-sm">
                      #{order._id}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {order.buyerInfo.first_name} {order.buyerInfo.last_name}
                    </td>
                    <td className="px-4 py-3">{order.product.name}</td>

                    <td className="px-4 py-3 font-semibold">
                      {formatAmount(order.totalPrice)}
                    </td>
                    <td
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/app/order-details/${order._id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-blue-500 hover:underline"
                        >
                          View Details
                        </motion.button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 bg-gray-100">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </motion.button>

              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
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
