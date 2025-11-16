import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PendingApproval = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is actually a vendor
    const accountType = localStorage.getItem("accountType");
    if (accountType !== "vendor") {
      navigate("/signup-vendor");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("vendorData");
    localStorage.removeItem("accountType");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⏳</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Waiting for Approval
        </h2>
        
        <p className="text-gray-600 mb-6">
          Your vendor account is pending admin approval. 
          You'll be able to access your dashboard once approved.
        </p>
        
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
         Home Page
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;