import type React from "react";
import MbaayReturnPolicy from "../../../assets/policies/MbaayReturnPolicy.pdf";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface ReturnPolicyPopupProps {
  showReturnPolicyPopup: boolean;
  setShowReturnPolicyPopup: React.Dispatch<React.SetStateAction<boolean>>;
  returnPolicyRef: React.RefObject<HTMLInputElement>;
}

export default function ReturnPolicyPopup({
  showReturnPolicyPopup,
  setShowReturnPolicyPopup,
}: // returnPolicyRef,
ReturnPolicyPopupProps) {
  const navigate = useNavigate();

  if (!showReturnPolicyPopup) return null;

  const handleUploadClick = () => {
    setShowReturnPolicyPopup(false);
    navigate("/app/edit-vendor-profile");
  };

  const handleDownloadPolicy = async () => {
    try {
      // Fetch the PDF file from the imported asset
      const response = await fetch(MbaayReturnPolicy);

      if (!response.ok) {
        throw new Error("Failed to fetch PDF file");
      }

      // Get the PDF as a blob
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "Mbaay-Return-Policy.pdf";
      link.setAttribute("type", "application/pdf");

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);

      // Optional: Show success message
      console.log("PDF downloaded successfully");
    } catch (error) {
      console.error("Error downloading PDF:", error);

      // Fallback method - direct link approach
      try {
        const link = document.createElement("a");
        link.href = MbaayReturnPolicy;
        link.download = "Mbaay-Return-Policy.pdf";
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackError) {
        console.error("Fallback download method also failed:", fallbackError);
        // You could show a toast notification here
        alert(
          "Unable to download the PDF. Please try again or contact support."
        );
      }
    }
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoMdClose size={24} />
          </motion.button>
        </div>

        <div className="mb-6 space-y-4">
          <p className="text-gray-700">
            You must have a return policy before adding products. Choose one of
            these options:
          </p>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">
              Option 1: Use Mbaay's Default Policy
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Download and review our standard return policy that meets all
              platform requirements.
            </p>
            <button
              onClick={handleDownloadPolicy}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FiDownload />
              Download Mbaay Return Policy
            </button>
            <p className="text-xs text-gray-500 mt-2">
              By using this option, you agree to apply Mbaay's default return
              policy to your store.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">
              Option 2: Upload Your Own Policy
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Upload a custom return policy that meets or exceeds Mbaay's
              minimum standards.
            </p>
            <button
              onClick={handleUploadClick}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Upload Custom Policy
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowReturnPolicyPopup(false)}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
