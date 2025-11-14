import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, UserCheck, AlertTriangle, Loader } from "lucide-react";
import { useVendorCustomer } from "@/hook/useCustomer_Payment";
import { useSelector } from "react-redux";

interface Customer {
  name: string;
  phone: string;
  location: string;
  customer: {
    _id: string;
    email: string;
  };
  status: "Active" | "Inactive";
  lastOrderDate?: string;
  avatar?: string;
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
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <User size={48} className="mb-3" />
      <p className="text-lg">No customers yet.</p>
    </div>
  );

  /* ---------- Error State ---------- */
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-red-500">
      <AlertTriangle size={48} className="mb-3" />
      <p className="text-lg">Couldn’t load customers.</p>
    </div>
  );

  /* ---------- Summary Stats ---------- */
  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "Active").length,
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
      {!isLoading && !error && customers.length === 0 && <EmptyState />}

      {!isLoading && !error && customers.length > 0 && (
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
                <User className="text-green-500" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Members</h2>
                <p className="text-2xl font-semibold">{stats.active}</p>
              </div>
            </motion.div>

            <motion.div
              className="p-4 bg-white rounded-lg shadow"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  className="flex items-center justify-center p-2 bg-green-100 rounded-full"
                  whileHover={{ scale: 1.2 }}
                >
                  <UserCheck className="text-green-600" size={20} />
                </motion.div>
                <h2 className="text-lg font-bold">Active Now</h2>
              </div>
              <div className="flex items-center mt-2 space-x-2">
                {customers
                  .filter((c) => c.status === "Active")
                  .slice(0, 5)
                  .map((c) => (
                    <motion.div
                      key={c.customer?._id}
                      className="w-10 h-10 overflow-hidden rounded-full ring-2 ring-offset-1 ring-green-300"
                    >
                      {c.avatar ? (
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-200">
                          <span className="font-semibold text-gray-700">
                            {(
                              c.customer?.email?.trim().charAt(0) || "?"
                            ).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
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

          {/* Table */}
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="sticky top-0 bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-sm font-medium text-left">
                    Customer
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-left">
                    Phone
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-left">
                    Email
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-left">
                    Location
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
                          <td className="flex items-center px-4 py-3 space-x-3 text-sm">
                            <img
                              src={c.avatar || "https://via.placeholder.com/32"}
                              alt=""
                              className="object-cover w-8 h-8 rounded-full"
                            />
                            <span>{c.name}</span>
                          </td>
                          <td className="px-4 py-3 text-sm">{c.phone}</td>
                          <td className="px-4 py-3 text-sm break-all">
                            {c.customer?.email}
                          </td>
                          <td className="px-4 py-3 text-sm">{c.location}</td>
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
