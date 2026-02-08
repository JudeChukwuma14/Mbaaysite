import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  UserCheck, 
  AlertTriangle, 
  Loader, 
  RefreshCw,
  Users,
  TrendingUp,
  Activity,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  Package
} from "lucide-react";
import { useVendorCustomer } from "@/hook/useCustomer_Payment";
import { useSelector } from "react-redux";

interface Customer {
  _id: string;
  customer: {
    _id: string;
    email: string;
  };
  status: "Active" | "Inactive";
  modelType: string;
  lastOrderDate?: string;
}

const CustomersPage: React.FC = () => {
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const user = useSelector((state: any) => state.vendor);
  const { data, isLoading, error } = useVendorCustomer({ token: user?.token });

  const customers: Customer[] = data?.customers ?? [];
  console.log("Customers data:", customers);
  const totalPages = Math.ceil(customers.length / pageSize);

  const filtered =
    filter === "All" ? customers : customers.filter((c) => c.status === filter);

  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (p: number) =>
    p >= 1 && p <= totalPages && setCurrentPage(p);

  /* ---------- Skeleton Row ---------- */
  // const SkeletonRow = () => (
  //   <motion.tr className="border-b border-gray-100 animate-pulse" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  //     {Array.from({ length: 5 }).map((_, i) => (
  //       <td key={i} className="px-6 py-4">
  //         <div className="w-full h-4 bg-gray-200 rounded"></div>
  //       </td>
  //     ))}
  //   </motion.tr>
  // );

  // const SkeletonCard = () => (
  //   <motion.div 
  //     className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 animate-pulse"
  //     initial={{ opacity: 0, y: 20 }}
  //     animate={{ opacity: 1, y: 0 }}
  //   >
  //     <div className="flex items-center justify-between mb-4">
  //       <div className="w-20 h-4 bg-gray-200 rounded"></div>
  //       <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
  //     </div>
  //     <div className="space-y-2">
  //       <div className="w-full h-4 bg-gray-200 rounded"></div>
  //       <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
  //       <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
  //     </div>
  //   </motion.div>
  // );

  /* ---------- Empty State ---------- */
  interface EmptyStateProps {
    filter: 'All' | 'Active' | 'Inactive';
    onResetFilter: () => void;
  }

  const EmptyState = ({ filter, onResetFilter }: EmptyStateProps) => (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-6 mb-6 bg-orange-50 rounded-full">
        <User size={56} className="text-orange-400" />
      </div>
      <h3 className="mb-2 text-2xl font-semibold text-gray-800">
        {filter === 'All' 
          ? 'No customers found'
          : `No ${filter.toLowerCase()} customers`}
      </h3>
      <p className="max-w-md mb-6 text-gray-500">
        {filter === 'All' 
          ? 'There are no customers in your list yet. New customers will appear here.'
          : `There are currently no customers marked as "${filter.toLowerCase()}".`}
      </p>
      {filter !== 'All' && (
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <button
            onClick={onResetFilter}
            className="px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-colors"
          >
            View All Customers
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      )}
    </motion.div>
  );

  /* ---------- Error State ---------- */
  const ErrorState = () => (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-4 mb-6 bg-red-50 rounded-full">
        <AlertTriangle size={48} className="text-red-500" />
      </div>
      <h3 className="mb-2 text-2xl font-semibold text-gray-800">Something went wrong</h3>
      <p className="max-w-md mb-6 text-gray-600">
        We couldn't load the customer data. Please check your connection and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="flex items-center px-6 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-colors"
      >
        <RefreshCw size={16} className="mr-2" />
        Try Again
      </button>
    </motion.div>
  );

  /* ---------- Summary Stats ---------- */
  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "Active").length,
    modelTypes: [...new Set(customers.map(c => c.modelType))],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-96">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-4">
                <Loader className="text-white animate-spin" size={32} />
              </div>
              <p className="text-gray-600 font-medium">Loading customers…</p>
            </motion.div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && <ErrorState />}
        
        {/* Empty State */}
        {!isLoading && !error && (customers.length === 0 || filtered.length === 0) && (
          <EmptyState filter={filter} onResetFilter={() => setFilter('All')} />
        )}

        {/* Main Content */}
        {!isLoading && !error && filtered.length > 0 && (
          <>
            {/* Header */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Customer Analytics</h1>
              <p className="text-gray-600">Manage and track your customer base</p>
            </motion.div>

            {/* Summary Cards */}
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
                      <Users className="w-6 h-6" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-blue-100" />
                  </div>
                  <h3 className="text-blue-100 text-sm font-medium mb-1">Total Customers</h3>
                  <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
                  <div className="mt-3 flex items-center text-xs text-blue-100">
                    <Activity className="w-3 h-3 mr-1" />
                    <span>All registered users</span>
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
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-100" />
                  </div>
                  <h3 className="text-green-100 text-sm font-medium mb-1">Active Customers</h3>
                  <p className="text-2xl sm:text-3xl font-bold">{stats.active}</p>
                  <div className="mt-3 flex items-center text-xs text-green-100">
                    <Activity className="w-3 h-3 mr-1" />
                    <span>Currently active</span>
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
                      <Package className="w-6 h-6" />
                    </div>
                    <Activity className="w-5 h-5 text-purple-100" />
                  </div>
                  <h3 className="text-purple-100 text-sm font-medium mb-1">Model Types</h3>
                  <p className="text-lg sm:text-xl font-bold">{stats.modelTypes.length}</p>
                  <div className="mt-3">
                    <p className="text-xs text-purple-100 truncate">
                      {stats.modelTypes.slice(0, 2).join(", ")}
                      {stats.modelTypes.length > 2 && ` +${stats.modelTypes.length - 2} more`}
                    </p>
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
                    {(["All", "Active", "Inactive"] as const).map((status) => (
                      <motion.button
                        key={status}
                        onClick={() => {
                          setFilter(status);
                          setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          filter === status
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {status}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Customer Table */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  Customer Directory
                </h2>
              </div>
              
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Email</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Type</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <AnimatePresence>
                      {paginated.map((c, index) => (
                        <motion.tr
                          key={`${c.customer?._id}-${c.customer?.email}`}
                          className="hover:bg-gray-50 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                                <Mail className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-900 break-all">{c.customer?.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mr-3">
                                <Package className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="font-medium text-gray-900 capitalize">{c.modelType}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                c.status === "Active" 
                                  ? "bg-green-100 text-green-800 border border-green-200" 
                                  : "bg-orange-100 text-orange-800 border border-orange-200"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                c.status === "Active" ? "bg-green-500" : "bg-orange-500"
                              }`}></span>
                              {c.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden p-4 sm:p-6 space-y-4">
                <AnimatePresence>
                  {paginated.map((c, index) => (
                    <motion.div
                      key={`${c.customer?._id}-${c.customer?.email}`}
                      className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 shadow-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-3">
                            <Mail className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm break-all">{c.customer?.email}</p>
                            <p className="text-xs text-gray-500 mt-1">Customer</p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            c.status === "Active" 
                              ? "bg-green-100 text-green-800 border border-green-200" 
                              : "bg-orange-100 text-orange-800 border border-orange-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            c.status === "Active" ? "bg-green-500" : "bg-orange-500"
                          }`}></span>
                          {c.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                        <div>
                          <span className="text-xs text-gray-500">Model Type</span>
                          <p className="font-medium text-gray-900 capitalize text-sm">{c.modelType}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Last Order</span>
                          <p className="font-medium text-gray-900 text-sm">
                            {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-medium text-gray-900">{paginated.length}</span> of{' '}
                      <span className="font-medium text-gray-900">{filtered.length}</span> {filtered.length === 1 ? 'customer' : 'customers'}
                    </div>
                    
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border-l border-r border-gray-200">
                        {currentPage} / {totalPages}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
