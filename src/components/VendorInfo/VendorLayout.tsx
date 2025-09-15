import React from "react";
import DashboardSidebar from "./DashboardSidebar";
import VendorHeader from "./VendorHeader";
import { Outlet } from "react-router-dom";
import { useDarkMode } from "../Context/DarkModeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ChatWidget } from "./VendorCustomerCare/CustomerCareWidget";
// Import dark mode context

const VendorLayout: React.FC = () => {
  const { darkMode } = useDarkMode(); // Use context instead of local state

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className={darkMode ? "dark" : ""}>
        <div className="flex h-screen">
          {/* Sidebar */}
          <DashboardSidebar darkMode={darkMode} />

          {/* Main Content */}
          <div className="flex flex-col flex-1">
            {/* Header */}
            <VendorHeader />{" "}
            {/* No need to pass darkMode here, since it can use the context */}
            {/* Scrollable Outlet */}
            <main className="flex-1 p-4 overflow-y-auto ">
              <Outlet />

              <span className="text-lg font-bold text-white">
                <ChatWidget />
              </span>
            </main>
          </div>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
};

export default VendorLayout;
