// "use client";

// import type React from "react";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import {
//   HeartIcon,
//   ShoppingCartIcon,
//   UserIcon,
//   ChevronDownIcon,
//   ChevronUpIcon,
//   LogOutIcon,
//   Wallet,
//   MessagesSquare,
// } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { logout } from "@/redux/slices/userSlice";
// import { clearSessionId } from "@/redux/slices/sessionSlice";

// interface SidebarItem {
//   icons: React.ReactNode;
//   label: string;
//   urlLink?: string;
//   children?: { title: string; link: string }[];
// }

// // Sidebar layout data
// const sidebarLayout: SidebarItem[] = [
//   {
//     icons: <UserIcon size={20} />,
//     label: "My Profile",
//     urlLink: "/dashboard",
//   },
//   {
//     icons: <HeartIcon size={20} />,
//     label: "My Wishlist",
//     urlLink: "/dashboard/wishlist",
//   },
//   {
//     icons: <Wallet size={20} />,
//     label: "Payment",
//     urlLink: "/dashboard/checkout",
//   },
//   {
//     icons: <MessagesSquare size={20} />,
//     label: "Messages",
//     urlLink: "/dashboard/messages",
//   },
//   {
//     icons: <ShoppingCartIcon size={20} />,
//     label: "Order",
//     children: [
//       { title: "Order List", link: "/dashboard/orderlist" },
//       { title: "Cancel Order", link: "/dashboard/canclellation" },
//       { title: "Return Order", link: "/dashboard/retrunproduct" },
//     ],
//   },
// ];

// const Siderbar: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);

//   const toggleDropdown = (label: string) => {
//     setOpenDropdown((prev) => (prev === label ? null : label));
//   };

//   const handleItemClick = (label: string) => {
//     if (openDropdown !== label) {
//       setOpenDropdown(null);
//     }
//   };

//   const handleLogout = () => {
//     dispatch(clearSessionId());
//     dispatch(logout());
//     navigate("/signin");
//   };

//   return (
//     <section className="sticky left-0 top-0 flex h-screen w-full flex-col justify-between p-6 pt-24 text-black bg-[#F3F4F6] max-sm:hidden lg:w-[200px]">

//       <div className="flex flex-col gap-2">
//         {sidebarLayout.map((item) => {
//           const isActive = location.pathname === item.urlLink;
//           const hasChildren = item.children && item.children.length > 0;
//           return (
//             <div key={item.label}>
//               {item.urlLink ? (
//                 <NavLink
//                   to={item.urlLink}
//                   className={`flex items-center p-3 gap-3 rounded-lg transition-colors ${
//                     isActive
//                       ? "bg-orange-500 text-white"
//                       : "hover:bg-orange-300"
//                   }`}
//                   onClick={() => handleItemClick(item.label)}
//                 >
//                   {item.icons}
//                   <p className="font-semibold text-[0.9rem]">{item.label}</p>
//                 </NavLink>
//               ) : (
//                 <motion.div
//                   className={`flex items-center p-3 gap-3 cursor-pointer rounded-lg transition-colors ${
//                     openDropdown === item.label
//                       ? "bg-orange-500 text-white"
//                       : "hover:bg-orange-300"
//                   }`}
//                   onClick={() => toggleDropdown(item.label)}
//                   whileHover={{ scale: 1.02 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   {item.icons}
//                   <p className="font-semibold text-[0.9rem]">{item.label}</p>
//                   {hasChildren && (
//                     <span className="ml-auto">
//                       {openDropdown === item.label ? (
//                         <ChevronUpIcon />
//                       ) : (
//                         <ChevronDownIcon />
//                       )}
//                     </span>
//                   )}
//                 </motion.div>
//               )}
//               {hasChildren && (
//                 <AnimatePresence>
//                   {openDropdown === item.label && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: "auto", opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.3, ease: "easeInOut" }}
//                       className="pl-8 mt-2 space-y-2 overflow-hidden"
//                     >
//                       {item.children?.map((child) => (
//                         <NavLink
//                           key={child.title}
//                           to={child.link}
//                           className="flex items-center p-2 rounded-lg hover:bg-orange-300 transition-colors"
//                         >
//                           <p className="font-semibold text-[0.9rem]">{child.title}</p>
//                         </NavLink>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               )}
//             </div>
//           );
//         })}
//       </div>
//       <button
//         onClick={handleLogout}
//         className="flex items-center gap-4 p-3 hover:bg-orange-300 rounded-lg transition-colors"
//       >
//         <LogOutIcon width={30} />
//         <p className="text-sm font-semibold">Logout</p>
//       </button>
//     </section>
//   );
// };

