import type React from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface ReturnPolicyPopupProps {
  showReturnPolicyPopup: boolean;
  setShowReturnPolicyPopup: React.Dispatch<React.SetStateAction<boolean>>;
  returnPolicyRef: React.RefObject<HTMLInputElement>;
}

export default function ReturnPolicyPopup({
  showReturnPolicyPopup,
  setShowReturnPolicyPopup,
}: ReturnPolicyPopupProps) {
  const navigate = useNavigate();

  if (!showReturnPolicyPopup) return null;

  const handleUploadClick = () => {
    setShowReturnPolicyPopup(false);
    navigate("/app/edit-vendor-profile");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-lg p-6 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-500">
            Return Policy Required
          </h2>
          <motion.button
            onClick={() => setShowReturnPolicyPopup(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoMdClose size={24} />
          </motion.button>
        </div>
        <p className="mb-4">
          You must upload a return policy before adding this product. This helps
          customers understand your terms and conditions.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700"
            onClick={() => setShowReturnPolicyPopup(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
            onClick={handleUploadClick}
          >
            Upload Return Policy
          </button>
        </div>
      </motion.div>
    </div>
  );
}
