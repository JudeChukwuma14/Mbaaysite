import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaSearch, FaUser, FaShoppingCart, FaHeart, FaBars, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Logo from "../../assets/image/MBLogo.png"

const Header: React.FC = () => {
  const userName = useSelector((state:RootState)=>state.user.name)
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // State to toggle search input on mobile
  const cartItems = useSelector((state:RootState)=>state.cart.items)
  const totalQuantity = cartItems.reduce((total,item)=>total+item.quantity,0)
  const wishlistItem = useSelector((state:RootState)=>state.wishlist.items)
  const totalWishlistQuantity =wishlistItem.reduce((total,item)=>total+item.quantity,0)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <header className="w-full shadow-md bg-white">
      {/* Top Bar */}
      <div className="bg-[#ff710b] h-10 flex items-center justify-between px-4 md:px-10 text-white text-sm">
        <p className="hidden md:block">Welcome to Mbaay Global Marketplaces {userName?.user?.email} </p>
        <div className="flex gap-6">
          <NavLink to="/shop" className="hover:underline">Shop Now</NavLink>
          <NavLink to="/language" className="hover:underline">English</NavLink>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 md:px-10 bg-white">

        <NavLink to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className=" w-16 md:w-20" />
        </NavLink>

        <nav className="hidden lg:flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/recently-viewed" className="hover:text-orange-500 text-sm md:text-base">Recently Viewed</NavLink>
          <NavLink to="/become-vendor" className="hover:text-orange-500 text-sm md:text-base">Become a Vendor</NavLink>
          <NavLink to="/vendors-auction" className="hover:text-orange-500 text-sm md:text-base">Vendors Auction</NavLink>
          <NavLink to="/sell" className="hover:text-orange-500 text-sm md:text-base">Sell on Mbaay</NavLink>
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          {/* Search Input - Visible on tablets and larger */}
          <div className="relative hidden sm:flex md:w-64 lg:w-64">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border rounded-full focus:outline-none w-full"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Search Icon for Mobile - Toggles search input */}
          <button onClick={toggleSearch} className="sm:hidden text-gray-700 hover:text-orange-500">
            <FaSearch size={20} />
          </button>

          {/* User & Cart Icons */}
          <NavLink to="/selectpath" className="text-gray-700 hover:text-orange-500">
            <FaUser size={20} />
          </NavLink>

          <NavLink to="dashboard/wishlist" className=" relative hover:bg-gray-40 hover:rounded-full transition-all duration-300 ease-in">
            <FaHeart size={20} />
            <span className="absolute -top-2 -right-2 text-xs text-white bg-[#ff710b] rounded-full h-5 w-5 flex items-center justify-center">
              {totalWishlistQuantity}
            </span>
          </NavLink>

          <NavLink to="/cart" className=" relative hover:bg-gray-40 hover:rounded-full transition-all duration-300 ease-in">
            <FaShoppingCart size={20} className=" text-gray-700 " />
            <span className="absolute -top-2 -right-2 text-xs text-white bg-[#ff710b] rounded-full h-5 w-5 flex items-center justify-center">
              {totalQuantity}
            </span>
          </NavLink>
          
          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden">
            {menuOpen ? <FaTimes size={24} className="text-gray-700" /> : <FaBars size={24} className="text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Input - Visible when searchOpen is true */}
      {searchOpen && (
        <div className="sm:hidden p-4 bg-white border-t">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border rounded-full focus:outline-none w-full"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md p-4">
          <nav className="flex flex-col space-y-4">
            <NavLink to="/recently-viewed" className="hover:text-orange-500" onClick={toggleMenu}>Recently Viewed</NavLink>
            <NavLink to="/become-vendor" className="hover:text-orange-500" onClick={toggleMenu}>Become a Vendor</NavLink>
            <NavLink to="/vendors-auction" className="hover:text-orange-500" onClick={toggleMenu}>Vendors Auction</NavLink>
            <NavLink to="/sell" className="hover:text-orange-500" onClick={toggleMenu}>Sell on Mbacy</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;