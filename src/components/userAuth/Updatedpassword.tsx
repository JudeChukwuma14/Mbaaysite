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
          className="bg-center bg-no-repeat bg-cover w-full min-h-screen px-4 lg:flex lg:justify-center"
        >
          {/* Logo for small screens */}
          <div className="  items-left mt-6 flex-col min-h-[150px]">
            <div className="lg:hidden">
              <img src={logo} width={50} alt="" />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="w-full max-w-md">
              <h1 className="text-2xl font-bold mb-2">PASSWORD UPDATED</h1>
              <p className="text-gray-600 mb-6">
                Your password has been updated
              </p>
              <div className="text-left mt-4">
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white p-3 font-semibold hover:bg-orange-600 transition duration-300"
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
