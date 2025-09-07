import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const ProtectedVendor: React.FC = () => {
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Check authentication after a brief delay
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
  
  // Check if user has auth token and is a vendor
  const authToken = localStorage.getItem("authToken");
  const accountType = localStorage.getItem("accountType");
  
  if (!authToken || accountType !== "vendor") {
    return <Navigate to="/login-vendor" replace />;
  }
  
  // Try to get vendor data from Redux first, then localStorage
  let currentVendor = vendor;
  if (!currentVendor) {
    const vendorData = localStorage.getItem("vendorData");
    if (vendorData) {
      try {
        currentVendor = JSON.parse(vendorData);
      } catch (error) {
        console.error("Error parsing vendor data:", error);
        // Clear invalid data and redirect to login
        localStorage.removeItem("vendorData");
        localStorage.removeItem("authToken");
        localStorage.removeItem("accountType");
        return <Navigate to="/login-vendor" replace />;
      }
    }
  }
  
  // If we still don't have vendor data, redirect to login
  if (!currentVendor) {
    return <Navigate to="/login-vendor" replace />;
  }
  
  // Check if vendor is approved
  if (currentVendor.verificationStatus !== "Approved") {
    return <Navigate to="/pending-approval" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedVendor;