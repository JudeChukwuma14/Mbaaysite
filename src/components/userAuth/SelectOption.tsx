import React from "react";
import background from "../../assets/image/bg2.jpeg";
import userImage from "../../assets/image/user.png";
import vendorImage from "../../assets/image/vendor.png";
import logo from "../../assets/image/mbbaylogo.png";
import { NavLink } from "react-router-dom";
import Sliding from "../Reuseable/Sliding";
const SelectOption: React.FC = () => {
  const bg = {
    backgroundImage: `url(${background})`,
  };
  return (
    <div className="w-full h-screen">
      <div className="flex flex-col md:flex-row">
        <Sliding />
        <div
          style={bg}
          className="bg-center bg-no-repeat bg-cover w-full min-h-screen px-4 lg:ml-[500px] pb-10"
        >
           <div className="flex justify-between items-center px-4 my-6">
            <div className="lg:hidden">
              <img src={logo} width={50} alt="" />
            </div>
          </div>
          <h1 className="md:text-2xl mt-16 font-bold mb-8 text-center">
            Please select account type to get started
          </h1>
          <div className="space-y-4 md:space-y-7 lg:ml-[200px]">
            <NavLink to="/signup">
              <div className="w-full md:w-[636px] bg-orange-500 text-white py-4 px-4 md:px-6 rounded-lg flex flex-col md:flex-row md:justify-between items-center md:items-start">
                <div className="flex flex-col gap-2">
                  <span className="text-xl md:text-3xl font-bold text-white">
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
            </NavLink>
            <NavLink to={"/signup-vendor"}>
            <div className="w-full md:w-[636px] bg-orange-300 text-white py-4 px-4 md:px-6 rounded-lg flex flex-col md:flex-row md:justify-between items-center md:items-start">
              <div className="flex flex-col gap-2">
                <span className="text-xl md:text-3xl font-bold text-white">
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
            </NavLink>
          </div>
          <div className="mt-8 lg:ml-[200px]">
            <a href="/" className="text-orange-500 text-sm md:text-lg">
              Click to visit homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectOption;
