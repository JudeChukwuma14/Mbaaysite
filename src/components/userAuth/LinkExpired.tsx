import React from "react";
import background from "../../assets/image/bg2.jpeg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import logo from "../../assets/image/mbbaylogo.png";
import Sliding from "../Reuseable/Sliding";

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
        <div
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
              <h1 className="text-2xl font-bold mb-2">LINK EXPIRED</h1>
              <p className="text-gray-600 mb-6">
                Your link has expired because you haven’t used it. Reset
                password link expires in every 3 mins and can be used only once.
                You can create one by clicking the button below.
              </p>
              <div className="text-left mt-4">
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white p-3 font-semibold hover:bg-orange-600 transition duration-300"
                >
                  Resend another link
                </button>
              </div>

              <div className="text-center mt-4">
                <a href="#" className="text-black hover:underline">
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkExpired;
