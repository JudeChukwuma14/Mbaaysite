import React, { useState } from "react";
import background from "@/assets/image/bg2.jpeg";
import logo from "@/assets/image/MBLogo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sliding from "../Reuseable/Sliding";
import { LoginVendorAPI } from "@/utils/vendorApi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { setVendor } from "@/redux/slices/vendorSlice";
import { useDispatch } from "react-redux";

interface FormData {
  emailOrPhone: string;
  password: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const LoginVendor: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const isApiError = (error: unknown): error is ApiError => {
    return (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as ApiError).response === "object"
    );
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    console.log(data);
    try {
      const response = await LoginVendorAPI({
        emailOrPhone: data.emailOrPhone,
        password: data.password,
      });
      console.log("Vender logs", response);
      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
      });
      dispatch(
        setVendor({
          vendor: response?.data?.user,
          token: response?.data?.token,
        })
      );
      localStorage.setItem("accountType", "vendor");
      navigate("/app");
    } catch (err) {
      console.log("error message", err);
      toast.error(err);
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
        <Sliding />
        <motion.div
          style={bg}
          className="bg-center bg-no-repeat bg-cover w-full min-h-screen px-4 lg:ml-[400px]"
        >
          <div className="flex items-center justify-between px-4 my-6 ">
            <div className="lg:hidden">
              <img src={logo} width={50} alt="" />
            </div>

            <div className="hidden w-full text-end lg:block">
              <span className="text-gray-600">Don't have an account? </span>
              <NavLink
                to={"/signup-vendor"}
                className="text-blue-500 hover:underline"
              >
                Sign up now!
              </NavLink>
            </div>
          </div>

          <div className="flex items-center justify-center px-4">
            <div className="w-full max-w-md">
              {/* Header */}
              <h1 className="mb-2 text-2xl font-bold">Log in to Mbaay.com</h1>
              <p className="mb-6 text-gray-600">
                Enter your valid email address and password to log in to your
                account.
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-orange-500"
                    {...register("emailOrPhone", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />

                  {errors.emailOrPhone && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {errors.emailOrPhone.message}
                    </p>
                  )}
                </div>

                <div className="relative mb-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-orange-500"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />

                  <span
                    className="absolute text-gray-500 cursor-pointer right-5 top-5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>

                  {errors.password && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {errors.password.message}
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
                    "Sign in"
                  )}
                </button>
              </form>

              <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-2 text-gray-500">or sign in with</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              <button className="flex items-center justify-center w-full p-3 font-semibold text-white transition duration-300 bg-black hover:bg-gray-800">
                <i className="mr-2 fab fa-google"></i> Sign in with Google
              </button>

              <div className="mt-4 text-left">
                <a href="#" className="text-orange-500 hover:underline">
                  <Link to={"/signin"}>Login as a user?</Link>
                </a>
              </div>

              <div className="block my-2 text-left lg:hidden">
                <span className="text-gray-600">Don't have an account? </span>
                <Link
                  to={"/signup-vendor"}
                  className="text-blue-500 hover:underline"
                >
                  Sign up now!
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginVendor;
