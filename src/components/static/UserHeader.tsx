import React, { useState } from "react";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, Link } from "react-router-dom";
import Logo from "../../assets/image/MBLogo.png";
import {
  FaAddressBook,
  FaBars,
  FaChevronDown,
  FaChevronUp,
  FaCreditCard,
  FaHeart,
  FaShoppingCart,
  FaSignOutAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";

interface SidebarItemProps {
  icon?: JSX.Element;
  label?: string;
  section: string;
  link?: string;
  hasDropdown?: boolean;
  items?: { title: string; link: string }[];
}

const UserHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [ordersDropdownOpen, setOrdersDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const notifications = [
    {
      id: 1,
      message: "Giovanni Kamper commented on your post",
      detail: "This Looks great!! Let's get started on it.",
      date: "Sep 20, 2024",
      time: "2:20pm",
      avatar: "/path-to-avatar1.png",
    },
    {
      id: 2,
      message: "Kessler Vester started following you",
      date: "Sep 20, 2024",
      time: "2:20pm",
      avatar: "/path-to-avatar2.png",
    },
    {
      id: 3,
      message: "OKonkwo Hilary added your product on wishlist",
      date: "Sep 20, 2024",
      time: "2:20pm",
    },
  ];

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
        { title: "Cancellation Page", link: "/dashboard/cancellation" },
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
    <header className="p-4 flex justify-between items-center shadow-md bg-white">
      {/* Logo */}
      <NavLink to="/" className="flex items-center">
        <img src={Logo} alt="Logo" className="w-20 md:w-20" />
      </NavLink>

      {/* Notifications and Menu Button */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell className="text-gray-500" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  <button
                    onClick={() => setShowNotifications(false)}
                    aria-label="Close Notifications"
                  >
                    <X className="text-gray-500" />
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 p-4 border-b"
                    >
                      {notification.avatar ? (
                        <img
                          src={notification.avatar}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                          {notification.message[0]}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{notification.message}</p>
                        {notification.detail && (
                          <p className="text-sm">{notification.detail}</p>
                        )}
                        <span className="text-xs">
                          {notification.time} - {notification.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 flex justify-between items-center">
                  <button className="text-orange-500">Mark as read</button>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded">
                    View All Notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden">
          {menuOpen ? (
            <FaTimes size={24} className="text-gray-700" />
          ) : (
            <FaBars size={24} className="text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-lg">
            <nav className="p-4">
              {sidebarItems.map((item) => (
                <div key={item.section}>
                  <Link
                    to={item.link || "#"}
                    onClick={() => {
                      setActiveSection(item.section);
                      setOrdersDropdownOpen(
                        item.section === "orders" ? !ordersDropdownOpen : false
                      );
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
                  {item.hasDropdown &&
                    ordersDropdownOpen &&
                    activeSection === "orders" && (
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
        </div>
      )}
    </header>
  );
};

export default UserHeader;