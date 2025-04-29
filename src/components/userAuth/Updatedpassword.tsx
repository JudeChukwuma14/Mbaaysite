import React from "react";
import background from "../../assets/image/bg2.jpeg";
import logo from "../../assets/image/MBLogo.png";
import Sliding from "../Reuseable/Sliding";
import { motion } from "framer-motion";

const Updatedpassword: React.FC = () => {
  const bg = {
    backgroundImage: `url(${background})`,
  };

  return (
    <div className="w-full h-screen">
      {/* Container */}
      <div className="flex flex-col md:flex-row">
        {/* Left Section */}
        <Sliding />
        {/* Right Section */}
        <motion.div
          style={bg}
          className="bg-center bg-no-repeat bg-cover w-full min-h-screen px-4 lg:ml-[500px] pb-10"
        >
          {/* Logo for small screens */}
          <div className="  items-left mt-6 flex-col min-h-[150px]">
            <div className="lg:hidden">
              <img src={logo} width={50} alt="" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <h1 className="mb-2 text-2xl font-bold">PASSWORD UPDATED</h1>
              <p className="mb-6 text-gray-600">
                Your password has been updated
              </p>
              <div className="mt-4 text-left">
                <button
                  type="submit"
                  className="w-full p-3 font-semibold text-white transition duration-300 bg-orange-500 hover:bg-orange-600"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Updatedpassword;
