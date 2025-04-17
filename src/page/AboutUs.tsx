import React from "react";
import About_1 from "../assets/image/about1.png";
import { FaStore, FaShoppingBag, FaUsers, FaDollarSign } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import StatsBoxprops from "../components/Statbox/StatsBoxprops";
import abt1 from "../assets/image/abt1.png";
import abt2 from "../assets/image/abt2.png";
import sev1 from "../assets/image/Services.png";
import sev2 from "../assets/image/Services-1.png";
import sev3 from "../assets/image/Services-2.png";
const AboutUs: React.FC = () => {
  const statsData = [
    { icon: <FaStore />, value: "10.5k", label: "Sellers active on our site" },
    { icon: <FaShoppingBag />, value: "33k", label: "Monthly Product Sale" },
    {
      icon: <FaUsers />,
      value: "45.5k",
      label: "Customers active on our site",
    },
    {
      icon: <FaDollarSign />,
      value: "25k",
      label: "Annual gross sale on our site",
    },
  ];

  const data = [
    {
      img: abt2,
      name: "Free Man",
      p: "Web Designer",
      icons: <FaUsers />,
    },
    {
      img: abt1,
      name: "Kimora",
      p: "Project Designer",
      icons: <FaUsers />,
    },
    {
      img: abt1,
      name: "Shubby",
      p: "C.E.O",
      icons: <FaUsers />,
    },

    {
      img: "https://img.freepik.com/free-photo/successful-dark-skinned-female-student-happy-get-scholarship-clenches-fists-accomplishes-goal_273609-25984.jpg?t=st=1716493688~exp=1716497288~hmac=94f131f0281fe0b7c491908924fc57e6b82bb0f2e57258e757cc441213b30806&w=900",
      name: "Praises Neche",
      p: "Land Lord",
      icons: <FaUsers />,
    },
    {
      img: "https://img.freepik.com/free-photo/stylish-young-african-black-man-with-white-cup-coffee-posing-dark-studio-background_155003-21813.jpg?t=st=1716493620~exp=1716497220~hmac=300c7e313946fe9dcdc062540e5039acb9868c36cd0aeb63c0bb4166f888a4bd&w=360",
      name: "Veric",
      p: "UI/UX Designer",
      icons: <FaUsers />,
    },
    {
      img: "https://img.freepik.com/free-photo/confident-african-businesswoman-smiling-closeup-portrait-jobs-career-campaign_53876-143280.jpg?t=st=1716493448~exp=1716497048~hmac=e947386ec50caae0074f287461acc53a32d6630895c60e39f3da417fba8d515d&w=900",
      name: "Juliet",
      p: "Manager",
      icons: <FaUsers />,
    },
  ];

  const settings = {
    dots: true, // Show dot indicators
    infinite: true, // Infinite looping
    speed: 2000, // Transition speed
    slidesToShow: 4, // Number of slides to show at once
    slidesToScroll: 2, // Number of slides to scroll
    arrows: false, // This removes the navigation arrows
    responsive: [
      {
        breakpoint: 1024, // Adjust for large screens
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 835, // Adjust for tablets
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // Adjust for mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="px-4 py-8 md:px-8 lg:px-16">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-500">
        <a href="/" className="hover:underline">
          Home
        </a>
        / <span>About</span>
      </div>
      <section className="mb-10">
        <div className="grid gap-8 mb-4 md:grid-cols-2">
          <div>
            <h1 className="mb-4 text-3xl font-bold">Our Story</h1>
            <p className="mb-4 text-justify text-gray-600">
              Launched in 2015, Mbaay is World's premier online shopping
              marketplace with an active presence in Bangladesh. Supported by a
              wide range of tailored marketing, data, and service solutions,
              Mbaay has 10,500 sellers and 300 brands and serves 3 million
              customers across the region.
            </p>
            <p className="text-gray-600">
              Mbaay has more than 1 million products to offer, growing at a very
              fast rate. Mbaay offers a diverse assortment in categories ranging
              from consumer products.
            </p>
          </div>

          {/* Image Section */}
          <div>
            <img
              src={About_1}
              alt="Our Story"
              className="w-[90%] rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
      <section className="mb-10">
        <div className="flex flex-col justify-center gap-4 px-5 py-8 md:px-0 md:flex-row ">
          {statsData.map((stat, index) => (
            <StatsBoxprops
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      </section>
      <section className="mb-10">
        <div className="w-full p-8 h-fit">
          <Slider {...settings}>
            {data.map((item, index) => (
              <div
                id="slider-boxes"
                key={index}
                className="py-7 px-5 h-[400px] rounded-xl flex flex-col justify-between items-center mx-4 shadow-lg"
              >
                {/* Image Section */}
                <div className="overflow-hidden h-[200px] w-full flex justify-center items-center">
                  <img
                    src={item.img}
                    className="w-[100%] h-[100%] object-contain"
                  />
                </div>
                {/* Text Section */}
                <div className="flex flex-col items-center justify-center flex-1 pt-2">
                  <h1 className="text-xl font-bold text-center">{item.name}</h1>
                  <p className="text-[17px] text-center">{item.p}</p>
                  <div>
                    <span className="text-2xl">{item.icons}</span>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
      <section className="mb-10">
        <div>
          <div className="flex flex-col justify-center gap-4 px-5 py-8 md:px-0 md:flex-row">
            <div className="flex flex-col items-center w-full p-6 shadow-md sm:w-1/2 lg:w-1/4">
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
            <div className="flex flex-col items-center w-full p-6 shadow-md sm:w-1/2 lg:w-1/4">
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
            <div className="flex flex-col items-center w-full p-6 shadow-md sm:w-1/2 lg:w-1/4">
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
    </div>
  );
};

export default AboutUs;
