import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
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
    <div className="p-5 bg-white rounded-lg shadow animate-pulse">
      <div className="w-3/4 h-4 mb-2 bg-gray-200 rounded"></div>
      <div className="w-1/2 h-6 bg-gray-200 rounded"></div>
    </div>
  );

  const SkeletonRow = () => (
    <tr className="border-b animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="w-full h-4 bg-gray-200 rounded"></div>
        </td>
      ))}
    </tr>
  );

  /* ---------- render ---------- */
  if (isLoading)
    return (
      <main className="p-5 overflow-x-hidden max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="p-5 bg-white rounded-lg shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th>Model Type</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </main>
    );

  if (error)
    return (
      <main className="flex flex-col items-center justify-center p-5 text-red-500 h-96">
        <AlertTriangle size={48} className="mb-3" />
        <p className="text-lg">Couldn’t load payments.</p>
      </main>
    );

  if (!invoices.length)
    return (
      <main className="flex flex-col items-center justify-center p-5 text-gray-400 h-96">
        <CreditCard size={48} className="mb-3" />
        <p className="text-lg">No invoices yet.</p>
      </main>
    );

  return (
    <main className="p-5 overflow-x-hidden max-w-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
        <motion.div
          className="flex items-center justify-between p-5 text-blue-500 bg-white rounded-lg shadow"
          whileHover={{ scale: 1.02 }}
        >
          <div>
            <h3 className="text-sm text-gray-500">Total Invoices</h3>
            <p className="text-2xl font-bold text-gray-800">
              ${totalAmount.toLocaleString()}
            </p>
          </div>
          <CreditCard className="w-8 h-8" />
        </motion.div>

        <motion.div
          className="flex items-center justify-between p-5 text-green-500 bg-white rounded-lg shadow"
          whileHover={{ scale: 1.02 }}
        >
          <div>
            <h3 className="text-sm text-gray-500">Paid</h3>
            <p className="text-2xl font-bold text-gray-800">
              ${paidAmount.toLocaleString()}
            </p>
          </div>
          <CheckCircle className="w-8 h-8" />
        </motion.div>

        <motion.div
          className="flex items-center justify-between p-5 text-red-500 bg-white rounded-lg shadow"
          whileHover={{ scale: 1.02 }}
        >
          <div>
            <h3 className="text-sm text-gray-500">Unpaid</h3>
            <p className="text-2xl font-bold text-gray-800">
              ${unpaidAmount.toLocaleString()}
            </p>
          </div>
          <XCircle className="w-8 h-8" />
        </motion.div>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          {(["All status", "Paid", "Unpaid"] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded text-sm font-medium transition ${
                filter === status
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search Product..."
          className="w-full sm:w-64 px-3 py-2 border rounded-lg outline-orange-500"
        />
      </div>

      {/* Table */}
      <div className="p-5 overflow-x-auto bg-white rounded-lg shadow">
        {/* Desktop Table View */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Model Type</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center text-gray-500">
                      <CreditCard size={40} className="mb-2" />
                      <p className="text-sm font-medium">
                        No payments found for "{filter.toLowerCase()}".
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {paginated.map((inv) => (
                    <motion.tr
                      key={inv.id}
                      className="border-b hover:bg-gray-50"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium capitalize">{inv.modelType}</div>
                      </td>
                      <td>{inv.date}</td>
                      <td>${inv.amount.toLocaleString()}</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-lg text-white text-xs font-semibold ${
                            inv.status === "Paid" ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
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
        <div className="grid gap-4 md:hidden">
          {paginated.length === 0 ? (
            <div className="py-12 text-center">
              <div className="flex flex-col items-center text-gray-500">
                <CreditCard size={40} className="mb-2" />
                <p className="text-sm font-medium">
                  No payments found for "{filter.toLowerCase()}".
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {paginated.map((inv) => (
                <motion.div
                  key={inv.id}
                  className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <span className="text-xs text-gray-500">Model Type</span>
                      <p className="font-medium capitalize">{inv.modelType}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Date</span>
                      <p className="font-medium">{inv.date}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <span className="text-xs text-gray-500">Amount</span>
                      <p className="font-medium text-lg">${inv.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Status</span>
                      <span
                        className={`inline-block px-3 py-1 rounded-lg text-white text-xs font-semibold ${
                          inv.status === "Paid" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{(validCurrentPage - 1) * rowsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(validCurrentPage * rowsPerPage, sortedFiltered.length)}
              </span>{' '}
              of <span className="font-medium">{sortedFiltered.length}</span> {sortedFiltered.length === 1 ? 'result' : 'results'}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Page Size Selector */}
              <div className="relative">
                <button
                  onClick={() => setPageSizeOpen(!pageSizeOpen)}
                  onBlur={() => setTimeout(() => setPageSizeOpen(false), 200)}
                  className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  aria-haspopup="listbox"
                  aria-expanded={pageSizeOpen}
                >
                  {rowsPerPage} per page
                  <svg
                    className={`w-4 h-4 transition-transform ${pageSizeOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {pageSizeOpen && (
                  <div 
                    className="absolute bottom-full mb-1 right-0 z-10 w-40 py-1 bg-white rounded-md shadow-lg border border-gray-200"
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
                        className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                          rowsPerPage === size ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
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
              <div className="flex items-center border rounded-lg overflow-hidden divide-x">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={validCurrentPage === 1}
                  className="p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  aria-label="Previous page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="px-4 py-2 text-sm text-gray-700 bg-gray-50">
                  {validCurrentPage} / {totalPages}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={validCurrentPage === totalPages}
                  className="p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  aria-label="Next page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default PaymentsPage;
