import React from "react";
import background from "../../assets/image/bg2.jpeg";
import logo from "../../assets/image/mbbaylogo.png";
import Sliding from "../Reuseable/Sliding";
import { motion } from "framer-motion";

const NumberForgotPassword: React.FC = () => {
  const bg = {
    backgroundImage: `url(${background})`,
  };

  return (
    <div className="w-full h-screen">
      {/* Container */}
      <motion.div className="flex flex-col md:flex-row">
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
              <h1 className="text-2xl font-bold mb-2">FORGOT PASSWORD</h1>
              <p className="text-gray-600 mb-6">
                Provide your phone number for which you want to reset your
                password
              </p>
              <form>
                <div className="mb-4">
                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white p-3 font-semibold hover:bg-orange-600 transition duration-300"
                >
                  Send
                </button>
              </form>
              <div className="text-center mt-4">
                <a href="#" className="text-black hover:underline">
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NumberForgotPassword;
