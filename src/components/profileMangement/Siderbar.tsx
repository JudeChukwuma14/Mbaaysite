// Sidebar.tsx
import { useState } from "react";
import LogoImage from "@/assets/image/mbbaylogo.png"
import {
  FaBars,
  FaUser,
  FaShoppingCart,
  FaHeart,
  FaAddressBook,
  FaCreditCard,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = ({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const [ordersDropdownOpen, setOrdersDropdownOpen] = useState(false);

  return (
    <div
      className={`h-screen bg-gray-100  transition-all ${
        isOpen ? "w-56" : "w-20"
      }`}
    >
      <div
        className="p-4 flex items-center gap-4 cursor-pointer"
        onClick={toggleSidebar}
      >
        <FaBars size={24} />
        {isOpen && (
          <img
            src={LogoImage}
            alt="Mbbay Logo"
            className="h-8"
          />
        )}
      </div>
      <nav className="mt-4">
        {[
          {
            icon: <FaUser size={24} />,
            label: "My Profile",
            link: "/dashboard",
          },
          {
            icon: <FaHeart size={24} />,
            label: "My Wishlist",
            link: "/dashboard/wishlist",
          },
          {
            icon: <FaAddressBook size={24} />,
            label: "Addresses",
            link: "/dashboard/addresses",
          },
          {
            icon: <FaCreditCard size={24} />,
            label: "Payment Methods",
            link: "/dashboard/checkout",
          },
        ].map(({ icon, label, link }) => (
          <Link
            key={label}
            to={link}
            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-orange-500 hover:text-white"
          >
            {icon}
            {isOpen && <span>{label}</span>}
          </Link>
        ))}

        {/* My Orders with Dropdown */}
        <div>
          <div
            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-orange-500 hover:text-white"
            onClick={() => setOrdersDropdownOpen(!ordersDropdownOpen)}
          >
            <FaShoppingCart size={24} />
            {isOpen && <span>My Orders</span>}
            {isOpen &&
              (ordersDropdownOpen ? <FaChevronUp /> : <FaChevronDown />)}
          </div>
          {ordersDropdownOpen && isOpen && (
            <div className="ml-6">
              {[
                { title: "Order List", link: "/dashboard/orderlist" },
                { title: "Order Detail", link: "/dashboard/orderdetail" },
                { title: "Cancellation Page", link: "/dashboard/cancellation" },
                { title: "Review", link: "/dashboard/review" },
              ].map(({ title, link }) => (
                <Link
                  key={title}
                  to={link}
                  className="block p-2 hover:bg-orange-500 hover:text-white"
                >
                  {title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
