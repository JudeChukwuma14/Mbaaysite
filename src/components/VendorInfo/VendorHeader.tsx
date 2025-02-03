
import { Sun, Moon, Bell, Search } from "lucide-react";
import { useState } from "react";

const VendorHeader = () => {
    const [darkMode, setDarkMode] = useState(false);
    return (
      <header className="bg-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-semibold">Good Morning, <span className="text-orange-500">Finbarr</span></h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="p-2 pr-10 rounded border outline-orange-500 border-orange-500"
            />
            <Search className="absolute right-2 top-2 text-gray-400 text-orange-500" />
          </div>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-500" />}
          </button>
          <Bell className="text-gray-500" />
          <img src="/vendor-avatar.png" alt="Vendor" className="w-10 h-10 rounded-full" />
        </div>
      </header>
    );
  };

  export default VendorHeader