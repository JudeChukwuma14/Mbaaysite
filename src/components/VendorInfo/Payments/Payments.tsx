import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useSelector } from "react-redux";
import { useVendorPayments } from "@/hook/useCustomer_Payment";

interface Invoice {
  id: string | number;
  modelType: string;
  date: string;
  amount: number; // use number so we can sum
  status: "Paid" | "Unpaid";
}

type PaymentRecord = {
  paymentId: string;
  status: "Successful" | "Failed";
  amount: number;
  modelType: string;
  date: string;
};

const PaymentsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"All status" | "Paid" | "Unpaid">("All status");
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);

  const user = useSelector((state: any) => state.vendor);
  const { data, isLoading, error } = useVendorPayments({ token: user?.token });
  console.log("Payments data:", data);

  const invoices: Invoice[] = useMemo(() => {
    const raw: PaymentRecord[] = data?.payments ?? [];
    return raw.map((p) => ({
      id: p.paymentId,
      modelType: p.modelType,
      date: new Date(p.date).toLocaleDateString(),
      amount: p.amount,
      status: p.status === "Successful" ? "Paid" : "Unpaid",
    }));
  }, [data]);

  const { totalAmount, paidAmount, unpaidAmount } = useMemo(() => {
    const paid = invoices.filter((i) => i.status === "Paid");
    const unpaid = invoices.filter((i) => i.status === "Unpaid");
    return {
      totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0),
      paidAmount: paid.reduce((sum, i) => sum + i.amount, 0),
      unpaidAmount: unpaid.reduce((sum, i) => sum + i.amount, 0),
    };
  }, [invoices]);

  const filtered = useMemo(() => {
    if (filter === "All status") return invoices;
    return invoices.filter((i) => i.status === filter);
  }, [invoices, filter]);

  // Sort by date descending (newest first)
  const sortedFiltered = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Newest first
    });
  }, [filtered]);

  // Ensure we always have at least 1 page, even with no results
  const totalPages = Math.max(1, Math.ceil(sortedFiltered.length / rowsPerPage));
  // Ensure currentPage is within valid range
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  // Update currentPage if it was out of bounds
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage);
  }
  
  const paginated = sortedFiltered.slice(
    (validCurrentPage - 1) * rowsPerPage,
    validCurrentPage * rowsPerPage
  );

  /* ---------- skeletons ---------- */
  const SkeletonCard = () => (
    <motion.div 
      className="p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 animate-pulse"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-20 h-4 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>
      <div className="w-32 h-8 bg-gray-200 rounded mb-2"></div>
      <div className="w-24 h-3 bg-gray-200 rounded"></div>
    </motion.div>
  );

  const SkeletonRow = () => (
    <motion.tr className="border-b border-gray-100 animate-pulse" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="w-full h-4 bg-gray-200 rounded"></div>
        </td>
      ))}
    </motion.tr>
  );

  /* ---------- render ---------- */
  if (isLoading)
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Payment Analytics</h1>
            <p className="text-gray-600">Track your payment history and insights</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="w-32 h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left"><div className="w-20 h-4 bg-gray-200 rounded"></div></th>
                    <th className="px-4 py-3 text-left"><div className="w-16 h-4 bg-gray-200 rounded"></div></th>
                    <th className="px-4 py-3 text-left"><div className="w-16 h-4 bg-gray-200 rounded"></div></th>
                    <th className="px-4 py-3 text-left"><div className="w-16 h-4 bg-gray-200 rounded"></div></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-red-100 p-8"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Payments</h2>
            <p className="text-gray-600 mb-6">We couldn't retrieve your payment data. Please try again later.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </motion.div>
        </div>
      </main>
    );

  if (!invoices.length)
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={32} className="text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Payments Yet</h2>
            <p className="text-gray-600">Your payment history will appear here once you start receiving payments.</p>
          </motion.div>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Payment Analytics</h1>
          <p className="text-gray-600">Track your payment history and financial insights</p>
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
                  <Wallet className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-100" />
              </div>
              <h3 className="text-blue-100 text-sm font-medium mb-1">Total Revenue</h3>
              <p className="text-2xl sm:text-3xl font-bold">
                ${totalAmount.toLocaleString()}
              </p>
              <div className="mt-3 flex items-center text-xs text-blue-100">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                <span>All time earnings</span>
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
                  <CheckCircle className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-100" />
              </div>
              <h3 className="text-green-100 text-sm font-medium mb-1">Paid Amount</h3>
              <p className="text-2xl sm:text-3xl font-bold">
                ${paidAmount.toLocaleString()}
              </p>
              <div className="mt-3 flex items-center text-xs text-green-100">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                <span>Successfully received</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white"
            whileHover={{ scale: 1.02, y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-400 rounded-full opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <TrendingDown className="w-5 h-5 text-orange-100" />
              </div>
              <h3 className="text-orange-100 text-sm font-medium mb-1">Pending Amount</h3>
              <p className="text-2xl sm:text-3xl font-bold">
                ${unpaidAmount.toLocaleString()}
              </p>
              <div className="mt-3 flex items-center text-xs text-orange-100">
                <ArrowDownRight className="w-3 h-3 mr-1" />
                <span>Awaiting payment</span>
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
                {(["All status", "Paid", "Unpaid"] as const).map((status) => (
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
                placeholder="Search transactions..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Payment Table */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              Transaction History
            </h2>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16">
                      <div className="flex flex-col items-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <CreditCard size={24} className="text-gray-400" />
                        </div>
                        <p className="text-sm font-medium">
                          No transactions found for "{filter.toLowerCase()}".
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {paginated.map((inv, index) => (
                      <motion.tr
                        key={inv.id}
                        className="hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                              <Wallet className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900 capitalize">{inv.modelType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{inv.date}</td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">${inv.amount.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              inv.status === "Paid" 
                                ? "bg-green-100 text-green-800 border border-green-200" 
                                : "bg-orange-100 text-orange-800 border border-orange-200"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              inv.status === "Paid" ? "bg-green-500" : "bg-orange-500"
                            }`}></span>
                            {inv.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden p-4 sm:p-6 space-y-4">
            {paginated.length === 0 ? (
              <div className="py-12 text-center">
                <div className="flex flex-col items-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CreditCard size={24} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-medium">
                    No transactions found for "{filter.toLowerCase()}".
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {paginated.map((inv, index) => (
                  <motion.div
                    key={inv.id}
                    className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-3">
                          <Wallet className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 capitalize">{inv.modelType}</p>
                          <p className="text-xs text-gray-500">{inv.date}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          inv.status === "Paid" 
                            ? "bg-green-100 text-green-800 border border-green-200" 
                            : "bg-orange-100 text-orange-800 border border-orange-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          inv.status === "Paid" ? "bg-green-500" : "bg-orange-500"
                        }`}></span>
                        {inv.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-500">Amount</span>
                      <span className="font-bold text-lg text-gray-900">${inv.amount.toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium text-gray-900">{(validCurrentPage - 1) * rowsPerPage + 1}</span> to{' '}
                  <span className="font-medium text-gray-900">
                    {Math.min(validCurrentPage * rowsPerPage, sortedFiltered.length)}
                  </span>{' '}
                  of <span className="font-medium text-gray-900">{sortedFiltered.length}</span> {sortedFiltered.length === 1 ? 'result' : 'results'}
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Page Size Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setPageSizeOpen(!pageSizeOpen)}
                      onBlur={() => setTimeout(() => setPageSizeOpen(false), 200)}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      aria-haspopup="listbox"
                      aria-expanded={pageSizeOpen}
                    >
                      {rowsPerPage} per page
                      <ChevronLeft
                        className={`w-4 h-4 transition-transform ${pageSizeOpen ? 'rotate-90' : ''}`}
                      />
                    </button>
                    {pageSizeOpen && (
                      <div 
                        className="absolute bottom-full mb-2 right-0 z-20 w-40 py-2 bg-white rounded-lg shadow-xl border border-gray-200"
                        role="listbox"
                      >
                        {[4, 8, 12, 20].map((size) => (
                          <button
                            key={size}
                            onClick={(e) => {
                              e.preventDefault();
                              setRowsPerPage(size);
                              setCurrentPage(1);
                              setPageSizeOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                              rowsPerPage === size ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                            }`}
                            role="option"
                            aria-selected={rowsPerPage === size}
                          >
                            {size} per page
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pagination Buttons */}
                  <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={validCurrentPage === 1}
                      className="p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border-l border-r border-gray-200">
                      {validCurrentPage} / {totalPages}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={validCurrentPage === totalPages}
                      className="p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
};

export default PaymentsPage;
