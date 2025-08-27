import { setUser } from "@/redux/slices/userSlice";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const GoogleButton = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            setIsLoading(true);
            console.log("Google Response:", credentialResponse);
            const idToken = credentialResponse.credential;
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
            toast.error(
              err.response?.data?.message || "Google Sign-In failed",
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
            console.error("Google Sign-In Error:", err);
          } finally {
            setIsLoading(false);
          }
        }}
        onError={() => {
          toast.error("Google Sign-In failed", {
            position: "top-right",
            autoClose: 3000,
          });
        }}
        // Use the built-in styling options instead of render prop
        theme="outline"
        size="large"
        width="100%"
        text="signup_with"
        shape="rectangular"
        logo_alignment="center"
      />
      {isLoading && (
        <div className="mt-2 text-sm text-center text-gray-600">
          Processing...
        </div>
      )}
    </div>
  );
};
