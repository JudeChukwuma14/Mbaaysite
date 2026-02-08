import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Slider from "@/components/Slider";
import NewCard from "@/components/Cards/NewCard";
import VendorCard from "@/components/VendorCard";
import FlashSaleCountdown from "@/components/FlashSales/FlashSaleCountdown";
import ProductSlider from "@/components/FlashSales/FlashSalesSlide";
import NewArrival from "@/components/Cards/NewArrival";
import { flashSale } from "@/components/mockdata/data";
import { getAllProduct } from "@/utils/productApi";
import { getAllVendor } from "@/utils/vendorApi";
import sev1 from "../assets/image/Services.png";
import sev2 from "../assets/image/Services-1.png";
import sev3 from "../assets/image/Services-2.png";
import { FaRegSadTear, FaShoppingCart } from "react-icons/fa";
import { IoFlash } from "react-icons/io5";
const CategoriesSection = lazy(
  () => import("@/components/Reuseable/CategoriesSection"),
);

import BestSellingCard from "@/components/Cards/BestSellingCard";
import CategoriesSectionSkeleton from "@/components/skeletons/CategoriesSectionSkeleton";

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  flashSalePrice?: number;
  flashSaleStatus?: string;
  flashSaleDiscount?: number;
  images: string[];
  createdAt: string;
  productType: string;
  inventory?: number;
  rating?: number;
  reviews?: number;
  flashSaleStartDate?: string;
  flashSaleEndDate?: string;
  poster?: string;
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

const FlashSaleSkeleton = () => (
  <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl shadow-sm p-4">
        <div className="aspect-square bg-gray-200 rounded-lg animate-pulse mb-4"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
      </div>
    ))}
  </div>
);

const HomeArea: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [flashSaleLoading, setFlashSaleLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [getVender, setGetVendor] = useState<VendorProfile[]>([]);

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

  // Fetch all products including flash sale products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setFlashSaleLoading(true);
      try {
        const result = await getAllProduct();

        // Handle both array and object responses
        const productsData = Array.isArray(result)
          ? result
          : result.products || [];
        // Filter regular sales products
        const salesProducts = productsData.filter(
          (product: Product) => product.productType === "sales",
        );

        // Filter active flash sale products
        const flashSaleProducts = productsData.filter((product: Product) => {
          const isFlashSale =
            product.flashSaleStatus === "Active" ||
            product.productType === "flash sale";

          return isFlashSale;
        });

        console.log("Flash sale products found:", flashSaleProducts.length);
        flashSaleProducts.forEach((p: Product) =>
          console.log(p.name, p.flashSaleStatus, p.productType),
        );

        // For development/testing, you can merge mock data
        const finalFlashSaleProducts =
          process.env.NODE_ENV === "development" &&
          flashSaleProducts.length === 0
            ? flashSale // Use mock data if no real flash sale products
            : flashSaleProducts;

        // Add sale counts for best selling calculation
        const productsWithSales = salesProducts.map((product: Product) => ({
          ...product,
          saleCount: Math.floor(Math.random() * 100),
        }));

        // Calculate best selling products
        const bestSelling = productsWithSales
          .sort(
            (
              a: Product & { saleCount: number },
              b: Product & { saleCount: number },
            ) => b.saleCount - a.saleCount,
          )
          .slice(0, 5);

        // Calculate new arrivals (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newArrivalsData = salesProducts
          .filter(
            (product: Product) => new Date(product.createdAt) >= thirtyDaysAgo,
          )
          .sort(
            (a: Product, b: Product) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 15);

        // Update all states
        setProducts(salesProducts);
        setBestSellingProducts(bestSelling);
        setNewArrivals(newArrivalsData);
        setFlashSaleProducts(finalFlashSaleProducts);
      } catch (err) {
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
        setFlashSaleLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch vendors
  useEffect(() => {
    const getVendor = async () => {
      try {
        const vendor = await getAllVendor();
        setGetVendor(vendor.vendors);
      } catch (error) {
        console.log("Error fetching vendors:", error);
      }
    };
    getVendor();
  }, []);

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
                    new Date(a.createdAt).getTime(),
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

      {/* Flash Sale Section - UPDATED */}
      <section className="container px-4 mx-auto mb-16 md:px-8">
        <div className="flex items-center mb-3">
          <div className="w-1 h-6 mr-3 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
          <span className="font-medium text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
            Limited Time Offer
          </span>
        </div>

        {/* Flash Sale Header with Countdown */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              🔥 Flash Sale
            </h2>
            <p className="mt-2 text-gray-600">
              Limited-time deals ending soon. Don't miss out!
            </p>
          </div>
          <FlashSaleCountdown />
        </div>

        {/* Flash Sale Products */}
        {flashSaleLoading ? (
          <FlashSaleSkeleton />
        ) : flashSaleProducts.length > 0 ? (
          <>
            <div className="mb-8">
              <ProductSlider products={flashSaleProducts} />
            </div>

            {/* Flash Sale Stats */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {flashSaleProducts.length}
                </div>
                <div className="text-gray-600">Products on Sale</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {Math.max(
                    ...flashSaleProducts.map((p) => p.flashSaleDiscount || 0),
                  )}
                  %
                </div>
                <div className="text-gray-600">Maximum Discount</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {
                    flashSaleProducts.filter(
                      (p) => p.inventory && p.inventory > 0,
                    ).length
                  }
                </div>
                <div className="text-gray-600">In Stock</div>
              </div>
            </div> */}
          </>
        ) : (
          <div className="text-center py-12 bg-gradient-to-b from-orange-50 to-transparent rounded-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-full">
              <IoFlash className="text-3xl text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Flash Sales Available
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Check back soon for exciting flash sale deals!
            </p>
            <Link
              to="/random-product"
              className="inline-flex items-center gap-2 px-6 py-3 font-medium text-white transition-all duration-300 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg hover:shadow-lg hover:scale-105"
            >
              <FaShoppingCart />
              Browse All Products
            </Link>
          </div>
        )}

        {flashSaleProducts.length > 0 && (
          <div className="flex justify-center mt-8">
            <Link
              to="/flash-sale"
              className="px-8 py-3 font-medium text-white transition-all duration-300 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg hover:shadow-lg hover:scale-105"
            >
              View All Flash Sales
            </Link>
          </div>
        )}
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
