import React from "react";
import background from "../../assets/image/bg2.jpeg";
import userImage from "../../assets/image/user.png";
import vendorImage from "../../assets/image/vendor.png";
import logo from "../../assets/image/MBLogo.png";
import Sliding from "../Reuseable/Sliding";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const SelectOption: React.FC = () => {
  const bg = {
    backgroundImage: `url(${background})`,
  };
  return (
    <div className="w-full h-screen">
      <div className="flex flex-col md:flex-row">
        <Sliding />
        <motion.div
          style={bg}
          className="bg-center bg-no-repeat bg-cover w-full min-h-screen px-4 lg:ml-[350px] pb-10"
        >
           <div className="flex items-center justify-between px-4 my-6">
            <div className="lg:hidden">
            <Link to="/">
            <img src={logo} width={50} alt="" />
            </Link>
            </div>
          </div>
          <h1 className="mt-16 mb-8 font-bold text-center md:text-2xl">
            Please select account type to get started
          </h1>
          <div className="space-y-4 md:space-y-7 lg:ml-[200px]">
            <Link to="/signin">
              <div className="w-full md:w-[636px] bg-orange-500 text-white py-4 px-4 md:px-6 rounded-lg flex flex-col md:flex-row md:justify-between items-center md:items-start mb-5">
                <div className="flex flex-col gap-2">
                  <span className="text-xl font-bold text-white md:text-3xl">
                    Login as a User
                  </span>
                  <p className="text-sm md:text-[16px] md:w-[410px]">
                    Bringing the Soul of Home to Your Doorstep
                  </p>
                </div>
                <div className="hidden md:block">
                  <img
                    src={userImage}
                    alt="userImage....."
                    className="w-[87px] h-[130px]"
                  />
                </div>
              </div>
            </Link>
            <Link to={"/login-vendor"}>
            <div className="w-full md:w-[636px] bg-orange-300 text-white py-4 px-4 md:px-6 rounded-lg flex flex-col md:flex-row md:justify-between items-center md:items-start">
              <div className="flex flex-col gap-2">
                <span className="text-xl font-bold text-white md:text-3xl">
                  Login as a Vendor/Seller
                </span>
                <p className="text-sm md:text-[16px] md:w-[410px]">
                  Reconnect with Your Roots—Shop Artisanal & Cultural Creations
                </p>
              </div>
              <div className="hidden md:block">
                <img
                  src={vendorImage}
                  alt="userImage....."
                  className="w-[87px] h-[130px]"
                />
              </div>
            </div>
            </Link>
          </div>
          <div className="mt-8 lg:ml-[200px]">
            <a href="/" className="text-sm text-orange-500 md:text-lg">
              Click to visit homepage
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SelectOption;
