import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Package,
  ShoppingCart,
  TrendingUp,
  Filter,
  Search,
  Calendar,
  User,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useVendorOrders } from "@/hook/useOrders";
import { Link } from "react-router-dom";

// Order interface
interface Order {
  _id: string;
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
    postalCode: string;
    sessionId?: string;
    companyName?: string;
    userId?: string;
  };
  returnDetails?: {
    reason?: string;
    condition?: string;
    method?: string;
    comments?: string;
    requestedAt?: string;
    returnedProducts: Array<{
      _id?: string;
      name?: string;
      image?: string;
      quantity?: number;
      reason?: string;
      condition?: string;
    }>;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      poster: string;
      price: number;
      uploadedBy: string | null;
    };
    quantity: number;
    price: number;
    total: number;
    _id: string;
  }>;
  totalPrice: number;
  buyerSession: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Cancellation Requested" | "Postponement Requested" | "Return Requested";
  payStatus: "Successful" | "Pending" | "Failed";
  userId: string;
  paymentOption: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
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

  // const getStatusColor = (status: Order["status"]) => {
  //   switch (status) {
  //     case "Processing":
  //       return "text-yellow-400";
  //     case "Shipped":
  //       return "text-blue-400";
  //     case "Delivered":
  //       return "text-green-500";
  //     case "Cancelled":
  //       return "text-red-500";
  //     case "Cancellation Requested":
  //       return "text-red-400";
  //     case "Postponement Requested":
  //       return "text-purple-400";
  //     case "Return Requested":
  //       return "text-red-500";
  //     case "Pending":
  //       return "text-blue-500";
  //     default:
  //       return "text-gray-500";
  //   }
  // };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
            <p className="text-gray-600">Track and manage your orders efficiently</p>
          </motion.div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-8 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg p-6 animate-pulse"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gray-300 rounded-full opacity-20"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/30 rounded-xl"></div>
                    <div className="w-5 h-5 bg-white/30 rounded-full"></div>
                  </div>
                  <div className="w-24 h-4 bg-white/30 rounded mb-2"></div>
                  <div className="w-32 h-8 bg-white/30 rounded"></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Controls Skeleton */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </motion.div>

          {/* Table Skeleton */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="w-32 h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4"><div className="w-20 h-4 bg-gray-200 rounded"></div></th>
                    <th className="px-6 py-4"><div className="w-16 h-4 bg-gray-200 rounded"></div></th>
                    <th className="px-6 py-4"><div className="w-24 h-4 bg-gray-200 rounded"></div></th>
                    <th className="px-6 py-4"><div className="w-16 h-4 bg-gray-200 rounded"></div></th>
                    <th className="px-6 py-4"><div className="w-20 h-4 bg-gray-200 rounded"></div></th>
                    <th className="px-6 py-4"><div className="w-16 h-4 bg-gray-200 rounded"></div></th>
                    <th className="px-6 py-4"><div className="w-20 h-4 bg-gray-200 rounded"></div></th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-red-100 p-8"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Orders</h2>
            <p className="text-gray-600 mb-6">
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred while loading your orders."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => refetch()}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 transition-all"
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">Track and manage your orders efficiently</p>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-8 lg:grid-cols-3">
          <motion.div
            className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white"
            whileHover={{ scale: 1.02, y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-400 rounded-full opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-100" />
              </div>
              <h3 className="text-blue-100 text-sm font-medium mb-1">Total Orders</h3>
              <p className="text-2xl sm:text-3xl font-bold">{orders.length}</p>
              <div className="mt-3 flex items-center text-xs text-blue-100">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                <span>All time orders</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white"
            whileHover={{ scale: 1.02, y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-400 rounded-full opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-100" />
              </div>
              <h3 className="text-green-100 text-sm font-medium mb-1">Active Orders</h3>
              <p className="text-2xl sm:text-3xl font-bold">
                {orders.filter(o => o.status === "Processing" || o.status === "Shipped").length}
              </p>
              <div className="mt-3 flex items-center text-xs text-green-100">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                <span>In progress</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white"
            whileHover={{ scale: 1.02, y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-400 rounded-full opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-purple-100" />
              </div>
              <h3 className="text-purple-100 text-sm font-medium mb-1">Revenue</h3>
              <p className="text-2xl sm:text-3xl font-bold">
                {formatAmount(orders.reduce((sum, order) => sum + order.totalPrice, 0))}
              </p>
              <div className="mt-3 flex items-center text-xs text-purple-100">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                <span>Total sales</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filter and Search */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {["All", "Pending", "Processing", "Delivered", "Return Requested"].map(
                  (tab) => (
                    <motion.button
                      key={tab}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTabChange(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentTab === tab
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tab}
                    </motion.button>
                  )
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {sortOrder === "newest" ? "Newest" : "Oldest"}
                <ChevronDown className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-500" />
              Order Directory
              {filteredOrders.length > 0 && (
                <span className="text-sm font-normal text-gray-500">
                  ({filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'})
                </span>
              )}
            </h2>
          </div>
          
          {filteredOrders.length === 0 ? (
            <div className="p-12">
              <div className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed rounded-xl bg-gray-50">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart size={32} className="text-orange-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  No matching orders
                </h4>
                <p className="max-w-sm text-gray-600 mb-6">
                  Try adjusting your search or filters to find orders.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 transition-all"
                >
                  Clear filters
                </motion.button>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="lg:hidden p-4 sm:p-6 space-y-4">
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-3">
                          <ShoppingCart className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-mono text-xs text-gray-500 mb-1">#{order._id}</p>
                          <p className="font-semibold text-gray-900 text-sm">
                            {order.buyerInfo.first_name} {order.buyerInfo.last_name}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/app/order-details/${order._id}`}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View
                      </Link>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <span className="text-xs text-gray-500">Date</span>
                        <p className="font-medium text-gray-900 text-sm">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Amount</span>
                        <p className="font-semibold text-gray-900">{formatAmount(order.totalPrice)}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-xs text-gray-500">Items</span>
                      <div className="mt-1 space-y-1">
                        {order.items.slice(0, 2).map((item, i) => (
                          <div key={i} className="flex items-center text-sm text-gray-700">
                            <Package className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="truncate">{item.quantity} × {item.product.name}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-xs text-gray-500 ml-5">
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">Status</span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "Delivered" 
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : order.status === "Processing" || order.status === "Shipped"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          order.status === "Delivered" ? "bg-green-500"
                          : order.status === "Processing" || order.status === "Shipped"
                          ? "bg-blue-500"
                          : order.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                        }`}></span>
                        {order.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order._id}
                        className="hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                              <ShoppingCart className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-mono text-sm text-gray-900">#{order._id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="font-medium text-gray-900">
                              {order.buyerInfo.first_name} {order.buyerInfo.last_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {order.items.slice(0, 2).map((item, i) => (
                              <div key={i} className="flex items-center text-sm text-gray-700">
                                <Package className="w-3 h-3 mr-2 text-gray-400" />
                                <span className="truncate">{item.product.name} × {item.quantity}</span>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="text-xs text-gray-500 ml-5">
                                +{order.items.length - 2} more items
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">
                            {formatAmount(order.totalPrice)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "Delivered" 
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : order.status === "Processing" || order.status === "Shipped"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              order.status === "Delivered" ? "bg-green-500"
                              : order.status === "Processing" || order.status === "Shipped"
                              ? "bg-blue-500"
                              : order.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                            }`}></span>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/app/order-details/${order._id}`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
                            >
                              View Details
                            </motion.button>
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-medium text-gray-900">{filteredOrders.length}</span> {filteredOrders.length === 1 ? 'order' : 'orders'}
                      {filteredOrders.length > 0 && (
                        <span> on page <span className="font-medium text-gray-900">{currentPage}</span> of <span className="font-medium text-gray-900">{totalPages}</span></span>
                      )}
                    </div>
                    
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </motion.button>
                      
                      <div className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border-l border-r border-gray-200">
                        {currentPage} / {totalPages}
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
};

export default AllOrdersPage;
