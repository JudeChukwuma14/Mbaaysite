import FirstCartCard from "@/components/Cards/FirstCartCard";
import Fashion from "../assets/image/Fashion.jpeg";
import Jewelry from "../assets/image/Jeal.jpeg";
import Art from "../assets/image/Art.jpeg";
import wellness from "../assets/image/Wellness.jpg";
import pro1 from "../assets/image/pro1.jpg";
import pro2 from "../assets/image/pro2.jpg";
import pro3 from "../assets/image/pro3.jpg";
import pro4 from "../assets/image/pro4.jpg";
import CategoryCard from "@/components/categorycardprops/CategoryCard";
import VendorCard from "@/components/VendorCard";
import vendorbg from "../assets/image/vendorbg.png";
import vendorpr from "../assets/image/vendorpr.png";
import sev1 from "../assets/image/Services.png";
import sev2 from "../assets/image/Services-1.png";
import sev3 from "../assets/image/Services-2.png";
import FlashSaleCountdown from "@/components/FlashSales/FlashSale";
import ProductSlider from "@/components/FlashSales/FlashSalesSlide";
import Gear from "@/assets/image/Gear.jpg";
import Slider from "@/components/Slider";
// import headset from "../assets/image/headset.jpg";
// import watch from "../assets/image/watch.jpg";
// import bluetooth from "../assets/image/Bluetooth.jpg";
// import game from "../assets/image/game.jpg";
interface Product {
  id: number;
  title: string;
  currentPrice: string;
  originalPrice: string;
  image: string;
  rating: number;
  reviews: number;
}
const HomeArea: React.FC = () => {
  // const products = [
  //     {
  //       id: 1,
  //       name: "Wireless Headphones",
  //       price: "$99.99",
  //       image: headset,
  //     },
  //     {
  //       id: 2,
  //       name: "Smartwatch",
  //       price: "$199.99",
  //       image: watch,
  //     },
  //     {
  //       id: 3,
  //       name: "Bluetooth Speaker",
  //       price: "$49.99",
  //       image: bluetooth,
  //     },
  //     {
  //       id: 4,
  //       name: "Gaming Keyboard",
  //       price: "$79.99",
  //       image: game,
  //     },
  //   ];

  const categoriesData = [
    { imageSrc: Fashion, title: "Fashion" },
    { imageSrc: Jewelry, title: "Jewelry" },
    { imageSrc: Art, title: "Art" },
    { imageSrc: Fashion, title: "Fragrances" },
    { imageSrc: wellness, title: "Wellness products" },
    { imageSrc: Art, title: "Skin Care" },
  ];
  const ProductData: Product[] = [
    {
      id: 1,
      image: pro1,
      currentPrice: "250",
      originalPrice: "400",
      rating: 4,
      reviews: 3,
      title: "Fashion",
    },
    {
      id: 2,
      image: pro2,
      currentPrice: "250",
      originalPrice: "400",
      rating: 4,
      reviews: 3,
      title: "Jewelry",
    },
    {
      id: 3,
      image: pro3,
      currentPrice: "250",
      originalPrice: "400",
      rating: 4,
      reviews: 3,
      title: "Art",
    },
    {
      id: 4,
      image: pro4,
      currentPrice: "250",
      originalPrice: "400",
      rating: 4,
      reviews: 3,
      title: "Fragrances",
    },
    {
      id: 5,
      image: pro1,
      currentPrice: "250",
      originalPrice: "400",
      rating: 4,
      reviews: 3,
      title: "Wellness products",
    },
    {
      id: 6,
      image: pro3,
      currentPrice: "250",
      originalPrice: "400",
      rating: 4,
      reviews: 3,
      title: "Skin Care",
    },
  ];

  const profilesData = [
    {
      backgroundImage: vendorbg,
      avatar: vendorpr,
      name: "Johnathan Grandy",
      profession: "Photographer",
      location: "Lagos, Nigeria",
    },
    {
      backgroundImage: vendorbg,
      avatar: vendorpr,
      name: "Johnathan Grandy",
      profession: "Photographer",
      location: "Lagos, Nigeria",
    },
    {
      backgroundImage: vendorbg,
      avatar: vendorpr,
      name: "Johnathan Grandy",
      profession: "Photographer",
      location: "Lagos, Nigeria",
    },
    {
      backgroundImage: vendorbg,
      avatar: vendorpr,
      name: "Johnathan Grandy",
      profession: "Photographer",
      location: "Lagos, Nigeria",
    },
    {
      backgroundImage: vendorbg,
      avatar: vendorpr,
      name: "Johnathan Grandy",
      profession: "Photographer",
      location: "Lagos, Nigeria",
    },

    {
      backgroundImage: vendorbg,
      avatar: vendorpr,
      name: "Johnathan Grandy",
      profession: "Photographer",
      location: "Lagos, Nigeria",
    },
    {
      backgroundImage: vendorbg,
      avatar: vendorpr,
      name: "Johnathan Grandy",
      profession: "Photographer",
      location: "Lagos, Nigeria",
    },
    {
      backgroundImage: vendorbg,
      avatar: vendorpr,
      name: "Johnathan Grandy",
      profession: "Photographer",
      location: "Lagos, Nigeria",
    },
  ];

  const flashSale = [
    {
      id: 1,
      name: "AK-900 Wired Keyboard",
      price: "$960",
      originalPrice: "$1160",
      image:
        "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
      rating: 4,
      reviews: 75,
    },
    {
      id: 2,
      name: "Wireless Headphones",
      price: "$99.99",
      originalPrice: "$129.99",
      image:
        "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
      rating: 5,
      reviews: 120,
    },
    {
      id: 3,
      name: "Smartwatch",
      price: "$199.99",
      originalPrice: "$249.99",
      image:
        "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
      rating: 4,
      reviews: 90,
    },
    {
      id: 4,
      name: "Bluetooth Speaker",
      price: "$49.99",
      originalPrice: "$69.99",
      image:
        "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
      rating: 3,
      reviews: 50,
    },
    {
      id: 5,
      name: "Gaming Keyboard",
      price: "$79.99",
      originalPrice: "$99.99",
      image:
        "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
      rating: 4,
      reviews: 80,
    },
    {
      id: 6,
      name: "Gaming Keyboard",
      price: "$79.99",
      originalPrice: "$99.99",
      image:
        "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
      rating: 4,
      reviews: 80,
    },
    {
      id: 7,
      name: "Gaming Keyboard",
      price: "$79.99",
      originalPrice: "$99.99",
      image:
        "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
      rating: 4,
      reviews: 80,
    },
    {
      id: 8,
      name: "Gaming Keyboard",
      price: "$79.99",
      originalPrice: "$99.99",
      image:
        "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
      rating: 4,
      reviews: 80,
    },
  ];

  const categories = [
    {
      title: "Professional Camera Zoom",
      image: Gear, // Replace with actual image
      bgColor: "bg-purple-300",
      link: "#",
    },
    {
      title: "Gear 360°",
      image: Gear,
      bgColor: "bg-gray-200",
      link: "#",
    },
    {
      title: "Black Friday Deals",
      image: Gear,
      bgColor: "bg-black text-white",
      link: "#",
    },
    {
      title: "Apple Macbook Air 15.6”",
      image: Gear,
      bgColor: "bg-white",
      link: "#",
    },
    {
      title: "Headphone XL Stereo",
      image: Gear,
      bgColor: "bg-blue-200",
      link: "#",
    },
  ];

  return (
    <>
    <section className=" mb-10">
    <Slider/>
    </section>
      <section className="mb-10 px-8">
        <div className=" flex items-center pl-6 mb-2">
          <div className="h-4 w-3 bg-orange-500"></div>
          <span className="text-orange-500  pl-2">Category</span>
        </div>
        <h2 className="text-2xl font-bold pl-6 mb-6">Browse By Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4  lg:grid-cols-6 gap-6">
          {categoriesData.map((category, index) => (
            <CategoryCard
              key={index}
              imageSrc={category.imageSrc}
              title={category.title}
            />
          ))}
        </div>
      </section>
      <section className="mb-10 px-8">
        <div className=" flex items-center pl-6 mb-2">
          <div className="h-4 w-3 bg-orange-500"></div>
          <span className="text-orange-500  pl-2">This Month</span>
        </div>
        <h2 className="text-2xl font-bold pl-6 mb-6">Best Selling Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {ProductData.map((item) => (
            <FirstCartCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <section className=" mb-10 px-8">
        <div className="p-4 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((product, index) => (
              <div
                key={index}
                className={`p-4 shadow-md ${product.bgColor} flex items-center`}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-[200px] h-[200px] object-contain mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <a
                    href={product.link}
                    className="mt-2 inline-block text-sm text-blue-600 font-semibold"
                  >
                    Shop Now →
                  </a>
                </div>
              </div>
            ))}
          </div>
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
      <section className=" mb-10 px-8">
        <div className="p-4 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((product, index) => (
              <div
                key={index}
                className={`p-4 shadow-md ${product.bgColor} flex items-center`}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-[200px] h-[200px] object-contain mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <a
                    href={product.link}
                    className="mt-2 inline-block text-sm text-blue-600 font-semibold"
                  >
                    Shop Now →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-10">
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
