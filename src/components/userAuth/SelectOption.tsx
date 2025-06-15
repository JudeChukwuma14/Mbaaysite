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
  const accountType = localStorage.getItem("accountType");
  console.log("accouuntType", accountType)
  return (
    <div className="w-full h-screen">
      <div className="flex flex-col md:flex-row">
        <Sliding />
        <motion.div
          style={bg}
          className="bg-center bg-no-repeat bg-cover w-full min-h-screen px-4 sm:px-6 md:px-8 pb-10 md:ml-0 lg:ml-[350px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between px-4 my-6">
            <div className="lg:hidden">
              <Link to="/">
                <img src={logo} width={50} alt="" />
              </Link>
            </div>
          </div>
          <div className="max-w-4xl pt-8 mx-auto md:pt-12 lg:pt-16">
           <h1 className="mb-6 text-xl font-bold text-center sm:text-2xl sm:mb-8 ">
            Please select account type to get started
            </h1>
            <div className="space-y-4 md:space-y-7 lg:ml-[200px]">
              <Link to={accountType !== "none" ? "/signin" : "/signup"} aria-label="User account">
                <div className="flex flex-col items-center justify-between w-full px-4 py-4 mb-4 text-white transition-colors bg-orange-500 rounded-lg cursor-pointer sm:flex-row sm:px-6 hover:bg-orange-600">
                  <div className="flex flex-col gap-2 mb-3 text-center sm:text-left sm:mb-0">
                    <span className="text-lg font-bold text-white sm:text-xl md:text-2xl lg:text-3xl">
                      {accountType !== "none" ? "Login as a User" : "Sign Up as a User"}
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
              <Link to={accountType !== "none" ? "/login-vendor" : "/signup-vendor"} aria-label="Vendor account">
                <div className="flex flex-col items-center justify-between w-full px-4 py-4 mb-4 text-white transition-colors bg-orange-500 rounded-lg cursor-pointer sm:flex-row sm:px-6 hover:bg-orange-600">
                  <div className="flex flex-col gap-2 mb-3 text-center sm:text-left sm:mb-0">
                    <span className="text-lg font-bold text-white sm:text-xl md:text-2xl lg:text-3xl">
                     {accountType !== "none" ? "Login as a Vendor/Seller" : "Sign Up as a Vendor/Seller"}
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SelectOption;
