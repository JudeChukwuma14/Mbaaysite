"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// Import components
import Slider from "@/components/Slider";
import CategoryCard from "@/components/categorycardprops/CategoryCard";
import FirstCartCard from "@/components/Cards/FirstCartCard";
import NewCard from "@/components/Cards/NewCard";
import VendorCard from "@/components/VendorCard";
import ExploreCard from "@/components/Cards/ExploreCard";
import AuctionCard from "@/components/AuctionPage/AuctionCard";
import FlashSaleCountdown from "@/components/FlashSales/FlashSale";
import ProductSlider from "@/components/FlashSales/FlashSalesSlide";
import NewArrival from "@/components/Cards/NewArrival";
import Spinner from "@/components/Common/Spinner";

// Import data and APIs
import {
  Auction,
  ExploreData,
  flashSale,
  ProductData,
} from "@/components/mockdata/data";
import { getAllProduct } from "@/utils/productApi";
import { getAllVendor } from "@/utils/vendorApi";

// Import images
import Fashion from "../assets/image/Fashion.jpeg";
import Jewelry from "../assets/image/Jeal.jpeg";
import Art from "../assets/image/Art.jpeg";
import wellness from "../assets/image/Wellness.jpg";
import BookPoetry from "../assets/image/Bookspoetry.jpg";
import Furniture from "@/assets/image/Furniture.jpg";
import sev1 from "../assets/image/Services.png";
import sev2 from "../assets/image/Services-1.png";
import sev3 from "../assets/image/Services-2.png";
import { FaRegSadTear, FaShoppingCart } from "react-icons/fa";

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  images: string[];
  createdAt: string;
}

interface VendorProfile {
  storeName: string;
  country: string;
  city: string;
  avatar: string;
  businessLogo: string;
  id: string;
}

