import React, { useState } from "react";
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



interface SidebarItem {
  icons: React.ReactNode;
  label: string;
  urlLink?: string; 
  children?: { title: string; link: string }[]; 
}

// Sidebar layout data
const sidebarLayout: SidebarItem[] = [
  {
    icons: <UserIcon size={30} />,
    label: "My Profile",
    urlLink: "/dashboard", 
  },
  {
    icons: <HeartIcon size={30} />,
    label: "My Wishlist",
    urlLink: "/dashboard/wishlist",
  },
  {
    icons: <Wallet size={30} />,
    label: "Payment Method",
    urlLink: "/dashboard/checkout",
  },
  {
    icons: <NotebookIcon size={30} />,
    label: "Addresses",
    urlLink: "/dashboard/addresses",
  },
  {
    icons: <MessagesSquare size={30} />,
    label: "Index",
    urlLink: "/dashboard/user-index",
  },
  {
    icons: <ShoppingCartIcon size={30} />,
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
    console.log("User logged out");
    navigate("/login");
  };

  return (
    <section className="sticky left-0 top-0 flex h-screen w-full flex-col justify-between p-6 pt-32 text-black bg-[#F3F4F6] max-sm:hidden lg:w-[264px]">
      <div className="flex flex-col flex-1 gap-2">
        {sidebarLayout.map((item) => {
          const isActive = location.pathname === item.urlLink; 
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.label}>
              {item.urlLink ? (
                <NavLink
                  to={item.urlLink}
                  className={`flex items-center p-4 gap-3 rounded-lg  ${
                    isActive
                      ? " bg-orange-500 text-white"
                      : "hover:bg-orange-300"
                  }`}
                  onClick={() => handleItemClick(item.label)}
                >
                  {item.icons}
                  <p className="text-[16px] font-semibold">{item.label}</p>
                </NavLink>
              ) : (
                <div
                  className={`flex items-center p-4 gap-3 rounded-lg cursor-pointer ${
                    openDropdown === item.label
                      ? " bg-orange-500 text-white"
                      : "hover:bg-orange-300"
                  }`}
                  onClick={() => toggleDropdown(item.label)}
                >
                  {item.icons}
                  <p className="text-[16px] font-semibold">{item.label}</p>
                  {hasChildren && (
                    <span className="ml-auto">
                      {openDropdown === item.label ? (
                        <ChevronUpIcon />
                      ) : (
                        <ChevronDownIcon />
                      )}
                    </span>
                  )}
                </div>
              )}
              {hasChildren && (
                <div
                  className={`pl-8 mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                    openDropdown === item.label ? "max-h-96" : "max-h-0"
                  }`}
                >
                  {item.children?.map((child) => (
                    <NavLink
                      key={child.title}
                      to={child.link}
                      className="flex items-center p-2 rounded-lg hover:bg-orange-300"
                    >
                      <p className="font-semibold">
                        {child.title}
                      </p>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-4 p-4 rounded-lg hover:bg-orange-300"
      >
        <LogOutIcon width={30} />
        <p className="text-sm font-semibold">Logout</p>
      </button>
    </section>
  );
};

export default Siderbar;
