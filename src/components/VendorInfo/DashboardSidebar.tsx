import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Home,
  Box,
  ShoppingCart,
  Users,
  DollarSign,
  MessageSquare,
  LogOutIcon,
  ChevronDown,
  Inbox,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineReviews } from "react-icons/md";
import { MdVerifiedUser } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useUnreadChatCount } from "@/hook/userVendorQueries";
import { logoutVendor } from "@/redux/slices/vendorSlice";
import Logo from "@/assets/image/MBLogo.png";
import { Link } from "react-router-dom";
import { get_single_vendor } from "@/utils/vendorApi";
import { IoIosPricetag } from "react-icons/io";
import { clearSessionId } from "@/redux/slices/sessionSlice";
import { RiProfileLine } from "react-icons/ri";

interface DashboardSidebarProps {
  darkMode: boolean;
  isOpen?: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  darkMode,
  isOpen = false,
}) => {
  interface RootState {
    vendor: {
      token: string;
      _id: string;
      vendor: {
        id: string;
      };
    };
  }

  const user = useSelector((state: RootState) => state.vendor);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { data: vendors } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => get_single_vendor(user.token),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);

  const handle_logOut = () => {
    dispatch(clearSessionId());
    dispatch(logoutVendor());
    navigate("/login-vendor");
  };

  // Unread count for Inbox badge
  const { data: unreadData } = useUnreadChatCount((user as any)?.vendor?._id);
  const inboxUnreadTotal = Number((unreadData as any)?.count || 0);

  const handleDropdownToggle = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  const handleLinkClick = () => {
    setOpenDropdown(null);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 p-5 h-full flex flex-col justify-between overflow-y-auto  duration-300 md:static md:h-screen md:translate-x-0 md:z-auto transition-colors ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-[#F5F8FA] text-gray-900"
      }`}
    >
      <div>
        <div className="mb-8 text-2xl font-bold text-orange-500">
          <Link
            to="/"
            className="inline-block transition-transform hover:scale-105 active:scale-95"
          >
            <img src={Logo} alt="MbaayLogo" className=" w-20" />
          </Link>
        </div>
        <nav className="space-y-1">
          <NavItem
            title="Dashboard"
            to="/app"
            Icon={Home}
            onLinkClick={handleLinkClick}
          />
          <NavItem
            title="Orders"
            subItems={["Orders", "MyOrders", "Cancellation"]}
            Icon={ShoppingCart}
            isOpen={openDropdown === "Orders"}
            onToggle={() => handleDropdownToggle("Orders")}
            onLinkClick={handleLinkClick}
          />
          <NavItem
            title="Products"
            subItems={["All Products", "New Product", "Return Product"]}
            Icon={Box}
            isOpen={openDropdown === "Products"}
            onToggle={() => handleDropdownToggle("Products")}
            onLinkClick={handleLinkClick}
          />
          <NavItem
            title="Customers"
            to="customers"
            Icon={Users}
            onLinkClick={handleLinkClick}
          />
          <NavItem
            title="Inbox"
            to="inbox"
            Icon={Inbox}
            badgeCount={inboxUnreadTotal}
            onLinkClick={handleLinkClick}
          />
          <NavItem
            title="Payment"
            subItems={["Payments", "Preview Invoice"]}
            Icon={DollarSign}
            isOpen={openDropdown === "Payment"}
            onToggle={() => handleDropdownToggle("Payment")}
            onLinkClick={handleLinkClick}
          />
          <NavItem
            title="Profile"
            to="edit-vendor-profile"
            Icon={RiProfileLine}
            onLinkClick={handleLinkClick}
          />
          <NavItem
            title="Kyc"
            to="kyc-verification"
            Icon={MdVerifiedUser}
            onLinkClick={handleLinkClick}
          />
          <NavItem
            title="Reviews"
            to="reviews"
            Icon={MdOutlineReviews}
            onLinkClick={handleLinkClick}
          />
          <NavItem
            title="Upgrade plan"
            to="pricing"
            Icon={IoIosPricetag}
            onLinkClick={handleLinkClick}
          />
          <NavItem
            title="Community"
            subItems={["All Post", "Profile", "My Community"]}
            Icon={MessageSquare}
            isOpen={openDropdown === "Community"}
            onToggle={() => handleDropdownToggle("Community")}
            onLinkClick={handleLinkClick}
          />
          <NavItem
            title="LogOut"
            onClick={handle_logOut}
            Icon={LogOutIcon}
            onLinkClick={handleLinkClick}
          />
        </nav>
      </div>
      <motion.div
        className="flex items-center gap-3 p-3 bg-gray-200 rounded-lg dark:bg-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {!vendors?.avatar ? (
          <motion.div
            className="w-[50px] h-[50px] rounded-[50%] bg-orange-300 text-white flex items-center justify-center font-semibold text-lg"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {vendors?.storeName?.charAt(0)?.toUpperCase()}
          </motion.div>
        ) : (
          <motion.img
            src={vendors?.avatar}
            alt="Vendor"
            className="w-10 h-10 rounded-full"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          />
        )}
        <div>
          <p className="text-sm font-semibold text-orange-500">
            {vendors?.storeName}
          </p>
          <div className="flex items-center justify-center mt-2">
            <motion.div
              className={`w-[12px] h-[12px] rounded-full ${
                isOnline ? "bg-green-500" : "bg-red-500"
              }`}
              animate={{ scale: isOnline ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 2, repeat: isOnline ? Infinity : 0 }}
            />
            <span
              className={`text-xs rounded ml-[3px] ${
                isOnline ? "text-green-500" : "text-red-500"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </motion.div>
    </aside>
  );
};

