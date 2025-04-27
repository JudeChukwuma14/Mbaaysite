import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import background from "../../assets/image/bg2.jpeg";
import logo from "../../assets/image/MBLogo.png";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sliding from "../Reuseable/Sliding";
import { resendOtp, verifyOtp } from "@/utils/api";
import { motion } from "framer-motion";

interface OTPFormData {
  otp: string;
}

const OTPVerification: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormData>();

  const onSubmit: SubmitHandler<OTPFormData> = async (data) => {
    setIsLoading(true);
    try {
      if (!userId) {
        throw new Error("User ID is missing");
      }
      const response = await verifyOtp(userId, data.otp);
      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/signin");
    } catch (error: unknown) {
      toast.error((error as Error)?.message || "Failed to send OTP", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      if (!userId) {
        throw new Error("User ID is missing");
      }
      const response = await resendOtp(userId);

      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error: unknown) {
      toast.error((error as Error)?.message || "Failed to Resend Otp", {
        position: "top-right",
        autoClose: 4000,
      });
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
          className="bg-center bg-no-repeat bg-cover w-full min-h-screen px-4 lg:flex lg:justify-center"
        >
          {/* Logo for small screens */}
          <div className="items-left mt-6 flex-col min-h-[150px]">
            <div className="lg:hidden">
              <img src={logo} width={50} alt="" />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="w-full max-w-md">
              <h1 className="text-2xl font-bold mb-2">OTP VERIFICATION</h1>
              <p className="text-gray-600 mb-6">
                Enter the OTP sent to your email address.
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-orange-500"
                    {...register("otp", {
                      required: "OTP is required",
                      pattern: {
                        value: /^\d{5}$/,
                        message: "OTP must be 6 digits",
                      },
                    })}
                  />
                  {errors.otp && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.otp.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white p-3 font-semibold hover:bg-orange-600 transition duration-300 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </form>
              <div className="text-left mt-4">
                <button
                  onClick={handleResendOTP}
                  className="text-orange-500 hover:underline"
                  disabled={isLoading}
                >
                  {isLoading ? "Resending..." : "Resend OTP"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OTPVerification;