// export default Siderbar;


"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LogOutIcon,
  Wallet,
  MessagesSquare,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/userSlice";
import { clearSessionId } from "@/redux/slices/sessionSlice";
import type { RootState } from "@/redux/store";

const Siderbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Get total unread messages from Redux
  const totalUnreadMessages = useSelector(
    (state: RootState) => state.notifications.totalUnreadMessages || 0
  );

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const handleItemClick = (label: string) => {
    if (openDropdown !== label) {
      setOpenDropdown(null);
    }
  };

  const handleLogout = () => {
    dispatch(clearSessionId());
    dispatch(logout());
    navigate("/signin");
  };

  const sidebarLayout = [
    {
      icons: <UserIcon size={20} />,
      label: "My Profile",
      urlLink: "/dashboard",
    },
    {
      icons: <HeartIcon size={20} />,
      label: "My Wishlist",
      urlLink: "/dashboard/wishlist",
    },
    {
      icons: <Wallet size={20} />,
      label: "Payment",
      urlLink: "/dashboard/checkout",
    },
    {
      icons: <MessagesSquare size={20} />,
      label: "Messages",
      urlLink: "/dashboard/messages",
      showBadge: totalUnreadMessages > 0,           // ← Add logic
      badgeCount: totalUnreadMessages,
    },
    {
      icons: <ShoppingCartIcon size={20} />,
      label: "Order",
      children: [
        { title: "Order List", link: "/dashboard/orderlist" },
        { title: "Cancel Order", link: "/dashboard/canclellation" },
        { title: "Return Order", link: "/dashboard/retrunproduct" },
      ],
    },
  ];

  return (
    <section className="sticky left-0 top-0 flex h-screen w-full flex-col justify-between p-6 pt-24 text-black bg-[#F3F4F6] max-sm:hidden lg:w-[200px]">
      <div className="flex flex-col gap-2">
        {sidebarLayout.map((item) => {
          const isActive = location.pathname === item.urlLink;
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.label} className="relative">
              {item.urlLink ? (
                <NavLink
                  to={item.urlLink}
                  className={`flex items-center justify-between p-3 gap-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "hover:bg-orange-300"
                  }`}
                  onClick={() => handleItemClick(item.label)}
                >
                  <div className="flex items-center gap-3">
                    {item.icons}
                    <p className="font-semibold text-[0.9rem]">{item.label}</p>
                  </div>

                  {/* Unread Badge */}
                  {item.showBadge && item.badgeCount > 0 && (
                    <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                      {item.badgeCount > 99 ? "99+" : item.badgeCount}
                    </span>
                  )}
                </NavLink>
              ) : (
                // ... rest of dropdown logic (unchanged)
                <motion.div
                  className={`flex items-center justify-between p-3 gap-3 cursor-pointer rounded-lg transition-colors ${
                    openDropdown === item.label
                      ? "bg-orange-500 text-white"
                      : "hover:bg-orange-300"
                  }`}
                  onClick={() => toggleDropdown(item.label)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    {item.icons}
                    <p className="font-semibold text-[0.9rem]">{item.label}</p>
                  </div>
                  {hasChildren && (
                    <span className="ml-auto">
                      {openDropdown === item.label ? (
                        <ChevronUpIcon />
                      ) : (
                        <ChevronDownIcon />
                      )}
                    </span>
                  )}
                </motion.div>
              )}

              {/* Dropdown children */}
              {hasChildren && (
                <AnimatePresence>
                  {openDropdown === item.label && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-8 mt-2 space-y-2 overflow-hidden"
                    >
                      {item.children?.map((child) => (
                        <NavLink
                          key={child.title}
                          to={child.link}
                          className="flex items-center p-2 rounded-lg hover:bg-orange-300 transition-colors"
                        >
                          <p className="font-semibold text-[0.9rem]">{child.title}</p>
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-4 p-3 hover:bg-orange-300 rounded-lg transition-colors"
      >
        <LogOutIcon width={30} />
        <p className="text-sm font-semibold">Logout</p>
      </button>
    </section>
  );
};

export default Siderbar;