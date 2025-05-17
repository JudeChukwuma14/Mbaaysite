"use client";

import type React from "react";
import { useState } from "react";
import background from "@/assets/image/bg2.jpeg";
import logo from "@/assets/image/MBLogo.png";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sliding from "../Reuseable/Sliding";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { createVendor } from "@/utils/vendorApi";
import { motion } from "framer-motion";
import {
  Country,
  State,
  City,
  type ICountry,
  type IState,
  type ICity,
} from "country-state-city";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface FormData {
  storeName: string;
  email: string;
  address1: string;
  country: string;
  city: string;
  state: string;
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
  const [selectedCountry, setSelectedCountry] = useState<string>("us"); // Default to 'us'
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const countries: ICountry[] = Country.getAllCountries();
  const states: IState[] = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.toUpperCase()) // Convert to uppercase for country-state-city
    : [];
  const cities: ICity[] = selectedState
    ? City.getCitiesOfState(selectedCountry.toUpperCase(), selectedState)
    : [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const formData = {
        ...data,
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
      };
      const response = await createVendor(formData);
      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
      });
      localStorage.setItem("accountType", "vendor");
      reset();
      navigate("/welcomepage");
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

  // Common input class for consistency
  const inputClass =
    "block w-full h-[48px] px-4 py-2 mt-1 border border-gray-300 focus:border-orange-500 focus:outline-none";
  const selectClass =
    "block w-full h-[48px] px-4 py-2 mt-1 border border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400";

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
              <img src={logo || "/placeholder.svg"} width={50} alt="" />
            </div>
            <div className="hidden w-full text-end lg:block">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to={"/login-vendor"}
                className="text-blue-500 hover:underline"
              >
                <span> Sign in</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center px-4">
            <div className="pb-10 w-max">
              <h1 className="mb-2 text-2xl font-bold">Welcome to Mbaay.com!</h1>
              <p className="mb-4 text-gray-600">
                We're excited to have you onboard start selling and growing your
                business with us today!
              </p>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-6 md:grid-cols-2"
              >
                {/* Store Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Store Name
                  </label>
                  <input
                    type="text"
                    {...register("storeName", {
                      required: "Store Name is required",
                    })}
                    className={inputClass}
                  />
                  {errors.storeName && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {errors.storeName.message}
                    </p>
                  )}
                </div>
                {/* Email */}
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
                    className={inputClass}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Address 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    {...register("address1", {
                      required: "Address is required",
                    })}
                    className={inputClass}
                  />
                  {errors.address1 && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {errors.address1.message}
                    </p>
                  )}
                </div>
                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <select
                    {...register("country", {
                      required: "Country is required",
                    })}
                    className={selectClass}
                    onChange={(e) => setSelectedCountry(e.target.value.toLowerCase())} // Convert to lowercase for PhoneInput
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <select
                    {...register("state", { required: "State is required" })}
                    className={selectClass}
                    onChange={(e) => setSelectedState(e.target.value)}
                    disabled={!selectedCountry}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <select
                    {...register("city", { required: "City is required" })}
                    className={selectClass}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedState}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                {/* Phone Number */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Store Number
                  </label>
                  <Controller
                    name="storePhone"
                    control={control}
                    rules={{ required: "Phone number is required" }}
                    render={({ field }) => (
                      <PhoneInput
                        country={selectedCountry || "us"} // Sync with selected country, default to 'us'
                        value={field.value}
                        onChange={(storePhone) => field.onChange(storePhone)}
                        inputProps={{
                          name: "storePhone",
                          required: true,
                        }}
                        containerClass="w-full"
                        inputClass="!w-full !h-[48px] !pl-14 !border !border-gray-300 !py-2 !px-4 focus:!border-orange-500 focus:!outline-none"
                        buttonClass="!h-[48px] !border-r !border-gray-300 !bg-white"
                        dropdownClass="!z-10"
                      />
                    )}
                  />
                  {errors.storePhone && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {errors.storePhone.message}
                    </p>
                  )}
                </div>

                {/* Craft Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Craft Categories
                  </label>
                  <Controller
                    name="craftCategories"
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        id="craftCategories"
                        className={selectClass}
                      >
                        <option value="">select craft categories</option>
                        <option value="Art and Sculpture">Art and Sculpture</option>
                        <option value="Beauty and Wellness">
                          Beauty and Wellness
                        </option>
                        <option value="Jewelry and Gemstones">
                          Jewelry and Gemstones
                        </option>
                        <option value="Books and Poetry">
                          Books and Poetry
                        </option>
                        <option value="Vintage and Antique Jewelry">
                          Vintage and Antique Jewelry
                        </option>
                        <option value="Home Décor and Accessories">
                          Home Décor and Accessories
                        </option>
                        <option value="Vintage Stocks">Vintage Stocks</option>
                        <option value="Plant and Seeds">Plant and Seeds</option>
                        <option value="Spices, Condiments and Seasonings">
                          Spices, Condiments and Seasonings
                        </option>
                        <option value="Local & Traditional Foods">
                          Local & Traditional Foods
                        </option>
                        <option value="Traditional Clothing and Fabrics">
                          Traditional Clothing and Fabrics
                        </option>
                        <option value="Traditional and Religious Items">
                          Traditional and Religious Items
                        </option>
                        <option value="Local Food and Drink Products">
                          Local Food and Drink Products
                        </option>
                      </select>
                    )}
                  />
                  {errors.craftCategories && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {errors.craftCategories.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Enter Password
                  </label>
                  <div className="relative mb-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={inputClass}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    <span
                      className="absolute text-gray-500 transform -translate-y-1/2 cursor-pointer right-4 top-1/2"
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
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative mb-2">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={inputClass}
                      {...register("confirmPassword", {
                        required: "Confirm Password is required",
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords do not match",
                      })}
                    />
                    <span
                      className="absolute text-gray-500 transform -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-[10px] mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full h-[48px] p-3 font-semibold text-white transition duration-300 bg-orange-500 focus:border-orange-500 focus:outline-none hover:bg-orange-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin"></div>
                    ) : (
                      "Sign up"
                    )}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="flex items-center my-6">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-2 text-gray-500">or sign up with</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              {/* Google Sign-Up */}
              <button className="flex items-center justify-center w-full h-[48px] p-3 font-semibold text-white transition duration-300 bg-black focus:border-orange-500 focus:outline-none hover:bg-gray-800">
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Sign up with Google
              </button>

              {/* Login Link */}
              <p className="mt-4 text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login-vendor"
                  className="text-orange-500 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Registration;