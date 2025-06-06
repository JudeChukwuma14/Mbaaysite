import React, { useState } from "react";
import { Sun, Moon, Bell, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../Context/DarkModeContext";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { get_single_vendor } from "@/utils/vendorApi";

const VendorHeader: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [showNotifications, setShowNotifications] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  interface RootState {
    vendor: {
      vendor: {
        name: string;
      };
      user: {
        name: string;
      };
    };
  }

  const user: any = useSelector((state: RootState) => state.vendor);

  const { data: vendors } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => get_single_vendor(user.token),
  });

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
    {
      id: 3,
      message: "OKonkwo Hilary added your product on wishlist",
      date: "Sep 20, 2024",
      time: "2:20pm",
    },
    {
      id: 3,
      message: "OKonkwo Hilary added your product on wishlist",
      date: "Sep 20, 2024",
      time: "2:20pm",
    },
    {
      id: 3,
      message: "OKonkwo Hilary added your product on wishlist",
      date: "Sep 20, 2024",
      time: "2:20pm",
    },
    {
      id: 1,
      message: "Giovanni Kamper commented on your post",
      detail: "This Looks great!! Let's get started on it.",
      date: "Sep 20, 2024",
      time: "2:20pm",
      avatar: "/path-to-avatar1.png",
    },
  ];

  return (
    <header
      className={`p-4 flex justify-between items-center shadow-md transition-colors ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-xl font-semibold">
        {getGreeting()},{" "}
        <span className="text-orange-500">
          {/* {user?.vendor?.storeName?.charAt(0)?.toUpperCase() +
            user?.vendor?.storeName?.slice(1)} */}
          {vendors?.storeName}
        </span>
      </h1>
      <div className="flex items-center gap-4">
        {/* Search Box */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className={`p-2 pr-10 rounded border outline-orange-500 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-orange-500 text-gray-900"
            }`}
          />
          <Search className="absolute text-orange-500 right-2 top-2" />
        </div>

        {/* Light/Dark Mode Button */}
        <button onClick={toggleDarkMode} aria-label="Toggle Dark Mode">
          {darkMode ? (
            <Sun className="text-yellow-400" />
          ) : (
            <Moon className="text-gray-500" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell className="text-gray-500" />
            {notifications.length > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className={`absolute right-0 mt-2 w-80 shadow-lg rounded-lg overflow-hidden ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  <button
                    onClick={() => setShowNotifications(false)}
                    aria-label="Close Notifications"
                  >
                    <X className="text-gray-500" />
                  </button>
                </div>
                <div className="overflow-y-auto max-h-64">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 p-4 border-b ${
                        darkMode
                          ? "border-gray-700 hover:bg-gray-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {notification.avatar ? (
                        <img
                          src={notification.avatar}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-orange-500 rounded-full">
                          {notification.message[0]}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{notification.message}</p>
                        {notification.detail && (
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {notification.detail}
                          </p>
                        )}
                        <span
                          className={`text-xs ${
                            darkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          {notification.time} - {notification.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-4">
                  <button className="text-orange-500">Mark as read</button>
                  <button className="px-4 py-2 text-white bg-orange-500 rounded">
                    View All Notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {!vendors?.avatar ? (
          <div className="w-[50px] h-[50px] rounded-[50%] bg-orange-300 text-white flex items-center justify-center">
            {vendors?.storeName?.charAt(0)?.toUpperCase()}
          </div>
        ) : (
          <img
            src={vendors?.avatar}
            alt="Vendor"
            className="w-10 h-10 rounded-full"
          />
        )}
      </div>
    </header>
  );
};

export default VendorHeader;
