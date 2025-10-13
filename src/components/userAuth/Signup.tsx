import React, { useState } from "react";
import background from "../../assets/image/bg2.jpeg";
import logo from "../../assets/image/MBLogo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sliding from "../Reuseable/Sliding";
import { createUser } from "@/utils/api";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleButton } from "../Reuseable/GoogleButton";
import PolicyModal from "../Reuseable/PolicyModal";


interface FormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState<boolean>(false);
  const [showPolicyModal, setShowPolicyModal] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm<FormData & { acceptPolicy: boolean }>();

  const onSubmit: SubmitHandler<FormData & { acceptPolicy: boolean }> = async (data) => {
    if (!acceptedPolicy) {
      setError("acceptPolicy", { 
        type: "manual", 
        message: "You must accept the privacy policy and terms of service" 
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await createUser(data);
      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
      });
      localStorage.setItem("accountType", "user");
      navigate(`/verify-otp/${response.data._id}`);
    } catch (err) {
      toast.error((err as Error)?.message || String(err), {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptPolicy = () => {
    setAcceptedPolicy(true);
    clearErrors("acceptPolicy");
    setShowPolicyModal(false);
  };

  const bg = {
    backgroundImage: `url(${background})`,
  };

  return (
    <div className="w-full h-screen">
      <PolicyModal 
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
        onAccept={handleAcceptPolicy}
      />
      
      <div className="flex flex-col md:flex-row">
        <Sliding />
        <motion.div
          style={bg}
          className="bg-center bg-no-repeat bg-cover w-full min-h-screen px-4 lg:ml-[500px] pb-10"
        >
          <div className="flex items-center justify-between px-4 my-6">
            <div className="lg:hidden">
              <img src={logo} width={50} alt="" />
            </div>
            <div className="hidden my-4 text-right lg:block md:mx-16 lg:w-full">
              <span className="text-gray-600">Already have an Account? </span>
              <Link to="/signin" className="text-blue-500 hover:underline">
                Sign in
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center px-4">
            <div className="w-full max-w-md">
              <h1 className="mb-2 text-2xl font-bold">Let's go!</h1>
              <h2 className="mb-2 text-xl font-semibold">
                Join with our Platform
              </h2>
              <p className="mb-6 text-gray-600">
                Enter your valid email address and complete some easy steps to
                register your account.
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="mb-2">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    {...register("phoneNumber", {
                      required: "Phone Number is required",
                    })}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
                <div className="relative mb-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    {...register("password", {
                      required: "Password is required",
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
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="relative mb-4">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                  />
                  <span
                    className="absolute text-gray-500 cursor-pointer right-5 top-5"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Policy Acceptance Checkbox */}
                <div className="mb-6">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="acceptPolicy"
                      checked={acceptedPolicy}
                      onChange={(e) => {
                        setAcceptedPolicy(e.target.checked);
                        if (e.target.checked) {
                          clearErrors("acceptPolicy");
                        }
                      }}
                      className="w-4 h-4 mt-1 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="acceptPolicy" className="text-sm text-gray-700">
                      I agree to the{" "}
                      <button
                        type="button"
                        onClick={() => setShowPolicyModal(true)}
                        className="text-orange-500 hover:underline focus:outline-none font-medium"
                      >
                        Privacy Policy and Terms of Service
                      </button>
                    </label>
                  </div>
                  {errors.acceptPolicy && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.acceptPolicy.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center w-full p-3 font-semibold text-white transition duration-300 bg-orange-500 rounded-md hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed"
                  disabled={isLoading || !acceptedPolicy}
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin"></div>
                  ) : (
                    "Sign up"
                  )}
                </button>
              </form>

              <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-2 text-gray-500">or sign up with</span>
                <hr className="flex-grow border-gray-300" />
              </div>
              <GoogleButton/>
              <div className="mt-4 text-left">
                <Link
                  to={"/signup-vendor"}
                  className="text-orange-500 hover:underline font-medium"
                >
                  Become a Vendor/Seller?
                </Link>
              </div>
              <div className="block my-2 text-left lg:hidden">
                <span className="text-gray-600">Already have an Account? </span>
                <Link to={"/signin"} className="text-blue-500 hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;