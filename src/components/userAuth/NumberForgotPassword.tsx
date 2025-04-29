import React from "react";
import background from "../../assets/image/bg2.jpeg";
import logo from "../../assets/image/MBLogo.png";
import Sliding from "../Reuseable/Sliding";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
              <h1 className="mb-2 text-2xl font-bold">FORGOT PASSWORD</h1>
              <p className="mb-6 text-gray-600">
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
                  className="w-full p-3 font-semibold text-white transition duration-300 bg-orange-500 hover:bg-orange-600"
                >
                  Send
                </button>
              </form>
              <div className="mt-4 text-center">
                <Link to="#" className="text-black hover:underline">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NumberForgotPassword;
