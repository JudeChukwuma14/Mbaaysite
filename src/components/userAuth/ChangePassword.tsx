import React, { useState } from "react";
import background from "../../assets/image/bg2.jpeg";
import logo from "../../assets/image/MBLogo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sliding from "../Reuseable/Sliding";
import { motion } from "framer-motion";
import { CreateNewPassword } from "@/utils/ForgetpassApi";
import { useNavigate } from "react-router-dom";

interface ResetPasswordFormData {
  email: string;
  otp: string;
  newPassword: string;
}

const ResetPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  // const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
  //   setIsLoading(true);
  //   try {
  //     // Call API to reset password
  //     const response = await CreateNewPassword(data.email, data.otp, data.newPassword);
  //     if(response.message){
  //       toast.success(response.message, {
  //       position: "top-right",
  //       autoClose: 3000,
  //     })
  //     navigate("/login-vendor");
  //     }else{
  //       toast.error("Please retry")
  //     }

  //   } catch (err) {
  //     toast.error((err as Error)?.message || String(err), {
  //           position: "top-right",
  //           autoClose: 4000,
  //         });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    setIsLoading(true);
    try {
      const response = await CreateNewPassword(data.email, data.otp, data.newPassword);
      const message = response?.message;
      console.log(message)
      if (message) {
        toast.success(message, {
          position: "top-right",
          autoClose: 5000,
        });
        navigate("/login-vendor");
      } else {
        toast.error("Password reset failed. Please try again.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(errorMessage, {
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
          className="bg-center bg-no-repeat bg-cover w-full min-h-screen px-4 lg:ml-[500px] pb-10"
        >
          {/* Logo for small screens */}
          <div className="items-left mt-6 flex-col min-h-[130px]">
            <div className="lg:hidden">
              <img src={logo} width={50} alt="" />
            </div>
          </div>
          <div className="flex items-center justify-center w-full">
            <div className="w-full max-w-md">
              <h1 className="mb-2 text-2xl font-bold">NEW CREDENTIALS</h1>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="relative mb-4">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-orange-500"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-orange-500"
                    {...register("otp", {
                      required: "OTP is required",
                    })}
                  />
                  {errors.otp && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.otp.message}
                    </p>
                  )}
                </div>
                <div className="relative mb-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-orange-500"
                    {...register("newPassword", {
                      required: "New Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <span
                    className="absolute text-gray-500 cursor-pointer right-5 top-5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {errors.newPassword && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center w-full p-3 font-semibold text-white transition duration-300 bg-orange-500 hover:bg-orange-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin"></div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
              <div className="mt-4 text-center">
                <a href="/" className="text-black hover:underline">
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

export default ResetPassword;
