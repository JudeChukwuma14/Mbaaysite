import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const ProtectedVendor: React.FC = () => {
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give Redux a moment to load the vendor data
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // Fallback to localStorage if Redux doesn't have vendor data
  const vendorData = localStorage.getItem("vendorData");
  const parsedVendor = vendor || (vendorData ? JSON.parse(vendorData) : null);

  // Check if user is authenticated as a vendor
  if (!parsedVendor) {
    return <Navigate to="/login-vendor" replace />;
  }

  // Check if vendor is approved
  if (parsedVendor.verificationStatus !== "Approved") {
    return <Navigate to="/pending-approval" replace />;
  }

  return <Outlet />;
};

export default ProtectedVendor;
