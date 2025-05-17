import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import Logo from "../../assets/image/MBLogo.png";

import { searchProducts } from "@/utils/productApi";
import { useTranslation } from "react-i18next";
import i18next from "@/utils/i18n";
import { setSettings } from "@/redux/slices/settingsSlice";
import { Country, type ICountry } from "country-state-city";
import Dropdown from "./Dropdrop";
import { convertPrice, getCurrencyByCountry, getLanguageByCountry } from "@/utils/currencyCoverter";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [word, setWord] = useState("");
  const [items, setItems] = useState<
    { _id: string; name: string; price: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [problem, setProblem] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: RootState) => state.user.user);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const settings = useSelector((state: RootState) => state.settings);

  const countries = Country.getAllCountries();
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleCountryChange = (country: ICountry) => {
    const language = getLanguageByCountry(country.isoCode);
    const currency = getCurrencyByCountry(country.isoCode);
    i18next.changeLanguage(language, (err) => {
      if (err) console.error("Language change failed:", err);
      else console.log("Language changed to:", language);
    });
    dispatch(
      setSettings({
        language,
        currency,
        countryCode: country.isoCode,
      })
    );
    setIsCountryOpen(false);
    setCountrySearch("");
  };

  const firstLetter = vendor?.storeName
    ? vendor.storeName.charAt(0).toUpperCase()
    : vendor?.id
      ? "V"
      : user?.name
        ? user.name.charAt(0).toUpperCase()
        : "";
  const dashboardLink = vendor ? "/app" : "/dashboard";

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setItems([]);
      }
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryOpen(false);
        setCountrySearch("");
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

  useEffect(() => {
    console.log("Current language:", i18next.language);
    console.log("Translation for 'welcome':", t("welcome"));
  }, [t]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="bg-[#ff710b] py-2 flex items-center justify-between px-4 md:px-10 text-white text-sm">
        <p className="font-medium ">
          {t("welcome")}{" "}
          {vendor?.storeName
            ? `, ${vendor.storeName}`
            : vendor?.id
              ? ", Vendor"
              : user?.name
                ? `, ${user.name}`
                : t("global_marketplaces")}!
        </p>
        <div className="flex items-center gap-6">
          <Link
            to="/random-product"
            className="hidden font-medium transition-colors duration-200 md:block hover:underline"
          >
            {t("shop_now")}
          </Link>
          <div className="relative" ref={countryDropdownRef}>
            <button
              onClick={() => setIsCountryOpen(!isCountryOpen)}
              className="flex items-center gap-2 font-medium transition-colors duration-200 hover:underline"
              aria-label={`Select country, current: ${settings.countryCode}`}
            >
              {countries.find((c) => c.isoCode === settings.countryCode)?.name ||
                "Select Country"}
              <svg
                className={`w-4 h-4 transform ${isCountryOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isCountryOpen && (
              <div className="absolute right-0 z-10 w-64 mt-2 overflow-y-auto text-black bg-white rounded-md shadow-lg top-full max-h-96">
                <div className="p-2">
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder={t("select_country")}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                    autoFocus
                  />
                </div>
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.isoCode}
                      onClick={() => handleCountryChange(country)}
                      className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                    >
                      {country.name} ({getCurrencyByCountry(country.isoCode)})
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No countries found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

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
            to="/"
            className="text-sm font-medium text-white transition-colors duration-200 hover:text-orange-500"
          >
            Recently Viewed
          </Link>
          <Link
            to={vendor ? "/app" : "/signup-vendor"}
            className="text-sm font-medium text-white transition-colors duration-200 hover:text-orange-500"
          >
            {vendor ? "Vendor Dashboard" : "Become a Vendor"}
          </Link>
          <Link
            to="/auctionview"
            className="text-sm font-medium text-white transition-colors duration-200 hover:text-orange-500"
          >
            Auction
          </Link>
        </nav>

        <div className="flex items-center gap-4">
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
                          {convertPrice(item.price, "USD", settings.currency).toLocaleString(settings.language, {
                            style: "currency",
                            currency: settings.currency,
                          })}
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

          <button
            onClick={toggleSearch}
            className="text-white transition-colors duration-200 sm:hidden hover:text-orange-500"
            aria-label="Search"
          >
            <FaSearch size={20} />
          </button>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/wishlist"
              className="relative hidden p-2 transition-colors duration-200 rounded-full md:block"
              aria-label="Wishlist"
            >
              <FaHeart size={20} className="text-white" />
              {totalWishlistQuantity > 0 && (
                <span className="absolute -top-1 -right-1 text-xs text-white bg-[#ff710b] rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-md">
                  {totalWishlistQuantity}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 transition-colors duration-200 rounded-full"
              aria-label="Shopping Cart"
            >
              <FaShoppingCart size={20} className="text-white" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 text-xs text-white bg-[#ff710b] rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-md">
                  {totalQuantity}
                </span>
              )}
            </Link>

            <div className="ml-2">
              {firstLetter ? (
                <Link
                  to={dashboardLink}
                  aria-label={vendor ? "Vendor Dashboard" : "User Dashboard"}
                >
                  <div className="flex items-center justify-center text-lg font-bold text-white bg-orange-500 rounded-full shadow-md w-7 h-7 ring-4 ring-orange-400">
                    {firstLetter}
                  </div>
                </Link>
              ) : (
                <Link
                  to="/selectpath"
                  className="px-3 py-2 text-sm text-white transition-colors duration-300 border border-orange-600 rounded-md hover:bordering-white hover:bg-orange-600"
                >
                  Get started
                </Link>
              )}
            </div>
          </div>

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
                        {convertPrice(item.price, "USD", settings.currency).toLocaleString(settings.language, {
                          style: "currency",
                          currency: settings.currency,
                        })}
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

      {menuOpen && (
        <div className="bg-white shadow-md lg:hidden">
          <nav className="flex flex-col divide-y divide-gray-100">
            <Link
              to="/"
              className="px-6 py-3 transition-colors duration-200 hover:bg-gray-50 hover:text-orange-500"
              onClick={toggleMenu}
            >
              Recently Viewed
            </Link>
            <Link
              to={vendor ? "/app" : "/signup-vendor"}
              className="px-6 py-3 transition-colors duration-200 hover:bg-gray-50 hover:text-orange-500"
              onClick={toggleMenu}
            >
              {vendor ? "Vendor Dashboard" : "Become a Vendor"}
            </Link>
            <Link
              to="/auctionview"
              className="px-6 py-3 transition-colors duration-200 hover:bg-gray-50 hover:text-orange-500"
              onClick={toggleMenu}
            >
              Auction
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