import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import background from "../../assets/image/bg2.jpeg";
import logo from "../../assets/image/MBLogo.png";
import Sliding from "../Reuseable/Sliding";
import { motion } from "framer-motion";
import { forgotPassword } from "@/utils/ForgetpassApi";
import { useNavigate } from "react-router-dom";

// Define the shape of the form data
interface ForgotPasswordFormData {
  email: string;
}

const Forgotpassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false); // TypeScript: boolean state
  const navigate = useNavigate(); // React Router: for navigation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>(); // TypeScript: Generic type for form data

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    setIsLoading(true);
    try {
      const response = await forgotPassword(data.email)
      const message = response.message
      if(message){
         toast.success(message, {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/restpassword"); 
      }else{
         toast.error("OTP Sending failed. Please try again.");
      }
     
    } catch (error: unknown) {
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
        <motion.div
          style={bg}
          className="bg-center bg-no-repeat bg-cover w-full min-h-screen px-4 lg:ml-[500px] pb-10"
        >
          {/* Logo for small screens */}
          <div className="items-left mt-6 flex-col min-h-[150px]">
            <div className="lg:hidden">
              <img src={logo} width={50} alt="" />
            </div>
          </div>
          <div className="flex items-center justify-center">
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
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.email.message}
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
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Forgotpassword;
