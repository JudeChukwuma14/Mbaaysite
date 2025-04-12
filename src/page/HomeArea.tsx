import FirstCartCard from "@/components/Cards/FirstCartCard";
import Fashion from "../assets/image/Fashion.jpeg";
import Jewelry from "../assets/image/Jeal.jpeg";
import Art from "../assets/image/Art.jpeg";
import wellness from "../assets/image/Wellness.jpg";
import BookPoetry from "../assets/image/Bookspoetry.jpg";
import CategoryCard from "@/components/categorycardprops/CategoryCard";
import VendorCard from "@/components/VendorCard";
import sev1 from "../assets/image/Services.png";
import sev2 from "../assets/image/Services-1.png";
import sev3 from "../assets/image/Services-2.png";
import FlashSaleCountdown from "@/components/FlashSales/FlashSale";
import ProductSlider from "@/components/FlashSales/FlashSalesSlide";

import Slider from "@/components/Slider";
import Furniture from "@/assets/image/Furniture.jpg";
import {
  Auction,
  ExploreData,
  flashSale,
  ProductData,
  profilesData,
} from "@/components/mockdata/data";

import NewCard from "@/components/Cards/NewCard";
import ExploreCard from "@/components/Cards/ExploreCard";
import AuctionCard from "@/components/AuctionPage/AuctionCard";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProduct } from "@/utils/productApi";
import Spinner from "@/components/Common/Spinner";
import NewArrival from "@/components/Cards/NewArrival";
// import FlashSale from "@/components/FlashSales/FlashSales";

interface Product {
  _id: string;
  id: string; // Optional id property
  name: string;
  price: number;
  images: string[]; // Updated to match the expected type
}

