import React, { useState } from "react";
import background from "../../assets/image/bg2.jpeg";
import logo from "../../assets/image/MBLogo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Sliding from "../Reuseable/Sliding";
import { motion } from "framer-motion";

const Forgotpasswordmessage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      // Call API to resend the reset link or OTP
      const response = await axios.post("/resend-reset-link");
      if (response.status === 200) {
        toast.success("Reset link resent to your email!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error: unknown) {
          toast.error(
            (error as Error)?.message || "Failed to create account",
            {
              position: "top-right",
              autoClose: 4000,
            }
          );
    } finally {
      setIsLoading(false);
    }
  };

  const bg = {
    backgroundImage: `url(${background})`,
  };

  return (
    <div className="w-full h-screen">
      <ToastContainer />
      <div className="flex flex-col md:flex-row">
        {/* Left Section */}
        <Sliding />
        {/* Right Section */}
        <motion.div
          style={bg}
          className="bg-center bg-no-repeat bg-cover w-full min-h-screen px-4 lg:ml-[500px] pb-10"
        >
          {/* Logo for small screens */}
          <div className="items-left mt-6 flex-col min-h-[150px]">
            <div className="lg:hidden">
              <img src={logo} width={50} alt="" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <h1 className="mb-2 text-2xl font-bold">FORGOT PASSWORD</h1>
              <p className="mb-6 text-gray-600">
                You will receive an email with a link to reset your password.
                Please check your inbox.
              </p>
              <div className="mt-4 text-left">
                <button
                  onClick={handleResendEmail}
                  className="text-orange-500 hover:underline"
                  disabled={isLoading}
                >
                  {isLoading ? "Resending..." : "Resend email link"}
                </button>
              </div>
              <div className="mt-4 text-left">
                <a
                  href="/forgot-password"
                  className="text-black hover:underline"
                >
                  Change email ID
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Forgotpasswordmessage;
