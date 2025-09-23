import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../static/Footer";
import Header from "../static/Header";
import ScrollToTop from "../Reuseable/ScrollToTop";
import { ChatWidget } from "../CustomerSupport/ChatWidget";

const WebLayout: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <ScrollToTop />
      <Header />
      {/* Add main content wrapper with padding-top */}
      <main className="pt-[158px] md:pt-[155px]"> 
        <Outlet />
      </main>
      <ChatWidget />
      <Footer />
    </div>
  );
};

export default WebLayout;