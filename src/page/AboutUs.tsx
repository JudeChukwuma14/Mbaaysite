import React from "react";
import About_1 from "../assets/image/about1.png";
import { FaStore, FaShoppingBag, FaUsers, FaDollarSign, FaQuoteLeft } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import StatsBoxprops from "../components/Statbox/StatsBoxprops";
import abt1 from "../assets/image/abt1.png";
import abt2 from "../assets/image/abt2.png";
import sev1 from "../assets/image/Services.png";
import sev2 from "../assets/image/Services-1.png";
import sev3 from "../assets/image/Services-2.png";

const AboutUs: React.FC = () => {
  const statsData = [
    { 
      icon: <FaStore className="text-2xl" />, 
      value: "10.5k", 
      label: "Sellers active on our site",
    },
    { 
      icon: <FaShoppingBag className="text-2xl" />, 
      value: "33k", 
      label: "Monthly Product Sale",
    },
    {
      icon: <FaUsers className="text-2xl" />,
      value: "45.5k",
      label: "Customers active on our site",
    },
    {
      icon: <FaDollarSign className="text-2xl" />,
      value: "25k",
      label: "Annual gross sale on our site",
    },
  ];

const teamData = [
  {
    img: abt2,
    name: "Free Man",
    position: "Web Designer",
    description: "Creative mind behind our stunning user interfaces and seamless user experiences."
  },
  {
    img: abt1,
    name: "Kimora",
    position: "Project Designer",
    description: "Transforming ideas into reality with innovative project designs and strategies."
  },
  {
    img: abt1,
    name: "Shubby",
    position: "C.E.O",
    description: "Visionary leader driving our company's mission and strategic direction."
  },
  {
    img: "https://img.freepik.com/free-photo/successful-dark-skinned-female-student-happy-get-scholarship-clenches-fists-accomplishes-goal_273609-25984.jpg?t=st=1716493688~exp=1716497288~hmac=94f131f0281fe0b7c491908924fc57e6b82bb0f2e57258e757cc441213b30806&w=900",
    name: "Praises Neche",
    position: "Land Lord",
    description: "Ensuring our operations run smoothly with exceptional property management."
  },
  {
    img: "https://img.freepik.com/free-photo/confident-african-businesswoman-smiling-closeup-portrait-jobs-career-campaign_53876-143280.jpg?t=st=1716493448~exp=1716497048~hmac=e947386ec50caae0074f287461acc53a32d6630895c60e39f3da417fba8d515d&w=900",
    name: "Juliet",
    position: "Manager",
    description: "Leading our teams to deliver exceptional service and operational excellence."
  },
  // Additional random team members
  {
    "img": "https://picsum.photos/seed/sophiaanderson0/300/300",
    "name": "Sophia Anderson",
    "position": "CEO",
    "description": "Visionary leader driving our company's mission and strategic direction."
  },
  {
    "img": "https://picsum.photos/seed/noahthompson1/300/300",
    "name": "Noah Thompson",
    "position": "Web Designer",
    "description": "Leading our teams to deliver exceptional service and operational excellence."
  },
  {
    "img": "https://picsum.photos/seed/henrymiller2/300/300",
    "name": "Henry Miller",
    "position": "HR Director",
    "description": "Leading our teams to deliver exceptional service and operational excellence."
  },
  {
    "img": "https://picsum.photos/seed/henrymartinez3/300/300",
    "name": "Henry Martinez",
    "position": "Land Lord",
    "description": "Producing engaging content that resonates with our audience."
  },
  {
    "img": "https://picsum.photos/seed/yarawhite4/300/300",
    "name": "Yara White",
    "position": "Marketing Specialist",
    "description": "Streamlining deployments and ensuring system reliability."
  },
  {
    "img": "https://picsum.photos/seed/bobperez5/300/300",
    "name": "Bob Perez",
    "position": "HR Director",
    "description": "Guiding product development from ideation to launch."
  },
  {
    "img": "https://picsum.photos/seed/evemartin6/300/300",
    "name": "Eve Martin",
    "position": "Software Engineer",
    "description": "Transforming ideas into reality with innovative project designs and strategies."
  },
  {
    "img": "https://picsum.photos/seed/henrymoore7/300/300",
    "name": "Henry Moore",
    "position": "Project Manager",
    "description": "Fostering a positive work environment and talent development."
  },
  {
    "img": "https://picsum.photos/seed/miamiller8/300/300",
    "name": "Mia Miller",
    "position": "Sales Executive",
    "description": "Closing deals and expanding our customer base with charisma."
  },
  {
    "img": "https://picsum.photos/seed/tylerlopez9/300/300",
    "name": "Tyler Lopez",
    "position": "Content Creator",
    "description": "Creative mind behind our stunning user interfaces and seamless user experiences."
  }
];
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const services = [
    {
      icon: sev1,
      title: "FREE AND FAST DELIVERY",
      description: "Free delivery for all orders over $140",
    },
    {
      icon: sev2,
      title: "24/7 CUSTOMER SERVICE",
      description: "Friendly 24/7 customer support",
    },
    {
      icon: sev3,
      title: "MONEY BACK GUARANTEE",
      description: "We return money within 30 days",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-16">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-gray-500">
              <li>
                <a href="/" className="hover:text-orange-500 transition-colors duration-200">
                  Home
                </a>
              </li>
              <li><IoIosArrowForward className="w-4 h-4" /></li>
              <li className="text-gray-900 font-medium">About Us</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                Building the Future of 
                <span className="text-orange-500"> E-commerce</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Since 2015, Mbaay has been revolutionizing online shopping in Bangladesh, 
                connecting millions of customers with thousands of sellers in a seamless marketplace.
              </p>
              <div className="flex space-x-4">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md">
                  Learn More
                </button>
                <button className="border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500 px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                  Contact Us
                </button>
              </div>
            </div>
            
            <div>
              <img
                src={About_1}
                alt="Mbaay Marketplace"
                className="rounded-2xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Driving growth and creating opportunities for sellers and customers alike
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {statsData.map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-orange-100 text-orange-600 mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind Mbaay's success story
            </p>
          </div>
          
          <div className="relative">
            <Slider {...settings}>
              {teamData.map((member, index) => (
                <div key={index} className="px-3 py-6">
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
                    <div className="relative overflow-hidden flex-shrink-0">
                      <img
                        src={member.img}
                        alt={member.name}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-orange-600 font-semibold mb-3">
                        {member.position}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Mbaay?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best shopping experience for our customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-xl mb-6">
                  <img 
                    src={service.icon} 
                    alt={service.title}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 lg:px-16 text-center">
          <FaQuoteLeft className="w-12 h-12 text-orange-400 mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
            "Our mission is to empower sellers and delight customers through innovative 
            e-commerce solutions that make shopping seamless and enjoyable."
          </h2>
          <p className="text-lg text-gray-300">
            - Mbaay Leadership Team
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;