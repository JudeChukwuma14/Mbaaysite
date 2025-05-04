import React, { useState } from "react";
import background from "../../assets/image/bg2.jpeg";
import logo from "../../assets/image/MBLogo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sliding from "../Reuseable/Sliding";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { LoginUser } from "@/utils/api";
import { motion } from "framer-motion";

interface FormData {
  emailOrPhone: string;
  password: string;
}

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const response = await LoginUser(data);
      console.log("Login Response:", response);

      if (response.user && response.token) {
        dispatch(setUser({ user: response.user, token: response.token }));
        toast.success(response.message || "Login successful");
        navigate("/");
      } else {
        throw new Error("Invalid response format from server");
      }
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
          style={bg}
          className="bg-center bg-no-repeat bg-cover w-full min-h-screen px-4 lg:ml-[500px]"
        >
          <div className="flex items-center justify-between px-4 my-6">
            <div className="lg:hidden">
              <Link to="/">
                <img src={logo} width={50} alt="" />
              </Link>
            </div>
            <div className="hidden my-4 text-right lg:block md:mx-16 lg:w-full">
              <span className="text-gray-600">Don't have an Account? </span>
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign Up now!
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center px-4">
            <div className="w-full max-w-md">
              {/* Header */}
              <h1 className="mb-2 text-2xl font-bold">Log in to Mbaay com</h1>
              <p className="mb-6 text-gray-600">
                Enter your valid email address and password to log in to your
                account.
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Enter email address or phone number"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-orange-500"
                    {...register("emailOrPhone", {
                      required: "Email or phone number is required",
                      validate: (value) => {
                        const emailPattern =
                          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                        const phonePattern = /^[0-9]{10,15}$/; // Adjust based on your phone format
                        return (
                          emailPattern.test(value) ||
                          phonePattern.test(value) ||
                          "Enter a valid email or phone number"
                        );
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
                <Link
                  to={"/signup-vendor"}
                  className="text-orange-500 hover:underline"
                >
                  Become a Vendor/Seller?
                </Link>
              </div>

              <div className="block my-2 text-left lg:hidden">
                <span className="text-gray-600">Don't have an account? </span>
                <Link to={"/signup"} className="text-blue-500 hover:underline">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signin;
