import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Home, Box, ShoppingCart, Users, DollarSign, Settings, MessageSquare, LogOutIcon } from "lucide-react";

const DashboardSidebar = () => {
  return (
    <aside className="w-64 bg-[#F5F8FA] text-gray-900 p-5 h-screen flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="text-2xl font-bold text-orange-500 mb-5">mbaay</div>
        <nav>
          <NavItem title="Dashboard" to="/app" Icon={Home} />
          <NavItem title="Orders" to="orders" Icon={ShoppingCart} />
          <NavItem title="Products" subItems={["all-products", "New Product"]} Icon={Box} />
          <NavItem title="Customers" to="customers" Icon={Users} />
          <NavItem title="Payment" subItems={["Payments", "Preview Invoice"]} Icon={DollarSign} />
          <NavItem title="Settings" subItems={["Edit Vendor Profile", "KYC Verification"]} Icon={Settings} />
          <NavItem title="Community" subItems={["CreatePost", "All Post", "Profile", "Reviews"]} Icon={MessageSquare} />
          <NavItem title="LogOut" to="logout" Icon={LogOutIcon} />
        </nav>
      </div>
      <div className="flex items-center gap-3 p-3 bg-gray-200 rounded-lg">
        <img src="/vendor-avatar.png" alt="Vendor" className="w-12 h-12 rounded-full" />
        <div>
          <p className="text-sm font-semibold">Finbarr</p>
          <span className="text-green-500 text-xs">Vendor</span>
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
}: {
  title: string;
  to?: string;
  subItems?: string[];
  Icon?: React.ComponentType<{ className?: string }>;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div
        className="p-2 flex items-center gap-3 cursor-pointer hover:bg-orange-400 hover:text-orange-700 rounded"
        onClick={() => setOpen(!open)}
      >
        {Icon && <Icon className="w-5 h-5" />}
        {to ? <NavLink to={to}>{title}</NavLink> : <span>{title}</span>}
      </div>
      {subItems && open && (
        <div className="pl-8">
          {subItems.map((item) => (
            <NavLink
              key={item}
              to={item.toLowerCase().replace(/ /g, "-")}
              className="block py-1 hover:text-gray-600"
            >
              {item}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardSidebar;
