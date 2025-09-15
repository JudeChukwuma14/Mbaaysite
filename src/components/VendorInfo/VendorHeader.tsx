"use client";

import type React from "react";
import { useState } from "react";
import { Sun, Moon, Bell, X, Check, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../Context/DarkModeContext";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  get_single_vendor,
  getVendorNotification,
  markOneAsRead,
  markVendorNotificationAsRead,
} from "@/utils/vendorApi";

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
  const queryClient = useQueryClient();

  const { data: vendors } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => get_single_vendor(user.token),
  });

  const { data: notificationsData } = useQuery({
    queryKey: ["vendorNotification", user.vendor._id],
    queryFn: () => getVendorNotification(user.vendor._id),
  });
  const notifications = notificationsData?.data.notifications;

  // Mark All Read
  const markNotificationAsRead = useMutation({
    mutationFn: () => markVendorNotificationAsRead(user.vendor._id),
    onSuccess: (data) => console.log("Mark Success:", data),
    onError: (err: any) =>
      console.error(err?.response?.data?.message || "Mark failed"),
  });

  const markSingleNotificationAsRead = useMutation({
    mutationFn: ({
      vendorId,
      notificationId,
    }: {
      vendorId: string | any;
      notificationId: string;
    }) => {
      return markOneAsRead(notificationId, vendorId);
    },
    onSuccess: (data) => {
      console.log("Single notification marked as read:", data);
      // Refetch notifications to update the UI
      queryClient.invalidateQueries({
        queryKey: ["vendorNotification", user.vendor._id],
      });
    },
    onError: (err: any) =>
      console.error(err?.response?.data?.message || "Mark single failed"),
  });

  const handleMarkAllNot = () => markNotificationAsRead.mutate();
  const handleMarkSingleNotification = (
    notificationId: string,
    vendorId: string
  ) => {
    markSingleNotificationAsRead.mutate({ notificationId, vendorId });
  };

  const unreadCount = notifications?.filter((n: any) => !n.isRead)?.length || 0;

  return (
    <header
      className={`p-4 flex justify-between items-center shadow-md transition-colors ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-xl font-semibold">
        {getGreeting()},{" "}
        <span className="text-orange-500">{vendors?.storeName}</span>
      </h1>
      <div className="flex items-center gap-4">
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
            className="relative p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Bell className="text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className={`absolute right-0 mt-2 w-96 shadow-xl rounded-xl overflow-hidden border z-50 ${
                  darkMode
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-900 border-gray-200"
                }`}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`flex items-center justify-between p-4 border-b ${
                    darkMode
                      ? "border-gray-700 bg-gray-750"
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <div>
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {unreadCount} unread notifications
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    aria-label="Close Notifications"
                    className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors`}
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="overflow-y-auto max-h-80">
                  {notifications?.length > 0 ? (
                    notifications.map((notification: any, index: number) => (
                      <div
                        key={notification.id || index}
                        className={`group relative flex items-start gap-3 p-4 border-b transition-all ${
                          darkMode
                            ? "border-gray-700 hover:bg-gray-750"
                            : "border-gray-100 hover:bg-gray-50"
                        } ${
                          !notification.isRead
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : ""
                        }`}
                      >
                        {/* Avatar */}
                        {notification.avatar ? (
                          <img
                            src={notification.avatar || "/placeholder.svg"}
                            alt="Avatar"
                            className="flex-shrink-0 w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 font-bold text-white rounded-full bg-gradient-to-br from-orange-400 to-orange-600">
                            {notification.message?.[0]?.toUpperCase() || "N"}
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p
                                className={`font-medium text-sm leading-relaxed ${
                                  !notification.isRead
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {notification.message}
                              </p>
                              {notification.detail && (
                                <p
                                  className={`text-sm mt-1 ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {notification.detail}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <span
                                  className={`text-xs ${
                                    darkMode ? "text-gray-500" : "text-gray-400"
                                  }`}
                                >
                                  {notification.time} • {notification.date}
                                </span>
                                {!notification.isRead && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                            </div>

                            {/* Individual Mark as Read Button */}
                            {!notification.isRead && (
                              <button
                                onClick={() =>
                                  handleMarkSingleNotification(
                                    notification.recipient,
                                    notification._id
                                  )
                                }
                                className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-full transition-all hover:scale-110 ${
                                  darkMode
                                    ? "hover:bg-gray-600 text-gray-400 hover:text-white"
                                    : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                                }`}
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Bell
                        className={`w-12 h-12 mb-3 ${
                          darkMode ? "text-gray-600" : "text-gray-300"
                        }`}
                      />
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        No notifications yet
                      </p>
                    </div>
                  )}
                </div>

                {notifications?.length > 0 && unreadCount > 0 && (
                  <div
                    className={`p-4 border-t ${
                      darkMode
                        ? "border-gray-700 bg-gray-750"
                        : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <button
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg font-medium transition-all hover:shadow-lg transform hover:scale-[1.02]"
                      onClick={handleMarkAllNot}
                      disabled={markNotificationAsRead.isPending}
                    >
                      <CheckCheck className="w-4 h-4" />
                      {markNotificationAsRead.isPending
                        ? "Marking..."
                        : "Mark All as Read"}
                    </button>
                  </div>
                )}
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
            src={vendors?.avatar || "/placeholder.svg"}
            alt="Vendor"
            className="w-10 h-10 rounded-full"
          />
        )}
      </div>
    </header>
  );
};

export default VendorHeader;

// import React, { useState } from "react";
// import { Sun, Moon, Bell, X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useDarkMode } from "../Context/DarkModeContext";
// import { useSelector } from "react-redux";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import {
//   get_single_vendor,
//   getVendorNotification,
//   markVendorNotificationAsRead,
// } from "@/utils/vendorApi";

// const VendorHeader: React.FC = () => {
//   const { darkMode, toggleDarkMode } = useDarkMode();
//   const [showNotifications, setShowNotifications] = useState(false);

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Good Morning";
//     if (hour < 18) return "Good Afternoon";
//     return "Good Evening";
//   };

//   interface RootState {
//     vendor: {
//       vendor: {
//         name: string;
//       };
//       user: {
//         name: string;
//       };
//     };
//   }

//   const user: any = useSelector((state: RootState) => state.vendor);

//   const { data: vendors } = useQuery({
//     queryKey: ["vendor"],
//     queryFn: () => get_single_vendor(user.token),
//   });

//   // const notifications = [
//   //   {
//   //     id: 1,
//   //     message: "Giovanni Kamper commented on your post",
//   //     detail: "This Looks great!! Let's get started on it.",
//   //     date: "Sep 20, 2024",
//   //     time: "2:20pm",
//   //     avatar: "/path-to-avatar1.png",
//   //   },
//   //   {
//   //     id: 2,
//   //     message: "Kessler Vester started following you",
//   //     date: "Sep 20, 2024",
//   //     time: "2:20pm",
//   //     avatar: "/path-to-avatar2.png",
//   //   },
//   //   {
//   //     id: 3,
//   //     message: "OKonkwo Hilary added your product on wishlist",
//   //     date: "Sep 20, 2024",
//   //     time: "2:20pm",
//   //   },
//   //   {
//   //     id: 3,
//   //     message: "OKonkwo Hilary added your product on wishlist",
//   //     date: "Sep 20, 2024",
//   //     time: "2:20pm",
//   //   },
//   //   {
//   //     id: 3,
//   //     message: "OKonkwo Hilary added your product on wishlist",
//   //     date: "Sep 20, 2024",
//   //     time: "2:20pm",
//   //   },
//   //   {
//   //     id: 3,
//   //     message: "OKonkwo Hilary added your product on wishlist",
//   //     date: "Sep 20, 2024",
//   //     time: "2:20pm",
//   //   },
//   //   {
//   //     id: 1,
//   //     message: "Giovanni Kamper commented on your post",
//   //     detail: "This Looks great!! Let's get started on it.",
//   //     date: "Sep 20, 2024",
//   //     time: "2:20pm",
//   //     avatar: "/path-to-avatar1.png",
//   //   },
//   // ];

//   const { data: notificationsData } = useQuery({
//     queryKey: ["vendorNotification", user.vendor._id],
//     queryFn: () => getVendorNotification(user.vendor._id),
//   });
//   const notifications = notificationsData?.data.notifications;
//   // console.log("Notifications:", notifications);

//   // Mark All Read
//   const markNotificationAsRead = useMutation({
//     mutationFn: () => markVendorNotificationAsRead(user.vendor._id),
//     onSuccess: (data) => console.log("Mark Success:", data),
//     onError: (err: any) =>
//       console.error(err?.response?.data?.message || "Mark failed"),
//   });

//   const handleMarkAllNot = () => markNotificationAsRead.mutate();
//   return (
//     <header
//       className={`p-4 flex justify-between items-center shadow-md transition-colors ${
//         darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
//       }`}
//     >
//       <h1 className="text-xl font-semibold">
//         {getGreeting()},{" "}
//         <span className="text-orange-500">
//           {/* {user?.vendor?.storeName?.charAt(0)?.toUpperCase() +
//             user?.vendor?.storeName?.slice(1)} */}
//           {vendors?.storeName}
//         </span>
//       </h1>
//       <div className="flex items-center gap-4">
//         {/* Light/Dark Mode Button */}
//         <button onClick={toggleDarkMode} aria-label="Toggle Dark Mode">
//           {darkMode ? (
//             <Sun className="text-yellow-400" />
//           ) : (
//             <Moon className="text-gray-500" />
//           )}
//         </button>

//         {/* Notifications */}
//         <div className="relative">
//           <button
//             onClick={() => setShowNotifications(!showNotifications)}
//             aria-label="Notifications"
//           >
//             <Bell className="text-gray-500" />
//             {notifications?.length > 0 && (
//               <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
//                 {notifications?.length}
//               </span>
//             )}
//           </button>

//           {/* Notification Dropdown */}
//           <AnimatePresence>
//             {showNotifications && (
//               <motion.div
//                 className={`absolute right-0 mt-2 w-80 shadow-lg rounded-lg overflow-hidden ${
//                   darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
//                 }`}
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="flex items-center justify-between p-4 border-b">
//                   <h2 className="text-lg font-semibold">Notifications</h2>
//                   <button
//                     onClick={() => setShowNotifications(false)}
//                     aria-label="Close Notifications"
//                   >
//                     <X className="text-gray-500" />
//                   </button>
//                 </div>
//                 <div className="overflow-y-auto max-h-64">
//                   {notifications?.map((notification: any) => (
//                     <div
//                       key={notification.id}
//                       className={`flex items-start gap-3 p-4 border-b ${
//                         darkMode
//                           ? "border-gray-700 hover:bg-gray-700"
//                           : "hover:bg-gray-100"
//                       }`}
//                     >
//                       {notification.avatar ? (
//                         <img
//                           src={notification.avatar}
//                           alt="Avatar"
//                           className="w-10 h-10 rounded-full"
//                         />
//                       ) : (
//                         <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-orange-500 rounded-full">
//                           {notification.message[0]}
//                         </div>
//                       )}
//                       <div className="flex-1">
//                         <p className="font-medium">{notification.message}</p>
//                         {notification.detail && (
//                           <p
//                             className={`text-sm ${
//                               darkMode ? "text-gray-400" : "text-gray-500"
//                             }`}
//                           >
//                             {notification.detail}
//                           </p>
//                         )}
//                         <span
//                           className={`text-xs ${
//                             darkMode ? "text-gray-500" : "text-gray-400"
//                           }`}
//                         >
//                           {notification.time} - {notification.date}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="flex items-center justify-between p-4">
//                   <button
//                     className="w-full px-4 py-2 text-white bg-orange-500 rounded"
//                     onClick={handleMarkAllNot}
//                   >
//                     Mark All Read
//                   </button>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//         {!vendors?.avatar ? (
//           <div className="w-[50px] h-[50px] rounded-[50%] bg-orange-300 text-white flex items-center justify-center">
//             {vendors?.storeName?.charAt(0)?.toUpperCase()}
//           </div>
//         ) : (
//           <img
//             src={vendors?.avatar}
//             alt="Vendor"
//             className="w-10 h-10 rounded-full"
//           />
//         )}
//       </div>
//     </header>
//   );
// };

// export default VendorHeader;
