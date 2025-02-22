import React, { useState } from "react";
import background from "@/assets/image/bg2.jpeg";
import logo from "@/assets/image/mbbaylogo.png";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sliding from "../Reuseable/Sliding";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createVendor } from "@/utils/vendorApi";
import { motion } from "framer-motion";

interface FormData {
  storeName: string;
  email: string;
  userName: string;
  address1: string;
  address2:string
  country: string;
  city: string;
  state: string;
  postcode: string;
  storePhone: string;
  password: string;
  craftCategories: string;
  confirmPassword: string;
}

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const response = await createVendor(data);
      console.log("Vender logs", response);
      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/welcomepage");
    } catch (error: unknown) {
      console.log(error);
      toast.error((error as Error)?.message || "An unexpected error occurred", {
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
            <div className="w-full hidden text-end lg:block">
              <span className="text-gray-600">Already have an account? </span>
              <a href="#" className="text-blue-500 hover:underline">
                Sign in
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center px-4">
            <div className="w-max pb-10">
              <h1 className="text-2xl font-bold mb-2">Welcome to Mbaay.com!</h1>
              <p className="text-gray-600 mb-4">
                We’re excited to have you onboard—start selling and growing your
                business with us today!
              </p>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    {...register("userName", {
                      required: "Username is required",
                    })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.userName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.userName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Store Name
                  </label>
                  <input
                    type="text"
                    {...register("storeName", {
                      required: "Store Name is required",
                    })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.storeName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.storeName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    {...register("address1", {
                      required: "Address is required",
                    })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.address1 && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address1.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address2
                  </label>
                  <input
                    type="text"
                    {...register("address2", {
                      required: "Address is required",
                    })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.address2 && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address2.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    {...register("country", {
                      required: "Country is required",
                    })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City/Town
                  </label>
                  <input
                    type="text"
                    {...register("city", { required: "City/Town is required" })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State/Country
                  </label>
                  <input
                    type="text"
                    {...register("state", {
                      required: "State/Country is required",
                    })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.state.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Post Code/Zip
                  </label>
                  <input
                    type="text"
                    {...register("postcode", {
                      required: "Post Code/Zip is required",
                    })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.postcode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.postcode.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Store Number
                  </label>
                  <input
                    type="text"
                    {...register("storePhone", {
                      required: "Store Number is required",
                    })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.storePhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.storePhone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Craft Categories
                  </label>
                  <input
                    type="text"
                    {...register("craftCategories", {
                      required: "Address is required",
                    })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.craftCategories && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.craftCategories.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Enter Password
                  </label>
                  <div className="mb-2 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    <span
                      className="absolute right-5 top-3 text-gray-500 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Comfirm Password
                  </label>
                  <div className="mb-2 relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      {...register("confirmPassword", {
                        required: "Confirm Password is required",
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords do not match",
                      })}
                    />
                    <span
                      className="absolute right-5 top-3 text-gray-500 cursor-pointer"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white p-3 font-semibold rounded-md hover:bg-orange-600 transition duration-300 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      "Sign up"
                    )}
                  </button>
                </div>
              </form>
              <div className="flex items-center my-6">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-2 text-gray-500">or sign up with</span>
                <hr className="flex-grow border-gray-300" />
              </div>
              <button className="w-full bg-black text-white p-3 font-semibold rounded-md flex items-center justify-center hover:bg-gray-800 transition duration-300">
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Sign up with Google
              </button>
              <p className="text-center mt-4 text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-orange-500 hover:underline">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Registration;