interface NavItemProps {
  title: string;
  to?: string;
  onClick?: () => void;
  subItems?: string[];
  Icon?: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  isOpen?: boolean;
  onToggle?: () => void;
  onLinkClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  title,
  to,
  subItems,
  Icon,
  onClick,
  badgeCount,
  isOpen = false,
  onToggle,
  onLinkClick,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (onClick) {
      onClick();
      onLinkClick();
    } else if (to && !subItems) {
      navigate(to);
      onLinkClick();
    } else if (subItems && onToggle) {
      onToggle();
    }
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const handleSubItemClick = () => {
    onLinkClick();
    setIsPressed(false);
  };

  // If it's a direct link without subitems, use NavLink to get active styling
  if (to && !subItems) {
    const isRoot = to === "/app";
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <NavLink
          to={to}
          end={isRoot}
          className={({ isActive }) =>
            `p-3 flex items-center justify-between gap-3 cursor-pointer rounded-lg transition-all duration-200 border-2 ${
              isActive
                ? "bg-orange-500 text-white border-orange-500 shadow-lg"
                : "hover:bg-orange-50 hover:border-orange-200 border-transparent hover:shadow-md"
            } ${isPressed ? "scale-95" : ""}`
          }
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
            )}
            <span className="font-medium">{title}</span>
          </div>
          {typeof badgeCount === "number" && badgeCount > 0 && (
            <motion.span
              className="inline-flex items-center justify-center min-w-6 h-6 px-1 text-xs font-bold text-white bg-red-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {badgeCount > 99 ? "99+" : badgeCount}
            </motion.span>
          )}
        </NavLink>
      </motion.div>
    );
  }

  // For collapsible groups, mark header active if any sub-link matches current path
  const isAnySubActive = (subItems || []).some((item) => {
    const slug = item.toLowerCase().replace(/ /g, "-");
    return (
      location.pathname.endsWith(`/${slug}`) ||
      location.pathname.includes(`/${slug}`)
    );
  });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        className={`p-3 flex items-center justify-between gap-3 cursor-pointer rounded-lg transition-all duration-200 border-2 ${
          isOpen || isAnySubActive
            ? "bg-orange-500 text-white border-orange-500 shadow-lg"
            : "hover:bg-orange-50 hover:border-orange-200 border-transparent hover:shadow-md"
        } ${isPressed ? "scale-95" : ""}`}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
          )}
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {typeof badgeCount === "number" && badgeCount > 0 && (
            <motion.span
              className="inline-flex items-center justify-center min-w-6 h-6 px-1 text-xs font-bold text-white bg-red-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {badgeCount > 99 ? "99+" : badgeCount}
            </motion.span>
          )}
          {subItems && (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {subItems && isOpen && (
          <motion.div
            className="pl-6 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="py-2 space-y-1">
              {subItems.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.toLowerCase().replace(/ /g, "-")}
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "text-orange-500 font-semibold bg-orange-50 shadow-inner"
                          : "hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`
                    }
                    onClick={handleSubItemClick}
                  >
                    {item}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardSidebar;
