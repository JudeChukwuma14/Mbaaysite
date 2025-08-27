import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VendorGoogleButton: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    try {
      const res = await fetch(
        "https://mbayy-be.onrender.com/api/v1/vendor/google-verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: idToken }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("accountType", "vendor");
          toast.success("Vendor logged in");
          navigate("/vendor-dashboard");
        } else if (data.tempToken) {
          localStorage.setItem("tempToken", data.tempToken);
          toast.info("Complete your vendor profile");
          navigate("/complete-signup", { state: data.user });
        }
      } else {
        toast.error(data.message || "Google verification failed");
      }
    } catch (err) {
      toast.error("Error verifying Google login");
      console.error(err);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed");
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
    />
  );
};

export default VendorGoogleButton;
