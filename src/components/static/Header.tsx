"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
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
import type { RootState } from "@/redux/store";
import Logo from "../../assets/image/MBLogo.png";
import Dropdown from "./Dropdrop";
import { searchProducts } from "@/utils/productApi";

const Header: React.FC = () => {
  const [word, setWord] = useState("");
  const [items, setItems] = useState<
    { _id: string; name: string; price: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [problem, setProblem] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: RootState) => state.user.user);
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "";

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const totalWishlistQuantity = wishlistItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setItems([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (word) {
        setIsLoading(true);
        searchProducts(word)
          .then((result) => {
            setItems(result.products || []);
          })
          .catch((err) => setProblem(err.message))
          .finally(() => setIsLoading(false));
      } else {
        setItems([]);
        setProblem("");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [word]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-[#ff710b] py-2 flex items-center justify-between px-4 md:px-10 text-white text-sm">
        <p className="hidden font-medium md:block">
          Welcome to Mbaay Global Marketplaces
        </p>
        <div className="flex gap-6">
          <Link
            to="/shop"
            className="font-medium transition-colors duration-200 hover:underline"
          >
            Shop Now
          </Link>
          <Link
            to="/language"
            className="font-medium transition-colors duration-200 hover:underline"
          >
            English
          </Link>
        </div>
      </div>

      {/* Main header */}
      <div className="flex items-center justify-between p-4 bg-black md:px-10">
        <Link to="/" className="flex items-center">
          <img
            src={Logo || "/placeholder.svg"}
            alt="MBLogo"
            className="w-16 md:w-20"
          />
        </Link>

        <nav className="items-center hidden space-x-4 lg:flex lg:space-x-8">
          <Link
            to="/recently-viewed"
            className="text-sm font-medium text-white transition-colors duration-200 hover:text-orange-500"
          >
            Recently Viewed
          </Link>
          <Link
            to="/become-vendor"
            className="text-sm font-medium text-white transition-colors duration-200 hover:text-orange-500"
          >
            Become a Vendor
          </Link>
          <Link
            to="/vendors-auction"
            className="text-sm font-medium text-white transition-colors duration-200 hover:text-orange-500"
          >
            Auction
          </Link>
          <Link
            to="/app"
            className="text-sm font-medium text-white transition-colors duration-200 hover:text-orange-500"
          >
            Vendor dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Search input */}
          <div
            className="relative hidden sm:block md:w-64 lg:w-80"
            ref={searchRef}
          >
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Search products..."
              className="w-full py-2 pl-10 pr-4 transition-all duration-200 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
            />
            <FaSearch className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
            {isLoading && (
              <div className="absolute transform -translate-y-1/2 right-4 top-1/2">
                <div className="w-4 h-4 border-2 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
            )}
            {items.length > 0 && (
              <ul className="absolute z-50 w-full mt-2 overflow-y-auto text-black bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 top-full">
                {items.map((item) => (
                  <li
                    key={item._id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <Link
                      to={`/product/${item._id}`}
                      onClick={() => setWord("")}
                      className="block px-4 py-3 transition-colors duration-150 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.name}</span>
                        <span className="font-semibold text-orange-600">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {problem && word && (
              <div className="absolute z-50 w-full p-3 mt-2 text-red-600 bg-white border border-red-200 rounded-lg shadow-lg top-full">
                {problem}
              </div>
            )}
          </div>

          {/* Mobile search icon */}
          <button
            onClick={toggleSearch}
            className="text-white transition-colors duration-200 sm:hidden hover:text-orange-500"
            aria-label="Search"
          >
            <FaSearch size={20} />
          </button>

          <div className="flex items-center gap-2">
            {/* User icon or first letter */}
            <div>
              {firstLetter ? (
                <Link to="/dashboard">
                  <div className="flex items-center justify-center text-lg font-bold text-white bg-orange-500 rounded-full shadow-md w-7 h-7 ring-4 ring-orange-400">
                    {firstLetter}
                  </div>
                </Link>
              ) : (
                <Link
                  to="/selectpath"
                  className="p-2 text-white transition-colors duration-200 rounded-full hover:text-orange-500 "
                >
                  <FaUser size={20} />
                </Link>
              )}
            </div>

            {/* Wishlist */}
            <Link
              to="/dashboard/wishlist"
              className="relative hidden p-2 transition-colors duration-200 rounded-full md:block "
              aria-label="Wishlist"
            >
              <FaHeart size={20} className="text-white" />
              {totalWishlistQuantity > 0 && (
                <span className="absolute -top-1 -right-1 text-xs text-white bg-[#ff710b] rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-md">
                  {totalWishlistQuantity}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 transition-colors duration-200 rounded-full "
              aria-label="Shopping Cart"
            >
              <FaShoppingCart size={20} className="text-white" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 text-xs text-white bg-[#ff710b] rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-md">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu icon */}
          <button
            onClick={toggleMenu}
            className="p-1 transition-colors duration-200 rounded-md md:hidden hover:bg-gray-800"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <FaTimes size={24} className="text-white" />
            ) : (
              <FaBars size={24} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile search field */}
      {searchOpen && (
        <div className="p-4 bg-white border-t sm:hidden" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Search products..."
              className="w-full py-2 pl-10 pr-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300"
              autoFocus
            />
            <FaSearch className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
            {isLoading && (
              <div className="absolute transform -translate-y-1/2 right-4 top-1/2">
                <div className="w-4 h-4 border-2 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
            )}
          </div>
          {items.length > 0 && (
            <ul className="mt-3 text-black bg-white border border-gray-200 rounded-lg shadow-md">
              {items.map((item) => (
                <li
                  key={item._id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <Link
                    to={`/product/${item._id}`}
                    onClick={() => {
                      setWord("");
                      setSearchOpen(false);
                    }}
                    className="block px-4 py-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span className="font-semibold text-orange-600">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {problem && word && (
            <div className="p-3 mt-3 text-red-600 bg-white border border-red-200 rounded-lg shadow-md">
              {problem}
            </div>
          )}
        </div>
      )}

      {/* Mobile nav */}
      {menuOpen && (
        <div className="bg-white shadow-md lg:hidden">
          <nav className="flex flex-col divide-y divide-gray-100">
            <Link
              to="/recently-viewed"
              className="px-6 py-3 transition-colors duration-200 hover:bg-gray-50 hover:text-orange-500"
              onClick={toggleMenu}
            >
              Recently Viewed
            </Link>
            <Link
              to="/login-vendor"
              className="px-6 py-3 transition-colors duration-200 hover:bg-gray-50 hover:text-orange-500"
              onClick={toggleMenu}
            >
              Become a Vendor
            </Link>
            <Link
              to="/vendors-auction"
              className="px-6 py-3 transition-colors duration-200 hover:bg-gray-50 hover:text-orange-500"
              onClick={toggleMenu}
            >
              Auction
            </Link>
            <Link
              to="/app"
              className="px-6 py-3 transition-colors duration-200 hover:bg-gray-50 hover:text-orange-500"
              onClick={toggleMenu}
            >
              Vendor dashboard
            </Link>
            <Link
              to="/dashboard/wishlist"
              className="flex items-center gap-2 px-6 py-3 transition-colors duration-200 hover:bg-gray-50 hover:text-orange-500 md:hidden"
              onClick={toggleMenu}
            >
              <FaHeart size={16} />
              Wishlist
              {totalWishlistQuantity > 0 && (
                <span className="text-xs text-white bg-[#ff710b] rounded-full h-5 w-5 flex items-center justify-center">
                  {totalWishlistQuantity}
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}

      <Dropdown />
    </header>
  );
};

export default Header;
