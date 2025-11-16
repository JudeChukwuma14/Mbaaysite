import type React from "react";
import { useRef, useCallback, type ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUploadCloud, FiFile } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { get_single_vendor } from "@/utils/vendorApi";
import { useQuery } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ReturnPolicyUploaderProps {
  returnPolicy: File | null;
  returnPolicyName: string;
  setReturnPolicy: React.Dispatch<React.SetStateAction<File | null>>;
  setReturnPolicyName: React.Dispatch<React.SetStateAction<string>>;
  returnPolicyText: string;
  setReturnPolicyText: React.Dispatch<React.SetStateAction<string>>;
}

export default function ReturnPolicyUploader({
  returnPolicy,
  returnPolicyName,
  setReturnPolicy,
  setReturnPolicyName,
  returnPolicyText,
  setReturnPolicyText,
}: ReturnPolicyUploaderProps) {
  const returnPolicyRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: RootState) => state.vendor);

  const { data: vendors } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => get_single_vendor(user.token),
  });

  // Load return policy from localStorage on component mount
  useEffect(() => {
    const savedPolicy = localStorage.getItem("returnPolicyName");
    const savedPolicyText = localStorage.getItem("returnPolicyText");

    if (savedPolicy && savedPolicyText) {
      setReturnPolicyName(savedPolicy);
      setReturnPolicyText(savedPolicyText);

      // We can't restore the actual File object from localStorage,
      // but we can indicate that a policy exists
      if (!returnPolicy) {
        // Create a placeholder file object if needed for UI state
        const blob = new Blob([savedPolicyText], { type: "text/plain" });
        const file = new File([blob], savedPolicy, { type: "text/plain" });
        setReturnPolicy(file);
      }
    }
  }, [setReturnPolicy, setReturnPolicyName, setReturnPolicyText, returnPolicy]);

  // Handle drag over event
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Get file icon based on file type
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "txt":
        return "📃";
      default:
        return <FiFile />;
    }
  };

  // Handle return policy upload
  const handleReturnPolicyUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileType = file.type;

      // Check if file type is supported
      if (
        fileType === "text/plain" ||
        fileType === "application/pdf" ||
        fileType === "application/msword" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setReturnPolicy(file);
        setReturnPolicyName(file.name);

        // Read the file content
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const result = event.target.result;

            // For text files, we can directly use the content
            if (fileType === "text/plain") {
              const textContent = result as string;
              setReturnPolicyText(textContent);

              // Save to localStorage
              localStorage.setItem("returnPolicyName", file.name);
              localStorage.setItem("returnPolicyText", textContent);
            } else {
              // For binary files (PDF, DOC), we store a reference
              setReturnPolicyText(`File uploaded: ${file.name}`);

              // Save to localStorage
              localStorage.setItem("returnPolicyName", file.name);
              localStorage.setItem(
                "returnPolicyText",
                `File uploaded: ${file.name}`
              );

              // For binary files, we could store the base64 data in localStorage
              // but that might exceed localStorage limits for large files
              if (typeof result === "string") {
                try {
                  localStorage.setItem("returnPolicyData", result);
                } catch (e) {
                  console.warn("File too large to store in localStorage");
                }
              }
            }
          }
        };

        if (fileType === "text/plain") {
          reader.readAsText(file);
        } else {
          reader.readAsDataURL(file); // Read binary files as data URL
        }
      } else {
        toast.error(
          "Please upload a .txt, .pdf, or .doc/.docx file for return policy",
          {
            position: "top-right",
            autoClose: 4000,
          }
        );
      }
    }
  };

  // Handle file drop
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fileType = file.type;

      if (
        fileType === "text/plain" ||
        fileType === "application/pdf" ||
        fileType === "application/msword" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setReturnPolicy(file);
        setReturnPolicyName(file.name);

        // Read the file content
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const result = event.target.result;

            if (fileType === "text/plain") {
              const textContent = result as string;
              setReturnPolicyText(textContent);

              // Save to localStorage
              localStorage.setItem("returnPolicyName", file.name);
              localStorage.setItem("returnPolicyText", textContent);
            } else {
              setReturnPolicyText(`File uploaded: ${file.name}`);

              // Save to localStorage
              localStorage.setItem("returnPolicyName", file.name);
              localStorage.setItem(
                "returnPolicyText",
                `File uploaded: ${file.name}`
              );

              if (typeof result === "string") {
                try {
                  localStorage.setItem("returnPolicyData", result);
                } catch (e) {
                  console.warn("File too large to store in localStorage");
                }
              }
            }
            // Show success message
            toast.success("Return policy uploaded successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        };

        if (fileType === "text/plain") {
          reader.readAsText(file);
        } else {
          reader.readAsDataURL(file);
        }
      } else {
        toast.error(
          "Please upload a .txt, .pdf, or .doc/.docx file for return policy",
          {
            position: "top-right",
            autoClose: 4000,
          }
        );
      }
    }
  };

  // Remove return policy
  const removeReturnPolicy = () => {
    setReturnPolicy(null);
    setReturnPolicyName("");
    setReturnPolicyText("");

    // Clear from localStorage
    localStorage.removeItem("returnPolicyName");
    localStorage.removeItem("returnPolicyText");
    localStorage.removeItem("returnPolicyData");

    if (returnPolicyRef.current) {
      returnPolicyRef.current.value = ""; // Clear file input
    }
    // Show info message
    toast.info("Return policy removed", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Render file preview based on type
  const renderFilePreview = () => {
    if (!returnPolicyName && !vendors?.returnPolicy) return null;

    const fileName = returnPolicyName || vendors?.returnPolicy || "";
    const fileIcon = getFileIcon(fileName);

    return (
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded mt-2">
        <ToastContainer />
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl flex-shrink-0">{fileIcon}</span>
          <span className="text-sm truncate">{fileName}</span>
        </div>
        <motion.button
          className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
          onClick={removeReturnPolicy}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IoMdClose size={18} />
        </motion.button>
      </div>
    );
  };

  return (
    <motion.div
      className="bg-white p-4 sm:p-5 rounded-lg shadow space-y-4"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <h2 className="text-lg font-semibold">Return Policy</h2>

      {returnPolicyName || vendors?.returnPolicy ? (
        <>
          {renderFilePreview()}
          {returnPolicyText && returnPolicyText.startsWith("File uploaded:") ? (
            <div className="mt-2 p-3 bg-gray-50 rounded border text-sm">
              {returnPolicyText}
            </div>
          ) : returnPolicyText ? (
            <div className="mt-2 p-3 bg-gray-50 rounded border text-sm max-h-40 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{returnPolicyText}</pre>
            </div>
          ) : null}
        </>
      ) : (
        <div
          className="border-dashed border-2 border-orange-500 p-5 rounded-lg text-center space-y-2 cursor-pointer"
          onClick={() => returnPolicyRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleFileDrop}
        >
          <FiUploadCloud size={40} className="mx-auto text-gray-400" />
          <p>Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">
            Upload your return policy (.txt, .pdf, .doc, .docx)
          </p>
          <motion.input
            type="file"
            ref={returnPolicyRef}
            className="hidden"
            accept=".txt,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            onChange={handleReturnPolicyUpload}
          />
        </div>
      )}
    </motion.div>
  );
}
