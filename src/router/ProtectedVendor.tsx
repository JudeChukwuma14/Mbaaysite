import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedVendor: React.FC = () => {
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  
  // Check localStorage for Google-authenticated vendors
  const localStorageVendor = localStorage.getItem("vendorData");
  const accountType = localStorage.getItem("accountType");
  
  // Get vendor data from either source
  let vendorData = vendor;
  if (!vendorData && localStorageVendor) {
    try {
      vendorData = JSON.parse(localStorageVendor);
    } catch (error) {
      console.error("Error parsing vendor data from localStorage:", error);
    }
  }
  
  // Check authentication
  if (!vendorData || accountType !== "vendor") {
    return <Navigate to="/login-vendor" replace />;
  }
  
  // Check approval status
  if (vendorData.verificationStatus !== "Approved") {
    return <Navigate to="/pending-approval" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedVendor;