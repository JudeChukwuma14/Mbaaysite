import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Slider from "@/components/Slider";
import NewCard from "@/components/Cards/NewCard";
import VendorCard from "@/components/VendorCard";
// import AuctionCard from "@/components/AuctionPage/AuctionCard";
import FlashSaleCountdown from "@/components/FlashSales/FlashSale";
import ProductSlider from "@/components/FlashSales/FlashSalesSlide";
import NewArrival from "@/components/Cards/NewArrival";
import { flashSale } from "@/components/mockdata/data";
import { getAllProduct } from "@/utils/productApi";
import { getAllVendor } from "@/utils/vendorApi";
import sev1 from "../assets/image/Services.png";
import sev2 from "../assets/image/Services-1.png";
import sev3 from "../assets/image/Services-2.png";
import { FaRegSadTear, FaShoppingCart } from "react-icons/fa";
const CategoriesSection = lazy(
  () => import("@/components/Reuseable/CategoriesSection")
);

import BestSellingCard from "@/components/Cards/BestSellingCard";
import CategoriesSectionSkeleton from "@/components/skeletons/CategoriesSectionSkeleton";
// import AuctionCardSkeleton from "@/components/AuctionPage/AuctionCardSkeleton";

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  images: string[];
  createdAt: string;
  productType: string;
}

interface VendorProfile {
  _id: string;
  storeName: string;
  avatar: string;
  businessLogo: string;
  id: string;
  craftCategories: string[];
}

// Skeleton components
const ProductSkeleton = () => (
  <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse" />
);

const VendorSkeleton = () => (
  <div className="h-40 bg-gray-200 rounded-lg animate-pulse" />
);

const HomeArea: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [getVender, setGetVendor] = useState<VendorProfile[]>([]);
  // const [auctionProducts, setAuctionProducts] = useState<any[]>([]);
  // const [auctionLoading, setAuctionLoading] = useState<boolean>(true);

  const createInitialAvatar = (name: string) => {
    const firstLetter = name.trim().charAt(0).toUpperCase();
    const colors = ["#f97316", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];
    const color = colors[firstLetter.charCodeAt(0) % colors.length];
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
        console.log(result);
        const productsData = Array.isArray(result)
          ? result
          : result.products || [];

        // Filter products to include only those with productType: "sales"
        const salesProducts = productsData.filter(
          (product: Product) => product.productType === "sales"
        );

        const productsWithSales = salesProducts.map((product: Product) => ({
          ...product,
          saleCount: Math.floor(Math.random() * 100),
        }));

        const bestSelling = productsWithSales
          .sort(
            (
              a: Product & { saleCount: number },
              b: Product & { saleCount: number }
            ) => b.saleCount - a.saleCount
          )
          .slice(0, 5);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newArrivals = salesProducts
          .filter(
            (product: Product) => new Date(product.createdAt) >= thirtyDaysAgo
          )
          .sort(
            (a: Product, b: Product) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 15);

        setProducts(salesProducts);
        setBestSellingProducts(bestSelling);
        setNewArrivals(newArrivals);
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

  // useEffect(() => {
  //   const fetchAuctions = async () => {
  //     setAuctionLoading(true);
  //     try {
  //       const result = await getAuctionProduct();
  //       console.log(result);
  //       // result should be an array of auction products
  //       setAuctionProducts(Array.isArray(result) ? result : result.data || []);
  //     } catch (err) {
  //       console.error("Error fetching auctions:", err);
  //     } finally {
  //       setAuctionLoading(false);
  //     }
  //   };
  //   fetchAuctions();
  // }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FaRegSadTear className="mb-4 text-5xl text-gray-300" />
        <h2 className="mb-2 text-2xl font-semibold text-gray-400">Error</h2>
        <p className="max-w-md mb-6 text-gray-500">{error}</p>
        <Link
          to="/random-product"
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
      {/* Categories */}
      <Suspense fallback={<CategoriesSectionSkeleton />}>
        <CategoriesSection />
      </Suspense>
      {/* Our Products */}
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
            className="px-4 py-2 text-sm font-medium text-white transition-colors duration-300 bg-orange-500 rounded-md hover:bg-orange-600"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
            : products
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .slice(0, 15)
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

      {/* Best Selling */}
      <section className="container px-4 mx-auto mb-16 md:px-8">
        <div className="flex items-center mb-3">
          <div className="w-1 h-6 mr-3 bg-orange-500 rounded-full"></div>
          <span className="font-medium text-orange-500">This Month</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Best Selling Products
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : bestSellingProducts.length > 0 ? (
            bestSellingProducts.map((product) => (
              <BestSellingCard
                key={product._id}
                product={{
                  ...product,
                  id: product._id,
                  poster: product.images[0] || "",
                }}
              />
            ))
          ) : (
            <p className="text-gray-500">No best-selling products available.</p>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="container px-4 mx-auto mb-16 md:px-8">
        <div className="overflow-hidden bg-white shadow-sm rounded-xl">
          <NewCard />
        </div>
      </section>

      {/* Vendors */}
      <section className="container px-4 mx-auto mb-16 md:px-8">
        <div className="flex items-center mb-3">
          <div className="w-1 h-6 mr-3 bg-orange-500 rounded-full"></div>
          <span className="font-medium text-orange-500">Featured Sellers</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Latest Vendors
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2 mb:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
              <VendorSkeleton key={i} />
            ))
            : getVender.slice(0, 5).map((profile) => {
              const avatarUrl = profile.avatar
                ? profile.avatar
                : createInitialAvatar(profile.storeName || "V");

              const isArtVendor =
                profile.craftCategories?.includes("Art & Sculptures");
              return (
                <Link
                  to={
                    isArtVendor
                      ? `/art-profile/${profile._id}`
                      : `/veiws-profile/${profile._id}`
                  }
                  key={profile._id}
                >
                  <VendorCard
                    name={profile.storeName}
                    craft={profile.craftCategories[0]}
                    avatar={avatarUrl}
                    backgroundImage={
                      profile?.businessLogo ||
                      "https://mbaaysite-6b8n.vercel.app/assets/MBLogo-spwX6zWd.png"
                    }
                  />
                </Link>
              );
            })}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            to="/more-vendor"
            className="px-6 py-3 font-medium text-white transition-colors duration-300 bg-orange-500 rounded-md hover:bg-orange-600"
          >
            View All Vendors
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
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
            className="flex items-center text-sm text-gray-600 transition-colors duration-200 hover:text-orange-500"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2  gap-3 md:gap-6 mb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
          ) : newArrivals.length > 0 ? (
            newArrivals.slice(0, 10).map((product) => (
              <NewArrival
                key={product._id}
                product={{
                  ...product,
                  id: product._id,
                  poster: product.images[0] || "",
                }}
              />
            ))
          ) : (
            <p className="text-gray-500">No new arrivals available.</p>
          )}
        </div>
        <div className="flex justify-center">
          <Link
            to="/random-product"
            className="px-6 py-3 font-medium text-white transition-colors duration-300 bg-orange-500 rounded-md hover:bg-orange-600"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Second Banner */}
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
      {/* <section className="container px-4 mx-auto mb-16 md:px-8">
        <div className="flex items-center mb-3">
          <div className="w-1 h-6 mr-3 bg-orange-500 rounded-full"></div>
          <span className="font-medium text-orange-500">Bid Now</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-orange-500 md:text-3xl">
            Auction
          </h2>
          <Link
            to="/auctionlist"
            className="flex items-center text-sm text-gray-600 transition-colors duration-200 hover:text-orange-500"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {auctionLoading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <AuctionCardSkeleton key={idx} />
              ))
            : auctionProducts
                .slice(0, 8)
                .map((item) => (
                  <AuctionCard
                    key={item._id}
                    id={item._id}
                    image={item.images?.[0] || "/placeholder.svg"}
                    title={item.name}
                    currentBid={item.highestBid?.amount || item.startingPrice}
                    lotNumber={item._id.slice(-4)}
                    seller={item.poster?.storeName || "Unknown"}
                    sellerImage={item.poster?.image || "/placeholder.svg"}
                    endTime={item.auctionEndDate}
                    category={item.category}
                    isPremium={item.verified}
                  />
                ))}
        </div>
        <div className="flex justify-center">
          <NavLink
            to="/auctionlist"
            className="px-6 py-3 font-medium text-white transition-colors duration-300 bg-orange-500 rounded-md hover:bg-orange-600"
          >
            View All Auctions
          </NavLink>
        </div>
      </section> */}

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
