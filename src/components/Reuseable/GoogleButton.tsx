import { setUser } from "@/redux/slices/userSlice";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const GoogleButton = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        setIsLoading(true);
        console.log("Google Response:", credentialResponse);
        const idToken = credentialResponse.access_token;
        const response = await axios.post(
          "https://mbayy-be.onrender.com/api/v1/user/auth/google/user",
          { token: idToken },
          { headers: { "Content-Type": "application/json" } }
        );
        const { data } = response;
        dispatch(
          setUser({
            user: {
              _id: data.data._id,
              name: data.data.name,
              email: data.data.email,
              phoneNumber: "",
            },
            token: data.token,
          })
        );
        localStorage.setItem("accountType", "user");
        toast.success(data.message || "Google Sign-In successful", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Google Sign-In failed", {
          position: "top-right",
          autoClose: 3000,
        });
        console.error("Google Sign-In Error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error("Google Sign-In failed", {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  return (
    <button
      onClick={() => googleLogin()}
      disabled={isLoading}
      className="flex items-center justify-center w-full p-2 font-semibold text-black border-2 rounded-md hover:ring-2 bg-[#FFFFFF] hover:ring-orange-500 disabled:opacity-50"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google logo"
        className="w-5 h-5 mr-2"
      />
      {isLoading ? "Signing in..." : "Sign up with Google"}
    </button>
  );
};
