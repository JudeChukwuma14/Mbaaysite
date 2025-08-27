import { useState } from "react";
import background from "@/assets/image/bg2.jpeg";
import logo from "@/assets/image/MBLogo.png";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sliding from "../Reuseable/Sliding";
import { Link, useNavigate } from "react-router-dom";
import { createVendor } from "@/utils/vendorApi";
import { motion } from "framer-motion";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  Store,
  Tag,
} from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

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

const craftCategories = [
  "Art & Sculptures",
  "Beauty and Wellness",
  "Books and Poetry",
  "Fashion Clothing and Fabrics",
  "Jewelry and Gemstones",
  "Vintage and Antique Jewelry",
  "Home Décor and Accessories",
  "Vintage Stocks",
  "Plant and Seeds",
  "Spices, Condiments and Seasonings",
  "Local & Traditional Foods",
  "Traditional and Religious Items",
  "Local Food and Drink Products",
];

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  // Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse:any) => {
      try {
        const idToken = tokenResponse.credential || tokenResponse.access_token;

        const response = await fetch(
          "https://mbayy-be.onrender.com/api/v1/vendor/google-verify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: idToken }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          if (data.token) {
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("accountType", "vendor");
            toast.success("Login successful");
            navigate("/vendor-dashboard");
          } else if (data.tempToken) {
            localStorage.setItem("tempToken", data.tempToken);
            toast.info("Complete your vendor profile");
            navigate("/complete-signup", { state: data.user });
          }
        } else {
          toast.error(data.message || "Google verification failed");
        }
      } catch (error) {
        toast.error("Error verifying Google login");
        console.error(error);
      }
    },
    onError: () => {
      toast.error("Google login failed");
    },
  });

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
          className="bg-center bg-no-repeat bg-cover w-full min-h-screen px-4 lg:ml-[500px]"
        >
          <div className="flex items-center justify-between px-4 my-6">
            <div className="lg:hidden">
              <img src={logo || "/placeholder.svg"} width={50} alt="" />
            </div>
          </div>
          <div className="flex items-center justify-center px-4 text-clip">
            <div className="pb-10 w-max">
              <div className="flex flex-col items-center justify-center mb-9">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-2xl lg:mx-0">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <h1 className="mb-4 text-2xl font-bold text-gray-900 lg:text-5xl">
                  Welcome to <span className="text-orange-500">Mbaay.com</span>
                </h1>
                <p className="mb-4 text-sm text-center text-gray-600">
                  Join thousands of vendors who are growing their business with
                  us. Start selling your crafts and reach customers worldwide.
                </p>
              </div>

              <div className="">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Store Name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="storeName"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700"
                      >
                        <Store className="w-4 h-4" />
                        Store Name
                      </label>
                      <input
                        id="storeName"
                        type="text"
                        placeholder="Enter your store name"
                        {...register("storeName", {
                          required: "Store name is required",
                        })}
                        className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      {errors.storeName && (
                        <p className="text-sm text-red-500">
                          {errors.storeName.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700"
                      >
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <Controller
                        name="storePhone"
                        control={control}
                        rules={{ required: "Phone number is required" }}
                        render={({ field }) => (
                          <PhoneInput
                            country="ng"
                            value={field.value}
                            onChange={(phone) => field.onChange(phone)}
                            inputProps={{
                              name: "storePhone",
                              required: true,
                            }}
                            containerClass="w-full"
                            inputClass="!w-full !h-11 !pl-14 !border !border-gray-300 !rounded-md !shadow-sm !bg-white !text-sm focus:!outline-none focus:!ring-2 focus:!ring-orange-500 focus:!border-orange-500"
                            buttonClass="!h-11 !border-r !border-gray-300 !bg-white !rounded-l-md"
                            dropdownClass="!z-50"
                          />
                        )}
                      />
                      {errors.storePhone && (
                        <p className="text-sm text-red-500">
                          {errors.storePhone.message}
                        </p>
                      )}
                    </div>

                    {/* Craft Categories */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Tag className="w-4 h-4" />
                        Craft Category
                      </label>
                      <Controller
                        name="craftCategories"
                        control={control}
                        rules={{ required: "Please select a category" }}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          >
                            <option value="">Select your craft category</option>
                            {craftCategories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      {errors.craftCategories && (
                        <p className="text-sm text-red-500">
                          {errors.craftCategories.message}
                        </p>
                      )}
                    </div>

                    {/* Password */}
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
                          className="w-full px-3 py-2 pr-10 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label
                        htmlFor="confirmPassword"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700"
                      >
                        <Lock className="w-4 h-4" />
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                              value === watch("password") ||
                              "Passwords do not match",
                          })}
                          className="w-full px-3 py-2 pr-10 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 flex items-center px-3 text-gray-500 h-11 hover:text-gray-700"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full h-12 px-4 py-2 text-base font-semibold text-white transition-colors duration-200 bg-orange-500 rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="px-2 text-gray-500 bg-white">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Google Sign Up */}
                  <button
                    type="button"
                    onClick={() => googleLogin()}
                    className="w-full h-12 px-4 py-2 text-base font-semibold text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </div>
                  </button>
                </form>
              </div>

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
