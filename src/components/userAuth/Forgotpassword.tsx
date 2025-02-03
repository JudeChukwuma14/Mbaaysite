import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import background from "../../assets/image/bg2.jpeg";
import logo from "../../assets/image/mbbaylogo.png";
import Sliding from "../Reuseable/Sliding";

// Define the shape of the form data
interface ForgotPasswordFormData {
  email: string;
}

const Forgotpassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false); // TypeScript: boolean state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>(); // TypeScript: Generic type for form data

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/forgot-password", data);
      if (response.status === 200) {
        toast.success("Password reset link sent to your email!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }catch (error: unknown) {
              toast.error(
                (error as Error)?.message || "Failed to send reset link. Please try again.",
                {
                  position: "top-right",
                  autoClose: 4000,
                }
              );
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
        <div
          style={bg}
          className="bg-center bg-no-repeat bg-cover w-full min-h-screen px-4 lg:flex lg:justify-center"
        >
          {/* Logo for small screens */}
          <div className="items-left mt-6 flex-col min-h-[150px]">
            <div className="lg:hidden">
              <img src={logo} width={50} alt="" />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <form onSubmit={handleSubmit(onSubmit)} className="w-96">
              <div className="mb-4">
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
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
                  "Request reset password link"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgotpassword;
