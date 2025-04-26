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
    } catch (error: unknown) {
      toast.error((error as Error)?.message || "Failed to log in", {
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
          <div className="flex justify-between items-center px-4 my-6">
            <div className="lg:hidden">
              <img src={logo} width={50} alt="" />
            </div>
            <div className="hidden lg:block text-right my-4 md:mx-16 lg:w-full">
              <span className="text-gray-600">Don't have an Account? </span>
              <a href="#" className="text-blue-500 hover:underline">
                Sign Up now!
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center px-4">
            <div className="w-full max-w-md">
              {/* Header */}
              <h1 className="text-2xl font-bold mb-2">Log in to Mbaay com</h1>
              <p className="text-gray-600 mb-6">
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

                <div className="mb-4 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-orange-500"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />

                  <span
                    className="absolute right-5 top-5 text-gray-500 cursor-pointer"
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
                  className="w-full bg-orange-500 text-white p-3 font-semibold hover:bg-orange-600 transition duration-300 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
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

              <button className="w-full bg-black text-white p-3 font-semibold flex items-center justify-center hover:bg-gray-800 transition duration-300">
                <i className="fab fa-google mr-2"></i> Sign in with Google
              </button>

              <div className="text-left mt-4">
                <Link to={"/signup-vendor"} className="text-orange-500 hover:underline">
                Become a Vendor/Seller?
                </Link>
              </div>

              <div className=" block lg:hidden text-left my-2 ">
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
