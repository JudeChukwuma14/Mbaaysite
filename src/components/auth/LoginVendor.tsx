import React, { useState } from "react";
import background from "@/assets/image/bg2.jpeg";
import logo from "@/assets/image/MBLogo.png";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sliding from "../Reuseable/Sliding";
import { LoginVendorAPI, get_single_vendor } from "@/utils/vendorApi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { setVendor } from "@/redux/slices/vendorSlice";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { RootState } from "@/redux/store";
import { initializeSession } from "@/redux/slices/sessionSlice";
import { VendorGoogleButton } from "./VendorGoogleButton";

interface FormData {
  emailOrPhone: string;
  password: string;
}

const LoginVendor: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      if (!sessionId) {
        dispatch(initializeSession());
      }
      const loginResponse = await LoginVendorAPI({
        emailOrPhone: data.emailOrPhone,
        password: data.password,
      });
      const { token } = loginResponse.data;
      const vendorProfile = await get_single_vendor(token);
      dispatch(
        setVendor({
          vendor: vendorProfile,
          token,
        })
      );
      toast.success(loginResponse.message, {
        position: "top-right",
        autoClose: 3000,
      });
      localStorage.setItem("accountType", "vendor");
      navigate("/app");
    } catch (err) {
      toast.error((err as Error)?.message || String(err), {
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
        <Sliding />
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="emailOrPhone"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("emailOrPhone", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 shadow-sm h-11 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  {errors.emailOrPhone && (
                    <p className="text-sm text-red-500">
                      {errors.emailOrPhone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className="w-full px-3 py-2 pr-10 placeholder-gray-400 border border-gray-300 shadow-sm h-11 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 flex items-center px-3 text-gray-500 h-11 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">
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

              {/* Google Button goes OUTSIDE the form */}
              <div className="relative my-4 ">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-gray-500 bg-white">
                    Or continue with
                  </span>
                </div>
              </div>
              <VendorGoogleButton />

              <div className="mt-4 text-left">
                <Link
                  to={"/signin"}
                  className="text-orange-500 hover:underline"
                >
                  Login as a user
                </Link>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="block my-2 text-left lg:hidden">
                  <span className="text-gray-600">Don't have an account? </span>
                  <Link
                    to={"/signup-vendor"}
                    className="text-blue-500 hover:underline"
                  >
                    Sign up now!
                  </Link>
                </div>
                <div className="text-left ">
                  <Link
                    to={"/forgot-password"}
                    className="text-blue-500 hover:underline"
                  >
                    Forgot Password ?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginVendor;
