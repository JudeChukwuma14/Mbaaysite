import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { verifyVendorGoogle } from "@/utils/vendorApi";
import { Loader2 } from "lucide-react";

interface GoogleSignInButtonProps {
  onGoogleSuccess: (data: { email: string; name: string; picture: string }, tempToken: string) => void;
  disabled?: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onGoogleSuccess, disabled = false }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const response = await verifyVendorGoogle(tokenResponse.access_token);
        if (response.token) {
          // Existing vendor
          localStorage.setItem("authToken", response.token);
          localStorage.setItem("accountType", "vendor");
          toast.success(response.message, {
            position: "bottom-right",
            autoClose: 3000,
          });
          navigate("/vendor-dashboard");
        } else if (response.tempToken) {
          // New vendor
          localStorage.setItem("tempToken", response.tempToken);
          onGoogleSuccess(response.user, response.tempToken);
          toast.info("Please complete your vendor profile", {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      } catch (err) {
        toast.error((err as Error)?.message || "Google verification failed", {
          position: "bottom-right",
          autoClose: 4000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error("Google Sign-In failed", {
        position: "bottom-right",
        autoClose: 4000,
      });
      setIsLoading(false);
    },
  });

  return (
    <button
      type="button"
      className="w-full h-12 px-4 py-2 text-base font-semibold text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => googleLogin()}
      disabled={disabled || isLoading}
    >
      <div className="flex items-center justify-center">
        {isLoading ? (
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        ) : (
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
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.60 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {isLoading ? "Signing in..." : "Continue with Google"}
      </div>
    </button>
  );
};

export default GoogleSignInButton;