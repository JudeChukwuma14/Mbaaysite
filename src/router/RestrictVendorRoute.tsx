import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface RestrictVendorRouteProps {
  children: React.ReactNode;
}

const RestrictVendorRoute = ({ children }: RestrictVendorRouteProps) => {
  const vendor = useSelector((state: RootState) => state.vendor.vendor);

  console.log("DEBUG: Checking vendor in RestrictVendorRoute:", vendor);

  if (vendor?._id) {
    console.log("DEBUG: Vendor detected, redirecting to /app");
    return <Navigate to="/app/inbox" replace />;
  }

  return <>{children}</>;
};

export default RestrictVendorRoute;