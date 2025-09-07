import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedVendor: React.FC = () => {
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  if (!vendor) {
    return <Navigate to="/login-vendor" replace />;
  }
  return <Outlet />;
};

export default ProtectedVendor;