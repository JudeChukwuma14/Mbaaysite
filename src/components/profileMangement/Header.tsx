// Header.tsx
import {  FaBell, FaUser, FaSignInAlt,  } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import LogoImage from "@/assets/image/mbbaylogo.png";

const Header = ({
  isLoggedIn,
  isSidebarOpen,
}: {
  isLoggedIn: boolean;
  isSidebarOpen: boolean;
}) => {
  const [isMobileMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 md:px-8">
      <div className="flex items-center gap-4">
        {!isSidebarOpen && (
          <>
            <img src={LogoImage} alt="Mbbay Logo" className="h-8" />
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button className="md:hidden">
          <AiOutlineSearch size={24} />
        </button>
        {isLoggedIn ? (
          <>
            <FaBell size={24} className="hidden md:block" />
            <FaUser size={24} />
            <FiLogOut size={24} className="cursor-pointer" />
          </>
        ) : (
          <button className="flex items-center gap-2 p-2 bg-orange-500 text-white rounded">
            <FaSignInAlt /> Sign In
          </button>
        )}
      </div>
      {isMobileMenuOpen && (
        <div className="absolute top-14 left-0 w-full bg-gray-900 text-white flex flex-col items-center p-4 md:hidden">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          />
          <button className="flex items-center gap-2 p-2 bg-red-600 rounded w-full justify-center">
            <FaSignInAlt /> Sign In
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
