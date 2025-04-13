import React, { useState, useEffect } from "react";
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
import { searchProducts } from "@/utils/productApi";

const Header: React.FC = () => {
  const [word, setWord] = useState("");
  const [items, setItems] = useState<{ _id: string; name: string; price: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [problem, setProblem] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "";

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const totalWishlistQuantity = wishlistItems.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);

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
    <header className="w-full bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-[#ff710b] h-10 flex items-center justify-between px-4 md:px-10 text-white text-sm">
        <p className="hidden md:block">Welcome to Mbaay Global Marketplaces</p>
        <div className="flex gap-6">
          <Link to="/shop" className="hover:underline">Shop Now</Link>
          <Link to="/language" className="hover:underline">English</Link>
        </div>
      </div>

      {/* Main header */}
      <div className="flex items-center justify-between p-4 bg-black md:px-10">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="MBLogo" className="w-16 md:w-20" />
        </Link>

        <nav className="items-center hidden space-x-4 lg:flex lg:space-x-6">
          <Link to="/recently-viewed" className="text-sm text-white hover:text-orange-500">Recently Viewed</Link>
          <Link to="/become-vendor" className="text-sm text-white hover:text-orange-500">Become a Vendor</Link>
          <Link to="/vendors-auction" className="text-sm text-white hover:text-orange-500">Auction</Link>
          <Link to="/app" className="text-sm text-white hover:text-orange-500">Vendor dashboard</Link>
        </nav>

        <div className="flex items-center space-x-4">
          {/* Search input */}
          <div className="relative hidden sm:flex md:w-64 lg:w-72">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Search"
              className="w-full py-2 pl-10 pr-4 border rounded-full focus:outline-none"
            />
            <FaSearch className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
            {items.length > 0 && (
              <ul className="absolute z-50 w-full mt-2 overflow-y-auto text-black bg-white shadow-lg max-h-60">
                {items.map((item) => (
                  <li key={item._id} className="px-4 py-2 hover:bg-gray-100">
                    <Link to={`/product/${item._id}`} onClick={() => setWord("")}>
                      {item.name} - ${item.price}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mobile search icon */}
          <button onClick={toggleSearch} className="text-white sm:hidden hover:text-orange-500">
            <FaSearch size={20} />
          </button>

          {/* User icon or first letter */}
          <div>
            {firstLetter ? (
              <Link to="/dashboard">
                <h1 className="text-xl font-extrabold h-[30px] w-[30px] flex justify-center items-center bg-orange-500 rounded-full text-gray-600">
                  {firstLetter}
                </h1>
              </Link>
            ) : (
              <Link to="/selectpath" className="text-white hover:text-orange-500">
                <FaUser size={20} />
              </Link>
            )}
          </div>

          {/* Wishlist */}
          <Link to="/dashboard/wishlist" className="relative hidden md:block">
            <FaHeart size={20} className="text-white" />
            <span className="absolute -top-2 -right-2 text-xs text-white bg-[#ff710b] rounded-full h-5 w-5 flex items-center justify-center">
              {totalWishlistQuantity}
            </span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <FaShoppingCart size={20} className="text-white" />
            <span className="absolute -top-2 -right-2 text-xs text-white bg-[#ff710b] rounded-full h-5 w-5 flex items-center justify-center">
              {totalQuantity}
            </span>
          </Link>

          {/* Mobile menu icon */}
          <button onClick={toggleMenu} className="md:hidden">
            {menuOpen ? <FaTimes size={24} className="text-white" /> : <FaBars size={24} className="text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile search field */}
      {searchOpen && (
        <div className="p-4 bg-white border-t sm:hidden">
          <div className="relative">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Search"
              className="w-full py-2 pl-10 pr-4 border rounded-full focus:outline-none"
            />
            <FaSearch className="absolute left-0 text-gray-500 transform -translate-y-1/2 bottom-[-100px]" />
          </div>
          {isLoading && <p className="mt-2 text-gray-700">Loading...</p>}
          {problem && <p className="mt-2 text-red-700">Error: {problem}</p>}
          {items.length > 0 && (
            <ul className="mt-2 text-black">
              {items.map((item) => (
                <li key={item._id} className="py-1">
                  <Link to={`/product/${item._id}`} onClick={() => setWord("")}>
                    {item.name} - ${item.price}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Mobile nav */}
      {menuOpen && (
        <div className="p-4 bg-white shadow-md lg:hidden">
          <nav className="flex flex-col space-y-4">
            <Link to="/recently-viewed" className="hover:text-orange-500" onClick={toggleMenu}>Recently Viewed</Link>
            <Link to="/login-vendor" className="hover:text-orange-500" onClick={toggleMenu}>Become a Vendor</Link>
            <Link to="/vendors-auction" className="hover:text-orange-500" onClick={toggleMenu}>Auction</Link>
            <Link to="/app" className="hover:text-orange-500" onClick={toggleMenu}>Vendor dashboard</Link>
          </nav>
        </div>
      )}

      <Dropdown />
    </header>
  );
};

export default Header;
