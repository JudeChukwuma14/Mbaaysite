import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../static/Footer";
import Header from "./Header";
import Sidebar from "./Siderbar";

const AccountManagement: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn] = useState(false);

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex-1 flex flex-col">
          <Header isLoggedIn={isLoggedIn} isSidebarOpen={isSidebarOpen} />

          <main className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountManagement;
