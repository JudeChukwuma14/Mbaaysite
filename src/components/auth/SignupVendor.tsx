import React, { useState } from "react";
import background from "@/assets/image/bg2.jpeg";
import image1 from "@/assets/image/img1.jpg";
import image2 from "@/assets/image/img2.jpg";
import image3 from "@/assets/image/img3.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import logo from "@/assets/image/mbbaylogo.png";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface FormData {
  username: string;
  email: string;
  storeName: string;
  address: string;
  country: string;
  city: string;
  state: string;
  postCode: string;
  storeNumber: string;
  password: string;
  confirmPassword: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const Registration: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
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
    try {
      const response = await axios.post("/register", data);
      if (response.status === 200) {
        toast.success("Registration successful!", {
          position: "top-right",
          autoClose: 3000,
        });
        // Redirect to login or dashboard
        window.location.href = "/login";
      }
    } catch (error) {
      if (isApiError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Registration failed. Please try again.",
          {
            position: "top-right",
            autoClose: 4000,
          }
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [slides] = useState([
    {
      img: image1,
      text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less",
    },
    {
      img: image2,
      text: "The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters",
    },
    {
      img: image3,
      text: "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text",
    },
  ]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const bg = {
    backgroundImage: `url(${background})`,
  };

  return (
    <div className="w-full h-screen">
      {/* ToastContainer for displaying notifications */}
      <ToastContainer />

      <div className="flex flex-col md:flex-row">
        {/* Left Section (Slider) */}
        <div className="hidden lg:block w-[700px] h-screen overflow-hidden">
          <Slider {...settings} className="w-full h-screen">
            {slides.map((slide, index) => (
              <div key={index} className="flex flex-col items-start relative">
                {/* Logo */}
                <div className="absolute z-10 flex justify-center w-full top-7">
                  <img src={logo} alt="Logo" />
                </div>
                {/* Slide Image */}
                <img
                  src={slide.img}
                  alt=""
                  className="w-full h-screen object-cover mb-4"
                />
                {/* Overlay for the slide */}
                <div className="bg-black w-full h-screen absolute inset-0 opacity-50"></div>
                {/* Slide text */}
                <p className="absolute text-white bottom-28 px-5 text-center z-10">
                  {slide.text}
                </p>
              </div>
            ))}
          </Slider>
        </div>

        {/* Right Section (Form) */}
        <div
          style={bg}
          className="bg-center bg-no-repeat bg-cover w-full min-h-screen px-4"
        >
          {/* Logo for small screens */}
          <div className="flex justify-between items-center px-4 my-6">
            <div className="lg:hidden">
              <img src={logo} width={50} alt="" />
            </div>
            {/* Sign Up Link */}
            <div className="w-full hidden text-end lg:block">
              <span className="text-gray-600">Already have an account? </span>
              <a href="#" className="text-blue-500 hover:underline">
                Sign in
              </a>
            </div>
          </div>

          {/* Form container */}
          <div className="flex items-center justify-center px-4">
            <div className="w-full">
              {/* Header */}
              <h1 className="text-2xl font-bold mb-2">Welcome to Mbaay.com!</h1>
              <p className="text-gray-600 mb-4">
                We’re excited to have you onboard—start selling and growing your
                business with us today!
              </p>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.username.message}
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
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

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
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.storeName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.storeName.message}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    {...register("address", {
                      required: "Address is required",
                    })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                {/* Country */}
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

                {/* City/Town */}
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

                {/* State/Country */}
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

                {/* Post Code/Zip */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Post Code/Zip
                  </label>
                  <input
                    type="text"
                    {...register("postCode", {
                      required: "Post Code/Zip is required",
                    })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.postCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.postCode.message}
                    </p>
                  )}
                </div>

                {/* Store Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Store Number
                  </label>
                  <input
                    type="text"
                    {...register("storeNumber", {
                      required: "Store Number is required",
                    })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.storeNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.storeNumber.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
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

              {/* Divider */}
              <div className="flex items-center my-6">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-2 text-gray-500">or sign up with</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              {/* Google Sign-Up Button */}
              <button className="w-full bg-black text-white p-3 font-semibold rounded-md flex items-center justify-center hover:bg-gray-800 transition duration-300">
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Sign up with Google
              </button>

              {/* Login Link */}
              <p className="text-center mt-4 text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-orange-500 hover:underline">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