const HomeArea: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const categoriesData = [
    { imageSrc: Fashion, title: "Fashion", link: "/fashion" },
    { imageSrc: Jewelry, title: "Jewelry", link: "/jewelry" },
    { imageSrc: Art, title: "Art and Sculpture", link: "/art" },
    { imageSrc: Furniture, title: "Furniture", link: "/furniture" },
    {
      imageSrc: wellness,
      title: "Beauty and wellness",
      link: "/wellness-product",
    },
    { imageSrc: BookPoetry, title: "Books and Poetry", link: "/book-poetry" },
  ];

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

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <section className="mb-10 ">
        <Slider />
      </section>
      <section className="px-8 mb-10">
        <div className="flex items-center pl-6 mb-2 ">
          <div className="w-3 h-4 bg-orange-500"></div>
          <span className="pl-2 text-orange-500">Category</span>
        </div>
        <h2 className="pl-6 mb-6 text-2xl font-bold">Browse By Category</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
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

      {/* New arrival */}
      <section className="px-8 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold md:text-2xl md:pl-6">New Arrival</h2>
          <button
            type="submit"
            className="px-3 py-2 text-white transition duration-300 bg-orange-500 hover:bg-orange-600"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products
            .map((product) => (
              <NewArrival
                key={product._id}
                product={{
                  ...product,
                  id: product._id,
                  poster: product.images[0] || "",
                }}
              />
            ))
            .slice(0, 4)}
        </div>
      </section>

      {/* Best selling */}
      <section className="px-8 mb-10">
        <div className="flex items-center pl-6 mb-2 ">
          <div className="w-3 h-4 bg-orange-500"></div>
          <span className="pl-2 text-orange-500">This Month</span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold md:text-2xl md:pl-6">
            Best Selling Products
          </h2>

          <button
            type="submit"
            className="px-3 py-2 text-white transition duration-300 bg-orange-500 hover:bg-orange-600"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {ProductData.map((item) => (
            <FirstCartCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <section className="px-8 mb-10 ">
        <div className="p-5">
          <NewCard />
        </div>
      </section>

      <section className="px-8 mb-10 ">
        <div className="flex items-center pl-6 mb-2 ">
          <div className="w-3 h-4 bg-orange-500"></div>
          <span className="pl-2 text-orange-500">This Month</span>
        </div>
        <h2 className="pl-6 mb-6 text-2xl font-bold">Latest Vendors</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {profilesData.map((profile, index) => (
            <VendorCard key={index} {...profile} />
          ))}
        </div>
      </section>
      <section className="px-8 mb-10">
        <div className="flex items-center pl-6 mb-2 ">
          <div className="w-3 h-4 bg-orange-500"></div>
          <span className="pl-2 text-orange-500">Our Products</span>
        </div>
        <h2 className="pl-6 mb-6 text-2xl font-bold">Explore Our Products</h2>
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-3 lg:grid-cols-4">
          {ExploreData.map((item, index) => (
            <ExploreCard key={index} {...item} />
          ))}
        </div>
        <div className="flex justify-center ">
          <button
            type="submit"
            className="flex items-center justify-center px-5 py-2 text-white transition duration-300 bg-orange-500 hover:bg-orange-600"
          >
            View All Products
          </button>
        </div>
      </section>
      <section className="px-8 mb-10 ">
        <div className="p-5">
          <NewCard />
        </div>
      </section>

      <section className="px-8 mb-10">
        <div className="flex items-center pl-6 mb-2 ">
          <div className="w-3 h-4 bg-orange-500"></div>
          <span className="pl-2 text-orange-500">Today's</span>
        </div>
        <div className="pl-6 mb-6">
          <FlashSaleCountdown />
        </div>
        <div>
          <ProductSlider products={flashSale} />
        </div>
        <div className="flex justify-center ">
          <button
            type="submit"
            className="flex items-center justify-center px-5 py-2 text-white transition duration-300 bg-orange-500 hover:bg-orange-600"
          >
            View All Products
          </button>
        </div>
      </section>
      <section className="px-8 mb-10">
        <div className="flex items-center pl-6 mb-2 ">
          <div className="w-3 h-4 bg-orange-500"></div>
        </div>
        <h2 className="pl-6 mb-6 text-2xl font-bold text-orange-500">
          Auction
        </h2>
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-3 lg:grid-cols-4">
          {Auction.map((item, index) => (
            <AuctionCard key={index} {...item} />
          )).slice(0, 8)}
        </div>
        <div className="flex justify-center ">
          <NavLink
            to="/auctionview"
            className="flex items-center justify-center px-5 py-2 text-white transition duration-300 bg-orange-500 hover:bg-orange-600"
          >
            View All Auction
          </NavLink>
        </div>
      </section>

      <section className="mb-10 ">
        <div>
          <div className="flex flex-col justify-center gap-4 px-5 py-8 md:px-0 md:flex-row">
            <div className="flex flex-col items-center w-full p-6 sm:w-1/2 lg:w-1/4">
              <div className="mb-4 text-4xl">
                <img src={sev1} alt="" />
              </div>
              <div className="text-xl font-semibold">
                <h4>FREE AND FAST DELIVERY</h4>
              </div>
              <div className="mt-2 text-center">
                <p>Free delivery for all orders over $140</p>
              </div>
            </div>
            <div className="flex flex-col items-center w-full p-6 sm:w-1/2 lg:w-1/4">
              <div className="mb-4 text-4xl">
                <img src={sev2} alt="" />
              </div>
              <div className="text-xl font-semibold">
                <h4>24/7 CUSTOMER SERVICE</h4>
              </div>
              <div className="mt-2 text-center">
                <p>Friendly 24/7 customer support</p>
              </div>
            </div>
            <div className="flex flex-col items-center w-full p-6 sm:w-1/2 lg:w-1/4">
              <div className="mb-4 text-4xl">
                <img src={sev3} alt="" />
              </div>
              <div className="text-xl font-semibold">
                <h4>MONEY BACK GUARANTEE</h4>
              </div>
              <div className="mt-2 text-center">
                <p>We reurn money within 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeArea;
