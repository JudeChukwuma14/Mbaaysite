import React, { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import VendorHeader from "./VendorHeader";
import { Outlet } from "react-router-dom";
import { useDarkMode } from "../Context/DarkModeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ChatWidget } from "./VendorCustomerCare/CustomerCareWidget";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
// import DashboardPaymentHandler from "./DashboardPaymentHandler";
// Import dark mode context


const VendorLayout: React.FC = () => {
  const { darkMode } = useDarkMode(); // Use context instead of local state
  const vendor = useSelector((state: RootState) => state.vendor);
  console.log("Vendor info",vendor)

  const queryClient = new QueryClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={darkMode ? "dark" : ""}>
        <div className="flex h-screen">
          {/* Sidebar */}
          {/* <DashboardPaymentHandler /> */}
          <DashboardSidebar 
            darkMode={darkMode} 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main Content */}
          <div className="flex flex-col flex-1">
            {/* Header */}
            <VendorHeader onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />{" "}
            {/* No need to pass darkMode here, since it can use the context */}
            {/* Scrollable Outlet */}
            <main className="flex-1 p-4 overflow-y-auto text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
              <Outlet />

              <span className="text-lg font-bold text-white">
                <ChatWidget />
              </span>
            </main>
          </div>
        </div>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
};

export default VendorLayout;
