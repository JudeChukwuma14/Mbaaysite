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
  ExploreData,
  flashSale,
  ProductData,
  profilesData,
} from "@/components/mockdata/data";

import NewCard from "@/components/Cards/NewCard";
import ExploreCard from "@/components/Cards/ExploreCard";

const HomeArea: React.FC = () => {
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

  return (
    <>
      <section className=" mb-10">
        <Slider />
      </section>
      <section className="mb-10 px-8">
        <div className=" flex items-center pl-6 mb-2">
          <div className="h-4 w-3 bg-orange-500"></div>
          <span className="text-orange-500  pl-2">Category</span>
        </div>
        <h2 className="text-2xl font-bold pl-6 mb-6">Browse By Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
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
      <section className="mb-10 px-8">
        <div className=" flex items-center pl-6 mb-2">
          <div className="h-4 w-3 bg-orange-500"></div>
          <span className="text-orange-500  pl-2">This Month</span>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold pl-6">Best Selling Products</h2>
          <button
            type="submit"
            className=" bg-orange-500 text-white py-2  px-3 hover:bg-orange-600 transition duration-300 flex items-center justify-center"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {ProductData.map((item) => (
            <FirstCartCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <section className=" mb-10 px-8">
        <div className="p-5">
          <NewCard />
        </div>
      </section>

      <section className=" mb-10 px-8">
        <div className=" flex items-center pl-6 mb-2">
          <div className="h-4 w-3 bg-orange-500"></div>
          <span className="text-orange-500  pl-2">This Month</span>
        </div>
        <h2 className="text-2xl font-bold pl-6 mb-6">Latest Vendors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3  lg:grid-cols-4 gap-6">
          {profilesData.map((profile, index) => (
            <VendorCard key={index} {...profile} />
          ))}
        </div>
      </section>
      <section className="mb-10 px-8">
        <div className=" flex items-center pl-6 mb-2">
          <div className="h-4 w-3 bg-orange-500"></div>
          <span className="text-orange-500  pl-2">Our Products</span>
        </div>
        <h2 className="text-2xl font-bold pl-6 mb-6">Explore Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {ExploreData.map((item, index) => (
            <ExploreCard key={index} {...item} />
          ))}
        </div>
        <div className=" flex justify-center">
          <button
            type="submit"
            className=" bg-orange-500 text-white py-2 px-5  hover:bg-orange-600 transition duration-300 flex items-center justify-center"
          >
            View All Products
          </button>
        </div>
      </section>
      <section className=" mb-10 px-8">
        <div className="p-5">
          <NewCard />
        </div>
      </section>

      <section className="mb-10 px-8">
        <div className=" flex items-center pl-6 mb-2">
          <div className="h-4 w-3 bg-orange-500"></div>
          <span className="text-orange-500  pl-2">Today's</span>
        </div>
        <div className="pl-6 mb-6">
          <FlashSaleCountdown />
        </div>
        <div>
          <ProductSlider products={flashSale} />
        </div>
        <div className=" flex justify-center">
          <button
            type="submit"
            className=" bg-orange-500 text-white py-2 px-5  hover:bg-orange-600 transition duration-300 flex items-center justify-center"
          >
            View All Products
          </button>
        </div>
      </section>
      <section className=" mb-10">
        <div>
          <div className="flex justify-center gap-4 py-8 px-5 md:px-0 flex-col  md:flex-row">
            <div className="flex flex-col items-center p-6  w-full sm:w-1/2 lg:w-1/4">
              <div className="text-4xl mb-4">
                <img src={sev1} alt="" />
              </div>
              <div className="text-xl font-semibold">
                <h4>FREE AND FAST DELIVERY</h4>
              </div>
              <div className="mt-2 text-center">
                <p>Free delivery for all orders over $140</p>
              </div>
            </div>
            <div className="flex flex-col items-center p-6  w-full sm:w-1/2 lg:w-1/4">
              <div className="text-4xl mb-4">
                <img src={sev2} alt="" />
              </div>
              <div className="text-xl font-semibold">
                <h4>24/7 CUSTOMER SERVICE</h4>
              </div>
              <div className="mt-2 text-center">
                <p>Friendly 24/7 customer support</p>
              </div>
            </div>
            <div className="flex flex-col items-center p-6  w-full sm:w-1/2 lg:w-1/4">
              <div className="text-4xl mb-4">
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
