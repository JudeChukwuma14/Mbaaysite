import React, { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import VendorHeader from "./VendorHeader";
import { Outlet } from "react-router-dom";

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <DashboardSidebar darkMode={darkMode} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <VendorHeader darkMode={darkMode} setDarkMode={setDarkMode} />

          {/* Scrollable Outlet */}
          <main className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
