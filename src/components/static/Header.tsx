import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaHeart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Logo from "../../assets/image/MBLogo.png";
import Dropdown from "./Dropdrop";

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "";
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // State to toggle search input on mobile
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const wishlistItem = useSelector((state: RootState) => state.wishlist.items);
  const totalWishlistQuantity = wishlistItem.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <header className="w-full bg-white shadow-md">
      <div className="bg-[#ff710b] h-10 flex items-center justify-between px-4 md:px-10 text-white text-sm">
        <p className="hidden md:block">Welcome to Mbaay Global Marketplaces </p>
        <div className="flex gap-6">
          <Link to="/shop" className="hover:underline">
            Shop Now
          </Link>
          <Link to="/language" className="hover:underline">
            English
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-black md:px-10">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="w-16 md:w-20" />
        </Link>

        <nav className="items-center hidden space-x-4 lg:flex lg:space-x-6">
          <Link
            to="/recently-viewed"
            className="text-sm text-white hover:text-orange-500 md:text-base"
          >
            Recently Viewed
          </Link>
          <Link
            to="/become-vendor"
            className="text-sm text-white hover:text-orange-500 md:text-base"
          >
            Become a Vendor
          </Link>
          <Link
            to="/vendors-auction"
            className="text-sm text-white hover:text-orange-500 md:text-base"
          >
            Auction
          </Link>
          <Link
            to="/app"
            className="text-sm text-white hover:text-orange-500 md:text-base"
          >
            Vendor dashboard
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:flex md:w-64 lg:w-64">
            <input
              type="text"
              placeholder="Search"
              className="w-full py-2 pl-10 pr-4 border rounded-full focus:outline-none"
            />
            <FaSearch className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
          </div>

          <button
            onClick={toggleSearch}
            className="text-white sm:hidden hover:text-orange-500"
          >
            <FaSearch size={20} />
          </button>
          <div>
            {firstLetter ? (
              <Link to="/dashboard">
                <h1 className=" text-xl font-extrabold h-[30px] w-[30px] flex justify-center items-center bg-orange-500 rounded-full text-gray-600">
                  {firstLetter}
                </h1>
              </Link>
            ) : (
              <Link
                to="/selectpath"
                className="text-white hover:text-orange-500"
              >
                <FaUser size={20} />
              </Link>
            )}
          </div>
          <Link
            to="dashboard/wishlist"
            className="relative hidden transition-all duration-300 ease-in hover:bg-gray-40 hover:rounded-full md:block"
          >
            <FaHeart size={20} className="text-white " />
            <span className="absolute -top-2 -right-2 text-xs text-white  bg-[#ff710b] rounded-full h-5 w-5 flex items-center justify-center">
              {totalWishlistQuantity}
            </span>
          </Link>

          <Link
            to="/cart"
            className="relative transition-all duration-300 ease-in hover:bg-gray-40 hover:rounded-full"
          >
            <FaShoppingCart size={20} className="text-white " />
            <span className="absolute -top-2 -right-2 text-xs text-white bg-[#ff710b] rounded-full h-5 w-5 flex items-center justify-center">
              {totalQuantity}
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden">
            {menuOpen ? (
              <FaTimes size={24} className="text-white" />
            ) : (
              <FaBars size={24} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Input - Visible when searchOpen is true */}
      {searchOpen && (
        <div className="p-4 bg-white border-t sm:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full py-2 pl-10 pr-4 border rounded-full focus:outline-none"
            />
            <FaSearch className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="p-4 bg-white shadow-md lg:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/recently-viewed"
              className="hover:text-orange-500"
              onClick={toggleMenu}
            >
              Recently Viewed
            </Link>
            <Link
              to="/login-vendor"
              className="hover:text-orange-500"
              onClick={toggleMenu}
            >
              Become a Vendor
            </Link>
            <Link
              to="/vendors-auction"
              className="hover:text-orange-500"
              onClick={toggleMenu}
            >
              Auction
            </Link>
            <Link
              to="/app"
              className="hover:text-orange-500"
              onClick={toggleMenu}
            >
              Vendor dashboard
            </Link>
          </nav>
        </div>
      )}
      <Dropdown />
    </header>
  );
};

export default Header;
