import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LogOutIcon,
  Menu,
  Wallet,
  NotebookIcon,
  MessagesSquare,
} from "lucide-react";
import { useState } from "react";
import { logout } from "@/redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Define the interface for sidebar items
interface SidebarItem {
  icons: React.ReactNode;
  label: string;
  urlLink?: string; // Make urlLink optional
  children?: { title: string; link: string }[]; // Optional children for dropdown
}

// Sidebar layout data
const sidebarLayout: SidebarItem[] = [
  {
    icons: <UserIcon size={25} />,
    label: "My Profile",
    urlLink: "/dashboard",
  },
  {
    icons: <HeartIcon size={25} />,
    label: "My Wishlist",
    urlLink: "/dashboard/wishlist",
  },
  {
    icons: <Wallet size={25} />,
    label: "Payment Method",
    urlLink: "/dashboard/checkout",
  },
  {
    icons: <NotebookIcon size={25} />,
    label: "Addresses",
    urlLink: "/dashboard/addresses",
  },
  {
    icons: <MessagesSquare size={25} />,
    label: "Index",
    urlLink: "/dashboard/user-index",
  },
  {
    icons: <ShoppingCartIcon width={30} />,
    label: "Order",
    children: [
      { title: "Order List", link: "/dashboard/orderlist" },
      { title: "Order Detail", link: "/dashboard/orderdetail" },
      { title: "Cancellation Page", link: "/dashboard/canclellation" },
      { title: "Review", link: "/dashboard/review" },
    ],
  },
];

const MobileNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // Access user and vendor from Redux store
  const { user } = useSelector((state: RootState) => state.user);
  const { vendor } = useSelector((state: RootState) => state.vendor);

  // Determine the display name and initials
  const displayName = user?.name || vendor?.storeName || "";
  const initials = displayName
    ? displayName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "";

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
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Menu size={40} className="text-orange-500" />
          </motion.div>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-[#F3F4F6] border-none gap-1 text-black"
        >
          {/* Logo and Initials */}
          <div className="flex items-center justify-between">
            <Link to="/" className="z-10 flex items-center gap-1">
              <img
                src="https://mbaaysite-6b8n.vercel.app/assets/MBLogo-spwX6zWd.png"
                alt=""
                width={60}
                height={60}
              />
            </Link>
            {initials && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-white bg-orange-500 rounded-full"
                title={displayName}
              >
                {initials}
              </motion.div>
            )}
          </div>

          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto pt-10">
            <div>
              <div className="flex flex-col flex-1 gap-2">
                {sidebarLayout.map((item) => {
                  const isActive = location.pathname === item.urlLink;
                  const hasChildren = item.children && item.children.length > 0;

                  return (
                    <div key={item.label}>
                      {item.urlLink ? (
                        <SheetClose asChild>
                          <NavLink
                            to={item.urlLink}
                            className={`flex items-center p-3 gap-4 ${isActive
                                ? "bg-orange-500 text-white"
                                : "hover:bg-orange-300"
                              }`}
                            onClick={() => handleItemClick(item.label)}
                          >
                            {item.icons}
                            <p className="text-sm font-semibold">{item.label}</p>
                          </NavLink>
                        </SheetClose>
                      ) : (
                        <motion.div
                          className={`flex items-center p-3 gap-4 cursor-pointer ${openDropdown === item.label
                              ? "bg-orange-500 text-white"
                              : "hover:bg-orange-300"
                            }`}
                          onClick={() => toggleDropdown(item.label)}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.icons}
                          <p className="text-sm font-semibold">{item.label}</p>
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
                                <SheetClose asChild key={child.title}>
                                  <NavLink
                                    to={child.link}
                                    className="flex items-center p-2 hover:bg-orange-300"
                                  >
                                    <p className="text-sm font-semibold">
                                      {child.title}
                                    </p>
                                  </NavLink>
                                </SheetClose>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  );
                })}
              </div>

              <SheetClose asChild>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full gap-4 p-3 mt-16 hover:bg-orange-300"
                >
                  <LogOutIcon width={25} />
                  <p className="text-sm font-semibold">Logout</p>
                </button>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};




export default MobileNavbar;
