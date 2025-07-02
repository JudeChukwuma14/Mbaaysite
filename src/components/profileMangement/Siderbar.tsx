import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LogOutIcon,
  NotebookIcon,
  Wallet,
  MessagesSquare,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/userSlice";

interface SidebarItem {
  icons: React.ReactNode;
  label: string;
  urlLink?: string;
  children?: { title: string; link: string }[];
}

// Sidebar layout data
const sidebarLayout: SidebarItem[] = [
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
    label: "Payment Method",
    urlLink: "/dashboard/checkout",
  },
  {
    icons: <NotebookIcon size={20} />,
    label: "Addresses",
    urlLink: "/dashboard/addresses",
  },
  {
    icons: <MessagesSquare size={20} />,
    label: "Index",
    urlLink: "/dashboard/user-index",
  },
  {
    icons: <ShoppingCartIcon size={20} />,
    label: "Order",

    children: [
      { title: "Order List", link: "/dashboard/orderlist" },
      { title: "Order Detail", link: "/dashboard/orderdetail" },
      { title: "Cancellation Page", link: "/dashboard/canclellation" },
      { title: "Review", link: "/dashboard/review" },
    ],
  },
];

const Siderbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const handleItemClick = (label: string) => {
    if (openDropdown !== label) {
      setOpenDropdown(null);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

 return (
    <section className="sticky left-0 top-0 flex h-screen w-full flex-col justify-between p-6 pt-24 text-black bg-[#F3F4F6] max-sm:hidden lg:w-[264px]">
      <div className="flex flex-col gap-2">
        {sidebarLayout.map((item) => {
          const isActive = location.pathname === item.urlLink;
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.label}>
              {item.urlLink ? (
                <NavLink
                  to={item.urlLink}
                  className={`flex items-center p-3 gap-3 ${
                    isActive ? "bg-orange-500 text-white" : "hover:bg-orange-300"
                  }`}
                  onClick={() => handleItemClick(item.label)}
                >
                  {item.icons}
                  <p className="font-semibold">{item.label}</p>
                </NavLink>
              ) : (
                <motion.div
                  className={`flex items-center p-3 gap-3 cursor-pointer ${
                    openDropdown === item.label ? "bg-orange-500 text-white" : "hover:bg-orange-300"
                  }`}
                  onClick={() => toggleDropdown(item.label)}
                  whileHover={{ scale: 1.02 }} // Subtle hover animation
                  transition={{ duration: 0.2 }}
                >
                  {item.icons}
                  <p className="font-semibold">{item.label}</p>
                  {hasChildren && (
                    <span className="ml-auto">
                      {openDropdown === item.label ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </span>
                  )}
                </motion.div>
              )}
              {hasChildren && (
                <AnimatePresence>
                  {openDropdown === item.label && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="pl-8 mt-2 space-y-2 overflow-hidden"
                    >
                      {item.children?.map((child) => (
                        <NavLink
                          key={child.title}
                          to={child.link}
                          className="flex items-center p-2 rounded-lg hover:bg-orange-300"
                        >
                          <p className="font-semibold">{child.title}</p>
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
        className="flex items-center gap-4 p-3 hover:bg-orange-300"
      >
        <LogOutIcon width={30} />
        <p className="text-sm font-semibold">Logout</p>
      </button>
    </section>
  );
};

export default Siderbar;
