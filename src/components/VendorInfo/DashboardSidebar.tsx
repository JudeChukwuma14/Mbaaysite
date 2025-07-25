import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Home,
  Box,
  ShoppingCart,
  Users,
  DollarSign,
  Settings,
  MessageSquare,
  LogOutIcon,
  ChevronDown,
  Inbox,
} from "lucide-react";
import { motion } from "framer-motion";
import { MdOutlineReviews } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { logoutVendor } from "@/redux/slices/vendorSlice";
import Logo from "@/assets/image/mbbaylogo.png";
import { Link } from "react-router-dom";
import { get_single_vendor } from "@/utils/vendorApi";
import { IoIosPricetag } from "react-icons/io";



interface DashboardSidebarProps {
  darkMode: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ darkMode }) => {
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
  const { data: vendors } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => get_single_vendor(user.token),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handle_logOut = () => {
     dispatch(clearSessionId())
    dispatch(logoutVendor());
    navigate("/login-vendor");
  };

  return (
    <aside
      className={`w-64 p-5 h-screen flex flex-col justify-between overflow-y-auto transition-colors ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-[#F5F8FA] text-gray-900"
      }`}
    >
      <div>
        <div className="mb-5 text-2xl font-bold text-orange-500">
          <Link to="/">
            <img src={Logo} alt="MbaayLogo" className=" w-14" />
          </Link>
        </div>
        <nav>
          <NavItem title="Dashboard" to="/app" Icon={Home} />
          <NavItem title="Orders" to="orders" Icon={ShoppingCart} />
          <NavItem
            title="Products"
            subItems={["All Products", "New Product"]}
            Icon={Box}
          />
          <NavItem title="Customers" to="customers" Icon={Users} />
          <NavItem title="Inbox" to="inbox" Icon={Inbox} />
          <NavItem
            title="Payment"
            subItems={["Payments", "Preview Invoice"]}
            Icon={DollarSign}
          />
          <NavItem
            title="Settings"
            subItems={["Edit Vendor Profile", "KYC Verification"]}
            Icon={Settings}
          />
          <NavItem title="Reviews" to="reviews" Icon={MdOutlineReviews} />
          <NavItem title="Upgrade plan" to="pricing" Icon={IoIosPricetag} />
          <NavItem
            title="Community"
            subItems={["All Post", "Profile", "My Community"]}
            Icon={MessageSquare}
          />
          <NavItem title="LogOut" onClick={handle_logOut} Icon={LogOutIcon} />
        </nav>
      </div>
      <div className="flex items-center gap-3 p-3 bg-gray-200 rounded-lg dark:bg-gray-700">
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
        <div>
          <p className="text-sm font-semibold text-orange-500">
            {vendors?.storeName}
          </p>
          <div className="flex items-center justify-center mt-2">
            <div
              className={`w-[12px] h-[12px] rounded-full ${
                isOnline ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span
              className={`text-xs rounded ml-[3px] ${
                isOnline ? "text-green-500" : "text-red-500"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({
  title,
  to,
  subItems,
  Icon,
  onClick,
}: {
  title: string;
  to?: string;
  onClick?: () => void;
  subItems?: string[];
  Icon?: React.ComponentType<{ className?: string }>;
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (subItems) {
      setOpen(!open);
    }
  };

  return (
    <div>
      <div
        className={`p-2 flex items-center justify-between gap-3 cursor-pointer hover:bg-orange-400 rounded ${
          open ? "bg-orange-400 text-white" : ""
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5" />}
          {to && !subItems ? (
            <NavLink
              to={to}
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-orange-500"
                  : "text-gray-700 dark:text-gray-300"
              }
            >
              {title}
            </NavLink>
          ) : (
            <span>{title}</span>
          )}
        </div>
        {subItems && (
          <ChevronDown className={`w-5 h-5 ${open && "rotate-180"}`} />
        )}
      </div>
      {subItems && (
        <motion.div
          className="pl-8 overflow-hidden"
          initial={false}
          animate={{ height: open ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
        >
          {subItems.map((item) => (
            <NavLink
              key={item}
              to={item.toLowerCase().replace(/ /g, "-")}
              className={({ isActive }) =>
                `block py-1 ${
                  isActive
                    ? "text-orange-500 font-semibold"
                    : "hover:text-gray-600 dark:hover:text-gray-300"
                }`
              }
            >
              {item}
            </NavLink>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DashboardSidebar;