const HomeArea: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [getVender, setGetVendor] = useState<VendorProfile[]>([]);

  const categoriesData = [
    { imageSrc: Fashion, title: "Fashion", link: "/fashion" },
    { imageSrc: Jewelry, title: "Jewelry", link: "/jewelry" },
    { imageSrc: Art, title: "Art and Sculpture", link: "/art" },
    { imageSrc: Furniture, title: "Home Décor", link: "/homedecor" },
    {
      imageSrc: wellness,
      title: "Beauty and wellness",
      link: "/beautywellness",
    },
    { imageSrc: BookPoetry, title: "Books and Poetry", link: "/book-poetry" },
  ];

  const createInitialAvatar = (name: string) => {
    // Get first letter and ensure it's uppercase
    const firstLetter = name.trim().charAt(0).toUpperCase();

    // Color options (you can customize these)
    const colors = ["#f97316", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];
    const color = colors[firstLetter.charCodeAt(0) % colors.length];

    // Create SVG with just the first letter
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>
      <rect width='100' height='100' fill='${color}' rx='50' />
      <text x='50%' y='50%' font-size='60' fill='white' 
            font-weight='bold'
            text-anchor='middle' dominant-baseline='middle'>${firstLetter}</text>
    </svg>`;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getAllProduct();
        const productsData = Array.isArray(result)
          ? result
          : result.products || [];
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const getVendor = async () => {
      try {
        const vendor = await getAllVendor();
        setGetVendor(vendor.vendors);
      } catch (error) {
        console.log(error);
      }
    };
    getVendor();
  }, []);

  if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FaRegSadTear className="mb-4 text-5xl text-gray-300" />
        <h2 className="mb-2 text-2xl font-semibold text-gray-400">Error</h2>
        <p className="max-w-md mb-6 text-gray-500">{error}</p>
        <Link
          to="/shop"
          className="flex items-center gap-2 px-6 py-2 font-medium text-white transition duration-300 bg-orange-500 rounded-lg hover:bg-orange-600"
        >
          <FaShoppingCart />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Slider */}
      <section className="mb-12">
        <Slider />
      </section>

      {/* Categories Section */}
      <section className="container px-4 mx-auto mb-16 md:px-8">
        <div className="flex items-center mb-3">
          <div className="w-1 h-6 mr-3 bg-orange-500 rounded-full"></div>
          <span className="font-medium text-orange-500">Category</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Browse By Category
          </h2>
          <Link
            to="/"
            className="flex items-center text-sm text-gray-600 transition-colors duration-200 hover:text-orange-500"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categoriesData.map((category, index) => (
            <CategoryCard
              key={index}
              imageSrc={category.imageSrc}
              title={category.title}
              link={category.link}
            />
          ))}
        </div>
      </section>

      {/* Explore Products */}
      <section className="container px-4 mx-auto mb-16 md:px-8">
        <div className="flex items-center mb-3">
          <div className="w-1 h-6 mr-3 bg-orange-500 rounded-full"></div>
          <span className="font-medium text-orange-500">Our Products</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Explore Our Products
          </h2>
          <Link
            to="/random-product"
            className="flex items-center text-sm text-gray-600 transition-colors duration-200 hover:text-orange-500"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {ExploreData.map((item, index) => (
            <ExploreCard key={index} {...item} />
          ))}
        </div>

        {/* <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 20)
            .map((product) => (
              <NewArrival
                key={product._id}
                product={{
                  ...product,
                  id: product._id,
                  poster: product.images[0] || "",
                }}
              />
            ))}
        </div> */}
        <div className="flex justify-center">
          <Link
            to="/random-product"
            className="px-6 py-3 font-medium text-white transition-colors duration-300 bg-orange-500 rounded-md hover:bg-orange-600"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="container px-4 mx-auto mb-16 md:px-8">
        <div className="flex items-center mb-3">
          <div className="w-1 h-6 mr-3 bg-orange-500 rounded-full"></div>
          <span className="font-medium text-orange-500">This Month</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Best Selling Products
          </h2>
          <Link
            to="/random-product"
            className="px-4 py-2 text-sm font-medium text-white transition-colors duration-300 bg-orange-500 rounded-md hover:bg-orange-600"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {ProductData.map((item) => (
            <FirstCartCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="container px-4 mx-auto mb-16 md:px-8">
        <div className="overflow-hidden bg-white shadow-sm rounded-xl">
          <NewCard />
        </div>
      </section>

      {/* Latest Vendors */}
      <section className="container px-4 mx-auto mb-16 md:px-8">
        <div className="flex items-center mb-3">
          <div className="w-1 h-6 mr-3 bg-orange-500 rounded-full"></div>
          <span className="font-medium text-orange-500">Featured Sellers</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Latest Vendors
          </h2>
          <Link
            to="/"
            className="flex items-center text-sm text-gray-600 transition-colors duration-200 hover:text-orange-500"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {getVender.slice(0, 5).map((profile, index) => {
            // Verify the store name is correct
            console.log(`Vendor ${index}:`, profile.storeName);

            const avatarUrl = profile.avatar
              ? profile.avatar
              : createInitialAvatar(profile.storeName || "V"); // Fallback to "V" if no name

            // Verify the generated avatar URL
            console.log(`Avatar ${index}:`, avatarUrl);

            return (
              <VendorCard
                key={index}
                name={profile.storeName}
                location={profile.country}
                profession={profile.city}
                avatar={avatarUrl}
                backgroundImage={
                  profile?.businessLogo ||
                  "https://img.freepik.com/free-photo/portrait-man-with-kaleidoscope-effect_23-2148261310.jpg?t=st=1744827001~exp=1744830601~hmac=4cbd73162b20719ef34d33ab04807c4ad11606b990b62e2580c103325c8292e3&w=1380"
                }
              />
            );
          })}
        </div>
      </section>
      {/* New Arrivals Section */}
      <section className="container px-4 mx-auto mb-16 md:px-8">
        <div className="flex items-center mb-3">
          <div className="w-1 h-6 mr-3 bg-orange-500 rounded-full"></div>
          <span className="font-medium text-orange-500">Just Arrived</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            New Arrivals
          </h2>
          <Link
            to="/random-product"
            className="px-4 py-2 text-sm font-medium text-white transition-colors duration-300 bg-orange-500 rounded-md hover:bg-orange-600"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 5)
            .map((product) => (
              <NewArrival
                key={product._id}
                product={{
                  ...product,
                  id: product._id,
                  poster: product.images[0] || "",
                }}
              />
            ))}
        </div>
      </section>
      {/* ............................... */}
      {/* Second Promotional Banner */}
      <section className="container px-4 mx-auto mb-16 md:px-8">
        <div className="overflow-hidden bg-white shadow-sm rounded-xl">
          <NewCard />
        </div>
      </section>

      {/* Flash Sale */}
      <section className="container px-4 mx-auto mb-16 md:px-8">
        <div className="flex items-center mb-3">
          <div className="w-1 h-6 mr-3 bg-orange-500 rounded-full"></div>
          <span className="font-medium text-orange-500">Today's</span>
        </div>
        <div className="mb-8">
          <FlashSaleCountdown />
        </div>
        <div className="mb-8">
          <ProductSlider products={flashSale} />
        </div>
        <div className="flex justify-center">
          <Link
            to="/random-product"
            className="px-6 py-3 font-medium text-white transition-colors duration-300 bg-orange-500 rounded-md hover:bg-orange-600"
          >
            View All Flash Sales
          </Link>
        </div>
      </section>

      {/* Auction */}
      <section className="container px-4 mx-auto mb-16 md:px-8">
        <div className="flex items-center mb-3">
          <div className="w-1 h-6 mr-3 bg-orange-500 rounded-full"></div>
          <span className="font-medium text-orange-500">Bid Now</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-orange-500 md:text-3xl">
            Auction
          </h2>
          <Link
            to="/auctions"
            className="flex items-center text-sm text-gray-600 transition-colors duration-200 hover:text-orange-500"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Auction.slice(0, 8).map((item, index) => (
            <AuctionCard key={index} {...item} />
          ))}
        </div>
        <div className="flex justify-center">
          <NavLink
            to="/auctionview"
            className="px-6 py-3 font-medium text-white transition-colors duration-300 bg-orange-500 rounded-md hover:bg-orange-600"
          >
            View All Auctions
          </NavLink>
        </div>
      </section>

      {/* Services */}
      <section className="px-4 py-16 bg-white md:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center p-6 text-center transition-shadow duration-300 rounded-lg hover:shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mb-4">
                <img
                  src={sev1 || "/placeholder.svg"}
                  alt="Free Delivery"
                  className="object-contain w-full h-full"
                />
              </div>
              <h3 className="mb-2 text-xl font-bold">FREE AND FAST DELIVERY</h3>
              <p className="text-gray-600">
                Free delivery for all orders over $140
              </p>
            </div>

            <div className="flex flex-col items-center p-6 text-center transition-shadow duration-300 rounded-lg hover:shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mb-4">
                <img
                  src={sev2 || "/placeholder.svg"}
                  alt="Customer Service"
                  className="object-contain w-full h-full"
                />
              </div>
              <h3 className="mb-2 text-xl font-bold">24/7 CUSTOMER SERVICE</h3>
              <p className="text-gray-600">Friendly 24/7 customer support</p>
            </div>

            <div className="flex flex-col items-center p-6 text-center transition-shadow duration-300 rounded-lg hover:shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mb-4">
                <img
                  src={sev3 || "/placeholder.svg"}
                  alt="Money Back"
                  className="object-contain w-full h-full"
                />
              </div>
              <h3 className="mb-2 text-xl font-bold">MONEY BACK GUARANTEE</h3>
              <p className="text-gray-600">We return money within 30 days</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeArea;
