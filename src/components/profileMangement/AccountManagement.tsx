import React, { useState } from "react";
import {
  FaUser,
  FaShoppingCart,
  FaHeart,
  FaAddressBook,
  FaCreditCard,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import image from "@/assets/image/bg1.jpg";
import { Outlet, Link } from "react-router-dom";
import Header from "../static/Header";
import Footer from "../static/Footer";

interface SidebarItemProps {
  icon?: JSX.Element;
  label?: string;
  section: string;
  link?: string;
  hasDropdown?: boolean;
  items?: { title: string; link: string }[];
}

const AccountManagement: React.FC = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [ordersDropdownOpen, setOrdersDropdownOpen] = useState(false);

  const sidebarItems: SidebarItemProps[] = [
    {
      icon: <FaUser />,
      label: "My Profile",
      section: "profile",
      link: "/dashboard",
    },
    {
      icon: <FaShoppingCart />,
      label: "My Orders",
      section: "orders",
      hasDropdown: true,
      items: [
        { title: "Order List", link: "/dashboard/orderlist" },
        { title: "Order Detail", link: "/dashboard/orderdetail" },
        { title: "Canclellation page", link: "/dashboard/canclellation" },
        { title: "Review", link: "/dashboard/review" },
      ],
    },
    {
      icon: <FaHeart />,
      label: "My Wishlist",
      section: "wishlist",
      link: "/dashboard/wishlist",
    },
    {
      icon: <FaAddressBook />,
      label: "Addresses",
      section: "addresses",
      link: "/dashboard/addresses",
    },
    {
      icon: <FaCreditCard />,
      label: "Payment Methods",
      section: "payments",
      link: "/dashboard/checkout",
    },
  ];

  return (
    <div>
      <Header />
      <div className="flex flex-col md:flex-row bg-gray-100 w-full">
        {/* Left Sidebar */}
        <div className="w-full md:w-72 lg:w-96 bg-white shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4">
              <img
                src={image}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold">John Doe</h2>
                <p className="text-gray-500">john.doe@example.com</p>
              </div>
            </div>
          </div>
          <nav className="p-4">
            {sidebarItems.map((item) => (
              <div key={item.section}>
                <Link
                  to={item.link || "#"}
                  onClick={() => {
                    setActiveSection(item.section);
                    setOrdersDropdownOpen(item.section === "orders" ? !ordersDropdownOpen : false);
                  }}
                  className={`flex items-center justify-between w-full p-3 rounded-lg mb-2 ${
                    activeSection === item.section
                      ? "bg-orange-500 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </div>
                  {item.hasDropdown &&
                    (ordersDropdownOpen ? <FaChevronUp /> : <FaChevronDown />)}
                </Link>
                {item.hasDropdown && ordersDropdownOpen && activeSection === "orders" && (
                  <div className="ml-6 mt-1">
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.title}
                        to={subItem.link}
                        className="block p-2 text-gray-700 hover:text-orange-500"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button className="flex items-center w-full p-3 rounded-lg text-red-500 hover:bg-gray-100">
              <FaSignOutAlt className="mr-3" /> Logout
            </button>
          </nav>
        </div>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountManagement;
