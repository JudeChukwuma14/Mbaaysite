import React from "react";
import background from "../../assets/image/bg2.jpeg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import logo from "../../assets/image/MBLogo.png";
import Sliding from "../Reuseable/Sliding";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LinkExpired: React.FC = () => {
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
              <Link to="/">
                <img src={logo} width={50} alt="" />
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <h1 className="mb-2 text-2xl font-bold">LINK EXPIRED</h1>
              <p className="mb-6 text-gray-600">
                Your link has expired because you haven’t used it. Reset
                password link expires in every 3 mins and can be used only once.
                You can create one by clicking the button below.
              </p>
              <div className="mt-4 text-left">
                <button
                  type="submit"
                  className="w-full p-3 font-semibold text-white transition duration-300 bg-orange-500 hover:bg-orange-600"
                >
                  Resend another link
                </button>
              </div>

              <div className="mt-4 text-center">
                <a href="#" className="text-black hover:underline">
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LinkExpired;
