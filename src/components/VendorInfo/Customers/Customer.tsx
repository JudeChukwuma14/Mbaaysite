import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, UserCheck, AlertTriangle, Loader, RefreshCw } from "lucide-react";
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
  const SkeletonRow = () => (
    <tr className="border-b animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="w-full h-4 bg-gray-200 rounded"></div>
        </td>
      ))}
    </tr>
  );

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
    <div className="min-h-screen p-4 md:p-6 bg-gray-50 overflow-x-hidden max-w-full">
      {/* Loading or Error Guard */}
      {isLoading && (
        <div className="flex items-center justify-center h-96">
          <Loader className="text-orange-500 animate-spin" size={32} />
          <span className="ml-2 text-gray-600">Loading customers…</span>
        </div>
      )}
      {error && !isLoading && <ErrorState />}
      {!isLoading && !error && (customers.length === 0 || filtered.length === 0) && (
        <EmptyState filter={filter} onResetFilter={() => setFilter('All')} />
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <>
          {/* Summary Cards */}
          <motion.div
            className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex items-center p-4 space-x-3 bg-white rounded-lg shadow"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="text-blue-500" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Total Customers</h2>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center p-4 space-x-3 bg-white rounded-lg shadow"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="text-green-500" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Active</h2>
                <p className="text-2xl font-semibold">{stats.active}</p>
              </div>
            </motion.div>

            <motion.div
              className="p-4 bg-white rounded-lg shadow"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-full">
                  <User className="text-purple-600" size={20} />
                </div>
                <h2 className="text-lg font-bold">Model Types</h2>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  {stats.modelTypes.join(", ") || "N/A"}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Filter & Title */}
          <motion.div
            className="flex flex-col mb-4 md:flex-row md:items-center md:justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-2 text-2xl font-bold md:mb-0">Customers</h1>
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "All" | "Active" | "Inactive")
              }
              className="p-2 border border-orange-500 rounded shadow-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </motion.div>

          {/* Desktop Table View */}
          <div className="hidden overflow-x-auto rounded-lg shadow md:block">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="sticky top-0 bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-sm font-medium text-left">
                    Email
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-left">
                    Model Type
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-left">
                    Last Order
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-left">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <motion.tr
                          key={`skeleton-${i}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <SkeletonRow />
                        </motion.tr>
                      ))
                    : paginated.map((c) => (
                        <motion.tr
                          key={`${c.customer?._id}-${c.customer?.email}`}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm break-all">
                            {c.customer?.email}
                          </td>
                          <td className="px-4 py-3 text-sm capitalize">
                            {c.modelType}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                c.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
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
          <div className="grid gap-4 md:hidden">
            {paginated.map((c) => (
              <motion.div
                key={`${c.customer?._id}-${c.customer?.email}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <span className="text-xs text-gray-500">Email</span>
                    <p className="font-medium text-sm break-all">{c.customer?.email}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Model Type</span>
                    <p className="font-medium text-sm capitalize">{c.modelType}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <span className="text-xs text-gray-500">Last Order</span>
                    <p className="font-medium text-sm">
                      {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Status</span>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        c.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              className="flex items-center justify-between mt-4 flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm text-gray-600">
                Showing {paginated.length} of {filtered.length} results
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-gray-600 bg-white border border-orange-500 rounded shadow-sm disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 border rounded shadow-sm text-sm ${
                      currentPage === i + 1
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-gray-600 bg-white border border-orange-500 rounded shadow-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomersPage;
